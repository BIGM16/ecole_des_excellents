import { NextRequest, NextResponse } from "next/server";

// Paths to protect
const protectedPrefixes = ["/admin", "/coordon", "/encadreur", "/etudiant"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // basic expiry check by decoding JWT payload
    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("invalid");
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf8")
      );
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (e) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/coordon/:path*",
    "/encadreur/:path*",
    "/etudiant/:path*",
  ],
};
