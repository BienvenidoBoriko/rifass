import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GetUserTicketsResponse } from "@/lib/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        buyerEmail: session.user.email,
      },
      include: {
        raffle: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });

    const formattedTickets = tickets.map(({ raffle, ...ticket }) => ({
      ...ticket,
      amountPaid: Number(ticket.amountPaid),
      raffleTitle: raffle.title,
    }));

    return NextResponse.json({ tickets: formattedTickets });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
