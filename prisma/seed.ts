import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Tasa de cambio oficial de Venezuela (2025-08-24)
const EXCHANGE_RATE = 141.8843;

// Función para convertir USD a VES
function convertUSDToVES(usdAmount: number): number {
  return Math.round(usdAmount * EXCHANGE_RATE * 100) / 100; // Redondear a 2 decimales
}

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Crear usuarios
  await prisma.user.createMany({
    data: [
      {
        email: "admin@test.com",
        name: "Admin User",
        role: "admin",
        password: await bcrypt.hash("password", 12),
      },
      {
        email: "test@example.com",
        name: "Usuario Test",
        role: "user",
        password: await bcrypt.hash("password", 12),
      },
      {
        email: "demo@test.com",
        name: "Demo User",
        role: "user",
        password: await bcrypt.hash("password", 12),
      },
      {
        email: "user@example.com",
        name: "Example User",
        role: "user",
        password: await bcrypt.hash("password", 12),
      },
      {
        email: "prueba@test.com",
        name: "Usuario Prueba",
        role: "user",
        password: await bcrypt.hash("password", 12),
      },
    ],
    skipDuplicates: true,
  });

  // 2. Crear rifas
  await prisma.raffle.createMany({
    data: [
      {
        title: "Toyota Camry 2024 - Edición Especial",
        description: "Increíble Toyota Camry 2024 en color blanco perla...",
        imageUrl:
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        ]),
        pricePerTicketUSD: 25.0,
        pricePerTicketVES: convertUSDToVES(25.0),
        exchangeRate: EXCHANGE_RATE,
        currency: "USD",
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(Date.now() + 15 * 86400000),
        drawDate: new Date(Date.now() + 16 * 86400000),
        status: "active",
        hasPredefinedWinners: false,
      },
      {
        title: "Honda Civic Type R 2024",
        description: "El deportivo más esperado del año...",
        imageUrl:
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        ]),
        pricePerTicketUSD: 35.0,
        pricePerTicketVES: convertUSDToVES(35.0),
        exchangeRate: EXCHANGE_RATE,
        currency: "USD",
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 20 * 86400000),
        endDate: new Date(Date.now() + 25 * 86400000),
        drawDate: new Date(Date.now() + 26 * 86400000),
        status: "active",
        hasPredefinedWinners: true,
        predefinedWinners: JSON.stringify([100, 500, 1000, 2500, 5000, 7500, 9000, 9500, 9800, 9999]),
      },
      {
        title: "Ford Mustang GT 2024 - Convertible",
        description: "Experimenta la libertad con este impresionante...",
        imageUrl:
          "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&h=600&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
        ]),
        pricePerTicketUSD: 50.0,
        pricePerTicketVES: convertUSDToVES(50.0),
        exchangeRate: EXCHANGE_RATE,
        currency: "USD",
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 10 * 86400000),
        endDate: new Date(Date.now() + 35 * 86400000),
        drawDate: new Date(Date.now() + 36 * 86400000),
        status: "active",
        hasPredefinedWinners: false,
      },
      {
        title: "Tesla Model 3 Performance 2024",
        description: "El futuro de la conducción está aquí...",
        imageUrl:
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        ]),
        pricePerTicketUSD: 45.0,
        pricePerTicketVES: convertUSDToVES(45.0),
        exchangeRate: EXCHANGE_RATE,
        currency: "USD",
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 5 * 86400000),
        endDate: new Date(Date.now() + 45 * 86400000),
        drawDate: new Date(Date.now() + 46 * 86400000),
        status: "active",
        hasPredefinedWinners: true,
        predefinedWinners: JSON.stringify([123, 456, 789, 1234, 5678, 8765, 4321, 9876, 5432, 1111]),
      },
      {
        title: "BMW X5 2023 - Ganador Anterior",
        description: "BMW X5 2023 completamente equipado...",
        imageUrl:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        ]),
        pricePerTicketUSD: 30.0,
        pricePerTicketVES: convertUSDToVES(30.0),
        exchangeRate: EXCHANGE_RATE,
        currency: "USD",
        totalTickets: 10000,
        soldTickets: 10000,
        startDate: new Date(Date.now() - 60 * 86400000),
        endDate: new Date(Date.now() - 31 * 86400000),
        drawDate: new Date(Date.now() - 30 * 86400000),
        status: "drawn",
        winnerTicketNumber: 1234,
        winnerName: "María González",
        winnerPhone: "+1234567890",
        winnerEmail: "maria.gonzalez@email.com",
        hasPredefinedWinners: false,
      },
    ],
  });

  // 3. Crear tickets con los nuevos campos paymentProof y paymentComment
  await prisma.ticket.createMany({
    data: [
      {
        raffleId: 1,
        ticketNumber: 1999,
        buyerName: "Admin User",
        buyerPhone: "+1555123456",
        buyerEmail: "admin@test.com",
        buyerCountry: "España",
        buyerCity: "Madrid",
        paymentMethod: "zelle",
        paymentStatus: "confirmed",
        paymentReference: "ZELLE123456789",
        paymentProof: "https://example.com/payment-proofs/admin-payment.jpg",
        paymentComment: "Pago realizado desde cuenta bancaria principal",
        amountPaid: 25.0,
        confirmedAt: new Date(Date.now() - 3 * 3600000),
        purchasedAt: new Date(Date.now() - 4 * 3600000),
      },
      {
        raffleId: 1,
        ticketNumber: 1001,
        buyerName: "Usuario Test",
        buyerPhone: "+1234567890",
        buyerEmail: "test@example.com",
        buyerCountry: "Venezuela",
        buyerCity: "Caracas",
        paymentMethod: "zelle",
        paymentStatus: "confirmed",
        paymentReference: "ZELLE987654321",
        paymentProof: "https://example.com/payment-proofs/test-payment.jpg",
        paymentComment: "Pago realizado desde Zelle app",
        amountPaid: 25.0,
        confirmedAt: new Date(Date.now() - 2 * 86400000),
        purchasedAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        raffleId: 1,
        ticketNumber: 1500,
        buyerName: "Demo User",
        buyerPhone: "+1987654321",
        buyerEmail: "demo@test.com",
        buyerCountry: "Colombia",
        buyerCity: "Bogotá",
        paymentMethod: "paypal",
        paymentStatus: "confirmed",
        paymentReference: "PAYPAL123456789",
        paymentProof: "https://example.com/payment-proofs/demo-payment.jpg",
        paymentComment: "Pago realizado desde PayPal",
        amountPaid: 25.0,
        confirmedAt: new Date(Date.now() - 1 * 86400000),
        purchasedAt: new Date(Date.now() - 2 * 86400000),
      },
      {
        raffleId: 1,
        ticketNumber: 1,
        buyerName: "Example User",
        buyerPhone: "+1111222333",
        buyerEmail: "user@example.com",
        buyerCountry: "México",
        buyerCity: "CDMX",
        paymentMethod: "binance",
        paymentStatus: "confirmed",
        paymentReference: "BINANCE123456789",
        paymentProof: "https://example.com/payment-proofs/user-payment.jpg",
        paymentComment: "Pago realizado desde Binance Pay",
        amountPaid: 25.0,
        confirmedAt: new Date(Date.now() - 5 * 86400000),
        purchasedAt: new Date(Date.now() - 6 * 86400000),
      },
      {
        raffleId: 1,
        ticketNumber: 100,
        buyerName: "Usuario Prueba",
        buyerPhone: "+1444555666",
        buyerEmail: "prueba@test.com",
        buyerCountry: "Argentina",
        buyerCity: "Buenos Aires",
        paymentMethod: "pago-movil",
        paymentStatus: "confirmed",
        paymentReference: "PAGOMOVIL123456789",
        paymentProof: "https://example.com/payment-proofs/prueba-payment.jpg",
        paymentComment: "Pago realizado desde Pago Móvil",
        amountPaid: 25.0,
        confirmedAt: new Date(Date.now() - 4 * 86400000),
        purchasedAt: new Date(Date.now() - 5 * 86400000),
      },
      {
        raffleId: 2,
        ticketNumber: 500,
        buyerName: "Nuevo Usuario",
        buyerPhone: "+1999888777",
        buyerEmail: "nuevo@test.com",
        buyerCountry: "Chile",
        buyerCity: "Santiago",
        paymentMethod: "paypal",
        paymentStatus: "pending",
        paymentReference: "PAYPAL987654321",
        paymentProof: "https://example.com/payment-proofs/nuevo-payment.jpg",
        paymentComment: "Pendiente de confirmación",
        amountPaid: 35.0,
        purchasedAt: new Date(Date.now() - 1 * 3600000),
      },
      {
        raffleId: 2,
        ticketNumber: 501,
        buyerName: "Usuario Binance",
        buyerPhone: "+1888777666",
        buyerEmail: "binance@test.com",
        buyerCountry: "Perú",
        buyerCity: "Lima",
        paymentMethod: "binance",
        paymentStatus: "pending",
        paymentReference: "BINANCE987654321",
        paymentProof: "https://example.com/payment-proofs/binance-payment.jpg",
        paymentComment: "Pago realizado con USDT",
        amountPaid: 35.0,
        purchasedAt: new Date(Date.now() - 2 * 3600000),
      },
    ],
  });

  // 4. Registrar ganador
  await prisma.winner.create({
    data: {
      raffleId: 5,
      ticketNumber: 1,
      winnerName: "María González",
      winnerPhone: "+1234567890",
      winnerEmail: "maria.gonzalez@email.com",
      drawDate: new Date(Date.now() - 30 * 86400000),
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      claimed: true,
    },
  });

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
