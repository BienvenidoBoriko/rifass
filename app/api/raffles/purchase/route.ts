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

  // Check authentication or user info
  const session = await getServerSession(authOptions);
  const body: PurchaseTicketsRequest = await request.json();

  let userEmail: string;
  let userName: string;
  let userPhone: string;

  if (session?.user?.email) {
    // Usuario autenticado
    userEmail = session.user.email;
    userName = session.user.name || "";
    userPhone = "";
    console.log("✅ Usuario autenticado:", userEmail);
  } else if (body.userInfo?.email) {
    // Usuario no autenticado con información proporcionada
    userEmail = body.userInfo.email;
    userName = body.userInfo.name || "";
    userPhone = body.userInfo.phone || "";
    console.log("✅ Usuario no autenticado con email:", userEmail);
  } else {
    console.log("❌ Usuario no autenticado y sin información de contacto");
    return NextResponse.json({ error: "Unauthorized - Se requiere email o autenticación" }, { status: 401 });
  }

  try {
    console.log("📋 Datos recibidos:", {
      raffleId: body.raffleId,
      ticketNumbers: body.ticketNumbers,
      ticketCount: body.ticketNumbers?.length,
      paymentMethod: body.paymentMethod,
      paymentReference: body.paymentReference,
      hasPaymentProof: !!body.paymentProof,
      paymentComment: body.paymentComment,
      userEmail,
      userName,
      userPhone,
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

    // Use a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Get raffle details with row-level locking
      console.log("🔍 Buscando rifa con ID:", raffleId);
      const raffle = await tx.raffle.findUnique({
        where: { id: raffleId },
        select: {
          id: true,
          title: true,
          pricePerTicketUSD: true,
          pricePerTicketVES: true,
          currency: true,
          status: true,
          endDate: true,
        },
      });

      if (!raffle) {
        console.log("❌ Rifa no encontrada");
        throw new Error("Raffle not found");
      }

      console.log("✅ Rifa encontrada:", raffle.title);

      if (raffle.status !== "active") {
        console.log("❌ Rifa no activa:", raffle.status);
        throw new Error("Raffle is not active");
      }

      if (new Date() > raffle.endDate) {
        console.log("❌ Rifa expirada");
        throw new Error("Raffle has ended");
      }

      // Check if tickets are available with row-level locking
      console.log("🔍 Verificando disponibilidad de tickets:", ticketNumbers);
      const existingTickets = await tx.ticket.findMany({
        where: {
          raffleId,
          ticketNumber: {
            in: ticketNumbers,
          },
        },
        select: {
          ticketNumber: true,
          buyerEmail: true,
        },
      });

      if (existingTickets.length > 0) {
        console.log("❌ Algunos tickets ya están ocupados:", existingTickets);

        // Check if user already owns any of these tickets
        const userOwnedTickets = existingTickets.filter(
          (ticket) => ticket.buyerEmail === userEmail
        );

        if (userOwnedTickets.length > 0) {
          throw new Error(`already own tickets: ${userOwnedTickets.map(t => t.ticketNumber).join(', ')}`);
        }

        throw new Error(`already taken tickets: ${existingTickets.map(t => t.ticketNumber).join(', ')}`);
      }

      // Calculate total amount based on currency
      const pricePerTicket = raffle.currency === 'VES' ? raffle.pricePerTicketVES : raffle.pricePerTicketUSD;
      const totalAmount = ticketNumbers.length * Number(pricePerTicket);
      console.log("💰 Monto total calculado:", totalAmount);

      // Create tickets
      const ticketIds: number[] = [];
      console.log("🎫 Creando tickets...");

      for (const ticketNumber of ticketNumbers) {
        const ticket = await tx.ticket.create({
          data: {
            raffleId,
            ticketNumber,
            buyerName: userName,
            buyerPhone: userPhone,
            buyerEmail: userEmail,
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
      return { raffle, ticketIds, totalAmount };
    });

    // Send email notification to user
    console.log("📧 Enviando notificación por email al usuario...");
    try {
      await emailService.sendTicketPurchaseConfirmation({
        buyerName: userName,
        buyerEmail: userEmail,
        raffleTitle: result.raffle.title,
        ticketNumbers,
        totalAmount: result.totalAmount,
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
          <li><strong>Usuario:</strong> ${userName} (${userEmail})</li>
          <li><strong>Teléfono:</strong> ${userPhone || 'No proporcionado'}</li>
          <li><strong>Rifa:</strong> ${result.raffle.title}</li>
          <li><strong>Boletos:</strong> ${ticketNumbers.map(num => num.toString().padStart(4, '0')).join(', ')}</li>
          <li><strong>Método de pago:</strong> ${paymentMethod}</li>
          <li><strong>Total:</strong> $${result.totalAmount}</li>
          <li><strong>Referencia:</strong> ${paymentReference || 'No proporcionada'}</li>
          <li><strong>Comentario:</strong> ${paymentComment || 'Sin comentarios'}</li>
          <li><strong>Comprobante:</strong> ${paymentProof ? 'Adjunto' : 'No proporcionado'}</li>
          <li><strong>Tipo de usuario:</strong> ${session?.user ? 'Autenticado' : 'No autenticado'}</li>
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
      ticketIds: result.ticketIds,
      totalAmount: result.totalAmount,
    };

    console.log("🎉 Compra completada exitosamente:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("💥 Error purchasing tickets:", error);

    // Return specific error messages for better user experience
    if (error instanceof Error) {
      if (error.message.includes("already taken")) {
        return NextResponse.json(
          { error: "Algunos boletos ya están ocupados. Por favor, selecciona otros números." },
          { status: 409 }
        );
      }
      if (error.message.includes("already own")) {
        return NextResponse.json(
          { error: "Ya tienes algunos de estos boletos. Por favor, verifica tu selección." },
          { status: 409 }
        );
      }
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Rifa no encontrada" },
          { status: 404 }
        );
      }
      if (error.message.includes("not active")) {
        return NextResponse.json(
          { error: "La rifa no está activa" },
          { status: 400 }
        );
      }
      if (error.message.includes("ended")) {
        return NextResponse.json(
          { error: "La rifa ha terminado" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intenta nuevamente." },
      { status: 500 }
    );
  }
}