-- Script de migración para agregar campos de moneda dual (USD y VES)
-- Ejecutar este script en tu base de datos MySQL

-- 1. Agregar nuevos campos de moneda
ALTER TABLE raffles
ADD COLUMN price_per_ticket_usd DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER gallery_images,
ADD COLUMN price_per_ticket_ves DECIMAL(15, 2) NOT NULL DEFAULT 0.00 AFTER price_per_ticket_usd,
ADD COLUMN exchange_rate DECIMAL(15, 6) NOT NULL DEFAULT 141.8843 AFTER price_per_ticket_ves,
ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD' AFTER exchange_rate;

-- 2. Migrar datos existentes (asumiendo que price_per_ticket era en USD)
-- Usando la tasa oficial actual de Venezuela: 1 USD = 141.8843 VES
UPDATE raffles
SET
    price_per_ticket_usd = price_per_ticket,
    price_per_ticket_ves = price_per_ticket * 141.8843,
    exchange_rate = 141.8843,
    currency = 'USD'
WHERE
    price_per_ticket_usd = 0.00;

-- 3. Hacer los nuevos campos obligatorios después de la migración
ALTER TABLE raffles
MODIFY COLUMN price_per_ticket_usd DECIMAL(10, 2) NOT NULL,
MODIFY COLUMN price_per_ticket_ves DECIMAL(15, 2) NOT NULL;

-- 4. Agregar índices para mejorar el rendimiento
CREATE INDEX idx_raffles_currency ON raffles (currency);

CREATE INDEX idx_raffles_price_usd ON raffles (price_per_ticket_usd);

CREATE INDEX idx_raffles_price_ves ON raffles (price_per_ticket_ves);

-- 5. Verificar la migración
SELECT
    id,
    title,
    price_per_ticket_usd as 'Precio USD',
    price_per_ticket_ves as 'Precio VES',
    exchange_rate as 'Tasa de Cambio',
    currency as 'Moneda'
FROM raffles
LIMIT 10;

-- Nota: Después de verificar que todo esté correcto, puedes eliminar el campo antiguo:
-- ALTER TABLE raffles DROP COLUMN price_per_ticket;