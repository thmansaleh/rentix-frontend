import React from 'react';
import { Scale } from 'lucide-react';

/**
 * Sidebar Header Component
 * Displays the logo and office name
 */
const SidebarHeader = ({ isRTL }) => {
  return (
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
    </header>
  );
};

export default SidebarHeader;
