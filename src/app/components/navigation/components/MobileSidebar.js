import React from 'react';
import { Menu, CircleX } from 'lucide-react';
import NavigationMenu from './NavigationMenu';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';

/**
 * Mobile Sidebar Component
 * Handles mobile navigation with overlay and slide-in menu
 */
const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  onToggle,
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
      {/* Mobile Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/log_in_card_logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-sidebar-foreground font-bold text-lg">
              LEXORA
            </h1>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors"
            aria-label={isRTL ? "فتح القائمة" : "Open Menu"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
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
      )}
    </div>
  );
};

export default MobileSidebar;
