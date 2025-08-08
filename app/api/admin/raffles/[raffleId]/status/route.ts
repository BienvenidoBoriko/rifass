import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { raffleId: string } }
) {
  try {
    const raffleId = parseInt(params.raffleId);
    const { status } = await request.json();

    if (isNaN(raffleId)) {
      return NextResponse.json({ error: "Invalid raffle ID" }, { status: 400 });
    }

    if (!["active", "closed", "drawn"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedRaffle = await prisma.raffle.update({
      where: { id: raffleId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    if (!updatedRaffle) {
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating raffle status:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update raffle status" },
      { status: 500 }
    );
  }
}
