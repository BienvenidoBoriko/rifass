import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function PUT(
  request: NextRequest,
  { params }: { params: { raffleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raffleId = parseInt(params.raffleId);

    if (isNaN(raffleId)) {
      return NextResponse.json({ error: "Invalid raffle ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["active", "closed", "drawn"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active', 'closed', or 'drawn'" },
        { status: 400 }
      );
    }

    // Obtener la rifa actual
    const currentRaffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      include: {
        tickets: {
          where: { paymentStatus: "confirmed" },
          select: {
            id: true,
            ticketNumber: true,
            buyerName: true,
            buyerEmail: true,
            buyerPhone: true,
          },
        },
      },
    });

    if (!currentRaffle) {
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    // Si se está marcando como sorteada y tiene ganadores predefinidos
    if (status === "drawn" && currentRaffle.hasPredefinedWinners && currentRaffle.predefinedWinners) {
      const predefinedWinners = currentRaffle.predefinedWinners as number[];

      // Crear ganadores para cada ticket premiado
      const winnerPromises = predefinedWinners.map(async (ticketNumber) => {
        // Buscar el ticket correspondiente
        const ticket = currentRaffle.tickets.find(t => t.ticketNumber === ticketNumber);

        if (ticket) {
          // Crear el ganador
          await prisma.winner.create({
            data: {
              raffleId,
              ticketNumber,
              winnerName: ticket.buyerName,
              winnerEmail: ticket.buyerEmail,
              winnerPhone: ticket.buyerPhone || "",
              drawDate: new Date(),
              claimed: false,
            },
          });

          // Actualizar la rifa con el primer ganador como ganador principal
          if (ticketNumber === predefinedWinners[0]) {
            await prisma.raffle.update({
              where: { id: raffleId },
              data: {
                status: "drawn",
                winnerTicketNumber: ticketNumber,
                winnerName: ticket.buyerName,
                winnerEmail: ticket.buyerEmail,
                winnerPhone: ticket.buyerPhone || "",
              },
            });
          }

          return {
            ticketNumber,
            winnerName: ticket.buyerName,
            winnerEmail: ticket.buyerEmail,
          };
        }

        return null;
      });

      const winners = (await Promise.all(winnerPromises)).filter(Boolean);

      // Enviar notificaciones por email
      if (winners.length > 0) {
        try {
          // Notificar a todos los participantes
          await emailService.sendAdminNotification(
            `Rifa "${currentRaffle.title}" Completada con Ganadores Predefinidos`,
            `
              <h3>Rifa Completada: ${currentRaffle.title}</h3>
              <p><strong>Total de ganadores:</strong> ${winners.length}</p>
              <p><strong>Ganadores:</strong></p>
              <ul>
                ${winners.map(w =>
              `<li>Ticket #${w.ticketNumber.toString().padStart(4, '0')} - ${w.winnerName} (${w.winnerEmail})</li>`
            ).join('')}
              </ul>
              <p><strong>Total de participantes:</strong> ${currentRaffle.tickets.length}</p>
              <p><strong>Total de boletos vendidos:</strong> ${currentRaffle.tickets.length}</p>
            `
          );

          // Notificar a cada ganador
          for (const winner of winners) {
            await emailService.sendWinnerNotification({
              winnerName: winner.winnerName,
              winnerEmail: winner.winnerEmail,
              raffleTitle: currentRaffle.title,
              ticketNumber: winner.ticketNumber,
              prize: currentRaffle.description || currentRaffle.title,
            });
          }

          // Notificar a los no ganadores
          for (const ticket of currentRaffle.tickets) {
            if (!winners.some(w => w.ticketNumber === ticket.ticketNumber)) {
              await emailService.sendNonWinnerNotification({
                buyerName: ticket.buyerName,
                buyerEmail: ticket.buyerEmail,
                raffleTitle: currentRaffle.title,
                ticketNumbers: [ticket.ticketNumber],
                winnerName: winners[0].winnerName,
                winnerTicketNumber: winners[0].ticketNumber,
              });
            }
          }
        } catch (emailError) {
          console.error("Error sending email notifications:", emailError);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Raffle "${currentRaffle.title}" marked as drawn with ${winners.length} predefined winners`,
        winners,
      });
    }

    // Actualización normal del estado
    const raffle = await prisma.raffle.update({
      where: { id: raffleId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Raffle status updated to ${status}`,
      raffle,
    });
  } catch (error) {
    console.error("Update raffle status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
