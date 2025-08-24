"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
import { Raffle } from "@/lib/types";
import Link from "next/link";

interface RaffleCardProps {
  raffle: Raffle;
}

export default function RaffleCard({ raffle }: RaffleCardProps) {
  const progressPercentage = (raffle.soldTickets / raffle.totalTickets) * 100;
  const timeLeft = new Date(raffle.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-slate-200">
      <div className="relative">
        <img
          src={raffle.imageUrl || "/placeholder-car.jpg"}
          alt={raffle.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {formatCurrency(raffle.pricePerTicketUSD, "USD")}/boleto
        </div>
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {formatCurrency(raffle.pricePerTicketVES, "VES")}/boleto
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {raffle.title}
            </h3>
            <p className="text-slate-600 line-clamp-2">{raffle.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Progreso de venta</span>
              <span className="text-sm font-medium text-slate-900">
                {raffle.soldTickets}/{raffle.totalTickets} boletos
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-slate-500">
              {progressPercentage.toFixed(1)}% completado
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Precio USD:</span>
              <div className="font-semibold text-green-600">
                {formatCurrency(raffle.pricePerTicketUSD, "USD")}
              </div>
            </div>
            <div>
              <span className="text-slate-600">Precio VES:</span>
              <div className="font-semibold text-blue-600">
                {formatCurrency(raffle.pricePerTicketVES, "VES")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {daysLeft > 0 ? (
                <span className="text-orange-600 font-medium">
                  {daysLeft} día{daysLeft !== 1 ? "s" : ""} restante
                  {daysLeft !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-red-600 font-medium">Finalizada</span>
              )}
            </div>
            <Link href={`/raffles/${raffle.id}`}>
              <Button className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
