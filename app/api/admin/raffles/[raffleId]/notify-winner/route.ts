import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function POST(
    request: NextRequest,
    { params }: { params: { raffleId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const raffleId = parseInt(params.raffleId);

        if (isNaN(raffleId)) {
            return NextResponse.json({ error: "Invalid raffle ID" }, { status: 400 });
        }

        // Check if raffle exists and has a winner
        const raffle = await prisma.raffle.findUnique({
            where: { id: raffleId },
            select: {
                id: true,
                title: true,
                description: true,
                winnerName: true,
                winnerEmail: true,
                winnerTicketNumber: true,
                status: true
            }
        });

        if (!raffle) {
            return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
        }

        if (raffle.status !== 'drawn' || !raffle.winnerName) {
            return NextResponse.json(
                { error: "Raffle does not have a winner assigned" },
                { status: 400 }
            );
        }

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
        const results = {
            winnerNotification: false,
            nonWinnerNotifications: 0,
            adminNotification: false,
            totalParticipants: participants.size,
            totalTickets: allTickets.length
        };

        // Send winner notification
        try {
            const winnerResult = await emailService.sendWinnerNotification({
                winnerName: raffle.winnerName,
                winnerEmail: raffle.winnerEmail,
                raffleTitle: raffle.title,
                ticketNumber: raffle.winnerTicketNumber,
                prize: raffle.description || raffle.title,
            });
            results.winnerNotification = winnerResult;
        } catch (emailError) {
            console.error("Error sending winner notification email:", emailError);
        }

        // Send notifications to non-winners
        for (const [email, participant] of participants) {
            if (email !== raffle.winnerEmail) {
                try {
                    const result = await emailService.sendNonWinnerNotification({
                        buyerName: participant.buyerName,
                        buyerEmail: participant.buyerEmail,
                        raffleTitle: raffle.title,
                        ticketNumbers: participant.ticketNumbers,
                        winnerName: raffle.winnerName,
                        winnerTicketNumber: raffle.winnerTicketNumber,
                    });
                    if (result) results.nonWinnerNotifications++;
                } catch (emailError) {
                    console.error(`Error sending non-winner notification to ${email}:`, emailError);
                }
            }
        }

        // Send comprehensive admin notification
        try {
            const adminResult = await emailService.sendRaffleDrawNotification({
                raffleTitle: raffle.title,
                winnerName: raffle.winnerName,
                winnerEmail: raffle.winnerEmail,
                winnerTicketNumber: raffle.winnerTicketNumber,
                totalParticipants: participants.size,
                totalTickets: allTickets.length,
            });
            results.adminNotification = adminResult;
        } catch (adminEmailError) {
            console.error("Error sending admin notification:", adminEmailError);
        }

        return NextResponse.json({
            success: true,
            message: `Notifications sent for raffle "${raffle.title}"`,
            results
        });

    } catch (error) {
        console.error("Error sending notifications:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
