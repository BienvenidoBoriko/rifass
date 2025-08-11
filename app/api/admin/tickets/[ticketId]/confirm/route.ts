import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function PUT(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  console.log("🔐 Iniciando confirmación de pago para ticket:", params.ticketId);

  try {
    const ticketId = parseInt(params.ticketId);

    if (isNaN(ticketId)) {
      console.log("❌ ID de ticket inválido:", params.ticketId);
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    console.log("✅ ID de ticket válido:", ticketId);

    // Use Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      console.log("🔄 Iniciando transacción para ticket:", ticketId);

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
        console.log("❌ Ticket no encontrado:", ticketId);
        throw new Error("Ticket not found");
      }

      console.log("✅ Ticket encontrado:", {
        id: existingTicket.id,
        ticketNumber: existingTicket.ticketNumber,
        raffleTitle: existingTicket.raffle.title,
        paymentStatus: existingTicket.paymentStatus,
        buyerEmail: existingTicket.buyerEmail
      });

      if (existingTicket.paymentStatus === "confirmed") {
        console.log("❌ Ticket ya confirmado:", ticketId);
        throw new Error("Ticket already confirmed");
      }

      // Update ticket status
      console.log("📝 Actualizando estado del ticket a 'confirmed'");
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

      console.log("✅ Ticket actualizado exitosamente");

      // Update sold tickets count
      console.log("🔢 Actualizando contador de tickets vendidos para rifa:", ticket.raffleId);
      const confirmedTicketsCount = await tx.ticket.count({
        where: {
          raffleId: ticket.raffleId,
          paymentStatus: "confirmed",
        },
      });

      console.log("📊 Total de tickets confirmados:", confirmedTicketsCount);

      await tx.raffle.update({
        where: { id: ticket.raffleId },
        data: { soldTickets: confirmedTicketsCount },
      });

      console.log("✅ Contador de tickets vendidos actualizado");

      return { success: true, ticket };
    });

    console.log("🎉 Transacción completada exitosamente");

    // Send email notification to user
    console.log("📧 Enviando notificación por email al usuario...");
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
      console.log("✅ Email de confirmación enviado al usuario");
    } catch (emailError) {
      console.error("❌ Error sending payment confirmation email:", emailError);
      // Don't fail the confirmation if email fails
    }

    // Send admin notification
    console.log("📧 Enviando notificación a administradores...");
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
      console.log("✅ Email de notificación admin enviado");
    } catch (adminEmailError) {
      console.error("❌ Error sending admin notification:", adminEmailError);
      // Don't fail the confirmation if admin email fails
    }

    console.log("🎯 Confirmación de pago completada exitosamente para ticket:", ticketId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 Error confirmando pago:", error);

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
