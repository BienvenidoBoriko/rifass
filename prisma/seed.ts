import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
        pricePerTicket: 25.0,
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(Date.now() + 15 * 86400000),
        drawDate: new Date(Date.now() + 16 * 86400000),
        status: "active",
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
        pricePerTicket: 35.0,
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 20 * 86400000),
        endDate: new Date(Date.now() + 25 * 86400000),
        drawDate: new Date(Date.now() + 26 * 86400000),
        status: "active",
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
        pricePerTicket: 50.0,
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 10 * 86400000),
        endDate: new Date(Date.now() + 35 * 86400000),
        drawDate: new Date(Date.now() + 36 * 86400000),
        status: "active",
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
        pricePerTicket: 45.0,
        totalTickets: 10000,
        soldTickets: 0,
        startDate: new Date(Date.now() - 5 * 86400000),
        endDate: new Date(Date.now() + 45 * 86400000),
        drawDate: new Date(Date.now() + 46 * 86400000),
        status: "active",
      },
      {
        title: "BMW X5 2023 - Ganador Anterior",
        description: "BMW X5 2023 completamente equipado...",
        imageUrl:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        galleryImages: JSON.stringify([
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        ]),
        pricePerTicket: 30.0,
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
      },
    ],
  });

  // 3. Crear tickets
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
        paymentMethod: "stripe",
        paymentStatus: "confirmed",
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
        paymentMethod: "zinli",
        paymentStatus: "confirmed",
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
        paymentMethod: "zelle",
        paymentStatus: "confirmed",
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
        amountPaid: 25.0,
        confirmedAt: new Date(Date.now() - 4 * 86400000),
        purchasedAt: new Date(Date.now() - 5 * 86400000),
      },
    ],
  });

  // 4. Registrar ganador
  await prisma.winner.create({
    data: {
      raffleId: 5,
      ticketId: 1,
      winnerName: "María González",
      winnerPhone: "+1234567890",
      winnerEmail: "maria.gonzalez@email.com",
      prizeTitle: "BMW X5 2023 - Ganador Anterior",
      drawDate: new Date(Date.now() - 30 * 86400000),
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      claimed: true,
      claimedAt: new Date(Date.now() - 29 * 86400000),
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
