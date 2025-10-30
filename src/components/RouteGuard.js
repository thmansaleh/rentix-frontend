'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * RouteGuard component - simplified to only check authentication
 */
export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuth, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If not authenticated and not on login page, redirect to login
    if (!isAuth && pathname !== '/login') {
      router.push('/login');
      return;
    }
  }, [pathname, isAuth, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return null;
  }

  // If not authenticated and not on login page, don't render
  if (!isAuth && pathname !== '/login') {
    return null;
  }

  return children;
}
