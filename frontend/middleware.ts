import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  console.log("Cookies in Middleware:", request.cookies.getAll()); 

  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/register" || path === "/";

  // ✅ Allow access to public routes without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  let token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // ✅ If NextAuth token is missing, use `_vercel_jwt`
  if (!token) {
    const vercelJWT = request.cookies.get("_vercel_jwt")?.value;
    if (vercelJWT) {
      console.log("Using Vercel JWT instead:", vercelJWT);
      return NextResponse.next();
    }

    console.log("No valid token found. Redirecting to login...");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Middleware Token (NextAuth):", token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*", "/profile"],  // ✅ Protect only these routes
};
