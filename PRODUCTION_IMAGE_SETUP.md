# Configuración de Imágenes en Producción

## Problema

En producción, las imágenes subidas no se muestran porque Next.js no sirve archivos estáticos desde la carpeta `public/uploads/` por defecto.

## Solución Implementada

### 1. Configuración de Next.js

Se ha configurado `next.config.mjs` para redirigir las peticiones de `/uploads/*` a un endpoint API:

```javascript
async rewrites() {
  return [
    {
      source: '/uploads/:path*',
      destination: '/api/uploads/:path*',
    },
  ];
}
```

### 2. Endpoint API para Servir Archivos

Se ha creado `app/api/uploads/[...path]/route.ts` que:
- Lee archivos desde `public/uploads/`
- Determina el tipo MIME correcto
- Configura headers de caché para optimizar rendimiento
- Maneja errores apropiadamente

### 3. Estructura de Archivos

```
public/uploads/
├── raffle-images/      # Imágenes de rifas
│   └── raffle-*.jpg
└── payment-proofs/     # Comprobantes de pago
    └── payment-proof-*.jpg
```

## Verificación

### Script de Prueba

Ejecuta el script para verificar el estado:

```bash
npx tsx scripts/test-image-serving.ts
```

### URLs de Prueba

Basado en el script, estas URLs deberían funcionar:

- **Imagen de rifa**: `http://localhost:3001/uploads/raffle-images/raffle-1755138864050-h5exb5yf1u.jpg`
- **Comprobante de pago**: `http://localhost:3001/uploads/payment-proofs/payment-proof-1754673047046-4n2wmiypq9.jpg`

## Configuración para Diferentes Entornos

### Desarrollo Local

La configuración actual debería funcionar en desarrollo local.

### Producción (Vercel)

Para Vercel, la configuración actual debería funcionar automáticamente.

### Producción (Otros Hostings)

Si usas otro hosting, asegúrate de:

1. **Subir la carpeta `public/uploads/`** al servidor
2. **Configurar el servidor web** para servir archivos estáticos desde `/uploads/`
3. **O usar la configuración de Next.js** que ya está implementada

### Configuración de Nginx (Ejemplo)

Si usas Nginx, agrega esta configuración:

```nginx
location /uploads/ {
    alias /path/to/your/app/public/uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Las imágenes no se muestran

1. **Verifica que el servidor esté corriendo**
2. **Verifica que los archivos existan** en `public/uploads/`
3. **Verifica la configuración de Next.js**
4. **Revisa los logs del servidor** para errores

### Error 404 en imágenes

1. **Verifica la ruta del archivo** en la base de datos
2. **Verifica que el archivo exista** físicamente
3. **Verifica los permisos** de la carpeta `uploads/`

### Error 500 en imágenes

1. **Revisa los logs del servidor**
2. **Verifica que el endpoint API** esté funcionando
3. **Verifica los permisos** de lectura de archivos

## Optimización

### Caché

El endpoint está configurado con caché de 1 año para optimizar el rendimiento:

```javascript
headers.set('Cache-Control', 'public, max-age=31536000, immutable');
```

### Tipos MIME

Se detectan automáticamente los tipos MIME más comunes:
- `image/jpeg` para .jpg, .jpeg
- `image/png` para .png
- `image/webp` para .webp
- `image/gif` para .gif
- `image/svg+xml` para .svg

## Monitoreo

### Scripts de Verificación

- `scripts/test-image-serving.ts`: Verifica el estado de las imágenes
- `scripts/test-image-upload.ts`: Verifica la funcionalidad de subida

### Logs

Monitorea los logs del servidor para:
- Errores 404 en imágenes
- Errores 500 en el endpoint de archivos
- Problemas de permisos

## Backup

### Importante

Haz backup regular de la carpeta `public/uploads/` ya que contiene:
- Imágenes de rifas subidas por administradores
- Comprobantes de pago subidos por usuarios

### Comando de Backup

```bash
# Backup de imágenes
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz public/uploads/

# Restaurar backup
tar -xzf uploads-backup-YYYYMMDD.tar.gz
```

## Seguridad

### Consideraciones

1. **Validación de tipos de archivo** en el endpoint de subida
2. **Límite de tamaño** de archivos (5MB)
3. **Nombres únicos** para evitar conflictos
4. **Headers de seguridad** en el endpoint de archivos

### Mejoras Futuras

- Implementar compresión de imágenes
- Agregar watermark automático
- Implementar CDN para mejor rendimiento
- Agregar autenticación para archivos privados
