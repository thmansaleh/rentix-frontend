import React from 'react';
import NavigationMenu from './NavigationMenu';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';

/**
 * Mobile Sidebar Component
 * Handles mobile navigation with overlay and slide-in menu
 * Header is now handled by MobileHeader component in ResponsiveLayout
 */
const MobileSidebar = ({ 
  isOpen, 
  onClose,
  menuItems,
  activeItem,
  openSubmenus,
  onNavClick,
  onToggleSubmenu,
  user,
  userRole,
  onLogout,
  isRTL,
  sidebarRef
}) => {
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Overlay — always rendered so the fade-out transition plays */}
      <div
        className={`
          fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      >
        {/* Mobile Sidebar */}
        <aside 
          className={`
            fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0
            w-80 max-w-[85vw]
            bg-sidebar
            shadow-2xl
            transform transition-transform duration-300 ease-in-out
            flex flex-col
            ${isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
          `}
          onClick={(e) => e.stopPropagation()}
          ref={sidebarRef}
          role="dialog"
          aria-modal="true"
          aria-label={isRTL ? "القائمة الجانبية" : "Navigation menu"}
        >
          {/* Mobile Sidebar Header */}
          <SidebarHeader isRTL={isRTL} isMobile={true} onClose={onClose} />

          {/* Mobile Navigation Menu */}
          <NavigationMenu 
            menuItems={menuItems}
            activeItem={activeItem}
            openSubmenus={openSubmenus}
            onNavClick={onNavClick}
            onToggleSubmenu={onToggleSubmenu}
            isRTL={isRTL}
          />

          {/* Mobile User Profile Section */}
          <SidebarFooter 
            user={user}
            userRole={userRole}
            isRTL={isRTL}
            onLogout={onLogout}
          />
        </aside>
      </div>
    </div>
  );
};

export default MobileSidebar;
