# Migración de Imágenes de Base64 a Archivos

## Descripción

Este documento explica el proceso de migración de imágenes de rifas desde base64 (almacenadas en la base de datos) a archivos físicos en el servidor.

## Cambios Realizados

### 1. Nuevo Endpoint de Subida de Imágenes
- **Archivo**: `app/api/upload/raffle-images/route.ts`
- **Función**: Maneja la subida de imágenes de rifas como archivos
- **Ubicación**: `/public/uploads/raffle-images/`

### 2. Endpoint de Migración
- **Archivo**: `app/api/admin/migrate-images/route.ts`
- **Función**: Migra imágenes base64 existentes a archivos
- **Acceso**: Solo administradores

### 3. Componente RaffleForm Actualizado
- **Archivo**: `components/admin/RaffleForm.tsx`
- **Cambios**:
  - Subida de archivos en lugar de base64
  - Indicador de carga durante la subida
  - Validación de tipos de archivo y tamaño

### 4. Página de Admin Actualizada
- **Archivo**: `app/admin/raffles/page.tsx`
- **Nuevo**: Botón "Migrar Imágenes" para ejecutar la migración

## Proceso de Migración

### Paso 1: Migrar Imágenes Existentes
1. Ve a la página de administración de rifas
2. Haz clic en el botón "Migrar Imágenes"
3. Espera a que se complete la migración
4. Verifica que las imágenes se muestren correctamente

### Paso 2: Limpiar Base de Datos (Opcional)
```bash
# Ejecutar el script de limpieza
npx tsx scripts/clean-base64-images.ts
```

### Paso 3: Verificar la Migración
- Las nuevas rifas usarán el sistema de archivos
- Las imágenes existentes deberían seguir funcionando
- El tamaño de la base de datos debería reducirse significativamente

## Estructura de Archivos

```
public/
└── uploads/
    ├── payment-proofs/     # Comprobantes de pago
    └── raffle-images/      # Imágenes de rifas (nuevo)
```

## Beneficios

1. **Rendimiento**: Las consultas a la base de datos son más rápidas
2. **Escalabilidad**: Mejor manejo de grandes volúmenes de imágenes
3. **Mantenimiento**: Más fácil hacer backup y gestión de archivos
4. **Tamaño de BD**: Reducción significativa del tamaño de la base de datos

## Notas Importantes

- Las imágenes se guardan con nombres únicos basados en timestamp
- Se mantiene la compatibilidad con imágenes existentes
- El proceso de migración es seguro y no afecta las rifas existentes
- Se recomienda hacer backup antes de ejecutar la migración

## Troubleshooting

### Error: "No se pudo subir la imagen"
- Verifica que el archivo sea menor a 5MB
- Asegúrate de que sea un formato válido (JPG, PNG, WEBP)
- Revisa los permisos de escritura en `/public/uploads/`

### Error: "Error al migrar las imágenes"
- Verifica que tengas permisos de administrador
- Revisa los logs del servidor para más detalles
- Asegúrate de que el directorio `/public/uploads/` exista

## Comandos Útiles

```bash
# Verificar imágenes base64 en la base de datos
npx tsx scripts/clean-base64-images.ts

# Limpiar imágenes base64 (descomenta en el script)
# UPDATE raffles SET image_url = NULL WHERE image_url LIKE "data:image%"
```
