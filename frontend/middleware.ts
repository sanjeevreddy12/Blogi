import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    // Get token from request
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "sanju"
    });
    
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/register' || path === '/';
  
    // Check if token exists AND is valid
    //@ts-ignore
    const isValidToken = token && token.exp && Date.now() < token.exp * 1000;
    
    if (isPublicPath && isValidToken) {
      return NextResponse.redirect(new URL('/posts', request.url));
    }
    
    if (!isPublicPath && !isValidToken) {
      // Clear any remnant cookies on redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Optional: Clear cookies directly in the response
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("next-auth.csrf-token");
      response.cookies.delete("next-auth.callback-url");
      return response;
    }
  
    return NextResponse.next();
  }


export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/posts/:path*',
    '/profile'
  ]
}