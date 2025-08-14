import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testImageUpload() {
  try {
    console.log('🧪 Probando funcionalidad de subida de imágenes...\n');

    // Test 1: Verificar estructura de directorios
    console.log('1. Verificando estructura de directorios...');
    const fs = require('fs');
    const path = require('path');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const raffleImagesDir = path.join(uploadsDir, 'raffle-images');
    const paymentProofsDir = path.join(uploadsDir, 'payment-proofs');

    console.log(`   📁 Uploads dir: ${fs.existsSync(uploadsDir) ? '✅' : '❌'}`);
    console.log(`   📁 Raffle images dir: ${fs.existsSync(raffleImagesDir) ? '✅' : '❌'}`);
    console.log(`   📁 Payment proofs dir: ${fs.existsSync(paymentProofsDir) ? '✅' : '❌'}`);

    // Test 2: Verificar rifas con imágenes base64
    console.log('\n2. Verificando rifas con imágenes base64...');
    const rafflesWithBase64 = await prisma.raffle.findMany({
      where: {
        imageUrl: {
          not: null,
          startsWith: "data:image"
        }
      },
      select: {
        id: true,
        title: true
      }
    });

    console.log(`   📊 Rifas con imágenes base64: ${rafflesWithBase64.length}`);
    if (rafflesWithBase64.length > 0) {
      rafflesWithBase64.forEach(raffle => {
        console.log(`      - ID: ${raffle.id}, Título: ${raffle.title}`);
      });
    }

    // Test 3: Verificar rifas con imágenes como archivos
    console.log('\n3. Verificando rifas con imágenes como archivos...');
    const rafflesWithFiles = await prisma.raffle.findMany({
      where: {
        imageUrl: {
          not: null,
          startsWith: "/uploads"
        }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });

    console.log(`   📊 Rifas con imágenes como archivos: ${rafflesWithFiles.length}`);
    if (rafflesWithFiles.length > 0) {
      rafflesWithFiles.forEach(raffle => {
        console.log(`      - ID: ${raffle.id}, Título: ${raffle.title}`);
        console.log(`        Archivo: ${raffle.imageUrl}`);
      });
    }

    // Test 4: Verificar archivos físicos
    console.log('\n4. Verificando archivos físicos...');
    if (fs.existsSync(raffleImagesDir)) {
      const files = fs.readdirSync(raffleImagesDir);
      const imageFiles = files.filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || 
        file.endsWith('.png') || file.endsWith('.webp')
      );
      console.log(`   📁 Archivos de imágenes encontrados: ${imageFiles.length}`);
      imageFiles.forEach(file => {
        console.log(`      - ${file}`);
      });
    }

    // Test 5: Resumen
    console.log('\n5. Resumen del estado de migración...');
    const totalRaffles = await prisma.raffle.count({
      where: {
        imageUrl: {
          not: null
        }
      }
    });

    console.log(`   📊 Total de rifas con imágenes: ${totalRaffles}`);
    console.log(`   📊 Rifas con base64: ${rafflesWithBase64.length}`);
    console.log(`   📊 Rifas con archivos: ${rafflesWithFiles.length}`);
    console.log(`   📊 Rifas sin migrar: ${rafflesWithBase64.length}`);

    if (rafflesWithBase64.length === 0) {
      console.log('\n✅ ¡Migración completada! Todas las imágenes están como archivos.');
    } else {
      console.log('\n⚠️  Aún hay imágenes base64 que necesitan migración.');
      console.log('   Ejecuta la migración desde el panel de administración.');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testImageUpload();
