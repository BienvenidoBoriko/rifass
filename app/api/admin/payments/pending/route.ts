import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.ticket.findMany({
      where: { paymentStatus: "pending" },
      include: {
        raffle: {
          select: { title: true },
        },
      },
      orderBy: { purchasedAt: "asc" },
    });

    const formattedPayments = payments.map((payment) => ({
      ticketId: payment.id,
      raffleTitle: payment.raffle.title,
      ticketNumber: payment.ticketNumber,
      buyerName: payment.buyerName,
      buyerEmail: payment.buyerEmail,
      paymentMethod: payment.paymentMethod,
      paymentReference: payment.paymentReference,
      paymentProof: payment.paymentProof,
      paymentComment: payment.paymentComment,
      amountPaid: Number(payment.amountPaid),
      purchasedAt: payment.purchasedAt,
    }));

    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending payments" },
      { status: 500 }
    );
  }
}
