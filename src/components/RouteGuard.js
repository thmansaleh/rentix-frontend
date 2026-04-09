'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Routes that are publicly accessible without authentication
// Note: /website/manage/* is NOT public — it requires admin login
const PUBLIC_ROUTES = ['/login', '/website', '/account-suspended'];
const ADMIN_ONLY_PREFIXES = ['/website/manage'];

/**
 * RouteGuard component - checks authentication for protected routes
 */
export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuth, loading } = useAuth();

  // /website/manage/* requires auth even though /website/* is otherwise public
  const isAdminOnlyRoute = ADMIN_ONLY_PREFIXES.some(p => pathname.startsWith(p));

  // Check if current path is public
  const isPublicRoute = !isAdminOnlyRoute && PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If not authenticated and not on a public route, redirect to login
    if (!isAuth && !isPublicRoute) {
      router.push('/login');
      return;
    }
  }, [pathname, isAuth, loading, router, isPublicRoute]);

  // Show loading state while checking auth (only for protected routes)
  if (loading && !isPublicRoute) {
    return null;
  }

  // If not authenticated and not on a public route, don't render
  if (!isAuth && !isPublicRoute) {
    return null;
  }

  return children;
}
