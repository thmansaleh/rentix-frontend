'use client'

import React, { useEffect, useState } from 'react'
import { getContactData } from '@/app/services/api/contact'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram, Twitter, Linkedin,
  Youtube, MessageSquare, Globe, ExternalLink
} from 'lucide-react'

const socialIcons = {
  facebook:  { Icon: Facebook,    color: 'text-blue-600' },
  instagram: { Icon: Instagram,   color: 'text-pink-600' },
  twitter:   { Icon: Twitter,     color: 'text-blue-400' },
  linkedin:  { Icon: Linkedin,    color: 'text-blue-700' },
  youtube:   { Icon: Youtube,     color: 'text-red-600' },
  whatsapp:  { Icon: MessageSquare, color: 'text-green-600' },
  website:   { Icon: Globe,       color: 'text-gray-600' },
}

export default function ContactPublicPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContactData()
      .then(res => { if (res.success) setData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-48 mx-auto" />
        {[1, 2, 3].map(i => (
          <Card key={i}><CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent></Card>
        ))}
      </div>
    )
  }

  const phones        = data?.phones || []
  const emails        = data?.emails || []
  const addresses     = data?.addresses || []
  const workingHours  = data?.workingHours || []
  const socials       = data?.socials || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <Phone className="h-12 w-12 mx-auto text-primary mb-3" />
        <h1 className="text-4xl font-bold mb-2">تواصل معنا</h1>
        <p className="text-muted-foreground">نحن هنا لمساعدتك</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Phones */}
        {phones.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-5 w-5 text-green-600" />
                أرقام الهاتف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {phones.map((p, i) => (
                <a
                  key={i}
                  href={`tel:${p.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {p.phone}
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Emails */}
        {emails.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5 text-blue-600" />
                البريد الإلكتروني
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {emails.map((e, i) => (
                <a
                  key={i}
                  href={`mailto:${e.email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {e.email}
                </a>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Working Hours */}
        {workingHours.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-purple-600" />
                أوقات العمل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workingHours.map((w, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="font-medium">{w.day}</span>
                  <span className="text-muted-foreground">{w.hours}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Social Media */}
        {socials.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5 text-gray-600" />
                التواصل الاجتماعي
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {socials.map((s, i) => {
                const entry = socialIcons[s.platform] || { Icon: Globe, color: 'text-gray-600' }
                const { Icon, color } = entry
                const url = s.url.startsWith('http') ? s.url : `https://${s.url}`
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors text-sm font-medium ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                    {s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Addresses */}
        {addresses.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-red-600" />
                عناويننا
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {addresses.map((a, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-1">
                  {a.title && <p className="font-semibold">{a.title}</p>}
                  {a.address && <p className="text-sm text-muted-foreground">{a.address}</p>}
                  {(a.city || a.country) && (
                    <p className="text-sm text-muted-foreground">
                      {[a.city, a.country].filter(Boolean).join('، ')}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {!phones.length && !emails.length && !addresses.length && (
          <div className="md:col-span-2 text-center py-16 text-muted-foreground">
            <Phone className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">معلومات الاتصال قيد الإعداد</p>
          </div>
        )}
      </div>
    </div>
  )
}
