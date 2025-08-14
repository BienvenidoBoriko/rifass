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

        // Get all participants for this raffle
        const allTickets = await prisma.ticket.findMany({
            where: {
                raffleId,
                paymentStatus: 'confirmed'
            },
            select: {
                id: true,
                ticketNumber: true,
                buyerName: true,
                buyerEmail: true,
                buyerPhone: true
            }
        });

        // Group tickets by buyer email to avoid duplicate emails
        const participants = new Map<string, {
            buyerName: string;
            buyerEmail: string;
            ticketNumbers: number[];
        }>();

        allTickets.forEach(ticket => {
            if (participants.has(ticket.buyerEmail)) {
                participants.get(ticket.buyerEmail)!.ticketNumbers.push(ticket.ticketNumber);
            } else {
                participants.set(ticket.buyerEmail, {
                    buyerName: ticket.buyerName,
                    buyerEmail: ticket.buyerEmail,
                    ticketNumbers: [ticket.ticketNumber]
                });
            }
        });

        // Send notifications to all participants
        const notificationPromises: Promise<boolean>[] = [];

        // Send winner notification
        try {
            notificationPromises.push(
                emailService.sendWinnerNotification({
                    winnerName,
                    winnerEmail,
                    raffleTitle: raffle.title,
                    ticketNumber,
                    prize: raffle.description || raffle.title,
                })
            );
        } catch (emailError) {
            console.error("Error sending winner notification email:", emailError);
        }

        // Send notifications to non-winners
        for (const [email, participant] of participants) {
            if (email !== winnerEmail) {
                try {
                    notificationPromises.push(
                        emailService.sendNonWinnerNotification({
                            buyerName: participant.buyerName,
                            buyerEmail: participant.buyerEmail,
                            raffleTitle: raffle.title,
                            ticketNumbers: participant.ticketNumbers,
                            winnerName,
                            winnerTicketNumber: ticketNumber,
                        })
                    );
                } catch (emailError) {
                    console.error(`Error sending non-winner notification to ${email}:`, emailError);
                }
            }
        }

        // Send comprehensive admin notification
        try {
            notificationPromises.push(
                emailService.sendRaffleDrawNotification({
                    raffleTitle: raffle.title,
                    winnerName,
                    winnerEmail,
                    winnerTicketNumber: ticketNumber,
                    totalParticipants: participants.size,
                    totalTickets: allTickets.length,
                })
            );
        } catch (adminEmailError) {
            console.error("Error sending admin notification:", adminEmailError);
        }

        // Wait for all notifications to be sent (but don't fail if some fail)
        try {
            await Promise.allSettled(notificationPromises);
            console.log(`Notifications sent for raffle ${raffleId}: ${participants.size} participants notified`);
        } catch (error) {
            console.error("Error sending notifications:", error);
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
