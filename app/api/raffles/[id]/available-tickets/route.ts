import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GetAvailableTicketsResponse } from "@/lib/types";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const raffleId = parseInt(params.id);

  if (isNaN(raffleId)) {
    return NextResponse.json({ error: "Invalid raffle ID" }, { status: 400 });
  }

  try {
    const soldTickets = await prisma.ticket.findMany({
      where: {
        raffleId,
        paymentStatus: "confirmed",
      },
      select: {
        ticketNumber: true,
      },
    });

    const soldNumbers = new Set(soldTickets.map((t) => t.ticketNumber));
    const availableTickets: number[] = [];

    for (let i = 0; i < 10000; i++) {
      if (!soldNumbers.has(i)) {
        availableTickets.push(i);
      }
    }

    return NextResponse.json({ availableTickets });
  } catch (error) {
    console.error("Error fetching available tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
