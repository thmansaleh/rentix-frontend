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
import { useTranslations } from '@/hooks/useTranslations'

/**
 * Desktop/Tablet Header Component
 * Responsive header optimized for medium to large screens
 */
function Header() {
  const { isRTL } = useLanguage();
  const router = useRouter();
  const t = useTranslations('navigation');
  
  const quickActions = [
    { icon: Calendar, label: t('sessions'), path: '/cases/sessions' },
    { icon: CheckSquare, label: t('tasks'), path: '/cases/my-tasks' },
    { icon: Files, label: t('cases'), path: '/cases' },
  ];
  
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
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 px-3 md:px-6 py-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => router.push(action.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors group cursor-pointer"
                title={action.label}
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  )
}

export default Header