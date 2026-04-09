import { NextResponse } from 'next/server'

/**
 * Next.js Edge Middleware — handles subdomain-based tenant routing.
 *
 * URL pattern:  http://tenantCode.localhost:3000/website/*  → public (no auth)
 * URL pattern:  http://tenantCode.localhost:3000/*          → admin (requires auth)
 *
 * The subdomain is used only to identify the tenant. It does NOT redirect
 * admin routes to the public website. Only /website/* is public.
 */
export function middleware(request) {
  return NextResponse.next()
}

// Only run middleware on relevant paths (skip static files, api routes, etc.)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - favicon.ico  (favicon)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
