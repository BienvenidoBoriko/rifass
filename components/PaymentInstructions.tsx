"use client";
import { useState } from "react";
import {
  Copy,
  CheckCircle,
  CreditCard,
  Smartphone,
  DollarSign,
  Upload,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { validateFile } from "@/lib/utils";

interface PaymentInstructionsProps {
  paymentMethod: string;
  totalAmount: number;
  onComplete: (reference: string, proofUrl?: string, comment?: string) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export default function PaymentInstructions({
  paymentMethod,
  totalAmount,
  onComplete,
  isSubmitting = false,
  onCancel,
}: PaymentInstructionsProps) {
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentComment, setPaymentComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Información copiada al portapapeles");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error || "Error al validar el archivo");
        return;
      }

      setPaymentProof(file);
      toast.success("Imagen de comprobante cargada exitosamente");
    }
  };

  const removeFile = () => {
    setPaymentProof(null);
    const fileInput = document.getElementById(
      "payment-proof"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmitReference = async () => {
    if (!paymentReference.trim()) {
      toast.error("Por favor ingresa la referencia de pago");
      return;
    }

    if (!paymentProof) {
      toast.error("Por favor sube una imagen del comprobante de pago");
      return;
    }

    setIsUploading(true);

    try {
      // Upload the file first
      const formData = new FormData();
      formData.append("file", paymentProof);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Error al subir el archivo");
      }

      const uploadResult = await uploadResponse.json();

      // Call onComplete with the file URL
      onComplete(paymentReference, uploadResult.url, paymentComment);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al subir el archivo"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "zelle":
        return <DollarSign className="h-6 w-6" />;
      case "paypal":
        return <CreditCard className="h-6 w-6" />;
      case "binance":
        return <CreditCard className="h-6 w-6" />;
      case "pago-movil":
        return <Smartphone className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPaymentInstructions = () => {
    switch (paymentMethod) {
      case "zelle":
        return {
          title: "Pago con Zelle",
          email: process.env.NEXT_PUBLIC_ZELLE_EMAIL || "soporte@ganaxdar.com",
          instructions: [
            "Abre tu app bancaria o Zelle",
            `Envía el pago al email: ${
              process.env.NEXT_PUBLIC_ZELLE_EMAIL || "soporte@ganaxdar.com"
            }`,
            'Usa como concepto: "Boletos Ganaxdar"',
            "Guarda la referencia de la transacción",
            "Sube una imagen del comprobante de pago",
            "Ingresa la referencia abajo para confirmar",
          ],
        };
      case "paypal":
        return {
          title: "Pago con PayPal",
          email: process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "soporte@ganaxdar.com",
          instructions: [
            "Abre PayPal en tu navegador o app",
            `Envía el pago al email: ${
              process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "soporte@ganaxdar.com"
            }`,
            'Usa como concepto: "Boletos Ganaxdar"',
            "Guarda la referencia de la transacción",
            "Sube una imagen del comprobante de pago",
            "Ingresa la referencia abajo para confirmar",
          ],
        };
      case "binance":
        return {
          title: "Pago con Binance Pay",
          wallet:
            process.env.NEXT_PUBLIC_BINANCE_EMAIL ||
            "oldschool1208cr@gmail.com",
          instructions: [
            "Abre Binance Pay en tu app",
            `Envía USDT a: ${
              process.env.NEXT_PUBLIC_BINANCE_EMAIL ||
              "oldschool1208cr@gmail.com"
            }`,
            "Usa la red BSC (BEP20) para menores comisiones",
            "Guarda el hash de la transacción",
            "Sube una imagen del comprobante de pago",
            "Ingresa el hash abajo para confirmar",
          ],
        };
      case "pago-movil":
        return {
          title: "Pago Móvil",
          bank: process.env.NEXT_PUBLIC_PAGO_MOVIL_BANK || "Banesco",
          phone: process.env.NEXT_PUBLIC_PAGO_MOVIL_PHONE || "04123738860",
          ci: process.env.NEXT_PUBLIC_PAGO_MOVIL_CI || "V-27248689",
          instructions: [
            "Marca *121# desde tu teléfono",
            "Selecciona Pago Móvil",
            `Banco: ${process.env.NEXT_PUBLIC_PAGO_MOVIL_BANK || "Banesco"}`,
            `Teléfono: ${
              process.env.NEXT_PUBLIC_PAGO_MOVIL_PHONE || "04123738860"
            }`,
            `Cédula: ${process.env.NEXT_PUBLIC_PAGO_MOVIL_CI || "V-27248689"}`,
            "Guarda la referencia de la transacción",
            "Sube una imagen del comprobante de pago",
          ],
        };
      default:
        return {
          title: "Procesando pago...",
          instructions: ["Redirigiendo a la pasarela de pago segura..."],
        };
    }
  };

  const instructions = getPaymentInstructions();

  return (
    <div className="space-y-6">
      {/* Header with Cancel Button */}
      {onCancel && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Instrucciones de Pago
          </h2>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-red-600 hover:text-red-700 border-red-300"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar Compra
          </Button>
        </div>
      )}

      {/* Payment Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            {getPaymentIcon()}
            <span>Resumen de Pago</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Monto a pagar:</span>
            <span className="font-semibold">${totalAmount}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Total a pagar:</span>
            <span className="text-blue-600">${totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>{instructions.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Details */}
          {paymentMethod === "zelle" && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{instructions.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(instructions.email!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{instructions.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(instructions.email!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "binance" && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Wallet:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">{instructions.wallet}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(instructions.wallet!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "pago-movil" && (
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Banco:</span>
                <span>{instructions.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Teléfono:</span>
                <span className="font-mono">{instructions.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cédula:</span>
                <span className="font-mono">{instructions.ci}</span>
              </div>
            </div>
          )}

          {/* Instructions List */}
          <div>
            <h4 className="font-medium mb-3">Instrucciones:</h4>
            <ol className="space-y-2">
              {instructions.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Payment Proof Upload */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comprobante de Pago *
            </label>
            <div className="space-y-2">
              <input
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("payment-proof")?.click()
                  }
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Subir Comprobante</span>
                </Button>
                {paymentProof && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">
                      ✓ {paymentProof.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500">
                Sube una imagen del comprobante de pago (JPG, PNG, WEBP - máximo
                5MB)
              </p>
            </div>
          </div>

          {/* Payment Comment */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Comentario (opcional)
            </label>
            <Textarea
              value={paymentComment}
              onChange={(e) => setPaymentComment(e.target.value)}
              placeholder="Agrega algún comentario o información adicional sobre tu pago..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Reference Input */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Referencia de Pago *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Ingresa la referencia o hash de la transacción"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSubmitReference}
                disabled={
                  !paymentReference.trim() ||
                  !paymentProof ||
                  isUploading ||
                  isSubmitting
                }
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {isUploading
                  ? "Subiendo..."
                  : isSubmitting
                  ? "Procesando..."
                  : "Confirmar"}
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Una vez enviado el pago, ingresa la referencia y sube el
              comprobante para que podamos verificar y confirmar tus boletos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-yellow-800 mb-2">
            Notas Importantes:
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • El pago debe realizarse por el monto exacto: ${totalAmount}
            </li>
            <li>• Tus boletos serán reservados por 30 minutos</li>
            <li>• La confirmación puede tomar hasta 24 horas</li>
            <li>• Guarda la referencia de pago para futuras consultas</li>
            <li>• Es obligatorio subir una imagen del comprobante de pago</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
