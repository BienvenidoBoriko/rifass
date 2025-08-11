"use client";
import {
  Car,
  Shield,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RaffleCard from "@/components/RaffleCard";
import CountdownTimer from "@/components/CountdownTimer";
import Link from "next/link";
import { useActiveRaffles, useRafflesWinners } from "@/hooks/use-raffles";

export default function Home() {
  const { raffles: rafflesData, loading, error } = useActiveRaffles();

  const {
    winners: winnersData,
    loading: winnersLoading,
    error: winnersError,
  } = useRafflesWinners();

  if (loading || winnersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const featuredRaffle = rafflesData[0];
  const recentWinners = winnersData.slice(0, 3) || [];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Gana el Auto de
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Tus Sueños
                  </span>
                </h1>
                <p className="text-xl text-blue-100 max-w-lg">
                  Participa en rifas de vehículos 100% seguras y transparentes.
                  Sorteos auditados, premios reales, ganadores verificados.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/raffles">
                    ¡Participa Ahora!
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-blue-600 hover:bg-white/10"
                >
                  <Link href="/winners">Ver Ganadores</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm">100% Seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Sorteos Auditados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm">Premios Reales</span>
                </div>
              </div>
            </div>

            {/* Featured Raffle */}
            {featuredRaffle && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold mb-2">Rifa Destacada</h3>
                  <p className="text-blue-100">{featuredRaffle.title}</p>
                </div>

                <div className="mb-6">
                  <img
                    src={featuredRaffle.imageUrl || "/placeholder-car.jpg"}
                    alt={featuredRaffle.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-blue-100 mb-2">Tiempo restante:</p>
                  <CountdownTimer endDate={featuredRaffle.endDate} />
                </div>

                <Button
                  asChild
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link href={`/raffles/${featuredRaffle.id}`}>
                    Ver Detalles
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            ¿Por Qué Elegir GanaXDar?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Somos la plataforma más confiable y transparente para rifas de
            vehículos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow border-slate-200">
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">100% Seguro</h3>
              <p className="text-slate-600">
                Todos nuestros sorteos son auditados por terceros
                independientes. Tu participación está garantizada.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow border-slate-200">
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Premios Reales
              </h3>
              <p className="text-slate-600">
                Vehículos nuevos y seminuevos de las mejores marcas. Todos los
                premios están respaldados y verificados.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow border-slate-200">
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Transparencia Total
              </h3>
              <p className="text-slate-600">
                Sorteos en vivo, videos públicos, y verificación completa de
                todos los ganadores.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Raffles Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Rifas Activas
            </h2>
            <p className="text-slate-600">
              Participa en nuestras rifas disponibles
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/raffles">Ver Todas</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rafflesData.slice(0, 3).map((raffle) => (
            <RaffleCard key={raffle.id} raffle={raffle} />
          ))}
        </div>
      </section>

      {/* Recent Winners */}
      {recentWinners.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Ganadores Recientes
              </h2>
              <p className="text-slate-600">
                Conoce a nuestros últimos ganadores y sus increíbles premios
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentWinners.map((winner) => (
                <Card
                  key={winner.id}
                  className="text-center p-6 bg-white border-slate-200"
                >
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {winner.winnerName}
                      </h3>
                      <p className="text-slate-600">{winner.prizeTitle}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(winner.drawDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/winners">Ver Todos los Ganadores</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Ganar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de participantes que ya confían en GanaXDar. Tu
            próximo auto te está esperando.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Link href="/raffles">
              Participar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
