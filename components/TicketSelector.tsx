import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus } from "lucide-react";

interface TicketSelectorProps {
  availableTickets: number[];
  loading?: boolean;
  selectedTickets: number[];
  onSelectionChange: (tickets: number[]) => void;
  pricePerTicket?: number;
  maxTickets?: number;
}

export default function TicketSelector({
  availableTickets,
  loading = false,
  selectedTickets,
  onSelectionChange,
  pricePerTicket,
  maxTickets = 10,
}: TicketSelectorProps) {
  const [searchNumber, setSearchNumber] = useState("");

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const number = parseInt(searchNumber);
    if (!isNaN(number) && number >= 0 && number <= 9999) {
      addTicket(number);
      setSearchNumber("");
    }
  };

  const formatTicketNumber = (num: number) => num.toString().padStart(4, "0");

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold text-slate-900">
          Seleccionar Boletos ({selectedTickets.length}/{maxTickets})
        </Label>
        <p className="text-sm text-slate-600 mt-1">
          Elige tus números de la suerte o déjanos seleccionar por ti
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addRandomTickets(1)}
          disabled={selectedTickets.length >= maxTickets}
        >
          <Plus className="h-4 w-4 mr-1" />1 Aleatorio
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addRandomTickets(5)}
          disabled={selectedTickets.length >= maxTickets - 4}
        >
          <Plus className="h-4 w-4 mr-1" />5 Aleatorios
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelectionChange([])}
          disabled={selectedTickets.length === 0}
        >
          Limpiar Todo
        </Button>
      </div>

      {/* Search Specific Number */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min="0"
            max="9999"
            placeholder="Buscar número específico (0000-9999)"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={selectedTickets.length >= maxTickets}>
          Agregar
        </Button>
      </form>

      {/* Selected Tickets */}
      {selectedTickets.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-slate-700">
            Boletos Seleccionados:
          </Label>
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
      {selectedTickets.length > 0 && pricePerTicket && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-slate-900">Resumen de Compra</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Boletos seleccionados:</span>
              <span className="font-medium">{selectedTickets.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Precio por boleto:</span>
              <span>${pricePerTicket}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">
                  ${(selectedTickets.length * pricePerTicket).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability Info */}
      <div className="text-sm text-slate-600">
        <p>Boletos disponibles: {availableTickets.length.toLocaleString()}</p>
        <p>
          Boletos vendidos: {(10000 - availableTickets.length).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
