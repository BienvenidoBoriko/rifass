# AutoRifa Pro - Sistema de Rifas

Un sistema completo de rifas de vehículos construido con Next.js, Prisma, y NextAuth.

## 🚀 Características

- **Sistema de Autenticación**: Registro e inicio de sesión con NextAuth
- **Gestión de Rifas**: Crear y administrar rifas de vehículos
- **Compra de Boletos**: Sistema de selección y compra de boletos
- **Panel de Administración**: Interfaz para administradores
- **Sistema de Pagos**: Múltiples métodos de pago
- **Diseño Responsivo**: Interfaz moderna y adaptativa

## 📋 Prerrequisitos

- Node.js 18+
- MySQL 8.0+
- pnpm (recomendado) o npm

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd auth-system
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env` en la raíz del proyecto:

   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/auth_system"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"

   # Email (opcional)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

4. **Configurar la base de datos**

   ```bash
   # Generar el cliente de Prisma
   pnpm prisma generate

   # Ejecutar las migraciones
   pnpm prisma migrate dev

   # Poblar la base de datos con datos de ejemplo
   pnpm prisma db seed
   ```

5. **Ejecutar el proyecto**
   ```bash
   pnpm dev
   ```

El proyecto estará disponible en `http://localhost:3000`

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **users**: Usuarios del sistema
- **raffles**: Rifas disponibles
- **tickets**: Boletos comprados
- **winners**: Ganadores de las rifas

### Usuarios de Prueba

- **Admin**: `admin@test.com` / `password`
- **Usuario**: `test@example.com` / `password`

## 🔧 Configuración de Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción
pnpm build

# Producción
pnpm start

# Linting
pnpm lint

# Base de datos
pnpm prisma studio
pnpm prisma migrate dev
pnpm prisma db seed
```

### Estructura del Proyecto

```
auth-system/
├── app/                    # App Router de Next.js
│   ├── (front)/           # Páginas públicas
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout principal
├── components/             # Componentes reutilizables
├── hooks/                  # Custom hooks
├── lib/                    # Utilidades y configuración
├── prisma/                 # Esquema y migraciones
└── types/                  # Definiciones de tipos
```

## 🚨 Errores Comunes y Soluciones

### 1. Error de Conexión a la Base de Datos

- Verifica que MySQL esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos `auth_system` exista

### 2. Error de NextAuth

- Verifica que `NEXTAUTH_SECRET` esté configurado
- Asegúrate de que `NEXTAUTH_URL` apunte a la URL correcta

### 3. Error de Prisma

- Ejecuta `pnpm prisma generate` después de cambios en el esquema
- Verifica que las migraciones estén actualizadas

### 4. Error de TypeScript

- Ejecuta `pnpm build` para ver errores de compilación
- Verifica que todos los tipos estén correctamente definidos

## 📱 Características del Sistema

### Para Usuarios

- Registro e inicio de sesión
- Ver rifas activas
- Comprar boletos
- Ver historial de compras
- Ver ganadores

### Para Administradores

- Gestión de rifas
- Confirmación de pagos
- Gestión de usuarios
- Reportes y estadísticas
- Configuración del sistema

## 🔒 Seguridad

- Autenticación con NextAuth
- Contraseñas hasheadas con bcrypt
- Validación de datos con Zod
- Protección CSRF
- Headers de seguridad

## 🎨 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Base de Datos**: MySQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Validación**: Zod
- **Estado**: React Hooks

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

- Revisa los issues existentes
- Crea un nuevo issue con detalles del problema
- Contacta al equipo de desarrollo
