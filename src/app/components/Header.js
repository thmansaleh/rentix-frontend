'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NotificationMenu from '@/app/components/notifications/NotificationMenu'
import ExternalLinksMenu from '@/app/components/ExternalLinksMenu'
import SearchBar from '@/app/components/search'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'
import { Calendar, CheckSquare, Files } from 'lucide-react'

/**
 * Desktop/Tablet Header Component
 * Responsive header optimized for medium to large screens
 */
function Header() {
  const { isRTL } = useLanguage();
  const router = useRouter();

  const quickActions = [
    { icon: Calendar, label: 'Sessions', path: '/cases/sessions' },
    { icon: CheckSquare, label: 'Approvals', path: '/approvals' },
    { icon: Files, label: 'Cases', path: '/cases' },
  ];
  
  return (
    <header 
      className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 md:gap-4 px-3 md:px-6 py-2.5 md:py-3">
        {/* Left/Right Side: Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2 lg:gap-3">
          <ExternalLinksMenu />
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => router.push(action.path)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={action.label}
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            );
          })}
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
  )
}

export default Header