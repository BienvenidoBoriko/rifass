import { PrismaClient } from '@prisma/client';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

async function testImageServing() {
  try {
    console.log('🧪 Probando servicio de imágenes...\n');

    // Test 1: Verificar archivos físicos
    console.log('1. Verificando archivos físicos...');
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const raffleImagesDir = join(uploadsDir, 'raffle-images');
    const paymentProofsDir = join(uploadsDir, 'payment-proofs');

    if (existsSync(raffleImagesDir)) {
      const raffleFiles = await readdir(raffleImagesDir);
      const imageFiles = raffleFiles.filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || 
        file.endsWith('.png') || file.endsWith('.webp')
      );
      console.log(`   📁 Imágenes de rifas encontradas: ${imageFiles.length}`);
      imageFiles.forEach(file => {
        console.log(`      - ${file}`);
      });
    }

    if (existsSync(paymentProofsDir)) {
      const proofFiles = await readdir(paymentProofsDir);
      const imageFiles = proofFiles.filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || 
        file.endsWith('.png') || file.endsWith('.webp')
      );
      console.log(`   📁 Comprobantes de pago encontrados: ${imageFiles.length}`);
      imageFiles.forEach(file => {
        console.log(`      - ${file}`);
      });
    }

    // Test 2: Verificar rifas con imágenes
    console.log('\n2. Verificando rifas con imágenes...');
    const rafflesWithImages = await prisma.raffle.findMany({
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

    console.log(`   📊 Rifas con imágenes: ${rafflesWithImages.length}`);
    rafflesWithImages.forEach(raffle => {
      console.log(`      - ID: ${raffle.id}, Título: ${raffle.title}`);
      console.log(`        URL: ${raffle.imageUrl}`);
    });

    // Test 3: Verificar tickets con comprobantes
    console.log('\n3. Verificando tickets con comprobantes...');
    const ticketsWithProofs = await prisma.ticket.findMany({
      where: {
        paymentProof: {
          not: null,
          startsWith: "/uploads"
        }
      },
      select: {
        id: true,
        buyerName: true,
        paymentProof: true
      },
      take: 5 // Solo mostrar los primeros 5
    });

    console.log(`   📊 Tickets con comprobantes: ${ticketsWithProofs.length}`);
    ticketsWithProofs.forEach(ticket => {
      console.log(`      - ID: ${ticket.id}, Comprador: ${ticket.buyerName}`);
      console.log(`        Comprobante: ${ticket.paymentProof}`);
    });

    // Test 4: URLs de prueba
    console.log('\n4. URLs de prueba para verificar...');
    if (rafflesWithImages.length > 0) {
      const testRaffle = rafflesWithImages[0];
      console.log(`   🖼️  Imagen de rifa: ${testRaffle.imageUrl}`);
      console.log(`   🔗 URL completa: http://localhost:3001${testRaffle.imageUrl}`);
    }

    if (ticketsWithProofs.length > 0) {
      const testTicket = ticketsWithProofs[0];
      console.log(`   📄 Comprobante de pago: ${testTicket.paymentProof}`);
      console.log(`   🔗 URL completa: http://localhost:3001${testTicket.paymentProof}`);
    }

    // Test 5: Resumen
    console.log('\n5. Resumen del estado...');
    console.log(`   📊 Total de rifas con imágenes: ${rafflesWithImages.length}`);
    console.log(`   📊 Total de tickets con comprobantes: ${ticketsWithProofs.length}`);
    
    if (rafflesWithImages.length > 0 || ticketsWithProofs.length > 0) {
      console.log('\n✅ Hay imágenes para probar. Verifica las URLs en tu navegador.');
      console.log('   Si las imágenes no se muestran, revisa:');
      console.log('   1. Que el servidor esté corriendo');
      console.log('   2. Que los archivos existan en la carpeta public/uploads/');
      console.log('   3. Que la configuración de Next.js esté correcta');
    } else {
      console.log('\n⚠️  No hay imágenes para probar. Sube algunas imágenes primero.');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testImageServing();
