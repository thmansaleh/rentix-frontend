'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Info, Phone, CalendarCheck, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPublicTenantSettings, validateTenant } from '@/app/services/api/tenantSettings'
import TenantNotFound from './TenantNotFound'

// Admin sub-routes under /website that should NOT use the public layout
const ADMIN_PREFIX = '/website/manage'

const navLinks = [
  { href: '/website/cars',     label: 'السيارات',    labelEn: 'Cars',     icon: Car },
  { href: '/website/bookings', label: 'احجز الآن',   labelEn: 'Book Now', icon: CalendarCheck },
  { href: '/website/about',    label: 'من نحن',      labelEn: 'About',    icon: Info },
  { href: '/website/contact',  label: 'تواصل معنا',  labelEn: 'Contact',  icon: Phone },
]

export default function WebsiteLayout({ children }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, isRTL } = useLanguage()
  const [companyInfo, setCompanyInfo] = useState(null)
  const [tenantValid, setTenantValid] = useState(null) // null = loading, true = valid, false = invalid

  // Check if we're on a subdomain
  const hasSubdomain = typeof window !== 'undefined' && window.location.hostname.split('.').length > 1

  useEffect(() => {
    // If no subdomain, tenant is invalid for the public website
    if (!hasSubdomain) {
      setTenantValid(false)
      return
    }

    // Validate tenant, then fetch settings
    validateTenant()
      .then((res) => {
        if (res?.valid) {
          setTenantValid(true)
          // Now fetch full tenant settings
          return getPublicTenantSettings()
        } else {
          setTenantValid(false)
        }
      })
      .then((res) => {
        if (res?.success && res?.data) setCompanyInfo(res.data)
      })
      .catch(() => {
        setTenantValid(false)
      })
  }, [hasSubdomain])

  const companyName = language === 'ar'
    ? (companyInfo?.company_name_ar || 'تأجير السيارات')
    : (companyInfo?.company_name_en || 'Car Rental')

  const logoUrl = companyInfo?.logo_url || ''

  // Admin routes under /website/manage use the normal admin layout — no public navbar
  if (pathname.startsWith(ADMIN_PREFIX)) {
    return <>{children}</>
  }

  // Still validating tenant
  if (tenantValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // Invalid or missing tenant — show error page
  if (!tenantValid) {
    return <TenantNotFound />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/website/cars" className="flex items-center gap-2 font-bold text-xl text-primary">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-8 w-8 rounded object-contain bg-background"
                />
              ) : (
                <Car className="h-6 w-6" />
              )}
              <span>{companyName}</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, labelEn, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {language === 'ar' ? label : labelEn}
                  </Link>
                )
              })}
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t bg-background px-4 pb-4 pt-2 space-y-1">
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
            {navLinks.map(({ href, label, labelEn, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {language === 'ar' ? label : labelEn}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          {language === 'ar'
            ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} — ${companyInfo?.company_name_ar || 'شركة تأجير السيارات'}`
            : `All rights reserved © ${new Date().getFullYear()} — ${companyInfo?.company_name_en || 'Car Rental Company'}`}
        </p>
      </footer>
    </div>
  )
}
