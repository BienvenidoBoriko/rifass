"use client";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RaffleCard from "@/components/RaffleCard";
import { useActiveRaffles } from "@/hooks/use-raffles";
import { useState } from "react";

export default function ActiveRaffles() {
  const [searchTerm, setSearchTerm] = useState("");
  const { raffles: rafflesData, loading: isLoading } = useActiveRaffles();

  const filteredRaffles =
    rafflesData?.filter((raffle) =>
      raffle.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Rifas Activas
        </h1>
        <p className="text-xl text-slate-600">
          Descubre todas las rifas disponibles y encuentra tu próximo auto
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar rifas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse"
            >
              <div className="bg-slate-200 h-48 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                <div className="bg-slate-200 h-4 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Raffles Grid */}
          {filteredRaffles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaffles.map((raffle) => (
                <RaffleCard key={raffle.id} raffle={raffle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No se encontraron rifas
              </h3>
              <p className="text-slate-600">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "No hay rifas activas en este momento"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
