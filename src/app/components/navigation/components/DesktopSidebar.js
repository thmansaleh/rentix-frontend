import React from 'react';
import SidebarHeader from './SidebarHeader';
import NavigationMenu from './NavigationMenu';
import SidebarFooter from './SidebarFooter';

/**
 * Desktop Sidebar Component
 * Handles desktop navigation sidebar
 */
const DesktopSidebar = ({ 
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
        <SidebarHeader isRTL={isRTL} />
        
        {/* Navigation Menu */}
        <NavigationMenu 
          menuItems={menuItems}
          activeItem={activeItem}
          openSubmenus={openSubmenus}
          onNavClick={onNavClick}
          onToggleSubmenu={onToggleSubmenu}
          isRTL={isRTL}
        />
        
        {/* User Profile Section */}
        <SidebarFooter 
          user={user}
          userRole={userRole}
          isRTL={isRTL}
          onLogout={onLogout}
        />
      </aside>
    </div>
  );
};

export default DesktopSidebar;
