import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

        // If accessing admin routes, check if user has admin role
        if (isAdminRoute && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = {
    matcher: ["/admin/:path*"]
}
