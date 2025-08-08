"use client";
import { useState, useEffect } from "react";
import { X, Trophy, User, Ticket, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface WinnerAssignmentProps {
  raffle: {
    id: number;
    title: string;
    totalTickets: number;
    soldTickets: number;
  };
  onAssign: (winnerData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface Ticket {
  id: number;
  ticketNumber: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentStatus: string;
  amountPaid: number;
  purchasedAt: string;
  confirmedAt?: string;
}

export default function WinnerAssignment({
  raffle,
  onAssign,
  onCancel,
  isLoading = false,
}: WinnerAssignmentProps) {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [winnerData, setWinnerData] = useState({
    winnerName: "",
    winnerEmail: "",
    winnerPhone: "",
    ticketNumber: 0,
    videoUrl: "",
    claimed: false,
  });

  // Fetch real tickets for the raffle
  useEffect(() => {
    const fetchTickets = async () => {
      setLoadingTickets(true);
      try {
        const response = await fetch(`/api/admin/raffles/${raffle.id}/tickets`);

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast.error("Error al cargar los boletos");
      } finally {
        setLoadingTickets(false);
      }
    };

    if (raffle.id) {
      fetchTickets();
    }
  }, [raffle.id]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toString().includes(searchTerm)
  );

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket.id);
    setWinnerData({
      winnerName: ticket.buyerName,
      winnerEmail: ticket.buyerEmail,
      winnerPhone: ticket.buyerPhone || "",
      ticketNumber: ticket.ticketNumber,
      videoUrl: "",
      claimed: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTicket) {
      toast.error("Debes seleccionar un boleto ganador");
      return;
    }

    if (!winnerData.winnerName.trim()) {
      toast.error("El nombre del ganador es requerido");
      return;
    }

    if (!winnerData.winnerEmail.trim()) {
      toast.error("El email del ganador es requerido");
      return;
    }

    onAssign({
      raffleId: raffle.id,
      ...winnerData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Asignar Ganador - {raffle.title}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Raffle Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Información de la Rifa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total de Boletos:</span>{" "}
                  {raffle.totalTickets}
                </div>
                <div>
                  <span className="font-medium">Boletos Vendidos:</span>{" "}
                  {tickets.length}
                </div>
                <div>
                  <span className="font-medium">Porcentaje Vendido:</span>{" "}
                  {raffle.totalTickets > 0
                    ? ((tickets.length / raffle.totalTickets) * 100).toFixed(1)
                    : "0"}
                  %
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ticket Selection */}
              <div className="space-y-4">
                <div>
                  <Label>Seleccionar Boleto Ganador</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre, email o número..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg max-h-96 overflow-y-auto">
                  {loadingTickets ? (
                    <div className="p-4 text-center text-slate-500">
                      Cargando boletos...
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">
                      {tickets.length === 0
                        ? "No hay boletos confirmados para esta rifa"
                        : "No se encontraron boletos que coincidan con la búsqueda"}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                            selectedTicket === ticket.id
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : ""
                          }`}
                          onClick={() => handleTicketSelect(ticket)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Ticket className="h-4 w-4 text-blue-600" />
                                <span className="font-mono font-semibold">
                                  #
                                  {ticket.ticketNumber
                                    .toString()
                                    .padStart(4, "0")}
                                </span>
                              </div>
                              <div className="text-sm">
                                <div className="font-medium">
                                  {ticket.buyerName}
                                </div>
                                <div className="text-slate-600">
                                  {ticket.buyerEmail}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-slate-500">
                                {ticket.buyerPhone || "Sin teléfono"}
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                  ticket.paymentStatus === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {ticket.paymentStatus === "confirmed"
                                  ? "Confirmado"
                                  : "Pendiente"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Winner Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">
                  Detalles del Ganador
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="winnerName">Nombre del Ganador *</Label>
                    <Input
                      id="winnerName"
                      value={winnerData.winnerName}
                      onChange={(e) =>
                        setWinnerData((prev) => ({
                          ...prev,
                          winnerName: e.target.value,
                        }))
                      }
                      placeholder="Nombre completo del ganador"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="winnerEmail">Email del Ganador *</Label>
                    <Input
                      id="winnerEmail"
                      type="email"
                      value={winnerData.winnerEmail}
                      onChange={(e) =>
                        setWinnerData((prev) => ({
                          ...prev,
                          winnerEmail: e.target.value,
                        }))
                      }
                      placeholder="email@ejemplo.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="winnerPhone">Teléfono del Ganador</Label>
                    <Input
                      id="winnerPhone"
                      value={winnerData.winnerPhone}
                      onChange={(e) =>
                        setWinnerData((prev) => ({
                          ...prev,
                          winnerPhone: e.target.value,
                        }))
                      }
                      placeholder="+58 412-123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="videoUrl">URL del Video del Sorteo</Label>
                    <Input
                      id="videoUrl"
                      value={winnerData.videoUrl}
                      onChange={(e) =>
                        setWinnerData((prev) => ({
                          ...prev,
                          videoUrl: e.target.value,
                        }))
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="claimed"
                      checked={winnerData.claimed}
                      onChange={(e) =>
                        setWinnerData((prev) => ({
                          ...prev,
                          claimed: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <Label htmlFor="claimed">Premio Reclamado</Label>
                  </div>
                </div>

                {selectedTicket && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 text-green-800">
                      <Trophy className="h-5 w-5" />
                      <span className="font-semibold">
                        Boleto Ganador Seleccionado
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                      <div>
                        Número:{" "}
                        <span className="font-mono font-bold">
                          #{winnerData.ticketNumber.toString().padStart(4, "0")}
                        </span>
                      </div>
                      <div>Comprador: {winnerData.winnerName}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !selectedTicket}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {isLoading ? "Asignando..." : "Asignar Ganador"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
