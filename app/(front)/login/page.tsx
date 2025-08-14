"use client";
import { useState } from "react";
import { X, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    city: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!loginData.email || !loginData.password) {
      toast.error("Campos requeridos: Por favor, completa todos los campos.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      toast.error("Email inválido: Por favor, ingresa un email válido.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      });

      if (result?.error) {
        console.log(result.error);
        toast.error("Error de inicio de sesión: " + result.error);
        return;
      }

      if (result?.ok) {
        await getSession();
        toast.success("¡Bienvenido!: Has iniciado sesión exitosamente.");

        // Redirect based on user role
        const session = await getSession();
        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        "Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      toast.error(
        "Campos requeridos: Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      toast.error("Email inválido: Por favor, ingresa un email válido.");
      return;
    }

    // Validate password length
    if (registerData.password.length < 6) {
      toast.error(
        "Contraseña muy corta: La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    // Validate name length
    if (registerData.name.trim().length < 2) {
      toast("Nombre muy corto: El nombre debe tener al menos 2 caracteres.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error(
        "Contraseñas no coinciden: Las contraseñas no coinciden. Por favor, verifica."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone,
          country: registerData.country,
          city: registerData.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from the API
        if (data.details) {
          const errorMessages = Object.values(data.details)
            .filter(Boolean)
            .join(", ");
          toast.error("Error de validación: " + errorMessages);
        } else {
          toast.error(
            "Error de registro: " + data.error || "No se pudo crear la cuenta."
          );
        }
        return;
      }

      // Success
      toast.success(
        "¡Cuenta creada exitosamente!: Ya puedes iniciar sesión con tu nueva cuenta."
      );

      // Clear form and switch to login tab
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        country: "",
        city: "",
      });

      // Auto-fill login form with new email
      setLoginData({
        email: registerData.email,
        password: "",
      });
    } catch (error: any) {
      toast.error(
        "Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (email: string) => {
    setLoginData({ email, password: "123456" });
  };

  return (
    <div className=" flex items-center justify-center z-50 p-4 my-10">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <CardTitle className="text-center">Acceder a GanaXDar</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      placeholder="tu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="Tu contraseña"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              {/* Test Accounts */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">
                    Cuentas de Prueba:
                  </h4>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestLogin("test@example.com")}
                      className="w-full text-left justify-start text-xs"
                    >
                      test@example.com (4 boletos)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestLogin("demo@test.com")}
                      className="w-full text-left justify-start text-xs"
                    >
                      demo@test.com (3 boletos)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestLogin("user@example.com")}
                      className="w-full text-left justify-start text-xs"
                    >
                      user@example.com (5 boletos)
                    </Button>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Contraseña para todas: <code>123456</code>
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="register-name"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Tu nombre completo"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="register-email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      placeholder="tu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="register-phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="register-phone"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1234567890"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="register-country">País</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="register-country"
                        value={registerData.country}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            country: e.target.value,
                          })
                        }
                        placeholder="País"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="register-city">Ciudad</Label>
                    <Input
                      id="register-city"
                      value={registerData.city}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          city: e.target.value,
                        })
                      }
                      placeholder="Ciudad"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="register-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="register-confirm-password">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="register-confirm-password"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirma tu contraseña"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
