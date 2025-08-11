"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Mail,
  Globe,
  CreditCard,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettings() {
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Ganar por Dar",
    siteDescription: " Ganar por Dar",
    contactEmail: "soporte@ganaxdar.com",
    contactPhone: "+1-234-567-8900",
    timezone: "America/EEUU",
    language: "es",

    // Payment Settings
    zelleEmail: process.env.NEXT_PUBLIC_ZELLE_EMAIL || "soporte@ganaxdar.com",
    paypalEmail: process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "soporte@ganaxdar.com",
    binanceEmail:
      process.env.NEXT_PUBLIC_BINANCE_EMAIL || "oldschool1208cr@gmail.com",
    pagoMovilPhone: process.env.NEXT_PUBLIC_PAGO_MOVIL_PHONE || "04123738860",
    pagoMovilCI: process.env.NEXT_PUBLIC_PAGO_MOVIL_CI || "V-27248689",
    pagoMovilBank: process.env.NEXT_PUBLIC_PAGO_MOVIL_BANK || "Banesco",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    newRaffleAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "24",
    maxLoginAttempts: "5",

    // Raffle Settings
    defaultTicketPrice: "25.00",
    defaultTotalTickets: "10000",
    minTicketsToStart: "1000",
    paymentTimeout: "30",
  });

  const handleSave = () => {
    toast.success("Los cambios han sido guardados exitosamente.");
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
          <p className="text-slate-600">
            Gestiona la configuración de la plataforma
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="raffles">Rifas</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Información del Sitio</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      handleInputChange("siteName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Descripción</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      handleInputChange("siteDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Teléfono de Soporte</Label>
                  <Input
                    id="supportPhone"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuración Regional</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america/caracas">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/caracas">
                        América/Caracas
                      </SelectItem>
                      <SelectItem value="america/bogota">
                        América/Bogotá
                      </SelectItem>
                      <SelectItem value="america/mexico_city">
                        América/Ciudad de México
                      </SelectItem>
                      <SelectItem value="europe/madrid">
                        Europa/Madrid
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - Dólar Americano</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="ves">VES - Bolívar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Métodos de Pago</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zelleEmail">Email de Zelle</Label>
                  <Input
                    id="zelleEmail"
                    type="email"
                    value={settings.zelleEmail}
                    onChange={(e) =>
                      handleInputChange("zelleEmail", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paypalEmail">Email de PayPal</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={settings.paypalEmail}
                    onChange={(e) =>
                      handleInputChange("paypalEmail", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="binanceEmail">Email de Binance</Label>
                  <Input
                    id="binanceEmail"
                    type="email"
                    value={settings.binanceEmail}
                    onChange={(e) =>
                      handleInputChange("binanceEmail", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pago Móvil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pagoMovilBank">Banco</Label>
                  <Input
                    id="pagoMovilBank"
                    value={settings.pagoMovilBank}
                    onChange={(e) =>
                      handleInputChange("pagoMovilBank", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pagoMovilPhone">Teléfono</Label>
                  <Input
                    id="pagoMovilPhone"
                    value={settings.pagoMovilPhone}
                    onChange={(e) =>
                      handleInputChange("pagoMovilPhone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pagoMovilCI">Cédula de Identidad</Label>
                  <Input
                    id="pagoMovilCI"
                    value={settings.pagoMovilCI}
                    onChange={(e) =>
                      handleInputChange("pagoMovilCI", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Configuración de Notificaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">
                    Notificaciones por Email
                  </Label>
                  <p className="text-sm text-slate-600">
                    Recibir notificaciones importantes por correo
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleInputChange("emailNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">
                    Notificaciones por SMS
                  </Label>
                  <p className="text-sm text-slate-600">
                    Recibir alertas críticas por mensaje de texto
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    handleInputChange("smsNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="paymentAlerts">Alertas de Pago</Label>
                  <p className="text-sm text-slate-600">
                    Notificar cuando se reciban nuevos pagos
                  </p>
                </div>
                <Switch
                  id="paymentAlerts"
                  checked={settings.paymentAlerts}
                  onCheckedChange={(checked) =>
                    handleInputChange("paymentAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newRaffleAlerts">
                    Alertas de Nuevas Rifas
                  </Label>
                  <p className="text-sm text-slate-600">
                    Notificar cuando se creen nuevas rifas
                  </p>
                </div>
                <Switch
                  id="newRaffleAlerts"
                  checked={settings.newRaffleAlerts}
                  onCheckedChange={(checked) =>
                    handleInputChange("newRaffleAlerts", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Configuración de Seguridad</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">
                    Autenticación de Dos Factores
                  </Label>
                  <p className="text-sm text-slate-600">
                    Añadir una capa extra de seguridad
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    handleInputChange("twoFactorAuth", checked)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">
                    Tiempo de Sesión (horas)
                  </Label>
                  <Select
                    value={settings.sessionTimeout}
                    onValueChange={(value) =>
                      handleInputChange("sessionTimeout", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="8">8 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                      <SelectItem value="168">1 semana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts">
                    Máximo Intentos de Login
                  </Label>
                  <Select
                    value={settings.maxLoginAttempts}
                    onValueChange={(value) =>
                      handleInputChange("maxLoginAttempts", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 intentos</SelectItem>
                      <SelectItem value="5">5 intentos</SelectItem>
                      <SelectItem value="10">10 intentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raffle Settings */}
        <TabsContent value="raffles">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Rifas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultTicketPrice">
                    Precio por Defecto de Boleto ($)
                  </Label>
                  <Input
                    id="defaultTicketPrice"
                    type="number"
                    step="0.01"
                    value={settings.defaultTicketPrice}
                    onChange={(e) =>
                      handleInputChange("defaultTicketPrice", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="defaultTotalTickets">
                    Total de Boletos por Defecto
                  </Label>
                  <Input
                    id="defaultTotalTickets"
                    type="number"
                    value={settings.defaultTotalTickets}
                    onChange={(e) =>
                      handleInputChange("defaultTotalTickets", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="minTicketsToStart">
                    Mínimo de Boletos para Iniciar
                  </Label>
                  <Input
                    id="minTicketsToStart"
                    type="number"
                    value={settings.minTicketsToStart}
                    onChange={(e) =>
                      handleInputChange("minTicketsToStart", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="paymentTimeout">
                    Tiempo Límite de Pago (minutos)
                  </Label>
                  <Input
                    id="paymentTimeout"
                    type="number"
                    value={settings.paymentTimeout}
                    onChange={(e) =>
                      handleInputChange("paymentTimeout", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
