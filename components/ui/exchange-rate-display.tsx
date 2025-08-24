"use client";
import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCurrentExchangeRate,
  getLastUpdateInfo,
  syncExchangeRateWithAPI,
  formatExchangeRate,
} from "@/lib/exchange-rates";

interface ExchangeRateDisplayProps {
  showRefreshButton?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ExchangeRateDisplay({
  showRefreshButton = true,
  className = "",
  size = "md",
}: ExchangeRateDisplayProps) {
  const [currentRate, setCurrentRate] = useState<number>(
    getCurrentExchangeRate()
  );
  const [lastUpdate, setLastUpdate] = useState(getLastUpdateInfo());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const refreshRate = async () => {
    setIsRefreshing(true);
    try {
      const success = await syncExchangeRateWithAPI();
      if (success) {
        setCurrentRate(getCurrentExchangeRate());
        setLastUpdate(getLastUpdateInfo());
      }
    } catch (error) {
      console.error("Error refreshing exchange rate:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Inicializar con la tasa actual
    setCurrentRate(getCurrentExchangeRate());
    setLastUpdate(getLastUpdateInfo());
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Tasa de cambio actual */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className={`font-medium text-slate-700 ${sizeClasses[size]}`}>
            Tasa de Cambio Oficial
          </span>
        </div>

        {showRefreshButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRate}
            disabled={isRefreshing}
            className="h-8 px-3"
          >
            <RefreshCw
              className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </Button>
        )}
      </div>

      {/* Valor de la tasa */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="text-center">
          <div className={`font-bold text-green-700 ${sizeClasses[size]}`}>
            {formatExchangeRate(currentRate)}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Fuente: API Oficial Venezuela
          </div>
        </div>
      </div>

      {/* Información de actualización */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1">
          <Info className="h-3 w-3" />
          <span>Última actualización: {lastUpdate.date}</span>
        </div>

        <Badge variant="secondary" className="text-xs">
          {lastUpdate.source}
        </Badge>
      </div>

      {/* Nota informativa */}
      <div className="text-xs text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p>
          <strong>Nota:</strong> Esta tasa se obtiene automáticamente de la API
          oficial de Venezuela (
          <a
            href="https://ve.dolarapi.com/v1/dolares/oficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            ve.dolarapi.com
          </a>
          ). Se actualiza en tiempo real y refleja la tasa oficial del Banco
          Central de Venezuela.
        </p>
      </div>
    </div>
  );
}
