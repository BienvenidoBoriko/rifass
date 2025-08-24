// Configuración de tasas de cambio para USD <-> VES
// Integrado con la API oficial de Venezuela: https://ve.dolarapi.com/v1/dolares/oficial

export interface ExchangeRate {
    USD_TO_VES: number;
    VES_TO_USD: number;
    lastUpdated: string;
    source: string;
}

export interface VenezuelaDolarAPIResponse {
    fuente: string;
    nombre: string;
    compra: number | null;
    venta: number | null;
    promedio: number;
    fechaActualizacion: string;
}

// Tasa de cambio actual (se actualiza automáticamente desde la API)
export const CURRENT_EXCHANGE_RATE: ExchangeRate = {
    USD_TO_VES: 141.8843, // Tasa oficial actual de Venezuela
    VES_TO_USD: 0.00705, // 1 / 141.8843
    lastUpdated: '2025-08-24',
    source: 'API Oficial Venezuela'
};

// Función para obtener la tasa de cambio desde la API oficial de Venezuela
export async function fetchExchangeRateFromAPI(): Promise<number | null> {
    try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: VenezuelaDolarAPIResponse = await response.json();

        // Usar el promedio si está disponible, sino usar compra o venta
        let rate = data.promedio;

        if (!rate && data.compra) {
            rate = data.compra;
        } else if (!rate && data.venta) {
            rate = data.venta;
        }

        if (rate && rate > 0) {
            console.log(`Tasa obtenida de API oficial: ${rate} VES/USD`);
            return rate;
        }

        console.warn('No se pudo obtener una tasa válida de la API');
        return null;

    } catch (error) {
        console.error('Error fetching exchange rate from Venezuela API:', error);
        return null;
    }
}

// Función para actualizar la tasa de cambio
export function updateExchangeRate(newRate: number) {
    if (newRate > 0) {
        CURRENT_EXCHANGE_RATE.USD_TO_VES = newRate;
        CURRENT_EXCHANGE_RATE.VES_TO_USD = 1 / newRate;
        CURRENT_EXCHANGE_RATE.lastUpdated = new Date().toISOString().split('T')[0];
        CURRENT_EXCHANGE_RATE.source = 'API Oficial Venezuela';

        console.log(`Tasa actualizada: 1 USD = ${newRate} VES`);
    }
}

// Función para sincronizar la tasa de cambio con la API oficial
export async function syncExchangeRateWithAPI(): Promise<boolean> {
    try {
        const apiRate = await fetchExchangeRateFromAPI();

        if (apiRate && apiRate > 0) {
            updateExchangeRate(apiRate);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error syncing exchange rate:', error);
        return false;
    }
}

// Función para obtener la tasa de cambio más reciente
export function getCurrentExchangeRate(): number {
    return CURRENT_EXCHANGE_RATE.USD_TO_VES;
}

// Función para validar si una tasa de cambio es razonable
export function isValidExchangeRate(rate: number): boolean {
    // Las tasas de cambio USD/VES en Venezuela suelen estar entre 50 y 200
    // La tasa oficial actual es 141.8843
    return rate >= 50 && rate <= 200;
}

// Función para formatear la tasa de cambio
export function formatExchangeRate(rate: number): string {
    return `1 USD = ${rate.toFixed(2)} VES`;
}

// Función para obtener información de la última actualización
export function getLastUpdateInfo(): { date: string; source: string } {
    return {
        date: CURRENT_EXCHANGE_RATE.lastUpdated,
        source: CURRENT_EXCHANGE_RATE.source
    };
}

// Función para inicializar la tasa de cambio al cargar la aplicación
export async function initializeExchangeRate(): Promise<void> {
    try {
        console.log('Inicializando tasa de cambio desde API oficial...');
        const success = await syncExchangeRateWithAPI();

        if (success) {
            console.log('Tasa de cambio inicializada exitosamente');
        } else {
            console.warn('No se pudo inicializar la tasa de cambio, usando valor por defecto');
        }
    } catch (error) {
        console.error('Error inicializando tasa de cambio:', error);
    }
}
