"use client";
import { useState, useEffect } from "react";
import { X, Upload, Calendar, DollarSign, Hash, RefreshCw } from "lucide-react";
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
import {
  CURRENCIES,
  convertUSDToVES,
  convertVESToUSD,
  formatCurrency,
  type CurrencyCode,
} from "@/lib/currency";
import {
  roundPrice,
  roundExchangeRate,
  parseAndRoundPrice,
  cleanPriceInput,
} from "@/lib/decimal-utils";

interface RaffleFormProps {
  raffle?: {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    pricePerTicketUSD: number;
    pricePerTicketVES: number;
    exchangeRate: number;
    currency: string;
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
    pricePerTicketUSD: 0,
    pricePerTicketVES: 0,
    exchangeRate: 141.88, // Tasa oficial actual de Venezuela
    currency: "USD" as CurrencyCode,
    totalTickets: 10000,
    startDate: "",
    endDate: "",
    drawDate: "",
    status: "active" as "active" | "closed" | "drawn",
    hasPredefinedWinners: false,
    predefinedWinners: [] as number[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (raffle) {
      setFormData({
        title: raffle.title,
        description: raffle.description,
        imageUrl: raffle.imageUrl || "",
        pricePerTicketUSD: raffle.pricePerTicketUSD,
        pricePerTicketVES: raffle.pricePerTicketVES,
        exchangeRate: raffle.exchangeRate,
        currency: raffle.currency as CurrencyCode,
        totalTickets: raffle.totalTickets,
        startDate: raffle.startDate.split("T")[0],
        endDate: raffle.endDate.split("T")[0],
        drawDate: raffle.drawDate.split("T")[0],
        status: raffle.status,
        hasPredefinedWinners: (raffle as any).hasPredefinedWinners || false,
        predefinedWinners: (raffle as any).predefinedWinners || [],
      });
      setImagePreview(raffle.imageUrl);
    }
  }, [raffle]);

  const handleInputChange = (field: string, value: string | number) => {
    // Si es un campo de tasa de cambio, redondear a 6 decimales
    if (field === "exchangeRate") {
      const numericValue =
        typeof value === "string" ? parseFloat(value) || 0 : value;
      const roundedValue = roundExchangeRate(numericValue);

      setFormData((prev) => ({
        ...prev,
        [field]: roundedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Función para manejar tickets premiados
  const handlePredefinedWinnersToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hasPredefinedWinners: checked,
      predefinedWinners: checked ? prev.predefinedWinners : [],
    }));
  };

  const addPredefinedWinner = (ticketNumber: number) => {
    if (formData.predefinedWinners.length >= 10) {
      toast.error("Máximo 10 tickets premiados permitidos");
      return;
    }

    if (ticketNumber < 0 || ticketNumber >= formData.totalTickets) {
      toast.error(
        `El número de ticket debe estar entre 0 y ${formData.totalTickets - 1}`
      );
      return;
    }

    if (formData.predefinedWinners.includes(ticketNumber)) {
      toast.error("Este número de ticket ya está seleccionado");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      predefinedWinners: [...prev.predefinedWinners, ticketNumber].sort(
        (a, b) => a - b
      ),
    }));
  };

  const removePredefinedWinner = (ticketNumber: number) => {
    setFormData((prev) => ({
      ...prev,
      predefinedWinners: prev.predefinedWinners.filter(
        (num) => num !== ticketNumber
      ),
    }));
  };

  const handleTicketNumberInput = (value: string) => {
    const ticketNumber = parseInt(value);
    if (!isNaN(ticketNumber)) {
      addPredefinedWinner(ticketNumber);
    }
  };

  // Función para convertir precios entre monedas
  const handlePriceChange = (
    field: "pricePerTicketUSD" | "pricePerTicketVES",
    value: number
  ) => {
    // Redondear a 2 decimales usando la utilidad
    const roundedValue = roundPrice(value);

    if (field === "pricePerTicketUSD") {
      const vesPrice = convertUSDToVES(roundedValue);
      // Redondear el precio en VES también a 2 decimales
      const roundedVESPrice = roundPrice(vesPrice);

      setFormData((prev) => ({
        ...prev,
        pricePerTicketUSD: roundedValue,
        pricePerTicketVES: roundedVESPrice,
      }));
    } else {
      const usdPrice = convertVESToUSD(roundedValue);
      // Redondear el precio en USD también a 2 decimales
      const roundedUSDPrice = roundPrice(usdPrice);

      setFormData((prev) => ({
        ...prev,
        pricePerTicketUSD: roundedUSDPrice,
        pricePerTicketVES: roundedValue,
      }));
    }
  };

  // Función para actualizar la tasa de cambio
  const updateExchangeRate = () => {
    if (formData.pricePerTicketUSD > 0 && formData.pricePerTicketVES > 0) {
      const newRate = formData.pricePerTicketVES / formData.pricePerTicketUSD;
      // Redondear la tasa de cambio a 6 decimales para mayor precisión
      const roundedRate = roundExchangeRate(newRate);

      setFormData((prev) => ({
        ...prev,
        exchangeRate: roundedRate,
      }));
      toast.success("Tasa de cambio actualizada");
    }
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

    if (formData.pricePerTicketUSD <= 0) {
      toast.error("El precio por boleto en USD debe ser mayor a 0");
      return;
    }

    if (formData.pricePerTicketVES <= 0) {
      toast.error("El precio por boleto en VES debe ser mayor a 0");
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

    // Validación de tickets premiados
    if (
      formData.hasPredefinedWinners &&
      formData.predefinedWinners.length === 0
    ) {
      toast.error(
        "Debes seleccionar al menos un ticket premiado cuando activas esta opción"
      );
      return;
    }

    if (
      formData.hasPredefinedWinners &&
      formData.predefinedWinners.length > 10
    ) {
      toast.error("Máximo 10 tickets premiados permitidos");
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
                <Label
                  htmlFor="pricePerTicketUSD"
                  className="flex items-center"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Precio por Boleto (USD) *
                </Label>
                <Input
                  id="pricePerTicketUSD"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.pricePerTicketUSD}
                  onChange={(e) => {
                    const cleanedValue = cleanPriceInput(e.target.value);
                    const parsedValue = parseAndRoundPrice(cleanedValue);
                    handlePriceChange("pricePerTicketUSD", parsedValue);
                  }}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pricePerTicketVES"
                  className="flex items-center"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Precio por Boleto (VES) *
                </Label>
                <Input
                  id="pricePerTicketVES"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.pricePerTicketVES}
                  onChange={(e) => {
                    const cleanedValue = cleanPriceInput(e.target.value);
                    const parsedValue = parseAndRoundPrice(cleanedValue);
                    handlePriceChange("pricePerTicketVES", parsedValue);
                  }}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchangeRate" className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Tasa de Cambio (VES/USD)
                </Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.exchangeRate}
                  onChange={(e) => {
                    const numericValue = parseFloat(e.target.value) || 0;
                    handleInputChange("exchangeRate", numericValue);
                  }}
                  placeholder="35.50"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={updateExchangeRate}
                  className="mt-2"
                >
                  Actualizar Tasa
                </Button>
              </div>
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

            {/* Tickets Premiados */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasPredefinedWinners"
                  checked={formData.hasPredefinedWinners}
                  onChange={(e) =>
                    handlePredefinedWinnersToggle(e.target.checked)
                  }
                  className="rounded"
                />
                <Label
                  htmlFor="hasPredefinedWinners"
                  className="text-base font-medium"
                >
                  Definir Tickets Premiados al Crear la Rifa
                </Label>
              </div>

              {formData.hasPredefinedWinners && (
                <div className="space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Tickets Premiados ({formData.predefinedWinners.length}/10)
                    </Label>
                    <span className="text-xs text-slate-500">
                      Máximo 10 tickets
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      max={formData.totalTickets - 1}
                      placeholder={`0 - ${formData.totalTickets - 1}`}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleTicketNumberInput(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder*="0 -"]'
                        ) as HTMLInputElement;
                        if (input && input.value) {
                          handleTicketNumberInput(input.value);
                          input.value = "";
                        }
                      }}
                    >
                      Agregar
                    </Button>
                  </div>

                  {formData.predefinedWinners.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Tickets Seleccionados:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.predefinedWinners.map((ticketNumber) => (
                          <div
                            key={ticketNumber}
                            className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            <span className="font-mono font-bold">
                              #{ticketNumber.toString().padStart(4, "0")}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removePredefinedWinner(ticketNumber)
                              }
                              className="text-blue-600 hover:text-blue-800 text-lg font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-600 bg-white p-3 rounded border">
                    <p className="font-medium mb-1">ℹ️ Información:</p>
                    <ul className="space-y-1">
                      <li>
                        • Los tickets premiados se seleccionarán automáticamente
                        al finalizar la rifa
                      </li>
                      <li>
                        • Si no se definen tickets premiados, los
                        administradores podrán elegir ganadores manualmente
                      </li>
                      <li>
                        • Los números de tickets deben estar entre 0 y{" "}
                        {formData.totalTickets - 1}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Valor Total del Premio</Label>
              <div className="space-y-2">
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(
                    formData.pricePerTicketUSD * formData.totalTickets,
                    "USD"
                  )}
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatCurrency(
                    formData.pricePerTicketVES * formData.totalTickets,
                    "VES"
                  )}
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
