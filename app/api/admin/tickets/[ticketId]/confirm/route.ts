import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function PUT(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const ticketId = parseInt(params.ticketId);

    if (isNaN(ticketId)) {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    // Use Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get ticket details before updating
      const existingTicket = await tx.ticket.findUnique({
        where: { id: ticketId },
        include: {
          raffle: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!existingTicket) {
        throw new Error("Ticket not found");
      }

      if (existingTicket.paymentStatus === "confirmed") {
        throw new Error("Ticket already confirmed");
      }

      // Update ticket status
      const ticket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          paymentStatus: "confirmed",
          confirmedAt: new Date(),
        },
        include: {
          raffle: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Update sold tickets count
      const confirmedTicketsCount = await tx.ticket.count({
        where: {
          raffleId: ticket.raffleId,
          paymentStatus: "confirmed",
        },
      });

      await tx.raffle.update({
        where: { id: ticket.raffleId },
        data: { soldTickets: confirmedTicketsCount },
      });

      return { success: true, ticket };
    });

    // Send email notification to user
    try {
      const ticket = result.ticket;
      await emailService.sendPaymentConfirmation({
        buyerName: ticket.buyerName,
        buyerEmail: ticket.buyerEmail,
        raffleTitle: ticket.raffle.title,
        ticketNumbers: [ticket.ticketNumber],
        totalAmount: Number(ticket.amountPaid),
        paymentMethod: ticket.paymentMethod,
      });
    } catch (emailError) {
      console.error("Error sending payment confirmation email:", emailError);
      // Don't fail the confirmation if email fails
    }

    // Send admin notification
    try {
      const ticket = result.ticket;
      await emailService.sendAdminNotification(
        "Pago Confirmado",
        `
        <h3>Pago confirmado:</h3>
        <ul>
          <li><strong>Usuario:</strong> ${ticket.buyerName} (${ticket.buyerEmail})</li>
          <li><strong>Rifa:</strong> ${ticket.raffle.title}</li>
          <li><strong>Boleto:</strong> #${ticket.ticketNumber.toString().padStart(4, '0')}</li>
          <li><strong>Método de pago:</strong> ${ticket.paymentMethod}</li>
          <li><strong>Total:</strong> $${ticket.amountPaid}</li>
          <li><strong>Referencia:</strong> ${ticket.paymentReference || 'No proporcionada'}</li>
        </ul>
        `
      );
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError);
      // Don't fail the confirmation if admin email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error confirming payment:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof Error && error.message.includes("already confirmed")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
