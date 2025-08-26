
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function PUT(
    request: NextRequest,
    { params }: { params: { ticketId: string } }
) {
    console.log("🔐 Iniciando rechazo de pago para ticket:", params.ticketId);

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

            if (existingTicket.paymentStatus === "failed") {
                console.log("❌ Ticket ya rechazado:", ticketId);
                throw new Error("Ticket already rejected");
            }

            // Update ticket status
            console.log("📝 Actualizando estado del ticket a 'rejected'");
            const ticket = await tx.ticket.update({
                where: { id: ticketId },
                data: {
                    paymentStatus: "failed",
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
            const rejectedTicketsCount = await tx.ticket.count({
                where: {
                    raffleId: ticket.raffleId,
                    paymentStatus: "failed",
                },
            });

            console.log("📊 Total de tickets rechazados:", rejectedTicketsCount);

            await tx.raffle.update({
                where: { id: ticket.raffleId },
                data: { soldTickets: rejectedTicketsCount },
            });

            console.log("✅ Contador de tickets vendidos actualizado");

            return { success: true, ticket };
        });

        console.log("🎉 Transacción completada exitosamente");

        // Send email notification to user
        console.log("📧 Enviando notificación por email al usuario...");
        try {
            const ticket = result.ticket;
            await emailService.sendPaymentRejection({
                buyerName: ticket.buyerName,
                buyerEmail: ticket.buyerEmail,
                raffleTitle: ticket.raffle.title,
                ticketNumbers: [ticket.ticketNumber],
                totalAmount: Number(ticket.amountPaid),
                paymentMethod: ticket.paymentMethod,
            });
            console.log("✅ Email de rechazo enviado al usuario");
        } catch (emailError) {
            console.error("❌ Error sending payment rejection email:", emailError);
            // Don't fail the confirmation if email fails
        }

        // Send admin notification
        console.log("📧 Enviando notificación a administradores...");
        try {
            const ticket = result.ticket;
            await emailService.sendAdminNotification(
                "Pago Rechazado",
                `
        <h3>Pago rechazado:</h3>
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

        console.log("🎯 Rechazo de pago completado exitosamente para ticket:", ticketId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("💥 Error rechazando pago:", error);

        if (error instanceof Error && error.message.includes("not found")) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        if (error instanceof Error && error.message.includes("already rejected")) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
