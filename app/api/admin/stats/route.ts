import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, createAdminResponse, createAdminErrorResponse } from "@/lib/admin-utils";

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return createAdminErrorResponse(adminCheck.error, adminCheck.status);
  }
  try {
    const [raffleStats, ticketStats, pendingPayments, winnerStats] =
      await Promise.all([
        // Raffle stats
        prisma.raffle
          .aggregate({
            _count: {
              id: true,
            },
          })
          .then(async (total) => {
            const active = await prisma.raffle.count({
              where: { status: "active" },
            });
            return { total: total._count.id, active };
          }),

        // Ticket stats
        prisma.ticket.aggregate({
          where: { paymentStatus: "confirmed" },
          _count: { id: true },
          _sum: { amountPaid: true },
        }),

        // Pending payments
        prisma.ticket.count({
          where: { paymentStatus: "pending" },
        }),

        // Winners
        prisma.winner.count(),
      ]);

    return createAdminResponse({
      totalRaffles: raffleStats.total,
      activeRaffles: raffleStats.active,
      totalTicketsSold: ticketStats._count.id || 0,
      totalRevenue: Number(ticketStats._sum.amountPaid) || 0,
      pendingPayments,
      totalWinners: winnerStats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return createAdminErrorResponse("Failed to fetch stats", 500);
  }
}
