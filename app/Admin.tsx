import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Trophy, 
  Clock, 
  Plus,
  CheckCircle,
  X,
  Eye,
  Edit,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { toast } from "sonner";
import backend from '~backend/client';

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => backend.admin.getAdminStats(),
  });

  const { data: rafflesData } = useQuery({
    queryKey: ['admin-raffles'],
    queryFn: () => backend.admin.listAllRaffles(),
  });

  const { data: pendingPayments } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: () => backend.admin.getPendingPayments(),
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: (ticketId: number) => backend.admin.confirmPayment({ ticketId }),
    onSuccess: () => {
      toast.success("El pago ha sido confirmado exitosamente.");
      queryClient.invalidateQueries({ queryKey: ['pending-payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: any) => {
      console.error('Confirm payment error:', error);
      toast.error("No se pudo confirmar el pago.");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ raffleId, status }: { raffleId: number; status: string }) => 
      backend.admin.updateRaffleStatus({ raffleId, status: status as any }),
    onSuccess: () => {
      toast.success("El estado de la rifa ha sido actualizado.");
      queryClient.invalidateQueries({ queryKey: ['admin-raffles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: any) => {
      console.error('Update status error:', error);
      toast.error("No se pudo actualizar el estado.");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-yellow-100 text-yellow-800';
      case 'drawn': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'closed': return 'Cerrada';
      case 'drawn': return 'Sorteada';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Panel de Administración
        </h1>
        <p className="text-xl text-slate-600">
          Gestiona rifas, pagos y estadísticas de la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Rifas</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalRaffles || 0}</p>
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
                <p className="text-sm font-medium text-slate-600">Rifas Activas</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.activeRaffles || 0}</p>
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
                <p className="text-sm font-medium text-slate-600">Boletos Vendidos</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalTicketsSold || 0}</p>
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
                <p className="text-sm font-medium text-slate-600">Ingresos Totales</p>
                <p className="text-3xl font-bold text-slate-900">${stats?.totalRevenue || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="raffles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="raffles">Gestión de Rifas</TabsTrigger>
          <TabsTrigger value="payments">
            Pagos Pendientes
            {stats?.pendingPayments ? (
              <Badge variant="destructive" className="ml-2">
                {stats.pendingPayments}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="create">Crear Rifa</TabsTrigger>
        </TabsList>

        {/* Raffles Management */}
        <TabsContent value="raffles">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Rifas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rafflesData?.raffles.map((raffle) => (
                  <div key={raffle.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{raffle.title}</h3>
                          <Badge className={getStatusColor(raffle.status)}>
                            {getStatusText(raffle.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Precio:</span> ${raffle.pricePerTicket}
                          </div>
                          <div>
                            <span className="font-medium">Vendidos:</span> {raffle.soldTickets}/{raffle.totalTickets}
                          </div>
                          <div>
                            <span className="font-medium">Fin:</span> {new Date(raffle.endDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Sorteo:</span> {new Date(raffle.drawDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {raffle.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ raffleId: raffle.id, status: 'closed' })}
                            disabled={updateStatusMutation.isPending}
                          >
                            Cerrar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Payments */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pagos Pendientes de Confirmación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayments?.payments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No hay pagos pendientes
                  </div>
                ) : (
                  pendingPayments?.payments.map((payment) => (
                    <div key={payment.ticketId} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{payment.raffleTitle}</h3>
                            <Badge variant="secondary">
                              Boleto #{payment.ticketNumber.toString().padStart(4, '0')}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Comprador:</span> {payment.buyerName}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {payment.buyerEmail}
                            </div>
                            <div>
                              <span className="font-medium">Método:</span> {payment.paymentMethod}
                            </div>
                            <div>
                              <span className="font-medium">Monto:</span> ${payment.amountPaid}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-slate-500">
                            Comprado: {new Date(payment.purchasedAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => confirmPaymentMutation.mutate(payment.ticketId)}
                            disabled={confirmPaymentMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirmar
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Raffle */}
        <TabsContent value="create">
          <CreateRaffleForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateRaffleForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    pricePerTicket: '',
    startDate: '',
    endDate: '',
    drawDate: '',
  });

  const createRaffleMutation = useMutation({
    mutationFn: (data: any) => backend.admin.createRaffle(data),
    onSuccess: () => {
      toast.success("La rifa ha sido creada exitosamente.");
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        pricePerTicket: '',
        startDate: '',
        endDate: '',
        drawDate: '',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-raffles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: any) => {
      console.error('Create raffle error:', error);
      toast.error(error.message || "No se pudo crear la rifa.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pricePerTicket || !formData.endDate || !formData.drawDate) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    createRaffleMutation.mutate({
      title: formData.title,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      pricePerTicket: parseFloat(formData.pricePerTicket),
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: new Date(formData.endDate),
      drawDate: new Date(formData.drawDate),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Crear Nueva Rifa</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Toyota Camry 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Precio por Boleto *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerTicket}
                onChange={(e) => setFormData({ ...formData, pricePerTicket: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Sorteo *
              </label>
              <input
                type="datetime-local"
                value={formData.drawDate}
                onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del premio..."
            />
          </div>

          <Button
            type="submit"
            disabled={createRaffleMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {createRaffleMutation.isPending ? 'Creando...' : 'Crear Rifa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
