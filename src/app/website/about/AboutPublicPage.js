'use client'

import React, { useEffect, useState } from 'react'
import { getCompanySettings } from '@/app/services/api/companySettings'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Target, Eye, Heart } from 'lucide-react'

function Section({ icon: Icon, iconColor, title, content }) {
  if (!content) return null
  return (
    <Card>
      <CardContent className="p-6">
        <div className={`flex items-center gap-2 mb-4 font-bold text-lg ${iconColor}`}>
          <Icon className="h-5 w-5" />
          {title}
        </div>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  )
}

export default function AboutPublicPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompanySettings()
      .then(res => { if (res.success) setData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <Building2 className="h-12 w-12 mx-auto text-primary mb-3" />
        <h1 className="text-4xl font-bold mb-2">من نحن</h1>
        <p className="text-muted-foreground">تعرف على شركتنا ورؤيتنا وقيمنا</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Section
            icon={Building2}
            iconColor="text-primary"
            title="نبذة عن الشركة"
            content={data?.company_overview_ar}
          />
          <Section
            icon={Target}
            iconColor="text-blue-600"
            title="رسالتنا"
            content={data?.mission_ar}
          />
          <Section
            icon={Eye}
            iconColor="text-green-600"
            title="رؤيتنا"
            content={data?.vision_ar}
          />
          <Section
            icon={Heart}
            iconColor="text-red-600"
            title="قيمنا"
            content={data?.values_ar}
          />
          {!data?.company_overview_ar && !data?.mission_ar && !data?.vision_ar && (
            <div className="text-center py-16 text-muted-foreground">
              <Building2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">المحتوى قيد الإعداد</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
