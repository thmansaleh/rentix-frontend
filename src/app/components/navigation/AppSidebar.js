'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth, useUserRole } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutWithRedux } from '@/app/services/api/auth';

// Import custom components
import MobileSidebar from './components/MobileSidebar';
import DesktopSidebar from './components/DesktopSidebar';

// Import custom hooks and config
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { getMenuItems } from './config/menuConfig';
import { startNavigation } from '@/components/NavigationProgressBar';

const AppSidebar = ({ isMobileSidebarOpen, onMobileSidebarClose }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const { user, roleEn, departmentEn, permissions } = useAuth();
  const userRole = useUserRole(isRTL ? 'ar' : 'en');

  // Derive active item from URL so it stays in sync on refresh and direct navigation
  const activeItem = useMemo(() => {
    const stripped = pathname?.replace(/^\//, '') ?? '';
    return stripped === '' ? '/' : stripped;
  }, [pathname]);

  // Memoized menu items configuration with user role and department for permission-based filtering
  const menuItems = useMemo(() => getMenuItems(t, roleEn, departmentEn, permissions), [t, roleEn, departmentEn, permissions]);

  // Memoized callbacks
  const toggleSubmenu = useCallback((menuId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  }, []);

  const handleNavClick = useCallback((itemId, itemType) => {
    // If it's a category item, just toggle the submenu instead of navigating
    if (itemType === 'category') {
      toggleSubmenu(itemId);
      return;
    }

    // For link items, navigate normally (activeItem derives from usePathname automatically)
    startNavigation();
    router.push(`/${itemId === '/' ? '' : itemId}`);
    // Close mobile sidebar when navigating
    if (isMobile && onMobileSidebarClose) {
      onMobileSidebarClose();
    }
  }, [router, isMobile, toggleSubmenu, onMobileSidebarClose]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutWithRedux());
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch, router]);

  // Custom keyboard navigation hook
  useKeyboardNavigation(menuItems, activeItem, handleNavClick);

  // Handle click outside to close submenus on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenSubmenus({});
        if (onMobileSidebarClose) {
          onMobileSidebarClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, onMobileSidebarClose]);

  // Render mobile navigation
  if (isMobile) {
    return (
      <MobileSidebar 
        isOpen={isMobileSidebarOpen}
        onClose={onMobileSidebarClose}
        menuItems={menuItems}
        activeItem={activeItem}
        openSubmenus={openSubmenus}
        onNavClick={handleNavClick}
        onToggleSubmenu={toggleSubmenu}
        user={user}
        userRole={userRole}
        onLogout={handleLogout}
        isRTL={isRTL}
        sidebarRef={sidebarRef}
      />
    );
  }

  return (
    <DesktopSidebar 
      menuItems={menuItems}
      activeItem={activeItem}
      openSubmenus={openSubmenus}
      onNavClick={handleNavClick}
      onToggleSubmenu={toggleSubmenu}
      user={user}
      userRole={userRole}
      onLogout={handleLogout}
      isRTL={isRTL}
      sidebarRef={sidebarRef}
    />
  );
};

export default AppSidebar;