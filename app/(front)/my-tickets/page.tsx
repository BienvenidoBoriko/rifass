"use client";
import {
  Ticket,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  X,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserTickets } from "@/hooks/useUserTickets";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/LoginModal";
import { useState } from "react";

export default function MyTickets() {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { tickets: ticketsData, loading: isLoading, error } = useUserTickets();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendiente";
      case "failed":
        return "Fallido";
      default:
        return "Desconocido";
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatTicketNumber = (num: number) => num.toString().padStart(4, "0");

  if (!session?.user) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Mis Boletos
            </h1>
            <p className="text-xl text-slate-600">
              Consulta el estado de tus boletos y participaciones
            </p>
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-12 text-center">
              <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                Inicia sesión para ver tus boletos
              </h3>
              <p className="text-blue-700 mb-6">
                Necesitas una cuenta para consultar el estado de tus boletos y
                participaciones.
              </p>
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Sesión / Registrarse
              </Button>
            </CardContent>
          </Card>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Mis Boletos
        </h1>
        <p className="text-xl text-slate-600">
          Consulta el estado de tus boletos y participaciones
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <User className="h-5 w-5" />
            <span className="font-medium">
              Conectado como: {session.user.name} ({session.user.email})
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-200 h-4 rounded w-1/2"></div>
                  <div className="bg-slate-200 h-4 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-800">
                  <X className="h-5 w-5" />
                  <span>Error al cargar los boletos: {error}</span>
                </div>
                <p className="text-sm text-red-600 mt-2">
                  Por favor, intenta recargar la página o contacta al soporte si
                  el problema persiste.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {!error && (
            <div className="space-y-6">
              {!ticketsData || ticketsData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <Ticket className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No tienes boletos aún
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Participa en nuestras rifas activas para ver tus boletos
                      aquí.
                    </p>
                    <Button asChild>
                      <a href="/raffles">Ver Rifas Activas</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Mis Boletos ({ticketsData.length})
                    </h2>
                  </div>

                  <div className="grid gap-6">
                    {ticketsData.map((ticket) => (
                      <Card
                        key={ticket.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Ticket Info */}
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-bold text-slate-900 mb-1">
                                  {ticket.raffleTitle}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <Ticket className="h-4 w-4 text-blue-600" />
                                  <span className="font-mono text-lg font-semibold text-blue-600">
                                    #{formatTicketNumber(ticket.ticketNumber)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-600">
                                  Comprado:{" "}
                                  {new Date(
                                    ticket.purchasedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium text-slate-700 mb-1">
                                  Estado del Pago
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(ticket.paymentStatus)}
                                  <Badge
                                    variant={getStatusVariant(
                                      ticket.paymentStatus
                                    )}
                                  >
                                    {getStatusText(ticket.paymentStatus)}
                                  </Badge>
                                </div>
                              </div>

                              <div>
                                <div className="text-sm font-medium text-slate-700 mb-1">
                                  Método de Pago
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="h-4 w-4 text-slate-400" />
                                  <span className="text-sm capitalize">
                                    {ticket.paymentMethod.replace("-", " ")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium text-slate-700 mb-1">
                                  Monto Pagado
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                  ${ticket.amountPaid}
                                </div>
                              </div>

                              {ticket.paymentReference && (
                                <div>
                                  <div className="text-sm font-medium text-slate-700 mb-1">
                                    Referencia
                                  </div>
                                  <p className="text-sm text-slate-600 font-mono">
                                    {ticket.paymentReference}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {ticket.paymentStatus === "pending" && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center space-x-2 text-yellow-800">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Pago pendiente de confirmación
                                </span>
                              </div>
                              <p className="text-sm text-yellow-700 mt-1">
                                Tu boleto será confirmado una vez que se verifique
                                el pago.
                              </p>
                            </div>
                          )}

                          {ticket.paymentStatus === "confirmed" && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  ¡Boleto confirmado! Ya estás participando en el
                                  sorteo.
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
