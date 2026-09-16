import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/auth/sign-in", "/auth/sign-up", "/auth/forgot-password", "/auth/reset-password", "/auth/verify-email"];
const apiAuthPrefix = "/api/auth";
const publicProductPaths = ["/products"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith(apiAuthPrefix)) return NextResponse.next();
  if (publicPaths.some(p => pathname === p)) return NextResponse.next();
  if (publicProductPaths.some(p => pathname.startsWith(p))) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/images")) return NextResponse.next();

  const sessionToken = req.cookies.get("better-auth.session_token")?.value;
  if (!sessionToken) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
