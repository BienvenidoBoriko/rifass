"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Trophy,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
  Shield,
  LogOut,
  Car,
  Award,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.jpg";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Rifas",
    href: "/admin/raffles",
    icon: Trophy,
  },
  {
    name: "Tickets",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    name: "Ganadores",
    href: "/admin/winners",
    icon: Award,
  },
  {
    name: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Pagos",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Reportes",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Image src={logo} alt="logo" width={32} height={32} />
          </div>
          <div>
            <span className="text-white font-bold text-lg"> GanaXDar</span>
            <p className="text-slate-400 text-xs">Panel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 px-4 py-6 space-y-2"
        role="navigation"
        aria-label="Admin navigation"
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-3 py-2 text-slate-300">
          <Shield className="h-5 w-5" />
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
            <p className="text-xs text-slate-400">
              {user?.email || "admin@ganaxdar.com"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-slate-300 hover:text-white hover:bg-slate-800"
          asChild
        >
          <Link href="/">Volver al Sitio</Link>
        </Button>
      </div>
    </div>
  );
}
