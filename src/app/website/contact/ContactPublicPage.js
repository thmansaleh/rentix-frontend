'use client'

import React, { useEffect, useState } from 'react'
import { getContactData } from '@/app/services/api/contact'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram, Twitter, Linkedin,
  Youtube, MessageSquare, Globe, ExternalLink
} from 'lucide-react'

const socialConfig = {
  facebook:  { Icon: Facebook,      color: 'text-blue-600',   bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60',   border: 'border-blue-200 dark:border-blue-800' },
  instagram: { Icon: Instagram,     color: 'text-pink-600',   bg: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/60',   border: 'border-pink-200 dark:border-pink-800' },
  twitter:   { Icon: Twitter,       color: 'text-sky-500',    bg: 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60',       border: 'border-sky-200 dark:border-sky-800' },
  linkedin:  { Icon: Linkedin,      color: 'text-blue-700',   bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60',   border: 'border-blue-200 dark:border-blue-800' },
  youtube:   { Icon: Youtube,       color: 'text-red-600',    bg: 'bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60',       border: 'border-red-200 dark:border-red-800' },
  whatsapp:  { Icon: MessageSquare, color: 'text-green-600',  bg: 'bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:hover:bg-green-900/60', border: 'border-green-200 dark:border-green-800' },
  website:   { Icon: Globe,         color: 'text-gray-600',   bg: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-700/60',   border: 'border-gray-200 dark:border-gray-700' },
}

function InfoCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${iconBg} rounded-xl p-3 shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export default function ContactPublicPage() {
  const { isRTL } = useLanguage()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContactData()
      .then(res => { if (res.success) setData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const phones       = data?.phones       || []
  const emails       = data?.emails       || []
  const addresses    = data?.addresses    || []
  const workingHours = data?.workingHours || []
  const socials      = data?.socials      || []

  const hasContent = phones.length || emails.length || addresses.length || workingHours.length || socials.length

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 ring-8 ring-primary/5">
            <Phone className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{isRTL ? 'تواصل معنا' : 'Contact Us'}</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {isRTL ? 'نحن هنا لمساعدتك — تواصل معنا عبر أي قناة تناسبك' : 'We are here to help. Reach us through any channel you prefer.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : !hasContent ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
              <Phone className="h-12 w-12 opacity-30" />
            </div>
            <p className="text-xl font-medium">{isRTL ? 'معلومات الاتصال قيد الإعداد' : 'Contact information is being prepared'}</p>
            <p className="text-sm mt-2 opacity-70">{isRTL ? 'سنضيف معلومات التواصل قريباً' : 'We will add contact details soon'}</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Phones */}
              {phones.length > 0 && (
                <InfoCard
                  icon={Phone}
                  iconBg="bg-green-100 dark:bg-green-900/40"
                  iconColor="text-green-600 dark:text-green-400"
                  title={isRTL ? 'أرقام الهاتف' : 'Phone Numbers'}
                >
                  <div className="space-y-2">
                    {phones.map((p, i) => (
                      <a
                        key={i}
                        href={`tel:${p.phone}`}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        {p.phone}
                      </a>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Emails */}
              {emails.length > 0 && (
                <InfoCard
                  icon={Mail}
                  iconBg="bg-blue-100 dark:bg-blue-900/40"
                  iconColor="text-blue-600 dark:text-blue-400"
                  title={isRTL ? 'البريد الإلكتروني' : 'Email'}
                >
                  <div className="space-y-2">
                    {emails.map((e, i) => (
                      <a
                        key={i}
                        href={`mailto:${e.email}`}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2 transition-colors break-all"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {e.email}
                      </a>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Working Hours */}
              {workingHours.length > 0 && (
                <InfoCard
                  icon={Clock}
                  iconBg="bg-purple-100 dark:bg-purple-900/40"
                  iconColor="text-purple-600 dark:text-purple-400"
                  title={isRTL ? 'أوقات العمل' : 'Working Hours'}
                >
                  <div className="space-y-2">
                    {workingHours.map((w, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{w.day}</span>
                        <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full text-xs">{w.hours}</span>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Social Media */}
              {socials.length > 0 && (
                <InfoCard
                  icon={Globe}
                  iconBg="bg-gray-100 dark:bg-gray-800/40"
                  iconColor="text-gray-600 dark:text-gray-400"
                  title={isRTL ? 'التواصل الاجتماعي' : 'Social Media'}
                >
                  <div className="flex flex-wrap gap-2">
                    {socials.map((s, i) => {
                      const cfg = socialConfig[s.platform] || socialConfig.website
                      const { Icon, color, bg, border } = cfg
                      const url = s.url?.startsWith('http') ? s.url : `https://${s.url}`
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${bg} ${border} ${color} text-xs font-medium transition-colors`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </a>
                      )
                    })}
                  </div>
                </InfoCard>
              )}
            </div>

            {/* Addresses – full width */}
            {addresses.length > 0 && (
              <InfoCard
                icon={MapPin}
                iconBg="bg-rose-100 dark:bg-rose-900/40"
                iconColor="text-rose-600 dark:text-rose-400"
                title={isRTL ? 'عناويننا' : 'Our Addresses'}
              >
                <div className="grid gap-3 sm:grid-cols-2 mt-1">
                  {addresses.map((a, i) => (
                    <div key={i} className="rounded-xl border bg-muted/40 p-4 space-y-1">
                      {a.title    && <p className="font-semibold text-sm">{a.title}</p>}
                      {a.address  && <p className="text-sm text-muted-foreground">{a.address}</p>}
                      {(a.city || a.country) && (
                        <p className="text-xs text-muted-foreground">
                          {[a.city, a.country].filter(Boolean).join(isRTL ? '، ' : ', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
