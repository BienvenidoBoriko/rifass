import { useState, useEffect, useCallback } from 'react';
import {
    getCurrentExchangeRate,
    getLastUpdateInfo,
    syncExchangeRateWithAPI,
    formatExchangeRate,
    type ExchangeRate
} from '@/lib/exchange-rates';

interface UseExchangeRateReturn {
    currentRate: number;
    lastUpdate: { date: string; source: string };
    isLoading: boolean;
    error: string | null;
    refreshRate: () => Promise<void>;
    formatRate: (rate: number) => string;
}

export function useExchangeRate(autoRefresh: boolean = true): UseExchangeRateReturn {
    const [currentRate, setCurrentRate] = useState<number>(getCurrentExchangeRate());
    const [lastUpdate, setLastUpdate] = useState(getLastUpdateInfo());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshRate = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const success = await syncExchangeRateWithAPI();

            if (success) {
                setCurrentRate(getCurrentExchangeRate());
                setLastUpdate(getLastUpdateInfo());
                console.log('Tasa de cambio actualizada exitosamente');
            } else {
                setError('No se pudo actualizar la tasa de cambio');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error al actualizar la tasa: ${errorMessage}`);
            console.error('Error refreshing exchange rate:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const formatRate = useCallback((rate: number): string => {
        return formatExchangeRate(rate);
    }, []);

    // Inicializar al montar el componente
    useEffect(() => {
        setCurrentRate(getCurrentExchangeRate());
        setLastUpdate(getLastUpdateInfo());
    }, []);

    // Auto-refresh cada 30 minutos si está habilitado
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            refreshRate();
        }, 30 * 60 * 1000); // 30 minutos

        return () => clearInterval(interval);
    }, [autoRefresh, refreshRate]);

    return {
        currentRate,
        lastUpdate,
        isLoading,
        error,
        refreshRate,
        formatRate
    };
}

// Hook simplificado para solo obtener la tasa actual
export function useCurrentExchangeRate(): number {
    const [rate, setRate] = useState(getCurrentExchangeRate());

    useEffect(() => {
        setRate(getCurrentExchangeRate());
    }, []);

    return rate;
}

// Hook para convertir precios entre monedas
export function useCurrencyConverter() {
    const currentRate = useCurrentExchangeRate();

    const convertUSDToVES = useCallback((usdAmount: number): number => {
        return usdAmount * currentRate;
    }, [currentRate]);

    const convertVESToUSD = useCallback((vesAmount: number): number => {
        return vesAmount / currentRate;
    }, [currentRate]);

    return {
        currentRate,
        convertUSDToVES,
        convertVESToUSD
    };
}
