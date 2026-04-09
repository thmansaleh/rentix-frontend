'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { selectIsAuth, selectAuthLoading } from '@/redux/slices/authSlice';
import { checkAuthStatus } from '@/app/services/api/auth';
import { validateTenant } from '@/app/services/api/tenantSettings';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

// Import your login page component
import LoginPage from '@/app/login/page';
import TenantNotFound from '@/app/website/TenantNotFound';

/** Full-screen branded loading screen */
function LoadingScreen({ message }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center w-full relative"
      style={{ backgroundImage: "url('/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm p-5 shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
        <p className="text-white/80 text-sm font-medium tracking-wide">{message}</p>
      </div>
    </div>
  );
}

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);
  const authLoading = useSelector(selectAuthLoading);
  const pathname = usePathname();
  const { t } = useTranslations();
  const [tenantValid, setTenantValid] = useState(null); // null = loading, true = valid, false = invalid

  const hasSubdomain = typeof window !== 'undefined' && window.location.hostname.split('.').length > 1;
  
  // Public routes that don't require authentication
  // /website/* is public EXCEPT /website/manage/* (admin area)
  const publicRoutes = ['/login', '/website', '/account-suspended'];
  const adminOnlyPrefixes = ['/website/manage'];
  
  const isAdminOnlyRoute = adminOnlyPrefixes.some(p => pathname.startsWith(p));
  const isPublicRoute = !isAdminOnlyRoute && publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Validate tenant subdomain on mount
  useEffect(() => {
    if (!hasSubdomain) {
      setTenantValid(true);
      return;
    }

    validateTenant()
      .then((res) => {
        setTenantValid(!!res?.valid);
      })
      .catch(() => {
        setTenantValid(false);
      });
  }, [hasSubdomain]);

  useEffect(() => {
    // Check authentication status by calling the API on app load
    if (!isAuth) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuth]);

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (isAuth && pathname === '/login') {
      router.push('/');
    }
  }, [isAuth, pathname, router]);

  // Show loading only on protected routes, not on login page
  if (authLoading && !isPublicRoute) {
    // Still validating tenant — show nothing yet
    if (tenantValid === null) return null;
    // Invalid tenant — show not found instead of loading
    if (!tenantValid) return <TenantNotFound />;

    return <LoadingScreen message={t('auth.verifyingAuth') || 'جاري التحقق من بيانات المصادقة...'} />;
  }

  // Invalid tenant subdomain — show not found for ALL routes (admin, login, website)
  if (tenantValid === null) return null;
  if (!tenantValid) return <TenantNotFound />;

  // If user is not authenticated and trying to access protected route
  if (!isAuth && !isPublicRoute) {
    return <LoginPage />;
  }

  // If user is authenticated and trying to access login page, show loading while redirecting
  if (isAuth && pathname === '/login') {
    return <LoadingScreen message={t('auth.redirecting') || 'جاري إعادة التوجيه...'} />;
  }

  // Render children for authenticated users on protected routes
  // or for anyone on public routes
  return <>{children}</>;
};

export default AuthProvider;