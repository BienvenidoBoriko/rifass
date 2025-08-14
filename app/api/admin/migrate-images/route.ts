import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all raffles with base64 images
    const raffles = await prisma.raffle.findMany({
      where: {
        imageUrl: {
          not: null,
          startsWith: "data:image"
        }
      }
    });

    if (raffles.length === 0) {
      return NextResponse.json({ 
        message: "No base64 images found to migrate",
        migrated: 0 
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Create raffle-images subdirectory
    const raffleImagesDir = join(uploadsDir, "raffle-images");
    if (!existsSync(raffleImagesDir)) {
      await mkdir(raffleImagesDir, { recursive: true });
    }

    let migratedCount = 0;

    for (const raffle of raffles) {
      try {
        if (!raffle.imageUrl || !raffle.imageUrl.startsWith('data:image')) {
          continue;
        }

        // Extract base64 data
        const base64Data = raffle.imageUrl.split(',')[1];
        if (!base64Data) {
          continue;
        }

        // Determine file extension from mime type
        const mimeType = raffle.imageUrl.split(';')[0].split(':')[1];
        let extension = 'jpg';
        if (mimeType === 'image/png') extension = 'png';
        else if (mimeType === 'image/webp') extension = 'webp';

        // Generate filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `raffle-${raffle.id}-${timestamp}-${randomString}.${extension}`;
        const filePath = join(raffleImagesDir, fileName);

        // Convert base64 to buffer and save
        const buffer = Buffer.from(base64Data, 'base64');
        await writeFile(filePath, buffer);

        // Update database with new file path
        const publicUrl = `/uploads/raffle-images/${fileName}`;
        await prisma.raffle.update({
          where: { id: raffle.id },
          data: { imageUrl: publicUrl }
        });

        migratedCount++;
      } catch (error) {
        console.error(`Error migrating raffle ${raffle.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} images`,
      migrated: migratedCount,
      total: raffles.length
    });

  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
