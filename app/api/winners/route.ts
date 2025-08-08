import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ListWinnersResponse } from "@/lib/types";

export async function GET() {
  try {
    const winners = await prisma.winner.findMany({
      orderBy: {
        drawDate: "desc",
      },
    });

    return NextResponse.json({ winners });
  } catch (error) {
    console.error("Error fetching winners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
