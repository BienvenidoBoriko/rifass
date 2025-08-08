"use client";
import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AutoRifa Pro</span>
            </div>
            <p className="text-slate-300 mb-4 max-w-md">
              La plataforma más segura y confiable para participar en rifas de
              vehículos. Sorteos auditados, premios reales, 100% transparente.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="h-4 w-4" />
                <span>info@autorifapro.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/raffles"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Rifas Activas
                </Link>
              </li>
              <li>
                <Link
                  href="/winners"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Ganadores
                </Link>
              </li>
              <li>
                <Link
                  href="/my-tickets"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Mis Boletos
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Política de Reembolsos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 AutoRifa Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
