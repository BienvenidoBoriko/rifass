import { apiCall } from "@/hooks/api";

export interface AdminStats {
    totalRaffles: number;
    activeRaffles: number;
    totalTicketsSold: number;
    totalRevenue: number;
    pendingPayments: number;
    totalWinners: number;
}

export interface Raffle {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    pricePerTicket: number;
    totalTickets: number;
    soldTickets: number;
    startDate: string;
    endDate: string;
    drawDate: string;
    status: 'active' | 'closed' | 'drawn';
    createdAt: string;
}

export interface PendingPayment {
    ticketId: number;
    raffleTitle: string;
    ticketNumber: number;
    buyerName: string;
    buyerEmail: string;
    paymentMethod: string;
    amountPaid: number;
    purchasedAt: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    city: string | null;
    totalTickets: number;
    totalSpent: number;
    lastPurchase: string | null;
    status: 'active' | 'inactive' | 'blocked';
    createdAt: string;
}

export interface Winner {
    id: number;
    raffleId: number;
    raffleTitle: string;
    winnerName: string;
    winnerEmail: string;
    winnerPhone: string;
    ticketNumber: number;
    videoUrl: string | null;
    claimed: boolean;
    drawDate: string;
    createdAt: string;
}

export const adminApi = {
    // Get admin statistics
    async getAdminStats(): Promise<AdminStats> {
        return apiCall<AdminStats>("/api/admin/stats");
    },

    // Get all raffles
    async listAllRaffles(): Promise<{ raffles: Raffle[] }> {
        const response = await apiCall<{ raffles: any[] }>("/api/admin/raffles");

        // Add soldTickets field by calculating from tickets table
        const rafflesWithSoldTickets = await Promise.all(
            response.raffles.map(async (raffle) => {
                try {
                    const soldTicketsResponse = await apiCall<{ soldTickets: number }>(`/api/raffles/${raffle.id}/available-tickets`);
                    return {
                        ...raffle,
                        soldTickets: raffle.totalTickets - (soldTicketsResponse.soldTickets || 0)
                    };
                } catch {
                    // If we can't get sold tickets, default to 0
                    return {
                        ...raffle,
                        soldTickets: 0
                    };
                }
            })
        );

        return { raffles: rafflesWithSoldTickets };
    },

    // Create new raffle
    async createRaffle(raffleData: {
        title: string;
        description: string;
        imageUrl: string;
        pricePerTicket: number;
        totalTickets: number;
        startDate: string;
        endDate: string;
        drawDate: string;
        status: 'active' | 'closed' | 'drawn';
    }): Promise<{ success: boolean; raffle: Raffle }> {
        return apiCall<{ success: boolean; raffle: Raffle }>("/api/admin/raffles", {
            method: "POST",
            body: JSON.stringify(raffleData),
        });
    },

    // Update raffle
    async updateRaffle(raffleId: number, raffleData: {
        title: string;
        description: string;
        imageUrl: string;
        pricePerTicket: number;
        totalTickets: number;
        startDate: string;
        endDate: string;
        drawDate: string;
        status: 'active' | 'closed' | 'drawn';
    }): Promise<{ success: boolean; raffle: Raffle }> {
        return apiCall<{ success: boolean; raffle: Raffle }>(`/api/admin/raffles/${raffleId}`, {
            method: "PUT",
            body: JSON.stringify(raffleData),
        });
    },

    // Delete raffle
    async deleteRaffle(raffleId: number): Promise<{ success: boolean }> {
        return apiCall<{ success: boolean }>(`/api/admin/raffles/${raffleId}`, {
            method: "DELETE",
        });
    },

    // Get pending payments
    async getPendingPayments(): Promise<{ payments: PendingPayment[] }> {
        return apiCall<{ payments: PendingPayment[] }>("/api/admin/payments/pending");
    },

    // Confirm payment
    async confirmPayment(params: { ticketId: number }): Promise<{ success: boolean }> {
        return apiCall<{ success: boolean }>(`/api/admin/tickets/${params.ticketId}/confirm`, {
            method: "PUT",
        });
    },

    // Update raffle status
    async updateRaffleStatus(params: { raffleId: number; status: 'active' | 'closed' | 'drawn' }): Promise<{ success: boolean }> {
        return apiCall<{ success: boolean }>(`/api/admin/raffles/${params.raffleId}/status`, {
            method: "PUT",
            body: JSON.stringify({ status: params.status }),
        });
    },

    // Assign winner
    async assignWinner(winnerData: {
        raffleId: number;
        winnerName: string;
        winnerEmail: string;
        winnerPhone: string;
        ticketNumber: number;
        videoUrl: string;
        claimed: boolean;
    }): Promise<{ success: boolean; winner: Winner }> {
        return apiCall<{ success: boolean; winner: Winner }>("/api/admin/winners", {
            method: "POST",
            body: JSON.stringify(winnerData),
        });
    },

    // Get winners
    async getWinners(): Promise<{ winners: Winner[] }> {
        return apiCall<{ winners: Winner[] }>("/api/admin/winners");
    },

    // Get users (for now we'll create a mock endpoint)
    async getUsers(): Promise<{ users: User[] }> {
        // Since there's no API endpoint for users yet, we'll return mock data
        const mockUsers: User[] = [
            {
                id: 1,
                name: 'María González',
                email: 'maria.gonzalez@email.com',
                phone: '+1234567890',
                country: 'Venezuela',
                city: 'Caracas',
                totalTickets: 15,
                totalSpent: 375,
                lastPurchase: '2024-01-15T00:00:00Z',
                status: 'active',
                createdAt: '2023-12-01T00:00:00Z'
            },
            {
                id: 2,
                name: 'Carlos Rodríguez',
                email: 'carlos.rodriguez@email.com',
                phone: '+1987654321',
                country: 'Colombia',
                city: 'Bogotá',
                totalTickets: 8,
                totalSpent: 280,
                lastPurchase: '2024-01-14T00:00:00Z',
                status: 'active',
                createdAt: '2023-11-15T00:00:00Z'
            },
            {
                id: 3,
                name: 'Ana Martínez',
                email: 'ana.martinez@email.com',
                phone: '+1122334455',
                country: 'México',
                city: 'Ciudad de México',
                totalTickets: 22,
                totalSpent: 550,
                lastPurchase: '2024-01-13T00:00:00Z',
                status: 'active',
                createdAt: '2023-10-20T00:00:00Z'
            },
            {
                id: 4,
                name: 'Luis Pérez',
                email: 'luis.perez@email.com',
                phone: '+1555666777',
                country: 'España',
                city: 'Madrid',
                totalTickets: 3,
                totalSpent: 75,
                lastPurchase: '2024-01-10T00:00:00Z',
                status: 'inactive',
                createdAt: '2023-09-05T00:00:00Z'
            },
        ];

        return Promise.resolve({ users: mockUsers });
    }
};
