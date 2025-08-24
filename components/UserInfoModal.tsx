"use client";
import { useState } from "react";
import { X, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (userInfo: {
    email: string;
    phone?: string;
    name?: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function UserInfoModal({
  isOpen,
  onClose,
  onContinue,
  isSubmitting = false,
}: UserInfoModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("El email es obligatorio");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    // Validar formato de teléfono si se proporciona
    if (phone.trim() && !/^[\+]?[0-9\s\-\(\)]{7,15}$/.test(phone)) {
      toast.error("Por favor ingresa un número de teléfono válido");
      return;
    }

    onContinue({
      email: email.trim(),
      phone: phone.trim() || undefined,
      name: name.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail("");
      setPhone("");
      setName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            Información de Contacto
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email *</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={isSubmitting}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Recibirás la confirmación de tu compra en este email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Nombre (opcional)</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Teléfono (opcional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                disabled={isSubmitting}
                className="w-full"
              />
              <p className="text-xs text-slate-500">
                Para contactarte en caso de ganar o por consultas
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Procesando..." : "Continuar con la Compra"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Nota:</strong> Al continuar sin iniciar sesión, tus
                boletos estarán asociados a este email. Te recomendamos crear
                una cuenta para un mejor seguimiento de tus compras.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
