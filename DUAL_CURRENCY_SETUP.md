# Sistema de Monedas Duales (USD + VES)

Este documento explica cómo configurar y usar el nuevo sistema de precios en dólares estadounidenses (USD) y bolívares venezolanos (VES) en tu sistema de rifas.

## 🚀 Características Implementadas

### ✅ Precios Duales

- **USD**: Precios en dólares estadounidenses
- **VES**: Precios en bolívares venezolanos
- **Conversión automática** entre ambas monedas
- **Tasa de cambio en tiempo real** desde la API oficial de Venezuela

### ✅ Componentes Actualizados

- Formulario de creación/edición de rifas
- Tarjetas de rifas
- Selector de boletos
- Resúmenes de compra
- Administración de rifas

### ✅ Base de Datos

- Nuevos campos para precios en ambas monedas
- Campo de tasa de cambio
- Campo de moneda principal
- Scripts de migración incluidos

## 📋 Pasos de Configuración

### 1. Ejecutar Migración de Base de Datos

```bash
# Conectarse a tu base de datos MySQL
mysql -u tu_usuario -p tu_base_de_datos

# Ejecutar el script de migración
source scripts/migrate-currency-fields.sql
```

### 2. Verificar la Migración

```sql
-- Verificar que los nuevos campos se crearon correctamente
DESCRIBE raffles;

-- Verificar que los datos se migraron
SELECT
  id,
  title,
  price_per_ticket_usd,
  price_per_ticket_ves,
  exchange_rate,
  currency
FROM raffles
LIMIT 5;
```

### 3. Verificar Tasa de Cambio Automática

La tasa de cambio se actualiza automáticamente desde la API oficial de Venezuela:

```typescript
// La tasa se obtiene automáticamente de:
// https://ve.dolarapi.com/v1/dolares/oficial

// Tasa actual (2025-08-24): 1 USD = 141.8843 VES
// Se actualiza automáticamente cada 30 minutos
```

## 🔧 Configuración de Tasa de Cambio

### ✅ API Oficial de Venezuela (Automática)

- **Fuente**: [ve.dolarapi.com](https://ve.dolarapi.com/v1/dolares/oficial)
- **Actualización**: Automática cada 30 minutos
- **Tasa actual**: 1 USD = 141.8843 VES
- **Sin configuración**: Funciona automáticamente

### Opción Manual (Solo si la API falla)

- Edita `lib/exchange-rates.ts` en caso de emergencia
- Actualiza `CURRENT_EXCHANGE_RATE.USD_TO_VES`
- La tasa se sincroniza automáticamente cuando la API esté disponible

## 💰 Cómo Usar

### Crear una Nueva Rifa

1. Ve a **Admin > Rifas > Crear Nueva Rifa**
2. Completa el título y descripción
3. **Precio USD**: Ingresa el precio en dólares
4. **Precio VES**: Se calcula automáticamente
5. **Tasa de Cambio**: Se actualiza automáticamente
6. Completa el resto de la información

### Editar Rifa Existente

1. Haz clic en **Editar** en cualquier rifa
2. Modifica los precios en USD o VES
3. La conversión se hace automáticamente
4. Usa **Actualizar Tasa** para recalcular

### Ver Precios

- **Tarjetas de rifas**: Muestran precios en ambas monedas
- **Detalles de rifa**: Precios claramente separados
- **Resumen de compra**: Totales en ambas monedas

## 🎨 Personalización

### Colores de Monedas

```typescript
// En lib/currency.ts
export const CURRENCY_COLORS = {
  USD: "text-green-600",
  VES: "text-blue-600",
};
```

### Formato de Monedas

```typescript
// Personalizar el formato de VES
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  if (currency === "VES") {
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  // ... resto del código
}
```

## 🔍 Solución de Problemas

### Error: "price_per_ticket_usd column doesn't exist"

- Ejecuta el script de migración completo
- Verifica que estés en la base de datos correcta

### Precios no se convierten automáticamente

- Verifica que `lib/currency.ts` esté importado correctamente
- Revisa la consola del navegador para errores

### Tasa de cambio incorrecta

- Actualiza `lib/exchange-rates.ts`
- Usa el botón "Actualizar Tasa" en el formulario

## 📱 Componentes Disponibles

### DualPriceDisplay

```tsx
import DualPriceDisplay from "@/components/ui/dual-price-display";

<DualPriceDisplay
  priceUSD={25.0}
  priceVES={887.5}
  showTotal={true}
  totalTickets={5}
  size="lg"
/>;
```

### Funciones de Moneda

```tsx
import {
  formatCurrency,
  convertUSDToVES,
  convertVESToUSD,
} from "@/lib/currency";

// Formatear moneda
formatCurrency(25.0, "USD"); // "$25.00"
formatCurrency(887.5, "VES"); // "Bs. 887,50"

// Convertir monedas
convertUSDToVES(25.0); // 887.50
convertVESToUSD(887.5); // 25.00
```

## 🚀 Próximos Pasos

### Funcionalidades Futuras

- [ ] API de tasas de cambio en tiempo real
- [ ] Historial de tasas de cambio
- [ ] Notificaciones cuando cambie la tasa
- [ ] Calculadora de conversión para usuarios
- [ ] Soporte para más monedas

### Integración con APIs

- [ ] exchangerate-api.com
- [ ] fixer.io
- [ ] openexchangerates.org
- [ ] Banco Central de Venezuela (BCV)

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa este documento
2. Verifica la consola del navegador
3. Revisa los logs del servidor
4. Contacta al equipo de desarrollo

---

**Nota**: Este sistema está diseñado para ser flexible y fácil de mantener. La tasa de cambio se puede actualizar manualmente o conectarse a una API externa según tus necesidades.
