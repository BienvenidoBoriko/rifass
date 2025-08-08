import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Create new raffle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      pricePerTicket,
      totalTickets,
      startDate,
      endDate,
      drawDate,
      status
    } = body;

    // Validation
    if (!title || !description || !pricePerTicket || !totalTickets || !startDate || !endDate || !drawDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (pricePerTicket <= 0 || totalTickets <= 0) {
      return NextResponse.json(
        { error: "Price and total tickets must be greater than 0" },
        { status: 400 }
      );
    }

    const raffle = await prisma.raffle.create({
      data: {
        title,
        description,
        imageUrl,
        pricePerTicket: parseFloat(pricePerTicket),
        totalTickets: parseInt(totalTickets),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        drawDate: new Date(drawDate),
        status: status || 'active'
      }
    });

    return NextResponse.json({ success: true, raffle });
  } catch (error) {
    console.error("Create raffle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all raffles
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raffles = await prisma.raffle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ raffles });
  } catch (error) {
    console.error("Get raffles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
