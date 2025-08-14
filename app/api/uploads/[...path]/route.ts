import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), "public", "uploads", ...params.path);

    // Verificar que el archivo existe
    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Leer el archivo
    const fileBuffer = await readFile(filePath);

    // Determinar el tipo MIME basado en la extensión
    const ext = filePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
    }

    // Configurar headers de caché para optimizar rendimiento
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 año de caché
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(fileBuffer, {
      headers,
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
