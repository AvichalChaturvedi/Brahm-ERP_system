import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPrefixes = [
  '/dashboard',
  '/projects',
  '/design-review',
  '/bom-analysis',
  '/quote-optimization',
  '/pipeline',
  '/settings',
  '/contact-sales',
];

function isProtected(pathname: string) {
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/design-review/:path*', '/bom-analysis/:path*', '/quote-optimization/:path*', '/pipeline/:path*', '/settings/:path*', '/contact-sales/:path*'],
};
