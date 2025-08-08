import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, createAdminResponse, createAdminErrorResponse } from "@/lib/admin-utils";

interface RouteParams {
    params: {
        raffleId: string;
    };
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) {
        return createAdminErrorResponse(adminCheck.error, adminCheck.status);
    }

    try {
        const raffleId = parseInt(params.raffleId);
        if (isNaN(raffleId)) {
            return createAdminErrorResponse("Invalid raffle ID", 400);
        }

        // Check if raffle exists
        const raffle = await prisma.raffle.findUnique({
            where: { id: raffleId }
        });

        if (!raffle) {
            return createAdminErrorResponse("Raffle not found", 404);
        }

        // Get all tickets for this raffle
        const tickets = await prisma.ticket.findMany({
            where: {
                raffleId: raffleId,
                paymentStatus: "confirmed" // Only confirmed tickets can be winners
            },
            orderBy: {
                ticketNumber: "asc"
            }
        });

        const formattedTickets = tickets.map((ticket) => ({
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            buyerName: ticket.buyerName,
            buyerEmail: ticket.buyerEmail,
            buyerPhone: ticket.buyerPhone,
            paymentStatus: ticket.paymentStatus,
            amountPaid: Number(ticket.amountPaid),
            purchasedAt: ticket.purchasedAt,
            confirmedAt: ticket.confirmedAt
        }));

        return createAdminResponse({
            tickets: formattedTickets,
            totalTickets: formattedTickets.length
        });
    } catch (error) {
        console.error("Error fetching raffle tickets:", error);
        return createAdminErrorResponse("Internal server error", 500);
    }
}
