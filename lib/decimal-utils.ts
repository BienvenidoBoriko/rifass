// Utilidades para manejo de decimales en precios y tasas de cambio

/**
 * Redondea un número a un número específico de decimales
 * @param value - El número a redondear
 * @param decimals - El número de decimales (por defecto 2)
 * @returns El número redondeado
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Redondea un precio a 2 decimales (para USD y VES)
 * @param price - El precio a redondear
 * @returns El precio redondeado a 2 decimales
 */
export function roundPrice(price: number): number {
    return roundToDecimals(price, 2);
}

/**
 * Redondea una tasa de cambio a 6 decimales (para mayor precisión)
 * @param rate - La tasa de cambio a redondear
 * @returns La tasa redondeada a 6 decimales
 */
export function roundExchangeRate(rate: number): number {
    return roundToDecimals(rate, 6);
}

/**
 * Valida que un precio tenga máximo 2 decimales
 * @param price - El precio a validar
 * @returns true si el precio es válido
 */
export function isValidPrice(price: number): boolean {
    const decimalPlaces = (price.toString().split('.')[1] || '').length;
    return decimalPlaces <= 2;
}

/**
 * Formatea un precio para mostrar exactamente 2 decimales
 * @param price - El precio a formatear
 * @returns El precio formateado como string
 */
export function formatPrice(price: number): string {
    return roundPrice(price).toFixed(2);
}

/**
 * Convierte un string a número y lo redondea a 2 decimales
 * @param value - El string a convertir
 * @returns El número redondeado o 0 si es inválido
 */
export function parseAndRoundPrice(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : roundPrice(parsed);
}

/**
 * Valida que un input de precio sea válido
 * @param value - El valor del input
 * @returns true si el valor es válido
 */
export function validatePriceInput(value: string): boolean {
    const regex = /^\d*\.?\d{0,2}$/;
    return regex.test(value);
}

/**
 * Limpia un input de precio para solo permitir números y máximo 2 decimales
 * @param value - El valor del input
 * @returns El valor limpio
 */
export function cleanPriceInput(value: string): string {
    // Remover caracteres no válidos excepto números y punto
    let cleaned = value.replace(/[^\d.]/g, '');

    // Solo permitir un punto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limitar decimales a 2
    if (parts.length === 2 && parts[1].length > 2) {
        cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }

    return cleaned;
}
