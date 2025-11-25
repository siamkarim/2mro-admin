import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // 1. If user is logged in and visits "/" → go to /dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  // 2. If not logged in and tries to access dashboard → go to "/"
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  // 3. Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
