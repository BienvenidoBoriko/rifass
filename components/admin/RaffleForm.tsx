"use client";
import { useState, useEffect } from "react";
import { X, Upload, Calendar, DollarSign, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RaffleFormProps {
  raffle?: {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    pricePerTicket: number;
    totalTickets: number;
    startDate: string;
    endDate: string;
    drawDate: string;
    status: "active" | "closed" | "drawn";
  };
  onSave: (raffleData: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RaffleForm({
  raffle,
  onSave,
  onCancel,
  isLoading = false,
}: RaffleFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    pricePerTicket: 0,
    totalTickets: 10000,
    startDate: "",
    endDate: "",
    drawDate: "",
    status: "active" as "active" | "closed" | "drawn",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (raffle) {
      setFormData({
        title: raffle.title,
        description: raffle.description,
        imageUrl: raffle.imageUrl || "",
        pricePerTicket: raffle.pricePerTicket,
        totalTickets: raffle.totalTickets,
        startDate: raffle.startDate.split("T")[0],
        endDate: raffle.endDate.split("T")[0],
        drawDate: raffle.drawDate.split("T")[0],
        status: raffle.status,
      });
      setImagePreview(raffle.imageUrl);
    }
  }, [raffle]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);

        // Upload file to server
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/raffle-images", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
        toast.success("Imagen subida exitosamente");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error al subir la imagen");
        setImagePreview(null);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    if (formData.pricePerTicket <= 0) {
      toast.error("El precio por boleto debe ser mayor a 0");
      return;
    }

    if (formData.totalTickets <= 0) {
      toast.error("El número total de boletos debe ser mayor a 0");
      return;
    }

    if (!formData.startDate || !formData.endDate || !formData.drawDate) {
      toast.error("Todas las fechas son requeridas");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const drawDate = new Date(formData.drawDate);

    if (endDate <= startDate) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    if (drawDate <= endDate) {
      toast.error("La fecha de sorteo debe ser posterior a la fecha de fin");
      return;
    }

    onSave({
      ...formData,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      drawDate: drawDate.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{raffle ? "Editar Rifa" : "Crear Nueva Rifa"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Rifa *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: Toyota Corolla 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "closed" | "drawn") =>
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="closed">Cerrada</SelectItem>
                    <SelectItem value="drawn">Sorteada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe el premio, características del vehículo, etc."
                rows={4}
                required
              />
            </div>

            {/* Pricing and Tickets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pricePerTicket" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Precio por Boleto *
                </Label>
                <Input
                  id="pricePerTicket"
                  type="number"
                  min="1"
                  value={formData.pricePerTicket}
                  onChange={(e) =>
                    handleInputChange(
                      "pricePerTicket",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="25.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalTickets" className="flex items-center">
                  <Hash className="h-4 w-4 mr-1" />
                  Total de Boletos *
                </Label>
                <Input
                  id="totalTickets"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.totalTickets}
                  onChange={(e) =>
                    handleInputChange(
                      "totalTickets",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="10000"
                  required
                />
                <p className="text-xs text-slate-500">
                  Números del 0000 al{" "}
                  {(formData.totalTickets - 1).toString().padStart(4, "0")}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Valor Total del Premio</Label>
                <div className="text-2xl font-bold text-green-600">
                  $
                  {(
                    formData.pricePerTicket * formData.totalTickets
                  ).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fecha de Inicio *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fecha de Fin *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawDate" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fecha de Sorteo *
                </Label>
                <Input
                  id="drawDate"
                  type="date"
                  value={formData.drawDate}
                  onChange={(e) =>
                    handleInputChange("drawDate", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagen del Premio</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <div className="flex justify-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, imageUrl: "" }));
                        }}
                      >
                        Cambiar Imagen
                      </Button>
                      {uploadingImage && (
                        <div className="flex items-center text-sm text-slate-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Subiendo...
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-sm text-slate-600">
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG hasta 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Subiendo..." : "Seleccionar Imagen"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Guardando..."
                  : raffle
                  ? "Actualizar Rifa"
                  : "Crear Rifa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
