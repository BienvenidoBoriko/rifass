# Configuración de Acceso Administrativo

Este documento explica cómo configurar el acceso administrativo para el sistema de rifas.

## Requisitos Previos

1. Asegúrate de que la base de datos esté configurada y las migraciones ejecutadas
2. El servidor de desarrollo debe estar ejecutándose

## Configuración del Usuario Administrador

### 1. Crear Usuario Administrador

Ejecuta el siguiente comando para crear un usuario administrador:

```bash
npm run create-admin
```

Esto creará un usuario con las siguientes credenciales:

- **Email**: admin@ganaxdar.com
- **Contraseña**: admin123
- **Rol**: admin

### 2. Personalizar Credenciales (Opcional)

Si deseas cambiar las credenciales por defecto, edita el archivo `scripts/create-admin.ts` y modifica:

```typescript
const adminEmail = "tu-email@ejemplo.com";
const adminPassword = "tu-contraseña-segura";
```

Luego ejecuta nuevamente:

```bash
npm run create-admin
```

## Acceso al Panel Administrativo

1. Inicia sesión con las credenciales del administrador en `/login`
2. Navega a `/admin` para acceder al panel administrativo
3. Solo usuarios con rol "admin" pueden acceder a las rutas `/admin/*`

## Funcionalidades del Panel Administrativo

- **Dashboard**: Resumen general de la plataforma
- **Rifas**: Gestión de todas las rifas
- **Pagos**: Confirmación de pagos pendientes
- **Usuarios**: Gestión de usuarios registrados
- **Reportes**: Análisis y métricas
- **Configuración**: Configuración del sistema

## Seguridad

- Todas las rutas administrativas están protegidas por middleware
- Se verifica la autenticación y el rol de administrador en cada solicitud
- Las sesiones se manejan de forma segura con NextAuth.js
- Las contraseñas se almacenan hasheadas con bcrypt

## Solución de Problemas

### Error: "Acceso denegado"

- Verifica que el usuario tenga el rol "admin" en la base de datos
- Asegúrate de estar autenticado correctamente

### Error: "No autorizado"

- Verifica que la sesión esté activa
- Intenta cerrar sesión y volver a iniciar sesión

### No se puede acceder a /admin

- Verifica que el middleware esté funcionando correctamente
- Revisa los logs del servidor para errores

## Comandos Útiles

```bash
# Crear usuario administrador
npm run create-admin

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Generar cliente de Prisma
npx prisma generate

# Ver datos en la base de datos
npx prisma studio
```
