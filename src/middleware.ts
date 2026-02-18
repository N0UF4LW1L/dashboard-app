import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login'];
const PROTECTED_PREFIX = '/dashboard';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);

    // Jika sudah login dan akses halaman publik (login), redirect ke dashboard
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Jika belum login dan akses halaman protected, redirect ke login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
