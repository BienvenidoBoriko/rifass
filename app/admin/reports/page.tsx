'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminApi, AdminStats, Raffle, User } from '@/lib/admin-api';
import { toast } from "sonner";

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rafflesData, setRafflesData] = useState<{ raffles: Raffle[] } | null>(null);
  const [usersData, setUsersData] = useState<{ users: User[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsResult, rafflesResult, usersResult] = await Promise.all([
          adminApi.getAdminStats(),
          adminApi.listAllRaffles(),
          adminApi.getUsers(),
        ]);
        
        setStats(statsResult);
        setRafflesData(rafflesResult);
        setUsersData(usersResult);
      } catch (error) {
        console.error('Error fetching reports data:', error);
        toast.error("No se pudieron cargar los datos de reportes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for charts (can be replaced with real data later)
  const salesData = [
    { month: 'Ene', sales: 12000, tickets: 480 },
    { month: 'Feb', sales: 15000, tickets: 600 },
    { month: 'Mar', sales: 18000, tickets: 720 },
    { month: 'Abr', sales: 22000, tickets: 880 },
    { month: 'May', sales: 25000, tickets: 1000 },
    { month: 'Jun', sales: 28000, tickets: 1120 },
  ];

  // Calculate top raffles from real data
  const topRaffles = rafflesData?.raffles
    .map(raffle => ({
      name: raffle.title,
      tickets: raffle.soldTickets,
      revenue: raffle.soldTickets * raffle.pricePerTicket
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4) || [];

  // Calculate active users
  const activeUsers = usersData?.users.filter(u => u.status === 'active').length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reportes y Análisis</h1>
          <p className="text-slate-600">Métricas y estadísticas de la plataforma</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ingresos Totales</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${stats?.totalRevenue?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3% vs período anterior
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Boletos Vendidos</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats?.totalTicketsSold?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.8% vs período anterior
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
                <p className="text-sm font-medium text-slate-600">Usuarios Activos</p>
                <p className="text-3xl font-bold text-slate-900">
                  {activeUsers.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% vs período anterior
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
                <p className="text-sm font-medium text-slate-600">Tasa de Conversión</p>
                <p className="text-3xl font-bold text-slate-900">24.6%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.1% vs período anterior
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-between space-x-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-slate-200 rounded-t relative" style={{ height: '200px' }}>
                    <div 
                      className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-full absolute bottom-0"
                      style={{ height: `${(data.sales / 30000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-slate-900">{data.month}</p>
                    <p className="text-xs text-slate-600">${data.sales.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Raffles */}
        <Card>
          <CardHeader>
            <CardTitle>Rifas Más Exitosas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRaffles.map((raffle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{raffle.name}</h4>
                      <p className="text-sm text-slate-600">{raffle.tickets} boletos vendidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${raffle.revenue.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Zelle</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Binance Pay</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">PayPal</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Otros</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios por País</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { country: 'Venezuela', users: 1247, percentage: 44 },
                { country: 'Colombia', users: 856, percentage: 30 },
                { country: 'México', users: 427, percentage: 15 },
                { country: 'España', users: 317, percentage: 11 },
              ].map((data, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{data.country}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-900">{data.users}</span>
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" 
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{data.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">
                  ${Math.round((stats?.totalRevenue || 0) * 0.07).toLocaleString()}
                </p>
                <p className="text-sm text-slate-600">Ingresos esta semana</p>
                <p className="text-sm text-green-600 flex items-center justify-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.2% vs semana anterior
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Meta semanal</span>
                  <span className="font-medium">$50,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(Math.round(((stats?.totalRevenue || 0) * 0.07) / 50000 * 100), 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 text-center">
                  {((stats?.totalRevenue || 0) * 0.07) > 50000 ? '¡Meta superada!' : 'En progreso'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
