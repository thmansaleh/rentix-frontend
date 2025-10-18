import ThemeSwitcher from '@/components/ThemeSwitcher'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NotificationMenu from '@/app/components/notifications/NotificationMenu'
import ExternalLinksMenu from '@/app/components/ExternalLinksMenu'
import AppLinkSearch from '@/app/components/AppLinkSearch'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function Header() {
    const { isRTL } = useLanguage();
  
  return (
    <header 
      className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Left/Right Side: Action Icons (position depends on language) */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <ExternalLinksMenu />
          <NotificationMenu />
        </div>
        
        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <AppLinkSearch />
        </div>
        
        {/* Right/Left Side: Placeholder for balance (optional - can add user menu, etc.) */}
        <div className="w-[180px]">
          {/* This maintains symmetry - you can add user profile menu here if needed */}
        </div>
      </div>
    </header>
  )
}

export default Header