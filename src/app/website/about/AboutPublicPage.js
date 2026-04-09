'use client'

import React, { useEffect, useState } from 'react'
import { getPublicTenantSettings } from '@/app/services/api/tenantSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Target, Eye, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const getSections = (isRTL) => [
  {
    key: isRTL ? 'company_overview_ar' : 'company_overview_en',
    icon: Building2,
    title: isRTL ? 'نبذة عن الشركة' : 'Company Overview',
    gradient: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    border: 'border-primary/20',
  },
  {
    key: isRTL ? 'mission_ar' : 'mission_en',
    icon: Target,
    title: isRTL ? 'رسالتنا' : 'Our Mission',
    gradient: 'from-blue-50 to-blue-50/40 dark:from-blue-950/30 dark:to-blue-950/10',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  {
    key: isRTL ? 'vision_ar' : 'vision_en',
    icon: Eye,
    title: isRTL ? 'رؤيتنا' : 'Our Vision',
    gradient: 'from-emerald-50 to-emerald-50/40 dark:from-emerald-950/30 dark:to-emerald-950/10',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    key: isRTL ? 'values_ar' : 'values_en',
    icon: Heart,
    title: isRTL ? 'قيمنا' : 'Our Values',
    gradient: 'from-rose-50 to-rose-50/40 dark:from-rose-950/30 dark:to-rose-950/10',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
  },
]

function Section({ section, content }) {
  const { icon: Icon, title, gradient, iconBg, iconColor, border } = section
  if (!content) return null
  return (
    <div className={`rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-6 sm:p-8 transition-shadow hover:shadow-md`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`${iconBg} rounded-xl p-3 shrink-0`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h2 className={`text-xl font-bold ${iconColor}`}>{title}</h2>
      </div>
      <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap text-base">{content}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-muted/30 p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-6 w-36" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}

export default function AboutPublicPage() {
  const { isRTL } = useLanguage()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicTenantSettings()
      .then(res => { if (res.success) setData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sections = getSections(isRTL)
  const hasContent = sections.some(s => data?.[s.key])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 ring-8 ring-primary/5">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{isRTL ? 'من نحن' : 'About Us'}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {isRTL ? 'تعرف على شركتنا، رؤيتنا، رسالتنا، والقيم التي نؤمن بها' : 'Learn about our company, mission, vision, and values.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : !hasContent ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
              <Building2 className="h-12 w-12 opacity-30" />
            </div>
            <p className="text-xl font-medium">{isRTL ? 'المحتوى قيد الإعداد' : 'Content is being prepared'}</p>
            <p className="text-sm mt-2 opacity-70">{isRTL ? 'سنضيف المحتوى قريباً، تابعونا!' : 'We will add this content soon.'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map(s => (
              <Section key={s.key} section={s} content={data?.[s.key]} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
