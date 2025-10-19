'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Define route access rules based on role and department
const routeAccess = {
  // Legal department routes (Litigation, Consultation, Legal Department or admin)
  legal: [
    '/cases',
    '/parties',
    '/potential-clients',
    '/sessions',
  ],
  
  // HR routes (HR Officer or admin)
  hr: [
    '/hr',
  ],
  
  // Finance routes (Accountant or admin)
  finance: [
    '/finance',
  ],
  
  // Admin only routes
  adminOnly: [
    '/logs',
  ],
  
  // Public routes (accessible to all authenticated users)
  public: [
    '/',
    '/login',
    '/approvals',
    '/goaml',
    '/call-logs',
    '/settings',
    '/payments',
  ],
};

// Legal departments that have access to legal routes
const legalDepartments = ['Litigation', 'Consultation', 'Legal Department'];

/**
 * Check if user has access to a specific route
 */
function hasAccess(pathname, userRole, userDepartment) {
  // Admin has access to everything
  if (userRole === 'admin') {
    return true;
  }

  // Check public routes
  if (routeAccess.public.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return true;
  }

  // Check legal routes
  if (routeAccess.legal.some(route => pathname.startsWith(route))) {
    return legalDepartments.includes(userDepartment);
  }

  // Check HR routes
  if (routeAccess.hr.some(route => pathname.startsWith(route))) {
    return userRole === 'HR Officer';
  }

  // Check finance routes
  if (routeAccess.finance.some(route => pathname.startsWith(route))) {
    return userRole === 'Accountant';
  }

  // Check admin-only routes
  if (routeAccess.adminOnly.some(route => pathname.startsWith(route))) {
    return false; // Already checked admin above
  }

  // Default: allow access if not in restricted routes
  return true;
}

/**
 * RouteGuard component to protect routes based on user role and department
 * Wrap this around page content to enforce access control
 */
export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { roleEn, departmentEn, isAuth, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If not authenticated and not on login page, redirect to login
    if (!isAuth && pathname !== '/login') {
      router.push('/login');
      return;
    }

    // If authenticated, check route access
    if (isAuth && pathname !== '/login') {
      const userHasAccess = hasAccess(pathname, roleEn, departmentEn);
      
      if (!userHasAccess) {
        console.warn(`Access denied to ${pathname} for role: ${roleEn}, department: ${departmentEn}`);
        // Redirect to home page if no access
        router.push('/');
      }
    }
  }, [pathname, roleEn, departmentEn, isAuth, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return null;
  }

  // If not authenticated and not on login page, don't render
  if (!isAuth && pathname !== '/login') {
    return null;
  }

  // If authenticated but no access to current route, don't render
  if (isAuth && pathname !== '/login' && !hasAccess(pathname, roleEn, departmentEn)) {
    return null;
  }

  return children;
}
