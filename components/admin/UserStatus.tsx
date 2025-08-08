"use client";

import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

export default function UserStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-slate-200 h-4 w-4 rounded"></div>
        <span className="text-sm text-slate-500">Cargando...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">No autenticado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Shield className="h-4 w-4 text-green-500" />
      <span className="text-sm text-green-600">
        {session.user.name} ({session.user.role})
      </span>
      <Badge variant={session.user.role === "admin" ? "default" : "secondary"}>
        {session.user.role === "admin" ? "Administrador" : "Usuario"}
      </Badge>
    </div>
  );
}
