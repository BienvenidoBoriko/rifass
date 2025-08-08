import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      // Update ticket status
      const ticket = await tx.ticket.updateMany({
        where: {
          id: ticketId,
          paymentStatus: "pending",
        },
        data: {
          paymentStatus: "confirmed",
          confirmedAt: new Date(),
        },
      });

      if (ticket.count === 0) {
        throw new Error("Ticket not found or already confirmed");
      }

      // Get the ticket to find raffle ID
      const updatedTicket = await tx.ticket.findUnique({
        where: { id: ticketId },
        select: { raffleId: true },
      });

      if (!updatedTicket) {
        throw new Error("Ticket not found");
      }

      // Update sold tickets count
      const confirmedTicketsCount = await tx.ticket.count({
        where: {
          raffleId: updatedTicket.raffleId,
          paymentStatus: "confirmed",
        },
      });

      await tx.raffle.update({
        where: { id: updatedTicket.raffleId },
        data: { soldTickets: confirmedTicketsCount },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error confirming payment:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
