"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  Trophy,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi, AdminStats, Raffle, PendingPayment } from "@/lib/admin-api";
import UserStatus from "@/components/admin/UserStatus";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rafflesData, setRafflesData] = useState<{ raffles: Raffle[] } | null>(
    null
  );
  const [pendingPayments, setPendingPayments] = useState<{
    payments: PendingPayment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResult, rafflesResult, paymentsResult] = await Promise.all([
          adminApi.getAdminStats(),
          adminApi.listAllRaffles(),
          adminApi.getPendingPayments(),
        ]);

        setStats(statsResult);
        setRafflesData(rafflesResult);
        setPendingPayments(paymentsResult);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentRaffles = rafflesData?.raffles.slice(0, 5) || [];
  const recentPayments = pendingPayments?.payments.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Resumen general de la plataforma</p>
        </div>
        <UserStatus />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Rifas
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.totalRaffles || 0}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs mes anterior
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Rifas Activas
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.activeRaffles || 0}
                </p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  En curso
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Boletos Vendidos
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.totalTicketsSold || 0}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% vs semana anterior
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Ingresos Totales
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  ${stats?.totalRevenue || 0}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% vs mes anterior
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats?.pendingPayments && stats.pendingPayments > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  Tienes {stats.pendingPayments} pagos pendientes de
                  confirmación
                </p>
                <p className="text-sm text-yellow-700">
                  Revisa la sección de pagos para confirmar las transacciones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Raffles */}
        <Card>
          <CardHeader>
            <CardTitle>Rifas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRaffles.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  No hay rifas recientes
                </p>
              ) : (
                recentRaffles.map((raffle) => (
                  <div
                    key={raffle.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {raffle.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {raffle.soldTickets}/{raffle.totalTickets} boletos
                        vendidos
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          raffle.status === "active" ? "default" : "secondary"
                        }
                        className={
                          raffle.status === "active"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {raffle.status === "active" ? "Activa" : raffle.status}
                      </Badge>
                      <span className="text-sm font-medium text-slate-900">
                        ${raffle.pricePerTicketUSD}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pagos Pendientes</span>
              {stats?.pendingPayments && stats.pendingPayments > 0 && (
                <Badge variant="destructive">{stats.pendingPayments}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-slate-500">No hay pagos pendientes</p>
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <div
                    key={payment.ticketId}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {payment.buyerName}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {payment.raffleTitle} - Boleto #
                        {payment.ticketNumber.toString().padStart(4, "0")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        ${payment.amountPaid}
                      </p>
                      <p className="text-sm text-slate-600 capitalize">
                        {payment.paymentMethod.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <Trophy className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-slate-900">Crear Nueva Rifa</h3>
              <p className="text-sm text-slate-600">
                Configura un nuevo sorteo
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <CreditCard className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium text-slate-900">Revisar Pagos</h3>
              <p className="text-sm text-slate-600">
                Confirmar transacciones pendientes
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-slate-900">Ver Reportes</h3>
              <p className="text-sm text-slate-600">
                Analizar métricas y estadísticas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
