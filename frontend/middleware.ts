import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  console.log("Cookies in Middleware:", request.cookies.getAll());

  
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });  
  console.log("Middleware Token:", token);

  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/register" || path === "/";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/posts", request.url));
  }

  if (!isPublicPath && !token) {
    console.log("No valid token found. Redirecting to login...");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Authenticated User Token:", token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*", "/profile"],
};
