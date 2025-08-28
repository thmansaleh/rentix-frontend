import ThemeSwitcher from '@/components/ThemeSwitcher'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NotificationMenu from '@/components/NotificationMenu'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

function Header() {
    const { isRTL } = useLanguage();
  
  return (
    <div dir={isRTL ? "ltr" : "rtl"}  className="flex sticky top-0 z-100  dark:bg-black  light:bg-gray-50  items-center border-b mb-4 p-2 ">
      <div  className="flex  items-center gap-4 ">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <NotificationMenu />
      </div>
    
    </div>
  )
}

export default Header