"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  X,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";

interface TicketDetailModalProps {
  ticket: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
}: TicketDetailModalProps) {
  if (!ticket) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary", text: "Pendiente" },
      confirmed: { variant: "default", text: "Confirmado" },
      failed: { variant: "destructive", text: "Fallido" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant as any}>{config.text}</Badge>;
  };

  const downloadPaymentProof = () => {
    if (ticket.paymentProof) {
      const link = document.createElement("a");
      link.href = ticket.paymentProof;
      link.download = `comprobante_ticket_${ticket.ticketNumber}.jpg`;
      link.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              Detalles del Ticket #
              {ticket.ticketNumber.toString().padStart(4, "0")}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Número de Ticket
                  </label>
                  <div className="text-lg font-mono font-bold">
                    #{ticket.ticketNumber.toString().padStart(4, "0")}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Estado del Pago
                  </label>
                  <div>{getStatusBadge(ticket.paymentStatus)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Rifa
                </label>
                <div className="text-lg font-medium">{ticket.raffle.title}</div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Comprador */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Comprador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Nombre Completo
                  </label>
                  <div className="text-lg font-medium">{ticket.buyerName}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{ticket.buyerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Teléfono
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{ticket.buyerPhone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Ubicación
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {ticket.buyerCity && ticket.buyerCountry
                        ? `${ticket.buyerCity}, ${ticket.buyerCountry}`
                        : ticket.buyerCountry ||
                          ticket.buyerCity ||
                          "No especificado"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información del Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Monto Pagado
                  </label>
                  <div className="text-2xl font-bold text-green-600">
                    ${ticket.amountPaid}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Método de Pago
                  </label>
                  <div className="text-lg font-medium">
                    {ticket.paymentMethod}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Referencia
                  </label>
                  <div className="text-lg font-mono">
                    {ticket.paymentReference || "N/A"}
                  </div>
                </div>
              </div>

              {ticket.paymentComment && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Comentario del Pago
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {ticket.paymentComment}
                  </div>
                </div>
              )}

              {ticket.paymentProof && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Comprobante de Pago
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadPaymentProof}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(ticket.paymentProof, "_blank")}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Fecha de Compra
                  </label>
                  <div className="text-lg">
                    {format(new Date(ticket.purchasedAt), "dd/MM/yyyy HH:mm", {
                      locale: es,
                    })}
                  </div>
                </div>
                {ticket.confirmedAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      Fecha de Confirmación
                    </label>
                    <div className="text-lg">
                      {format(
                        new Date(ticket.confirmedAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: es }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Precios de la Rifa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precios de la Rifa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Precio en USD
                  </label>
                  <div className="text-lg font-medium">
                    ${ticket.raffle.pricePerTicketUSD}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Precio en VES
                  </label>
                  <div className="text-lg font-medium">
                    Bs. {ticket.raffle.pricePerTicketVES.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
