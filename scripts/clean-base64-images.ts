import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanBase64Images() {
  try {
    console.log('🔍 Buscando rifas con imágenes base64...');
    
    // Find all raffles with base64 images
    const rafflesWithBase64 = await prisma.raffle.findMany({
      where: {
        imageUrl: {
          not: null,
          startsWith: "data:image"
        }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    console.log(`📊 Encontradas ${rafflesWithBase64.length} rifas con imágenes base64`);

    if (rafflesWithBase64.length === 0) {
      console.log('✅ No hay imágenes base64 para limpiar');
      return;
    }

    // Show which raffles have base64 images
    console.log('\n📋 Rifas con imágenes base64:');
    rafflesWithBase64.forEach(raffle => {
      console.log(`  - ID: ${raffle.id}, Título: ${raffle.title}`);
    });

    console.log('\n⚠️  ADVERTENCIA: Esto eliminará permanentemente las imágenes base64 de la base de datos.');
    console.log('   Asegúrate de que las imágenes ya hayan sido migradas a archivos.');
    
    // In a real scenario, you might want to add a confirmation prompt here
    // For now, we'll just log what would be done
    
    console.log('\n🔄 Para limpiar las imágenes base64, ejecuta:');
    console.log('   UPDATE raffles SET image_url = NULL WHERE image_url LIKE "data:image%"');
    
    // Uncomment the following lines to actually clean the database
    /*
    const result = await prisma.raffle.updateMany({
      where: {
        imageUrl: {
          startsWith: "data:image"
        }
      },
      data: {
        imageUrl: null
      }
    });
    
    console.log(`✅ Limpiadas ${result.count} imágenes base64 de la base de datos`);
    */

  } catch (error) {
    console.error('❌ Error al limpiar imágenes base64:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanBase64Images();
