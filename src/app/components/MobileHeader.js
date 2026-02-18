'use client';

import React, { useState } from 'react';
import { Menu, Search, Bell, Globe, Sun, Moon } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import NotificationMenu from '@/app/components/notifications/NotificationMenu';
import ExternalLinksMenu from '@/app/components/ExternalLinksMenu';
import SearchBar from '@/app/components/search';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { appConfig } from '@/lib/appConfig';

/**
 * Mobile Header Component
 * Optimized header for mobile devices with collapsible search
 */
const MobileHeader = ({ onMenuToggle }) => {
  const { isRTL } = useLanguage();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        {/* Menu Button */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={isRTL ? "فتح القائمة" : "Open Menu"}
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Logo/Title */}
        <div className="flex items-center gap-2 flex-1">
          <img src={appConfig.logo} alt="Logo" className="w-7 h-7 object-cover" />
          <h1 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg">
            {appConfig.name}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Search Toggle Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isRTL ? "بحث" : "Search"}
          >
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Notifications - Only icon on mobile */}
          <NotificationMenu />

          {/* External Links */}
          <ExternalLinksMenu />

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>

      {/* Expandable Search Bar */}
      {showSearch && (
        <div className="px-3 pb-2 animate-in slide-in-from-top-2">
          <SearchBar 
            onSelect={() => setShowSearch(false)} 
            autoFocus={true}
          />
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
