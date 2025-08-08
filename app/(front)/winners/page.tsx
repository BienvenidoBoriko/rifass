"use client";
import { Trophy, Calendar, Ticket, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRafflesWinners } from "@/hooks/use-raffles";

export default function Winners() {
  const { winners: winnersData, loading: isLoading } = useRafflesWinners();

  const formatTicketNumber = (num: number) => num?.toString().padStart(4, "0");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Ganadores y Sorteos
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Conoce a nuestros ganadores y la transparencia de nuestros sorteos.
          Todos los sorteos son auditados y verificados públicamente.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {winnersData?.length || 0}
              </h3>
              <p className="text-slate-600">Ganadores Totales</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Play className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">100%</h3>
              <p className="text-slate-600">Sorteos Transparentes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Ticket className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Verificado</h3>
              <p className="text-slate-600">Cada Sorteo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                <div className="bg-slate-200 h-4 rounded w-1/2"></div>
                <div className="bg-slate-200 h-4 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Winners List */}
          {!winnersData || winnersData.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Próximamente
                </h3>
                <p className="text-slate-600">
                  Los primeros ganadores aparecerán aquí una vez que se realicen
                  los sorteos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winnersData.map((winner) => (
                <Card
                  key={winner.id}
                  className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Winner Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                        <Trophy className="h-3 w-3 mr-1" />
                        Ganador
                      </Badge>
                      {winner.claimed && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Premio Reclamado
                        </Badge>
                      )}
                    </div>

                    {/* Winner Info */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {winner.winnerName}
                      </h3>
                      <p className="text-slate-600 font-medium">
                        {winner.prizeTitle}
                      </p>
                    </div>

                    {/* Draw Details */}
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Boleto Ganador:</span>
                        <span className="font-mono font-bold text-blue-600">
                          #{formatTicketNumber(winner.ticketNumber)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Fecha del Sorteo:</span>
                        <span>
                          {new Date(winner.drawDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Video Link */}
                    {winner.videoUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <a
                          href={winner.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2"
                        >
                          <Play className="h-4 w-4" />
                          <span>Ver Video del Sorteo</span>
                        </a>
                      </Button>
                    )}

                    {/* Contact Info (Partial) */}
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Contacto:{" "}
                        {winner.winnerEmail.replace(/(.{2}).*(@.*)/, "$1***$2")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Transparency Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Transparencia Total</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Todos nuestros sorteos son realizados en vivo y grabados para
            garantizar la transparencia. Cada ganador es verificado y contactado
            públicamente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Play className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Sorteos en Vivo</h3>
              <p className="text-blue-100 text-sm">
                Transmisiones en tiempo real de cada sorteo
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Verificación Pública</h3>
              <p className="text-blue-100 text-sm">
                Cada ganador es verificado y anunciado públicamente
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Ticket className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Auditoría Completa</h3>
              <p className="text-blue-100 text-sm">
                Registros completos de todos los boletos y sorteos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
