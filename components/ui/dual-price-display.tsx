import { formatCurrency, type CurrencyCode } from "@/lib/currency";

interface DualPriceDisplayProps {
  priceUSD: number;
  priceVES: number;
  showTotal?: boolean;
  totalTickets?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function DualPriceDisplay({
  priceUSD,
  priceVES,
  showTotal = false,
  totalTickets = 1,
  className = "",
  size = "md",
}: DualPriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const totalUSD = priceUSD * totalTickets;
  const totalVES = priceVES * totalTickets;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Precio por boleto */}
      <div className="flex items-center justify-between">
        <span className={`text-slate-600 ${sizeClasses[size]}`}>
          Precio por boleto:
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
          <div className={`font-bold text-green-700 ${sizeClasses[size]}`}>
            {formatCurrency(priceUSD, "USD")}
          </div>
          <div className="text-xs text-green-600">USD</div>
        </div>

        <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className={`font-bold text-blue-700 ${sizeClasses[size]}`}>
            {formatCurrency(priceVES, "VES")}
          </div>
          <div className="text-xs text-blue-600">VES</div>
        </div>
      </div>

      {/* Total si se solicita */}
      {showTotal && totalTickets > 1 && (
        <>
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-slate-600 ${sizeClasses[size]}`}>
                Total ({totalTickets} boletos):
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-green-100 rounded-lg border border-green-300">
                <div
                  className={`font-bold text-green-800 ${sizeClasses[size]}`}
                >
                  {formatCurrency(totalUSD, "USD")}
                </div>
                <div className="text-xs text-green-700">Total USD</div>
              </div>

              <div className="text-center p-2 bg-blue-100 rounded-lg border border-blue-300">
                <div className={`font-bold text-blue-800 ${sizeClasses[size]}`}>
                  {formatCurrency(totalVES, "VES")}
                </div>
                <div className="text-xs text-blue-700">Total VES</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
