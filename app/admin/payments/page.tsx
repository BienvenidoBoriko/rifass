"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  X,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { adminApi, PendingPayment } from "@/lib/admin-api";

export default function AdminPayments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingPayments, setPendingPayments] = useState<{
    payments: PendingPayment[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingPayment, setConfirmingPayment] = useState<number | null>(
    null
  );

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const paymentsResult = await adminApi.getPendingPayments();
      setPendingPayments(paymentsResult);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      toast.error("No se pudieron cargar los pagos pendientes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const confirmPayment = async (ticketId: number) => {
    try {
      setConfirmingPayment(ticketId);
      await adminApi.confirmPayment({ ticketId });

      toast.success("El pago ha sido confirmado exitosamente.");

      // Refetch payments
      await fetchPayments();
    } catch (error) {
      console.error("Confirm payment error:", error);
      toast.error("No se pudo confirmar el pago.");
    } finally {
      setConfirmingPayment(null);
    }
  };

  const filteredPayments =
    pendingPayments?.payments.filter(
      (payment) =>
        payment.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.raffleTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "zelle":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "binance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "zinli":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pago-movil":
        return "bg-green-100 text-green-800 border-green-200";
      case "stripe":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "zelle":
        return "Zelle";
      case "binance":
        return "Binance Pay";
      case "zinli":
        return "Zinli";
      case "pago-movil":
        return "Pago Móvil";
      case "stripe":
        return "Tarjeta de Crédito";
      default:
        return method;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestión de Pagos
          </h1>
          <p className="text-slate-600">
            Confirma y gestiona los pagos pendientes
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Pagos Pendientes
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingPayments?.payments.length || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Monto Pendiente
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  $
                  {pendingPayments?.payments.reduce(
                    (sum, p) => sum + p.amountPaid,
                    0
                  ) || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Tiempo Promedio
                </p>
                <p className="text-3xl font-bold text-slate-900">2.5h</p>
                <p className="text-sm text-slate-500">Para confirmación</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, email o rifa..."
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
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>
              Pagos Pendientes de Confirmación ({filteredPayments.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 h-20 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                ¡Todo al día!
              </h3>
              <p className="text-slate-600">
                {searchTerm
                  ? "No se encontraron pagos con esos criterios"
                  : "No hay pagos pendientes de confirmación"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.ticketId}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
                          {payment.buyerName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {payment.buyerName}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {payment.buyerEmail}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Boleto #
                          {payment.ticketNumber.toString().padStart(4, "0")}
                        </Badge>
                        <Badge
                          className={getPaymentMethodColor(
                            payment.paymentMethod
                          )}
                        >
                          {getPaymentMethodText(payment.paymentMethod)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 ml-13">
                        <div>
                          <span className="font-medium">Rifa:</span>{" "}
                          {payment.raffleTitle}
                        </div>
                        <div>
                          <span className="font-medium">Monto:</span>
                          <span className="text-lg font-bold text-green-600 ml-1">
                            ${payment.amountPaid}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span>{" "}
                          {new Date(payment.purchasedAt).toLocaleString()}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => confirmPayment(payment.ticketId)}
                            disabled={confirmingPayment === payment.ticketId}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {confirmingPayment === payment.ticketId
                              ? "Confirmando..."
                              : "Confirmar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
