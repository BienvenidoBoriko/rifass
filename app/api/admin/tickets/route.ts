import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Verificar autenticación y rol de administrador
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Verificar si el usuario es administrador
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true }
        });

        if (user?.role !== 'admin') {
            return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
        }

        // Obtener todos los tickets con información de la rifa
        const tickets = await prisma.ticket.findMany({
            include: {
                raffle: {
                    select: {
                        id: true,
                        title: true,
                        pricePerTicketUSD: true,
                        pricePerTicketVES: true,
                        status: true
                    }
                }
            },
            orderBy: {
                purchasedAt: 'desc'
            }
        });

        // Transformar los datos para el frontend
        const transformedTickets = tickets.map(ticket => ({
            id: ticket.id,
            raffleId: ticket.raffleId,
            ticketNumber: ticket.ticketNumber,
            buyerName: ticket.buyerName,
            buyerPhone: ticket.buyerPhone,
            buyerEmail: ticket.buyerEmail,
            buyerCountry: ticket.buyerCountry,
            buyerCity: ticket.buyerCity,
            paymentMethod: ticket.paymentMethod,
            paymentStatus: ticket.paymentStatus,
            paymentReference: ticket.paymentReference,
            amountPaid: parseFloat(ticket.amountPaid.toString()),
            purchasedAt: ticket.purchasedAt.toISOString(),
            confirmedAt: ticket.confirmedAt?.toISOString() || null,
            paymentComment: ticket.paymentComment,
            paymentProof: ticket.paymentProof,
            raffle: {
                title: ticket.raffle.title,
                pricePerTicketUSD: parseFloat(ticket.raffle.pricePerTicketUSD.toString()),
                pricePerTicketVES: parseFloat(ticket.raffle.pricePerTicketVES.toString())
            }
        }));

        return NextResponse.json({
            success: true,
            tickets: transformedTickets,
            total: transformedTickets.length
        });

    } catch (error) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
