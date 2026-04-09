'use client'

import { Car, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TenantNotFound() {
  const { language, isRTL } = useLanguage()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === 'ar'
              ? 'عذراً، الرابط الذي أدخلته غير صالح .'
              : 'Sorry, the link you entered is invalid .'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Car className="h-4 w-4" />
          <span>
            {language === 'ar'
              ? 'تأكد من صحة الرابط وحاول مرة أخرى'
              : 'Please verify the URL and try again'}
          </span>
        </div>
      </div>
    </div>
  )
}
