"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import TicketDetailModal from "@/components/admin/TicketDetailModal";

interface Ticket {
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
  purchasedAt: string;
  confirmedAt?: string;
  paymentComment?: string;
  paymentProof?: string;
  raffle: {
    title: string;
    pricePerTicketUSD: number;
    pricePerTicketVES: number;
  };
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [raffleFilter, setRaffleFilter] = useState<string>("all");
  const [raffles, setRaffles] = useState<{ id: number; title: string }[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchRaffles();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, raffleFilter]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/admin/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRaffles = async () => {
    try {
      const response = await fetch("/api/admin/raffles");
      if (response.ok) {
        const data = await response.json();
        setRaffles(data.raffles);
      }
    } catch (error) {
      console.error("Error fetching raffles:", error);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.buyerPhone.includes(searchTerm) ||
          ticket.ticketNumber.toString().includes(searchTerm)
      );
    }

    // Filtrar por estado de pago
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.paymentStatus === statusFilter
      );
    }

    // Filtrar por rifa
    if (raffleFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.raffleId === parseInt(raffleFilter)
      );
    }

    setFilteredTickets(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary", text: "Pendiente" },
      confirmed: { variant: "default", text: "Confirmado" },
      failed: { variant: "destructive", text: "Fallido" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const openTicketModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeTicketModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Rifa",
      "Número de Ticket",
      "Comprador",
      "Email",
      "Teléfono",
      "País",
      "Ciudad",
      "Método de Pago",
      "Estado",
      "Referencia",
      "Monto",
      "Fecha de Compra",
      "Fecha de Confirmación",
      "Comentario",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredTickets.map((ticket) =>
        [
          ticket.id,
          `"${ticket.raffle.title}"`,
          ticket.ticketNumber,
          `"${ticket.buyerName}"`,
          ticket.buyerEmail,
          ticket.buyerPhone,
          ticket.buyerCountry || "",
          ticket.buyerCity || "",
          ticket.paymentMethod,
          ticket.paymentStatus,
          ticket.paymentReference || "",
          ticket.amountPaid,
          format(new Date(ticket.purchasedAt), "dd/MM/yyyy HH:mm", {
            locale: es,
          }),
          ticket.confirmedAt
            ? format(new Date(ticket.confirmedAt), "dd/MM/yyyy HH:mm", {
                locale: es,
              })
            : "",
          `"${ticket.paymentComment || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `tickets_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusCounts = () => {
    const counts = {
      total: tickets.length,
      pending: tickets.filter((t) => t.paymentStatus === "pending").length,
      confirmed: tickets.filter((t) => t.paymentStatus === "confirmed").length,
      failed: tickets.filter((t) => t.paymentStatus === "failed").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Cargando tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Tickets</h1>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statusCounts.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.confirmed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.failed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado de Pago</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rifa</label>
              <Select value={raffleFilter} onValueChange={setRaffleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las rifas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las rifas</SelectItem>
                  {raffles.map((raffle) => (
                    <SelectItem key={raffle.id} value={raffle.id.toString()}>
                      {raffle.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resultados</label>
              <div className="text-sm text-gray-600 pt-2">
                {filteredTickets.length} de {tickets.length} tickets
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Rifa</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">
                      #{ticket.ticketNumber.toString().padStart(4, "0")}
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[200px] truncate"
                        title={ticket.raffle.title}
                      >
                        {ticket.raffle.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.buyerName}</div>
                        <div className="text-sm text-gray-500">
                          {ticket.buyerCountry && ticket.buyerCity
                            ? `${ticket.buyerCity}, ${ticket.buyerCountry}`
                            : ticket.buyerCountry || ticket.buyerCity || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{ticket.buyerEmail}</div>
                        <div className="text-gray-500">{ticket.buyerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">${ticket.amountPaid}</div>
                        <div className="text-gray-500">
                          {ticket.paymentMethod}
                        </div>
                        {ticket.paymentReference && (
                          <div className="text-xs text-gray-400">
                            Ref: {ticket.paymentReference}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {format(new Date(ticket.purchasedAt), "dd/MM/yyyy", {
                            locale: es,
                          })}
                        </div>
                        <div className="text-gray-500">
                          {format(new Date(ticket.purchasedAt), "HH:mm", {
                            locale: es,
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openTicketModal(ticket)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron tickets con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles del Ticket */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={closeTicketModal}
      />
    </div>
  );
}
