import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/users",
  "/payment-management",
  "/administration",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow "/" publicly
  if (pathname === "/") return NextResponse.next();

  // Allow Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  // Read token from cookies
  const token = req.cookies.get("accessToken")?.value;

  // Block protected routes if no token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/users",
    "/users/:path*",
    "/payment-management",
    "/payment-management/:path*",
    "/administration",
    "/administration/:path*",
  ],
};
