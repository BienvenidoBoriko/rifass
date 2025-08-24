import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { formatCurrency, calculateTotalPrice } from "@/lib/currency";

interface TicketSelectorProps {
  availableTickets: number[];
  loading?: boolean;
  selectedTickets: number[];
  onSelectionChange: (tickets: number[]) => void;
  pricePerTicketUSD?: number;
  pricePerTicketVES?: number;
  maxTickets?: number;
}

export default function TicketSelector({
  availableTickets,
  loading = false,
  selectedTickets,
  onSelectionChange,
  pricePerTicketUSD = 0,
  pricePerTicketVES = 0,
  maxTickets = 10,
}: TicketSelectorProps) {
  const addTicket = (ticketNumber: number) => {
    if (selectedTickets.length >= maxTickets) return;
    if (
      !selectedTickets.includes(ticketNumber) &&
      availableTickets.includes(ticketNumber)
    ) {
      onSelectionChange([...selectedTickets, ticketNumber]);
    }
  };

  const removeTicket = (ticketNumber: number) => {
    onSelectionChange(selectedTickets.filter((t) => t !== ticketNumber));
  };

  const addRandomTickets = (count: number) => {
    const available = availableTickets.filter(
      (t) => !selectedTickets.includes(t)
    );
    const toAdd = Math.min(
      count,
      maxTickets - selectedTickets.length,
      available.length
    );
    const randomTickets = available
      .sort(() => 0.5 - Math.random())
      .slice(0, toAdd);
    onSelectionChange([...selectedTickets, ...randomTickets]);
  };

  const formatTicketNumber = (num: number) => num.toString().padStart(4, "0");

  // Calcular totales en ambas monedas
  const totalUSD = selectedTickets.length * pricePerTicketUSD;
  const totalVES = selectedTickets.length * pricePerTicketVES;

  return (
    <div className="space-y-6">
      {/* Selected Tickets */}
      {selectedTickets.length > 0 && (
        <div>
          <div className="text-sm font-medium text-slate-700 mb-2">
            Boletos Seleccionados:
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTickets.map((ticket) => (
              <Badge
                key={ticket}
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
              >
                {formatTicketNumber(ticket)}
                <button
                  type="button"
                  onClick={() => removeTicket(ticket)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Summary */}
      {selectedTickets.length > 0 &&
        (pricePerTicketUSD > 0 || pricePerTicketVES > 0) && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-slate-900">Resumen de Compra</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Boletos seleccionados:</span>
                <span className="font-medium">{selectedTickets.length}</span>
              </div>

              {pricePerTicketUSD > 0 && (
                <div className="flex justify-between">
                  <span>Precio por boleto (USD):</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(pricePerTicketUSD, "USD")}
                  </span>
                </div>
              )}

              {pricePerTicketVES > 0 && (
                <div className="flex justify-between">
                  <span>Precio por boleto (VES):</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(pricePerTicketVES, "VES")}
                  </span>
                </div>
              )}

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Total (USD):</span>
                  <span className="text-green-600">
                    {formatCurrency(totalUSD, "USD")}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total (VES):</span>
                  <span className="text-blue-600">
                    {formatCurrency(totalVES, "VES")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Availability Info */}
      <div className="text-sm text-slate-600">
        <p>
          Boletos disponibles:{" "}
          <span className="font-medium">{availableTickets.length}</span>
        </p>
        <p>
          Máximo por compra: <span className="font-medium">{maxTickets}</span>
        </p>
      </div>

      {/* Quick Actions - Solo selección aleatoria */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRandomTickets(1)}
          disabled={selectedTickets.length >= maxTickets || loading}
        >
          <Plus className="h-4 w-4 mr-1" />
          Boleto Aleatorio
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRandomTickets(5)}
          disabled={selectedTickets.length >= maxTickets || loading}
        >
          <Plus className="h-4 w-4 mr-1" />5 Boletos Aleatorios
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRandomTickets(10)}
          disabled={selectedTickets.length >= maxTickets || loading}
        >
          <Plus className="h-4 w-4 mr-1" />
          10 Boletos Aleatorios
        </Button>
        {selectedTickets.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectionChange([])}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Información sobre selección aleatoria */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-2">🎲 Selección de Boletos</p>
          <p>
            Los boletos se seleccionan de forma aleatoria para garantizar la
            equidad en el sorteo.
          </p>
          <p className="mt-1">No es posible seleccionar números específicos.</p>
        </div>
      </div>
    </div>
  );
}
