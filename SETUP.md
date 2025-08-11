# Configuración del Sistema de Autenticación

Este documento te guiará a través de la configuración completa del sistema de autenticación y autorización administrativa.

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```bash
# NextAuth.js Configuration
NEXTAUTH_SECRET=tu-clave-secreta-super-segura-cambia-esto-en-produccion
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_base_datos"
```

**Importante:**

- Cambia `tu-clave-secreta-super-segura-cambia-esto-en-produccion` por una clave secreta real
- Actualiza la `DATABASE_URL` con tus credenciales de base de datos
- Para generar una clave secreta segura, puedes usar: `openssl rand -base64 32`

### 2. Base de Datos

Asegúrate de que tu base de datos esté configurada y ejecuta las migraciones:

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Ver la base de datos
npx prisma studio
```

### 3. Crear Usuario Administrador

Ejecuta el comando para crear un usuario administrador:

```bash
npm run create-admin
```

Esto creará un usuario con las siguientes credenciales:

- **Email**: admin@ganaxdar.com
- **Contraseña**: admin123
- **Rol**: admin

## 🚀 Iniciar el Sistema

### 1. Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### 2. Iniciar el Servidor de Desarrollo

```bash
npm run dev
# o
pnpm dev
```

### 3. Acceder al Sistema

1. Ve a `http://localhost:3000`
2. Haz clic en "Iniciar Sesión" o ve a `http://localhost:3000/login`
3. Usa las credenciales del administrador:
   - Email: `admin@ganaxdar.com`
   - Contraseña: `admin123`
4. Navega a `http://localhost:3000/admin` para acceder al panel administrativo

## 🔐 Seguridad

### Características Implementadas

- ✅ **Autenticación**: NextAuth.js con credenciales
- ✅ **Autorización**: Verificación de roles (admin/user)
- ✅ **Protección de Rutas**: Middleware para rutas administrativas
- ✅ **Sesiones Seguras**: JWT con información de roles
- ✅ **Contraseñas Hasheadas**: bcrypt para encriptación
- ✅ **Tipado Seguro**: TypeScript completo

### Rutas Protegidas

- `/admin/*` - Solo usuarios con rol "admin"
- `/api/admin/*` - APIs administrativas protegidas
- Middleware automático para verificación

## 🛠️ Solución de Problemas

### Error: "NO_SECRET"

```
[next-auth][error][NO_SECRET]
```

**Solución:**

1. Asegúrate de que el archivo `.env.local` existe
2. Verifica que `NEXTAUTH_SECRET` esté definido
3. Reinicia el servidor de desarrollo

### Error: "NEXTAUTH_URL"

```
[next-auth][warn][NEXTAUTH_URL]
```

**Solución:**

1. Agrega `NEXTAUTH_URL=http://localhost:3000` a tu `.env.local`
2. Para producción, usa tu dominio real

### Error: "Configuration"

```
GET /api/auth/error?error=Configuration 500
```

**Solución:**

1. Verifica que todas las variables de entorno estén configuradas
2. Asegúrate de que la base de datos esté funcionando
3. Revisa los logs del servidor para más detalles

### No se puede acceder a /admin

**Solución:**

1. Verifica que estés autenticado
2. Confirma que tu usuario tenga rol "admin"
3. Revisa la consola del navegador para errores
4. Verifica que el middleware esté funcionando

## 📁 Estructura de Archivos

```
├── .env.local              # Variables de entorno (crear)
├── middleware.ts           # Protección de rutas
├── lib/
│   ├── auth.ts            # Configuración de NextAuth
│   └── admin-utils.ts     # Utilidades administrativas
├── components/admin/
│   ├── AdminProtected.tsx # Componente de protección
│   ├── AdminSidebar.tsx   # Barra lateral administrativa
│   └── UserStatus.tsx     # Estado del usuario
├── app/admin/             # Rutas administrativas
└── scripts/
    └── create-admin.ts    # Script para crear admin
```

## 🔄 Comandos Útiles

```bash
# Crear usuario administrador
npm run create-admin

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Ver base de datos
npx prisma studio

# Limpiar caché de Next.js
rm -rf .next && npm run dev
```

## 🎯 Próximos Pasos

1. **Personalizar Credenciales**: Cambia las credenciales por defecto del administrador
2. **Configurar Base de Datos**: Ajusta la configuración de tu base de datos
3. **Configurar Dominio**: Actualiza `NEXTAUTH_URL` para producción
4. **Generar Clave Secreta**: Usa una clave secreta segura en producción
5. **Configurar HTTPS**: Para producción, asegúrate de usar HTTPS

## 📞 Soporte

Si encuentras problemas:

1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs del servidor y del navegador
3. Asegúrate de que la base de datos esté funcionando
4. Verifica que las migraciones se hayan ejecutado correctamente

¡El sistema está listo para usar! 🎉
