import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { appConfig } from '@/lib/appConfig';

/**
 * Sidebar Header Component
 * Clean, compact design with logo and office name
 */
const SidebarHeader = ({ isRTL, isMobile, onClose }) => {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border/50">
      {/* Logo */}
      <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-sidebar-accent border border-sidebar-border/40 flex items-center justify-center">
        <Image
          height={32}
          width={32}
          src={appConfig.logo}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">
          {appConfig.name}
        </p>
        <p className="text-[11px] text-sidebar-foreground/50 truncate leading-tight">
          {isRTL ? appConfig.description.ar : appConfig.description.en}
        </p>
      </div>

      {/* Close Button — mobile only */}
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-150"
          aria-label={isRTL ? "إغلاق القائمة" : "Close Menu"}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </header>
  );
};

export default SidebarHeader;