import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { error: "No autorizado", status: 401 };
    }

    if (session.user.role !== "admin") {
        return { error: "Acceso denegado", status: 403 };
    }

    return { session };
}

export function createAdminResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status });
}

export function createAdminErrorResponse(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}
