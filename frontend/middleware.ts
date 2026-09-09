import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/trips", "/profile", "/chat"];

export function middleware(request: NextRequest) {
  const isProtected = PROTECTED_ROUTES.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`),
  );
  if (!isProtected) return NextResponse.next();

  if (!request.cookies.get("kelana_token")?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/trips/:path*", "/profile/:path*", "/chat/:path*"],
};
