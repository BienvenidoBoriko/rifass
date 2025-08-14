"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Trophy,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { adminApi, Raffle } from "@/lib/admin-api";
import RaffleForm from "@/components/admin/RaffleForm";
import WinnerAssignment from "@/components/admin/WinnerAssignment";

export default function AdminRaffles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rafflesData, setRafflesData] = useState<{ raffles: Raffle[] } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [showRaffleForm, setShowRaffleForm] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<Raffle | null>(null);
  const [showWinnerAssignment, setShowWinnerAssignment] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [deletingRaffle, setDeletingRaffle] = useState<Raffle | null>(null);
  const [savingRaffle, setSavingRaffle] = useState(false);
  const [assigningWinner, setAssigningWinner] = useState(false);
  const [migratingImages, setMigratingImages] = useState(false);

  const fetchRaffles = async () => {
    try {
      setIsLoading(true);
      const rafflesResult = await adminApi.listAllRaffles();
      setRafflesData(rafflesResult);
    } catch (error) {
      console.error("Error fetching raffles:", error);
      toast.error("No se pudieron cargar las rifas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRaffles();
  }, []);

  const updateStatus = async (
    raffleId: number,
    status: "active" | "closed" | "drawn"
  ) => {
    try {
      setUpdatingStatus(raffleId);
      await adminApi.updateRaffleStatus({ raffleId, status });

      toast.success("El estado de la rifa ha sido actualizado.");

      // Refetch raffles
      await fetchRaffles();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCreateRaffle = () => {
    setEditingRaffle(null);
    setShowRaffleForm(true);
  };

  const handleEditRaffle = (raffle: Raffle) => {
    setEditingRaffle(raffle);
    setShowRaffleForm(true);
  };

  const handleDeleteRaffle = (raffle: Raffle) => {
    setDeletingRaffle(raffle);
  };

  const confirmDeleteRaffle = async () => {
    if (!deletingRaffle) return;

    try {
      await adminApi.deleteRaffle(deletingRaffle.id);
      toast.success("La rifa ha sido eliminada exitosamente.");
      await fetchRaffles();
    } catch (error) {
      console.error("Delete raffle error:", error);
      toast.error("No se pudo eliminar la rifa.");
    } finally {
      setDeletingRaffle(null);
    }
  };

  const handleSaveRaffle = async (raffleData: any) => {
    try {
      setSavingRaffle(true);

      if (editingRaffle) {
        await adminApi.updateRaffle(editingRaffle.id, raffleData);
        toast.success("La rifa ha sido actualizada exitosamente.");
      } else {
        await adminApi.createRaffle(raffleData);
        toast.success("La rifa ha sido creada exitosamente.");
      }

      setShowRaffleForm(false);
      setEditingRaffle(null);
      await fetchRaffles();
    } catch (error) {
      console.error("Save raffle error:", error);
      toast.error("No se pudo guardar la rifa.");
    } finally {
      setSavingRaffle(false);
    }
  };

  const handleAssignWinner = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    setShowWinnerAssignment(true);
  };

  const handleSaveWinner = async (winnerData: any) => {
    try {
      setAssigningWinner(true);
      await adminApi.assignWinner(winnerData);
      toast.success("El ganador ha sido asignado exitosamente.");
      setShowWinnerAssignment(false);
      setSelectedRaffle(null);
      await fetchRaffles();
    } catch (error) {
      console.error("Assign winner error:", error);
      toast.error("No se pudo asignar el ganador.");
    } finally {
      setAssigningWinner(false);
    }
  };

  const handleMigrateImages = async () => {
    try {
      setMigratingImages(true);
      const response = await fetch("/api/admin/migrate-images", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to migrate images");
      }

      const result = await response.json();
      toast.success(result.message);
      await fetchRaffles();
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Error al migrar las imágenes.");
    } finally {
      setMigratingImages(false);
    }
  };

  const filteredRaffles =
    rafflesData?.raffles.filter((raffle) =>
      raffle.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "drawn":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";
      case "closed":
        return "Cerrada";
      case "drawn":
        return "Sorteada";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestión de Rifas
            </h1>
            <p className="text-slate-600">
              Administra todas las rifas de la plataforma
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleCreateRaffle}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Rifa
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
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
              <Button
                variant="outline"
                onClick={handleMigrateImages}
                disabled={migratingImages}
                className="flex items-center space-x-2"
              >
                {migratingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Migrando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Migrar Imágenes</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Raffles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Todas las Rifas ({filteredRaffles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 h-16 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredRaffles.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No se encontraron rifas
                </h3>
                <p className="text-slate-600">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Aún no hay rifas creadas"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRaffles.map((raffle) => (
                  <div
                    key={raffle.id}
                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={raffle.imageUrl || "/placeholder-car.jpg"}
                          alt={raffle.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">
                              {raffle.title}
                            </h3>
                            <Badge className={getStatusColor(raffle.status)}>
                              {getStatusText(raffle.status)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Precio:</span> $
                              {raffle.pricePerTicket}
                            </div>
                            <div>
                              <span className="font-medium">Vendidos:</span>{" "}
                              {raffle.soldTickets}/{raffle.totalTickets}
                            </div>
                            <div>
                              <span className="font-medium">Fin:</span>{" "}
                              {new Date(raffle.endDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Sorteo:</span>{" "}
                              {new Date(raffle.drawDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRaffle(raffle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="flex items-center p-2 bg-white rounded-md shadow-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {raffle.status === "active" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(raffle.id, "closed")
                                }
                                disabled={updatingStatus === raffle.id}
                              >
                                {updatingStatus === raffle.id
                                  ? "Cerrando..."
                                  : "Cerrar Rifa"}
                              </DropdownMenuItem>
                            )}
                            {raffle.status === "closed" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatus(raffle.id, "drawn")
                                  }
                                  disabled={updatingStatus === raffle.id}
                                >
                                  {updatingStatus === raffle.id
                                    ? "Actualizando..."
                                    : "Marcar como Sorteada"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleAssignWinner(raffle)}
                                >
                                  <Trophy className="h-4 w-4 mr-2" />
                                  Asignar Ganador
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteRaffle(raffle)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Raffle Form Modal */}
      {showRaffleForm && (
        <RaffleForm
          raffle={editingRaffle || undefined}
          onSave={handleSaveRaffle}
          onCancel={() => {
            setShowRaffleForm(false);
            setEditingRaffle(null);
          }}
          isLoading={savingRaffle}
        />
      )}

      {/* Winner Assignment Modal */}
      {showWinnerAssignment && selectedRaffle && (
        <WinnerAssignment
          raffle={selectedRaffle}
          onAssign={handleSaveWinner}
          onCancel={() => {
            setShowWinnerAssignment(false);
            setSelectedRaffle(null);
          }}
          isLoading={assigningWinner}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingRaffle}
        onOpenChange={() => setDeletingRaffle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>¿Eliminar Rifa?</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar la rifa "
              {deletingRaffle?.title}"? Esta acción no se puede deshacer y
              eliminará todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRaffle}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
