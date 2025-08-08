import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Assign winner
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            raffleId,
            winnerName,
            winnerEmail,
            winnerPhone,
            ticketNumber,
            videoUrl,
            claimed
        } = body;

        // Validation
        if (!raffleId || !winnerName || !winnerEmail || ticketNumber === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if raffle exists
        const raffle = await prisma.raffle.findUnique({
            where: { id: raffleId }
        });

        if (!raffle) {
            return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
        }

        // Check if winner already exists for this raffle
        const existingWinner = await prisma.winner.findFirst({
            where: { raffleId }
        });

        if (existingWinner) {
            return NextResponse.json(
                { error: "Winner already assigned for this raffle" },
                { status: 400 }
            );
        }

        // Check if ticket exists and is confirmed
        const ticket = await prisma.ticket.findFirst({
            where: {
                raffleId,
                ticketNumber,
                paymentStatus: 'confirmed'
            }
        });

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket not found or not confirmed" },
                { status: 400 }
            );
        }

        const winner = await prisma.winner.create({
            data: {
                raffleId,
                winnerName,
                winnerEmail,
                winnerPhone: winnerPhone || null,
                ticketNumber,
                videoUrl: videoUrl || null,
                claimed: claimed || false,
                drawDate: new Date()
            }
        });

        return NextResponse.json({ success: true, winner });
    } catch (error) {
        console.error("Assign winner error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Get all winners
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const winners = await prisma.winner.findMany({
            include: {
                raffle: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform data to match the expected format
        const transformedWinners = winners.map(winner => ({
            id: winner.id,
            raffleId: winner.raffleId,
            raffleTitle: winner.raffle.title,
            winnerName: winner.winnerName,
            winnerEmail: winner.winnerEmail,
            winnerPhone: winner.winnerPhone,
            ticketNumber: winner.ticketNumber,
            videoUrl: winner.videoUrl,
            claimed: winner.claimed,
            drawDate: winner.drawDate.toISOString(),
            createdAt: winner.createdAt.toISOString()
        }));

        return NextResponse.json({ winners: transformedWinners });
    } catch (error) {
        console.error("Get winners error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
