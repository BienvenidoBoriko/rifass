import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

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
            where: { id: raffleId },
            select: {
                id: true,
                title: true,
                description: true,
            }
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
                { status: 404 }
            );
        }

        // Create winner
        const winner = await prisma.winner.create({
            data: {
                raffleId,
                winnerName,
                winnerEmail,
                winnerPhone,
                ticketNumber,
                videoUrl,
                claimed: claimed || false,
                drawDate: new Date()
            }
        });

        // Update raffle with winner information
        await prisma.raffle.update({
            where: { id: raffleId },
            data: {
                status: 'drawn',
                winnerTicketNumber: ticketNumber,
                winnerName,
                winnerPhone,
                winnerEmail
            }
        });

        // Send email notification to winner
        try {
            await emailService.sendWinnerNotification({
                winnerName,
                winnerEmail,
                raffleTitle: raffle.title,
                ticketNumber,
                prize: raffle.description || raffle.title,
            });
        } catch (emailError) {
            console.error("Error sending winner notification email:", emailError);
            // Don't fail the winner assignment if email fails
        }

        // Send admin notification
        try {
            await emailService.sendAdminNotification(
                "Ganador Asignado",
                `
                <h3>Ganador asignado:</h3>
                <ul>
                    <li><strong>Rifa:</strong> ${raffle.title}</li>
                    <li><strong>Ganador:</strong> ${winnerName} (${winnerEmail})</li>
                    <li><strong>Boleto ganador:</strong> #${ticketNumber.toString().padStart(4, '0')}</li>
                    <li><strong>Teléfono:</strong> ${winnerPhone || 'No proporcionado'}</li>
                    <li><strong>Fecha del sorteo:</strong> ${new Date().toLocaleDateString()}</li>
                </ul>
                `
            );
        } catch (adminEmailError) {
            console.error("Error sending admin notification:", adminEmailError);
            // Don't fail the winner assignment if admin email fails
        }

        return NextResponse.json({ success: true, winner });
    } catch (error) {
        console.error("Error assigning winner:", error);
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
