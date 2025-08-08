"use client";

import { Calendar, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
          ${raffle.pricePerTicket}/boleto
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
          {raffle.title}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {daysLeft > 0 ? `${daysLeft} días restantes` : "Último día"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>
                {raffle.soldTickets}/{raffle.totalTickets}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Progreso de venta</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Link href={`/raffles/${raffle.id}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
