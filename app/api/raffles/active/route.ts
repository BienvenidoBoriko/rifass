import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ListActiveRafflesResponse } from "@/lib/types";

export async function GET() {
  try {
    const raffles = await prisma.raffle.findMany({
      where: {
        status: "active",
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        endDate: "asc",
      },
    });

    const formattedRaffles = raffles.map((raffle) => ({
      ...raffle,
      pricePerTicket: Number(raffle.pricePerTicket),
      galleryImages: Array.isArray(raffle.galleryImages)
        ? (raffle.galleryImages as string[])
        : [],
    }));

    return NextResponse.json({ raffles: formattedRaffles });
  } catch (error) {
    console.error("Error fetching active raffles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
