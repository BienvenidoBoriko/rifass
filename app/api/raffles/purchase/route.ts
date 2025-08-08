import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  PurchaseTicketsRequest,
  PurchaseTicketsResponse,
} from "@/lib/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { emailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  console.log("📩 Iniciando proceso de compra de tickets...");

  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    console.log("❌ Usuario no autenticado");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("✅ Usuario autenticado:", session.user.email);

  try {
    const body: PurchaseTicketsRequest = await request.json();
    console.log("📋 Datos recibidos:", {
      raffleId: body.raffleId,
      ticketNumbers: body.ticketNumbers,
      ticketCount: body.ticketNumbers?.length,
      paymentMethod: body.paymentMethod,
      paymentReference: body.paymentReference,
      hasPaymentProof: !!body.paymentProof,
      paymentComment: body.paymentComment,
    });

    const {
      raffleId,
      ticketNumbers,
      paymentMethod,
      paymentReference,
      paymentProof,
      paymentComment
    } = body;

    // Validar que tenemos los datos necesarios
    if (!raffleId || !ticketNumbers || !Array.isArray(ticketNumbers) || ticketNumbers.length === 0) {
      console.log("❌ Datos inválidos - faltan ticketNumbers o raffleId");
      return NextResponse.json(
        { error: "Faltan datos requeridos: raffleId y ticketNumbers" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !paymentReference) {
      console.log("❌ Datos inválidos - faltan datos de pago");
      return NextResponse.json(
        { error: "Faltan datos de pago: método y referencia" },
        { status: 400 }
      );
    }

    // Get raffle details
    console.log("🔍 Buscando rifa con ID:", raffleId);
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      select: {
        id: true,
        title: true,
        pricePerTicket: true,
        status: true,
        endDate: true,
      },
    });

    if (!raffle) {
      console.log("❌ Rifa no encontrada");
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    console.log("✅ Rifa encontrada:", raffle.title);

    if (raffle.status !== "active") {
      console.log("❌ Rifa no activa:", raffle.status);
      return NextResponse.json(
        { error: "Raffle is not active" },
        { status: 400 }
      );
    }

    if (new Date() > raffle.endDate) {
      console.log("❌ Rifa expirada");
      return NextResponse.json({ error: "Raffle has ended" }, { status: 400 });
    }

    // Check if tickets are available
    console.log("🔍 Verificando disponibilidad de tickets:", ticketNumbers);
    const existingTickets = await prisma.ticket.findMany({
      where: {
        raffleId,
        ticketNumber: {
          in: ticketNumbers,
        },
        paymentStatus: {
          in: ["confirmed", "pending"],
        },
      },
    });

    if (existingTickets.length > 0) {
      console.log("❌ Algunos tickets ya están ocupados:", existingTickets.map(t => t.ticketNumber));
      return NextResponse.json(
        { error: "Some tickets are already taken" },
        { status: 409 }
      );
    }

    const totalAmount = ticketNumbers.length * Number(raffle.pricePerTicket);
    console.log("💰 Monto total calculado:", totalAmount);

    const ticketIds: number[] = [];

    // Insert tickets using authenticated user data
    console.log("💾 Creando tickets en la base de datos...");
    for (const ticketNumber of ticketNumbers) {
      console.log(`   📝 Creando ticket #${ticketNumber}`);

      const ticket = await prisma.ticket.create({
        data: {
          raffleId,
          ticketNumber,
          buyerName: session.user.name || "",
          buyerPhone: "",
          buyerEmail: session.user.email,
          buyerCountry: "",
          buyerCity: "",
          paymentMethod,
          paymentReference: paymentReference || null,
          paymentProof: paymentProof || null,
          paymentComment: paymentComment || null,
          amountPaid: totalAmount,
          paymentStatus: "pending", // Siempre empezar como pending
        },
      });

      ticketIds.push(ticket.id);
      console.log(`   ✅ Ticket #${ticketNumber} creado con ID: ${ticket.id}`);
    }

    console.log("✅ Todos los tickets creados. IDs:", ticketIds);

    // Send email notification to user
    console.log("📧 Enviando notificación por email al usuario...");
    try {
      await emailService.sendTicketPurchaseConfirmation({
        buyerName: session.user.name || "",
        buyerEmail: session.user.email,
        raffleTitle: raffle.title,
        ticketNumbers,
        totalAmount,
        paymentMethod,
      });
      console.log("✅ Email de confirmación enviado");
    } catch (emailError) {
      console.error("❌ Error sending email notification:", emailError);
      // Don't fail the purchase if email fails
    }

    // Send admin notification
    console.log("📧 Enviando notificación a administradores...");
    try {
      await emailService.sendAdminNotification(
        "Nueva Compra de Boletos",
        `
        <h3>Nueva compra realizada:</h3>
        <ul>
          <li><strong>Usuario:</strong> ${session.user.name} (${session.user.email})</li>
          <li><strong>Rifa:</strong> ${raffle.title}</li>
          <li><strong>Boletos:</strong> ${ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</li>
          <li><strong>Método de pago:</strong> ${paymentMethod}</li>
          <li><strong>Total:</strong> $${totalAmount}</li>
          <li><strong>Referencia:</strong> ${paymentReference || 'No proporcionada'}</li>
          <li><strong>Comentario:</strong> ${paymentComment || 'Sin comentarios'}</li>
          <li><strong>Comprobante:</strong> ${paymentProof ? 'Adjunto' : 'No proporcionado'}</li>
        </ul>
        `
      );
      console.log("✅ Email de notificación admin enviado");
    } catch (adminEmailError) {
      console.error("❌ Error sending admin notification:", adminEmailError);
      // Don't fail the purchase if admin email fails
    }

    const response: PurchaseTicketsResponse = {
      success: true,
      ticketIds,
      totalAmount,
    };

    console.log("🎉 Compra completada exitosamente:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("💥 Error purchasing tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}