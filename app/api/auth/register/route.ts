import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, country, city } = await req.json()

    // Validation: Required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Campos requeridos faltantes",
          details: {
            name: !name ? "El nombre es requerido" : null,
            email: !email ? "El email es requerido" : null,
            password: !password ? "La contraseña es requerida" : null
          }
        },
        { status: 400 }
      )
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      )
    }

    // Validation: Password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Validation: Name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "El nombre debe tener al menos 2 caracteres" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "user" // Default role
      }
    })

    return NextResponse.json(
      {
        message: "Cuenta creada exitosamente",
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    // Handle specific database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 409 }
      )
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "Error de referencia en la base de datos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intenta nuevamente." },
      { status: 500 }
    )
  }
}
