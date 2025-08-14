# Sistema de Notificaciones por Email

## Descripción General

El sistema de notificaciones por email se activa automáticamente cuando se asigna un ganador a una rifa. Envía notificaciones a todos los participantes y administradores sobre el resultado del sorteo.

## Tipos de Notificaciones

### 1. Notificación al Ganador

- **Cuándo se envía**: Automáticamente cuando se asigna un ganador
- **Contenido**:
  - Felicitaciones por ganar
  - Detalles de la rifa y el premio
  - Número del boleto ganador
  - Información sobre próximos pasos

### 2. Notificación a No Ganadores

- **Cuándo se envía**: Automáticamente cuando se asigna un ganador
- **Contenido**:
  - Información sobre el resultado del sorteo
  - Sus números de boletos
  - Datos del ganador y boleto ganador
  - Mensaje motivacional para futuras participaciones

### 3. Notificación a Administradores

- **Cuándo se envía**: Automáticamente cuando se asigna un ganador
- **Contenido**:
  - Resumen completo del sorteo
  - Información del ganador
  - Estadísticas (total de participantes, boletos vendidos)
  - Confirmación de envío de notificaciones

## Configuración

### Variables de Entorno Requeridas

```env
# Configuración del servidor de email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=tu-email@gmail.com
EMAIL_SERVER_PASSWORD=tu-contraseña-de-aplicación

# Email remitente
EMAIL_FROM=noreply@ganaxdar.com

# Emails de administradores (separados por comas)
ADMIN_EMAILS=admin1@ganaxdar.com,admin2@ganaxdar.com

# URL de la aplicación
NEXTAUTH_URL=https://ganaxdar.com
```

### Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. Activa la verificación en dos pasos en tu cuenta de Google
2. Genera una contraseña de aplicación específica para esta aplicación
3. Usa esa contraseña en `EMAIL_SERVER_PASSWORD`

## Flujo de Notificaciones

### Proceso Automático

1. **Asignación de Ganador**: Cuando un administrador asigna un ganador desde el panel
2. **Obtención de Participantes**: El sistema obtiene todos los tickets confirmados de la rifa
3. **Agrupación por Email**: Se agrupan los tickets por email para evitar duplicados
4. **Envío de Notificaciones**:
   - Email al ganador
   - Emails a todos los no ganadores
   - Email a los administradores
5. **Registro**: Se registra el resultado en los logs

### Proceso Manual

Si las notificaciones automáticas fallan, se puede reenviar manualmente:

1. Ir al panel de administración → Rifas
2. Buscar la rifa con estado "Sorteada"
3. Hacer clic en el menú de opciones (⋮)
4. Seleccionar "Reenviar Notificaciones"

## API Endpoints

### Asignar Ganador (Automático)

```
POST /api/admin/winners
```

### Reenviar Notificaciones (Manual)

```
POST /api/admin/raffles/{raffleId}/notify-winner
```

## Pruebas

### Script de Prueba

Ejecuta el script de prueba para verificar el funcionamiento:

```bash
npx tsx scripts/test-notifications.ts
```

Este script:

1. Verifica la conexión del servidor de email
2. Busca una rifa con ganador asignado
3. Prueba el envío de cada tipo de notificación
4. Muestra un resumen de los resultados

### Pruebas Manuales

1. **Configurar Email**: Asegúrate de que las variables de entorno estén configuradas
2. **Asignar Ganador**: Usa el panel de administración para asignar un ganador
3. **Verificar Logs**: Revisa los logs del servidor para confirmar el envío
4. **Verificar Bandeja**: Revisa las bandejas de entrada de los emails de prueba

## Manejo de Errores

### Errores Comunes

1. **Credenciales de Email Incorrectas**

   - Verificar `EMAIL_SERVER_USER` y `EMAIL_SERVER_PASSWORD`
   - Asegurar que la contraseña de aplicación sea correcta

2. **Servidor SMTP No Disponible**

   - Verificar `EMAIL_SERVER_HOST` y `EMAIL_SERVER_PORT`
   - Comprobar conectividad de red

3. **Emails Inválidos**
   - El sistema valida automáticamente los emails
   - Los emails inválidos se registran en los logs

### Recuperación

- Las notificaciones fallidas no impiden la asignación del ganador
- Se puede reenviar manualmente desde el panel de administración
- Los errores se registran en los logs del servidor

## Personalización

### Plantillas de Email

Las plantillas están en `lib/email.ts` y se pueden personalizar:

- **Estilo**: CSS inline para compatibilidad
- **Contenido**: Texto y estructura HTML
- **Imágenes**: Logos y elementos visuales

### Variables Disponibles

- `winnerName`: Nombre del ganador
- `winnerEmail`: Email del ganador
- `raffleTitle`: Título de la rifa
- `ticketNumber`: Número del boleto ganador
- `prize`: Descripción del premio
- `buyerName`: Nombre del comprador
- `ticketNumbers`: Array de números de boletos

## Monitoreo

### Logs Importantes

```javascript
// Conexión exitosa
console.log("Email server connection verified successfully");

// Envío exitoso
console.log("Email sent successfully:", info.messageId);

// Error de envío
console.error("Error sending email to", to, ":", error);

// Resumen de notificaciones
console.log(
  `Notifications sent for raffle ${raffleId}: ${participants.size} participants notified`
);
```

### Métricas

- Número total de participantes notificados
- Número de emails enviados exitosamente
- Número de emails fallidos
- Tiempo de envío promedio

## Seguridad

### Consideraciones

1. **Credenciales**: Las credenciales de email se almacenan en variables de entorno
2. **Validación**: Todos los emails se validan antes del envío
3. **Rate Limiting**: Considerar implementar rate limiting para evitar spam
4. **Logs**: Los logs no contienen información sensible

### Mejores Prácticas

- Usar contraseñas de aplicación específicas
- Rotar credenciales regularmente
- Monitorear logs de envío
- Implementar notificaciones de fallo para administradores
