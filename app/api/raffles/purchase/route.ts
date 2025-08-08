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
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: PurchaseTicketsRequest = await request.json();
    const { raffleId, ticketNumbers, paymentMethod, paymentReference, paymentProof, paymentComment } = body;

    // Get raffle details
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
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    if (raffle.status !== "active") {
      return NextResponse.json(
        { error: "Raffle is not active" },
        { status: 400 }
      );
    }

    if (new Date() > raffle.endDate) {
      return NextResponse.json({ error: "Raffle has ended" }, { status: 400 });
    }

    // Check if tickets are available
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
      return NextResponse.json(
        { error: "Some tickets are already taken" },
        { status: 409 }
      );
    }

    const totalAmount = ticketNumbers.length * Number(raffle.pricePerTicket);
    const ticketIds: number[] = [];

    // Insert tickets using authenticated user data
    for (const ticketNumber of ticketNumbers) {
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
          paymentReference,
          paymentProof,
          paymentComment,
          amountPaid: totalAmount,
        },
      });

      ticketIds.push(ticket.id);
    }

    // Send email notification to user
    try {
      await emailService.sendTicketPurchaseConfirmation({
        buyerName: session.user.name || "",
        buyerEmail: session.user.email,
        raffleTitle: raffle.title,
        ticketNumbers,
        totalAmount,
        paymentMethod,
      });
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Don't fail the purchase if email fails
    }

    // Send admin notification
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
        </ul>
        `
      );
    } catch (adminEmailError) {
      console.error("Error sending admin notification:", adminEmailError);
      // Don't fail the purchase if admin email fails
    }

    const response: PurchaseTicketsResponse = {
      success: true,
      ticketIds,
      totalAmount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
