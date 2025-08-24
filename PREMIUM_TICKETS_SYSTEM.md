# Sistema de Tickets Premiados - Ganaxdar

## Descripción General

El sistema de tickets premiados permite a los administradores definir hasta 10 números de tickets que serán automáticamente seleccionados como ganadores cuando una rifa se marque como sorteada. Esto proporciona transparencia y control total sobre el proceso de selección de ganadores.

## Características Principales

### 1. Selección de Tickets Premiados al Crear Rifa

- **Máximo 10 tickets**: Se pueden seleccionar hasta 10 números de tickets premiados
- **Validación automática**: Los números deben estar entre 0 y (totalTickets - 1)
- **Sin duplicados**: No se permiten números de tickets repetidos
- **Ordenamiento**: Los números se ordenan automáticamente de menor a mayor

### 2. Gestión Automática de Ganadores

- **Asignación automática**: Cuando una rifa se marca como "sorteada", los ganadores se asignan automáticamente
- **Base de datos**: Se crean registros en la tabla `winners` para cada ticket premiado
- **Estado de la rifa**: Se actualiza automáticamente a "drawn" con el primer ganador como ganador principal

### 3. Sistema de Notificaciones por Email

- **Ganadores**: Reciben email de felicitación con detalles del premio
- **No ganadores**: Reciben email informando el resultado del sorteo
- **Administradores**: Reciben notificación completa con resumen de ganadores y estadísticas

## Flujo de Trabajo

### Opción 1: Rifa con Ganadores Predefinidos

1. **Crear Rifa**: Administrador activa "Definir Tickets Premiados" y selecciona hasta 10 números
2. **Venta de Boletos**: Los usuarios compran boletos normalmente
3. **Finalizar Rifa**: Administrador cambia estado a "sorteada"
4. **Proceso Automático**:
   - Se asignan automáticamente los ganadores predefinidos
   - Se envían notificaciones por email a todos los participantes
   - Se notifica a los administradores

### Opción 2: Rifa sin Ganadores Predefinidos

1. **Crear Rifa**: Administrador no activa la opción de tickets premiados
2. **Venta de Boletos**: Los usuarios compran boletos normalmente
3. **Finalizar Rifa**: Administrador cambia estado a "sorteada"
4. **Asignación Manual**: Administrador usa la función "Elegir Ganador" para asignar ganadores manualmente
5. **Notificaciones**: Se envían manualmente usando la función de notificación

## Campos de Base de Datos

### Tabla `raffles`

- `hasPredefinedWinners`: Boolean - Indica si la rifa tiene ganadores predefinidos
- `predefinedWinners`: JSON - Array de números de tickets premiados

### Tabla `winners`

- Se crean automáticamente registros para cada ticket premiado
- Incluye información del comprador del ticket

## Interfaz de Usuario

### Formulario de Creación de Rifa

- Checkbox para activar/desactivar tickets premiados
- Selector de números de tickets con validación
- Vista previa de tickets seleccionados
- Información y ayuda contextual

### Panel de Asignación de Ganadores

- **Con ganadores predefinidos**: Muestra información y deshabilita funcionalidad manual
- **Sin ganadores predefinidos**: Funcionalidad completa de asignación manual

## Validaciones

### Al Crear Rifa

- Si se activan tickets premiados, debe haber al menos 1
- Máximo 10 tickets premiados
- Los números deben estar en el rango válido (0 a totalTickets-1)
- No se permiten duplicados

### Al Finalizar Rifa

- Verificación de que los tickets premiados existen y están confirmados
- Creación automática de registros de ganadores
- Manejo de errores y notificaciones

## Ventajas del Sistema

1. **Transparencia**: Los ganadores están definidos desde el inicio
2. **Automatización**: Reduce el trabajo manual de los administradores
3. **Flexibilidad**: Permite tanto ganadores predefinidos como asignación manual
4. **Auditoría**: Registro completo de todos los ganadores y fechas
5. **Notificaciones**: Comunicación automática con todos los participantes

## Casos de Uso

### Rifa con Ganadores Predefinidos

- **Eventos especiales**: Rifas con números específicos premiados
- **Promociones**: Números de tickets con significado especial
- **Transparencia total**: Ganadores conocidos desde el inicio

### Rifa sin Ganadores Predefinidos

- **Sorteos tradicionales**: Ganadores seleccionados al final
- **Flexibilidad**: Permite ajustes según circunstancias
- **Control manual**: Administradores mantienen control total

## Configuración de Email

El sistema utiliza el servicio de email configurado en `lib/email.ts` para enviar:

- Notificaciones a ganadores
- Notificaciones a no ganadores
- Reportes administrativos
- Confirmaciones de sorteo completado

## Mantenimiento

### Monitoreo

- Revisar logs de email para verificar envío exitoso
- Verificar creación correcta de registros de ganadores
- Monitorear estado de las rifas y transiciones

### Resolución de Problemas

- Si fallan las notificaciones por email, verificar configuración SMTP
- Si no se crean ganadores, verificar que los tickets existan y estén confirmados
- Si hay errores de validación, revisar números de tickets y rangos válidos

## Seguridad

- Solo administradores pueden crear rifas con ganadores predefinidos
- Validación estricta de números de tickets
- Verificación de permisos en todas las operaciones
- Logs de auditoría para cambios de estado

## Futuras Mejoras

1. **Sorteo en vivo**: Integración con sistema de sorteo en tiempo real
2. **Múltiples premios**: Diferentes niveles de premios por posición
3. **Estadísticas avanzadas**: Análisis de patrones de ganadores
4. **Integración con redes sociales**: Compartir resultados automáticamente
5. **Sistema de reclamación**: Seguimiento de premios reclamados
