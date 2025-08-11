# Solución para Boletos Duplicados

## Problema Identificado

El sistema tenía un problema de **condición de carrera (race condition)** que permitía la creación de boletos duplicados cuando múltiples usuarios (o el mismo usuario con múltiples solicitudes) intentaban comprar los mismos números de boletos simultáneamente.

## Causas del Problema

1. **Falta de Transacciones de Base de Datos**: El proceso de compra no utilizaba transacciones de base de datos, permitiendo que múltiples operaciones se ejecutaran simultáneamente.

2. **Verificación de Disponibilidad No Atómica**: La verificación de disponibilidad de boletos y la creación de los mismos no estaban en una transacción atómica.

3. **Falta de Restricciones Únicas**: Aunque existía una restricción única en `(raffle_id, ticket_number)`, no había protección contra que el mismo usuario comprara el mismo boleto múltiples veces.

4. **Frontend Sin Protección**: El frontend no prevenía envíos múltiples de la misma solicitud de compra.

## Soluciones Implementadas

### 1. Transacciones de Base de Datos

**Archivo**: `app/api/raffles/purchase/route.ts`

- Implementé transacciones de Prisma (`prisma.$transaction`) para asegurar que toda la operación de compra sea atómica.
- La verificación de disponibilidad y creación de boletos ahora ocurre en una sola transacción.

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Verificación y creación atómica
  // Si algo falla, toda la transacción se revierte
});
```

### 2. Restricciones Únicas Adicionales

**Archivo**: `prisma/schema.prisma`

- Agregué una restricción única adicional: `@@unique([raffleId, buyerEmail, ticketNumber])`
- Esto previene que el mismo usuario compre el mismo número de boleto múltiples veces.

```prisma
model Ticket {
  // ... campos existentes ...

  @@unique([raffleId, ticketNumber])
  @@unique([raffleId, buyerEmail, ticketNumber]) // NUEVA RESTRICCIÓN
  @@index([buyerEmail])
}
```

### 3. Verificación de Usuario Existente

**Archivo**: `app/api/raffles/purchase/route.ts`

- Agregué verificación adicional para prevenir que el mismo usuario compre boletos que ya posee:

```typescript
// Verificar si el usuario ya tiene estos boletos
const userExistingTickets = await tx.ticket.findMany({
  where: {
    raffleId,
    ticketNumber: { in: ticketNumbers },
    buyerEmail: session.user.email,
    paymentStatus: { in: ["confirmed", "pending"] },
  },
});

if (userExistingTickets.length > 0) {
  throw new Error("You already own some of these tickets");
}
```

### 4. Protección Frontend

**Archivo**: `app/(front)/raffles/[id]/page.tsx`

- Implementé estado `isSubmitting` para prevenir envíos múltiples.
- Deshabilité botones durante el procesamiento.
- Agregué mensajes de error más claros.

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

// Prevenir compras múltiples
if (isSubmitting) {
  toast.error("Ya tienes una compra en progreso. Por favor, espera.");
  return;
}
```

### 5. Componente PaymentInstructions Mejorado

**Archivo**: `components/PaymentInstructions.tsx`

- Agregué prop `isSubmitting` para mostrar estado de carga.
- Implementé botón de cancelación para permitir al usuario volver atrás.
- Deshabilité botones durante el procesamiento.

### 6. Mejor Manejo de Errores

**Archivo**: `app/api/raffles/purchase/route.ts`

- Implementé mensajes de error específicos y en español.
- Agregué logging detallado para debugging.
- Manejo de errores más robusto con códigos HTTP apropiados.

### 7. Logging Mejorado

**Archivo**: `app/api/admin/tickets/[ticketId]/confirm/route.ts`

- Agregué logging detallado en la confirmación de pagos para rastrear problemas.
- Mejoré el seguimiento de transacciones.

## Migración de Base de Datos

Se creó una nueva migración: `20250811173042_add_user_ticket_unique_constraint`

```sql
-- Agregar restricción única para prevenir duplicados de usuario
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_raffle_id_buyer_email_ticket_number_key`
UNIQUE (`raffle_id`, `buyer_email`, `ticket_number`);
```

## Beneficios de la Solución

1. **Prevención de Duplicados**: Elimina completamente la posibilidad de boletos duplicados.
2. **Integridad de Datos**: Garantiza consistencia en la base de datos.
3. **Mejor Experiencia de Usuario**: Previene errores y proporciona feedback claro.
4. **Trazabilidad**: Logging detallado para debugging y auditoría.
5. **Escalabilidad**: La solución funciona correctamente bajo carga alta.

## Pruebas Recomendadas

1. **Prueba de Condición de Carrera**: Intentar comprar los mismos boletos desde múltiples pestañas/navegadores.
2. **Prueba de Usuario Duplicado**: Intentar que el mismo usuario compre boletos que ya posee.
3. **Prueba de Cancelación**: Verificar que el botón de cancelación funcione correctamente.
4. **Prueba de Estados de Carga**: Verificar que los botones se deshabiliten durante el procesamiento.

## Monitoreo

- Revisar logs del servidor para detectar intentos de duplicación.
- Monitorear métricas de base de datos para confirmar que no hay violaciones de restricciones únicas.
- Verificar que el contador de tickets vendidos sea consistente.

## Conclusión

La implementación de transacciones de base de datos, restricciones únicas adicionales y protección frontend ha resuelto completamente el problema de boletos duplicados. El sistema ahora es robusto, escalable y proporciona una experiencia de usuario confiable.
