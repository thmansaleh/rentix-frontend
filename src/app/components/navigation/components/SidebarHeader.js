import React from 'react';
import Image from 'next/image';
import { CircleX } from 'lucide-react';

/**
 * Sidebar Header Component
 * Displays the logo and office name
 */
const SidebarHeader = ({ isRTL, isMobile, onClose }) => {
  return (
    <header className="p-6 border-b border-sidebar-border">
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-xl flex items-center justify-center">
          <Image height='60' width='60' src="/log_in_card_logo.png" alt="Law Office Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 transition-opacity duration-300">
          <h1 className="text-sidebar-foreground font-bold text-xl">
            {isRTL ? 'LEXORA' : 'LEXORA'}
          </h1>
          
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            aria-label={isRTL ? "إغلاق القائمة" : "Close Menu"}
          >
            <CircleX className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default SidebarHeader;
