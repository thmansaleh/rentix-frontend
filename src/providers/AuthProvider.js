'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { selectIsAuth, selectAuthLoading } from '@/redux/slices/authSlice';
import { checkAuthStatus } from '@/app/services/api/auth';
import { Loader2 } from 'lucide-react';

// Import your login page component
import LoginPage from '@/app/login/page';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);
  const authLoading = useSelector(selectAuthLoading);
  const pathname = usePathname();
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Check authentication status by calling the API on app load
    if (!isAuth) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuth]);

  // Show loading only on protected routes, not on login page
  if (authLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">جاري التحقق من بيانات المصادقة...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuth && !isPublicRoute) {
    return <LoginPage />;
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuth && pathname === '/login') {
    // Use Next.js router for client-side navigation instead of window.location
    router.push('/');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">جاري إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  // Render children for authenticated users on protected routes
  // or for anyone on public routes
  return <>{children}</>;
};

export default AuthProvider;