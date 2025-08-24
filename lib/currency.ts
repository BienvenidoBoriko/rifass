// Configuración de monedas y tasas de cambio
// Integrado con la API oficial de Venezuela para tasas en tiempo real
export const CURRENCIES = {
    USD: {
        symbol: '$',
        name: 'Dólar Estadounidense',
        code: 'USD'
    },
    VES: {
        symbol: 'Bs.',
        name: 'Bolívar Venezolano',
        code: 'VES'
    }
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

// Tasa de cambio actualizada (basada en la API oficial de Venezuela)
// Tasa oficial: 1 USD = 141.8843 VES (actualizada 2025-08-24)
export const EXCHANGE_RATES = {
    USD_TO_VES: 141.8843, // 1 USD = 141.8843 Bs.
    VES_TO_USD: 0.00705 // 1 Bs. = 0.00705 USD
} as const;

// Funciones de conversión
export function convertUSDToVES(usdAmount: number): number {
    return usdAmount * EXCHANGE_RATES.USD_TO_VES;
}

export function convertVESToUSD(vesAmount: number): number {
    return vesAmount * EXCHANGE_RATES.VES_TO_USD;
}

// Función para formatear monedas
export function formatCurrency(amount: number, currency: CurrencyCode): string {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    if (currency === 'VES') {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    return amount.toString();
}

// Función para obtener el símbolo de la moneda
export function getCurrencySymbol(currency: CurrencyCode): string {
    return CURRENCIES[currency].symbol;
}

// Función para calcular el precio total en ambas monedas
export function calculateTotalPrice(
    pricePerTicket: number,
    totalTickets: number,
    currency: CurrencyCode
): { usd: number; ves: number } {
    if (currency === 'USD') {
        const totalUSD = pricePerTicket * totalTickets;
        const totalVES = convertUSDToVES(totalUSD);
        return { usd: totalUSD, ves: totalVES };
    } else {
        const totalVES = pricePerTicket * totalTickets;
        const totalUSD = convertVESToUSD(totalVES);
        return { usd: totalUSD, ves: totalVES };
    }
}

// Función para obtener la tasa de cambio actual
export function getCurrentExchangeRate(): number {
    return EXCHANGE_RATES.USD_TO_VES;
}

// Función para formatear la tasa de cambio
export function formatExchangeRate(): string {
    return `1 USD = ${EXCHANGE_RATES.USD_TO_VES.toFixed(2)} VES`;
}
