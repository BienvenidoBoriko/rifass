import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: {
        raffleId: string;
    };
}

// Update raffle
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
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

        const body = await request.json();
        const {
            title,
            description,
            imageUrl,
            pricePerTicketUSD,
            pricePerTicketVES,
            totalTickets,
            startDate,
            endDate,
            drawDate,
            status
        } = body;

        // Validation
        if (!title || !description || !pricePerTicketUSD || !pricePerTicketVES || !totalTickets || !startDate || !endDate || !drawDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (pricePerTicketUSD <= 0 || pricePerTicketVES <= 0 || totalTickets <= 0) {
            return NextResponse.json(
                { error: "Prices and total tickets must be greater than 0" },
                { status: 400 }
            );
        }

        // Check if raffle exists
        const existingRaffle = await prisma.raffle.findUnique({
            where: { id: raffleId }
        });

        if (!existingRaffle) {
            return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
        }

        const raffle = await prisma.raffle.update({
            where: { id: raffleId },
            data: {
                title,
                description,
                imageUrl,
                pricePerTicketUSD: parseFloat(pricePerTicketUSD),
                pricePerTicketVES: parseFloat(pricePerTicketVES),
                totalTickets: parseInt(totalTickets),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                drawDate: new Date(drawDate),
                status: status || 'active'
            }
        });

        return NextResponse.json({ success: true, raffle });
    } catch (error) {
        console.error("Update raffle error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Delete raffle
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
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

        // Check if raffle exists
        const existingRaffle = await prisma.raffle.findUnique({
            where: { id: raffleId },
            include: {
                tickets: true
            }
        });

        if (!existingRaffle) {
            return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
        }

        // Check if raffle has tickets
        if (existingRaffle.tickets.length > 0) {
            return NextResponse.json(
                { error: "Cannot delete raffle with existing tickets" },
                { status: 400 }
            );
        }

        await prisma.raffle.delete({
            where: { id: raffleId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete raffle error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
