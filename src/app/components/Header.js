'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NotificationMenu from '@/app/components/notifications/NotificationMenu'
import ExternalLinksMenu from '@/app/components/ExternalLinksMenu'
import SearchBar from '@/app/components/search'
import QuickActionsBar from '@/app/components/QuickActionsBar'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Desktop/Tablet Header Component
 * Responsive header optimized for medium to large screens
 */
function Header() {
  const { isRTL } = useLanguage();
  
  return (
    <>
      <header 
        className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="flex items-center justify-between gap-2 md:gap-4 px-3 md:px-6 py-2.5 md:py-3">
          {/* Left/Right Side: Action Buttons */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
            <ExternalLinksMenu />
            <NotificationMenu />
          </div>
          
          {/* Center: Search Bar - Responsive width */}
          <div className="flex-1 max-w-md lg:max-w-2xl mx-auto">
            <SearchBar />
          </div>
          
          {/* Right/Left Side: Theme and Language Switchers */}
          <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Quick Actions Bar - Below Header */}
      <QuickActionsBar />
    </>
  )
}

export default Header