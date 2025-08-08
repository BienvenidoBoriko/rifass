import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Raffle } from "@/lib/types";

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
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
    });

    if (!raffle) {
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    const formattedRaffle = {
      ...raffle,
      pricePerTicket: Number(raffle.pricePerTicket),
      galleryImages: Array.isArray(raffle.galleryImages)
        ? (raffle.galleryImages as string[])
        : [],
    };

    return NextResponse.json(formattedRaffle);
  } catch (error) {
    console.error("Error fetching raffle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
