// lib/types.ts
export interface Raffle {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  galleryImages: string[];
  pricePerTicket: number;
  totalTickets: number;
  soldTickets: number;
  startDate: Date;
  endDate: Date;
  drawDate: Date;
  status: "active" | "closed" | "drawn";
  winnerTicketNumber?: number;
  winnerName?: string;
  winnerPhone?: string;
  winnerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: number;
  raffleId: number;
  ticketNumber: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerCountry?: string;
  buyerCity?: string;
  paymentMethod: string;
  paymentStatus: "pending" | "confirmed" | "failed";
  paymentReference?: string;
  amountPaid: number;
  purchasedAt: Date;
  confirmedAt?: Date;
}

export interface Winner {
  id: number;
  raffleId: number;
  ticketNumber: number;
  winnerName: string;
  winnerPhone: string;
  winnerEmail: string;
  prizeTitle: string;
  drawDate: Date;
  videoUrl?: string;
  claimed: boolean;
  claimedAt?: Date;
  createdAt: Date;
}

// API Request/Response interfaces
export interface GetAvailableTicketsParams {
  raffleId: number;
}

export interface GetAvailableTicketsResponse {
  availableTickets: number[];
}

export interface GetRaffleParams {
  id: number;
}

export interface GetUserTicketsResponse {
  tickets: (Ticket & { raffleTitle: string })[];
}

export interface ListActiveRafflesResponse {
  raffles: Raffle[];
}

export interface ListWinnersResponse {
  winners: Winner[];
}

export interface PurchaseTicketsRequest {
  raffleId: number;
  ticketNumbers: number[];
  paymentMethod: string;
  paymentReference?: string;
  paymentProof?: string;
  paymentComment?: string;
}

export interface PurchaseTicketsResponse {
  success: boolean;
  ticketIds: number[];
  totalAmount: number;
}

export interface AuthUser {
  email: string;
  name: string;
  id: string;
}
