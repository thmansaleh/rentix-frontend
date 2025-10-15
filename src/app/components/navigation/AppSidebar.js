'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  List, 
  Settings2,
  Package,
  Plus,
  Grid3X3,
  Warehouse,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  PieChart,
  Mail,
  User,
  Shield,
  Palette,
  ChevronDown,
  Crown,
  LogOut,
  Car,
  ScrollText,
  FilePlus2,
  UserRoundPlus,
  FileSearch,
  Globe,
  CarIcon,
  FileText,
  Receipt,
  Info,
  Menu,
  X,
  Scale,
  Calendar,
  Gavel,
  FolderPlus,
  CircleX,
  CheckSquare,
  Scroll,
  CheckCircle,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth, useUserRole } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutWithRedux } from '@/app/services/api/auth';

// Custom hook for keyboard navigation
const useKeyboardNavigation = (menuItems, activeItem, setActiveItem, handleNavClick) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = menuItems.findIndex(item => item.id === activeItem);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        const prevItem = menuItems[prevIndex];
        setActiveItem(prevItem.id);
        handleNavClick(prevItem.id, prevItem.type);
      } else if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = menuItems.findIndex(item => item.id === activeItem);
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        const nextItem = menuItems[nextIndex];
        setActiveItem(nextItem.id);
        handleNavClick(nextItem.id, nextItem.type);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuItems, activeItem, setActiveItem, handleNavClick]);
};

// Memoized menu item component
const MenuItem = React.memo(({ 
  item, 
  activeItem, 
  openSubmenus, 
  onNavClick, 
  onToggleSubmenu,
  isRTL 
}) => {
  const IconComponent = item.icon;
  const isActive = activeItem === item.id;
  const isOpen = openSubmenus[item.id];

  if (item.type === 'link') {
    return (
      <button 
        onClick={() => onNavClick(item.id, item.type)}
        className={`
          group 
          flex 
          items-center 
          w-full 
          px-4 
          py-3 
          text-sidebar-foreground 
          hover:text-sidebdar-foreground 
          rounded-xl 
          cursor-pointer
          transition-all 
          duration-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-sidebar-ring 
          focus:ring-offset-2 
          focus:ring-offset-sidebar
          ${isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg' 
            : 'hover:bg-sidebar-accent'
          }
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <IconComponent className={`
          w-5 
          h-5 
          transition-colors  
          ${isRTL ? 'icon-spacing-rtl' : 'icon-spacing-ltr'} 
          ${isActive 
            ? 'text-sidebar-primary-foreground' 
            : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
          }
        `} />
        <span className="font-medium transition-colors">{item.label}</span>
        {item.badge && (
          <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} ${item.badgeColor || 'bg-blue-500'} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => item.type === 'category' ? onNavClick(item.id, item.type) : onToggleSubmenu(item.id)}
        className={`
          group 
          flex 
          items-center 
          justify-between 
          w-full 
          cursor-pointer
          px-4 
          py-3 
          text-sidebar-foreground 
          rounded-xl 
          transition-all 
          duration-300 
          focus:outline-none 
          focus:ring-2 
          focus:ring-sidebar-ring 
          focus:ring-offset-2 
          focus:ring-offset-sidebar
          ${item.type === 'category' 
            ? 'hover:bg-sidebar-accent/50' 
            : isActive 
              ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
              : 'hover:bg-sidebar-accent'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <IconComponent className={`
            w-5 
            h-5 
            transition-colors  
            ${isRTL ? 'ml-3' : 'mr-3'} 
            ${item.type === 'category' 
              ? 'text-sidebar-foreground/80' 
              : isActive 
                ? 'text-sidebar-primary-foreground' 
                : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
            }
          `} />
          <span className={`font-medium transition-colors ${
            item.type === 'category' ? 'text-sidebar-foreground/90' : ''
          }`}>{item.label}</span>
        </div>
        <ChevronDown 
          className={`
            w-4 
            h-4 
            transition-all  
            duration-300 
            ${isOpen ? 'rotate-180' : ''} 
            ${item.type === 'category' 
              ? 'text-sidebar-foreground/60' 
              : isActive 
                ? 'text-sidebar-primary-foreground' 
                : 'text-sidebar-foreground/50'
            }
          `}
        />
      </button>
      
      <div 
        className={`overflow-hidden p-2 transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
          <ul className={`${isRTL ? 'mr-4' : 'ml-4'} mt-2 space-y-1`} role="group">
            {item.submenu?.map((subItem) => {
              const SubIconComponent = subItem.icon;
              const isSubActive = activeItem === subItem.id;
              
              return (
                <li key={subItem.id}>
                  <button 
                    onClick={() => onNavClick(subItem.id, 'link')}
                    className={`
                      flex            cursor-pointer

                      items-center 
                      w-full 
                      px-4 
                      
                      py-2 
                      text-sm 
                      rounded-lg 
                      transition-all 
                      duration-200 
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-sidebar-ring 
                      focus:ring-offset-2 
                      focus:ring-offset-sidebar
                      ${isSubActive 
                        ? 'bg-sidebar-accent text-sidebar-foreground font-medium shadow-sm' 
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }
                    `}
                    aria-current={isSubActive ? 'page' : undefined}
                  >
                    <SubIconComponent className={`
                      w-4 
                      h-4 
                      ${isRTL ? 'ml-3' : 'mr-3'} 
                      transition-colors 
                      ${isSubActive 
                        ? 'text-sidebar-foreground' 
                        : 'text-sidebar-foreground/50'
                      }
                    `} />
                    <span className="transition-colors">{subItem.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
    </>
  );
});

MenuItem.displayName = 'MenuItem';

const AppSidebar = () => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [activeItem, setActiveItem] = useState('/');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const { user } = useAuth();
  const userRole = useUserRole(isRTL ? 'ar' : 'en');

  // Memoized menu items configuration
  const menuItems = useMemo(() => [
    {
      id: '/',
      label: t('navigation.dashboard'),
      icon: LayoutDashboard,
      type: 'link'
    },
       {
      id: 'casesManagement',
      label: t('navigation.casesManagement'),
      icon: Scale,
      type: 'category',
      submenu: [
        { id: 'cases', label: t('navigation.cases'), icon: Scale },
        { id: 'cases/add-case', label: t('navigation.addCaseFile'), icon: FolderPlus },
        { id: 'cases/sessions', label: t('navigation.sessions'), icon: Calendar },
        // { id: 'cases/my-tasks', label: t('navigation.myTasks'), icon: CheckSquare },
        // { id: 'cases/memos', label: t('navigation.myMemos'), icon: Scroll },
        // { id: 'judgments', label: t('navigation.issuedJudgments'), icon: Gavel },
      ]
    },
    {
      id: 'parties',
      label: t('navigation.parties'),
      icon: Users,
      type: 'link'
    },
    {
      id: 'potential-clients',
      label: t('navigation.potentialClients'),
      icon: UserRoundPlus,
      type: 'link'
    },
   
    {
      id: 'approvals',
      label: t('navigation.approvalsCenter'),
      icon: CheckCircle,
      type: 'link'
    },
     {
      id: 'humanResources',
      label: t('navigation.humanResources'),
      icon: Users,
      type: 'category',
      submenu: [
        { id: 'hr/employees', label: t('navigation.employees'), icon: Users },
        { id: 'hr/requests', label: t('navigation.requests'), icon: FileText },
        { id: 'hr/assets', label: t('navigation.assets'), icon: Package },
        { id: 'hr/forms', label: t('navigation.forms'), icon: ScrollText },
        { id: 'hr/events', label: t('navigation.events'), icon: Calendar },
        { id: 'hr/notifications', label: t('navigation.notifications'), icon: Bell },
        // { id: 'salaries', label: t('navigation.salaries'), icon: Receipt },
      ]
    },
 
    // {
    //   id: 'reports',
    //   label: t('navigation.reports'),
    //   icon: FileText,
    //   type: 'link'
    // },
    // {
    //   id: 'charts',
    //   label: t('navigation.charts'),
    //   icon: BarChart3,
    //   type: 'link'
    // },
    // {
    //   id: 'website',
    //   label: t('navigation.website'),
    //   icon: Globe,
    //   type: 'link',
    //   badge: '5',
    //   badgeColor: 'bg-green-500'
    // },
    {
      id: 'settings',
      label: t('navigation.settings'),
      icon: Settings2,
      type: 'category',
      submenu: [
        // { id: 'settings/general', label: t('navigation.general'), icon: Info },
        // { id: 'settings/profile', label: t('navigation.profile'), icon: User },
        // { id: 'settings/security', label: t('navigation.security'), icon: Shield },
        { id: 'settings/appearance', label: t('navigation.appearance'), icon: Palette },
      ]
    }
  ], [t]);

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
    
    // For link items, navigate normally
    setActiveItem(itemId);
    router.push(`/${itemId === '/' ? '' : itemId}`);
    // Close mobile sidebar when navigating
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [router, isMobile, toggleSubmenu]);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutWithRedux());
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch, router]);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Custom keyboard navigation hook
  useKeyboardNavigation(menuItems, activeItem, setActiveItem, handleNavClick);

  // Handle click outside to close submenus on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (window.innerWidth < 768) {
          setOpenSubmenus({});
          setIsMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render mobile navigation
  if (isMobile) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Mobile Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border shadow-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                <CarIcon className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <h1 className="text-sidebar-foreground font-bold text-lg">
                {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
              </h1>
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
              aria-label={isRTL ? "فتح القائمة" : "Open Menu"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeMobileSidebar}>
            {/* Mobile Sidebar */}
            <aside 
              className={`
                fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0
                w-80 max-w-[85vw]
                bg-sidebar
                shadow-2xl
                transform transition-transform duration-300 ease-in-out
                flex flex-col
                ${isMobileSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
              `}
              onClick={(e) => e.stopPropagation()}
              ref={sidebarRef}
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-sidebar-foreground font-bold text-xl">
                      {isRTL ? 'محمد بني هاشم' : 'Mohammed Bani Hashem'}
                    </h1>
                    <p className="text-sidebar-foreground/70 text-sm">
                      {isRTL ? 'مكتب محاماة' : 'Law Office'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeMobileSidebar}
                  className="p-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  aria-label={isRTL ? "إغلاق القائمة" : "Close Menu"}
                >
                  <CircleX className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Menu */}
              <nav className="flex-1 overflow-y-auto mt-6 px-4" role="menubar">
                <ul className="space-y-2" role="none">
                  {menuItems.map((item) => (
                    <li key={item.id} role="none" className='cursor-pointer'>
                      <MenuItem
                        item={item}
                        activeItem={activeItem}
                        openSubmenus={openSubmenus}
                        onNavClick={handleNavClick}
                        onToggleSubmenu={toggleSubmenu}
                        isRTL={isRTL}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile User Profile Section */}
              <footer className="p-4 bg-sidebar border-t border-sidebar-border">
                <div className="bg-sidebar-accent rounded-xl p-3 border border-sidebar-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sidebar-foreground font-medium text-sm">
                        {user?.name || (isRTL ? 'مستخدم' : 'User')}
                      </p>
                      <p className="text-sidebar-foreground/70 text-xs">
                        {userRole || (isRTL ? 'مستخدم' : 'User')}
                      </p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-sidebar-foreground/70 hover:text-red-600 transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                      aria-label={isRTL ? "تسجيل الخروج" : "Logout"}
                      title={isRTL ? "تسجيل الخروج" : "Logout"}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </footer>
            </aside>
          </div>
        )}
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="h-full" ref={sidebarRef}>
      {/* Sidebar Container */}
      <aside 
        className={`
          sidebar-transition 
          w-64 
          h-screen 
          shadow-2xl 
          relative 
          flex 
          
          flex-col
          bg-sidebar
          ${isRTL ? 'sidebar-right' : 'sidebar-left'}
          transition-all 
          duration-300 
          ease-in-out
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        
        {/* Logo Section */}
        <header className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1 transition-opacity duration-300">
              <h1 className="text-sidebar-foreground font-bold text-xl">
                {isRTL ? 'محمد بني هاشم' : 'Mohammed Bani Hashem'}
              </h1>
              <p className="text-sidebar-foreground/70 text-sm">
                {isRTL ? 'مكتب محاماة' : 'Law Office'}
              </p>
            </div>
          </div>
          
          {/* Theme Switcher */}
        
        </header>
        
        {/* Navigation Menu */}
        <nav className="flex-1  overflow-y-auto mt-6 px-4" role="menubar">
          <ul className="space-y-2" role="none">
            {menuItems.map((item) => (
              <li key={item.id} role="none" className='cursor-pointer '>
                <MenuItem
                  item={item}
                  activeItem={activeItem}
                  openSubmenus={openSubmenus}
                  onNavClick={handleNavClick}
                  onToggleSubmenu={toggleSubmenu}
                  isRTL={isRTL}
                />
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile Section */}
        <footer className="p-4 bg-sidebar border-t border-sidebar-border">
          <div className="bg-sidebar-accent rounded-xl p-3 border border-sidebar-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.employeeName ? user.employeeName.charAt(0) : 'U'}
              </div>
              <div className="flex-1 transition-opacity duration-300">
                <p className="text-sidebar-foreground font-medium text-sm">
                  {user?.employeeName || (isRTL ? 'مستخدم' : 'User')}
                </p>
                <p className="text-sidebar-foreground/70 text-xs">
                  {userRole || (isRTL ? 'مستخدم' : 'User')}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sidebar-foreground/70 hover:text-red-600 transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
                aria-label={isRTL ? "تسجيل الخروج" : "Logout"}
                title={isRTL ? "تسجيل الخروج" : "Logout"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </footer>
      </aside>
    </div>
  );
};

export default AppSidebar;