"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Play,
  CheckCircle,
  X,
  AlertTriangle,
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
import { adminApi, Winner } from "@/lib/admin-api";

export default function AdminWinners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [winnersData, setWinnersData] = useState<{ winners: Winner[] } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [deletingWinner, setDeletingWinner] = useState<Winner | null>(null);

  const fetchWinners = async () => {
    try {
      setIsLoading(true);
      const winnersResult = await adminApi.getWinners();
      setWinnersData(winnersResult);
    } catch (error) {
      console.error("Error fetching winners:", error);
      toast.error("No se pudieron cargar los ganadores.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleDeleteWinner = (winner: Winner) => {
    setDeletingWinner(winner);
  };

  const confirmDeleteWinner = async () => {
    if (!deletingWinner) return;

    try {
      // This would be an API call in a real implementation
      toast.success("El ganador ha sido eliminado exitosamente.");
      await fetchWinners();
    } catch (error) {
      console.error("Delete winner error:", error);
      toast.error("No se pudo eliminar el ganador.");
    } finally {
      setDeletingWinner(null);
    }
  };

  const filteredWinners =
    winnersData?.winners.filter(
      (winner) =>
        winner.winnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.winnerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.raffleTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const formatTicketNumber = (num: number) => num.toString().padStart(4, "0");

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestión de Ganadores
            </h1>
            <p className="text-slate-600">
              Administra todos los ganadores de las rifas
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Ganadores
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {winnersData?.winners.length || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Premios Reclamados
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {winnersData?.winners.filter((w) => w.claimed).length || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Pendientes de Reclamar
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {winnersData?.winners.filter((w) => !w.claimed).length || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <X className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Con Videos
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {winnersData?.winners.filter((w) => w.videoUrl).length || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Play className="h-6 w-6 text-blue-600" />
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

        {/* Winners Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Todos los Ganadores ({filteredWinners.length})
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
            ) : filteredWinners.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No se encontraron ganadores
                </h3>
                <p className="text-slate-600">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Aún no hay ganadores registrados"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWinners.map((winner) => (
                  <div
                    key={winner.id}
                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 w-12 h-12 rounded-full flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-slate-900">
                              {winner.winnerName}
                            </h3>
                            <Badge
                              variant={winner.claimed ? "default" : "secondary"}
                              className={
                                winner.claimed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {winner.claimed ? "Reclamado" : "Pendiente"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Rifa:</span>{" "}
                              {winner.raffleTitle}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {winner.winnerEmail}
                            </div>
                            <div>
                              <span className="font-medium">Boleto:</span>{" "}
                              <span className="font-mono font-semibold text-blue-600">
                                #{formatTicketNumber(winner.ticketNumber)}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Fecha:</span>{" "}
                              {new Date(winner.drawDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {winner.videoUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={winner.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Play className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteWinner(winner)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar Ganador
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingWinner}
        onOpenChange={() => setDeletingWinner(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>¿Eliminar Ganador?</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar al ganador "
              {deletingWinner?.winnerName}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWinner}
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
