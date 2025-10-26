import React from 'react';
import { LogOut } from 'lucide-react';

/**
 * Sidebar Footer Component
 * Displays user profile information and logout button
 */
const SidebarFooter = ({ user, userRole, isRTL, onLogout }) => {
  return (
    <footer className="p-4 bg-sidebar border-t border-sidebar-border">
      <div className="bg-sidebar-accent rounded-xl p-3 border border-sidebar-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {(user?.employeeName || user?.name) ? (user.employeeName || user.name).charAt(0) : 'U'}
          </div>
          <div className="flex-1 transition-opacity duration-300">
            <p className="text-sidebar-foreground font-medium text-sm">
              {user?.employeeName || user?.name || (isRTL ? 'مستخدم' : 'User')}
            </p>
            <p className="text-sidebar-foreground/70 text-xs">
              {userRole || (isRTL ? 'مستخدم' : 'User')}
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="text-sidebar-foreground/70 hover:text-red-600 transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label={isRTL ? "تسجيل الخروج" : "Logout"}
            title={isRTL ? "تسجيل الخروج" : "Logout"}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default SidebarFooter;
