'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Info, Phone, CalendarCheck, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

  // Admin routes under /website/manage use the normal admin layout — no public navbar
  if (pathname.startsWith(ADMIN_PREFIX)) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/website/cars" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Car className="h-6 w-6" />
              <span>تأجير السيارات</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
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
                    {label}
                  </Link>
                )
              })}
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
            {navLinks.map(({ href, label, icon: Icon }) => {
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
                  {label}
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
        <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} — شركة تأجير السيارات</p>
      </footer>
    </div>
  )
}
