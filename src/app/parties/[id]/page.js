'use client'
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import Info from "./components/Info"
import Cases from "./components/Cases"
import Files from "./components/Files"
import Orders from "./components/Orders"
import Meetings from "./components/Meetings"
import Deals from "./components/Deals"

function PartyDetailsPage() {
  const { id } = useParams()
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isRTL = language === 'ar'
  
  const tabs = [
    { label: t('partyTabs.info') || t('common.info') || 'معلومات', value: "info", Component: <Info partyId={id} /> },
    { label: t('partyTabs.cases') || t('common.cases') || 'القضايا', value: "cases", Component: <Cases partyId={id} /> },
    { label: t('partyTabs.files') || t('common.files') || 'الملفات', value: "files", Component: <Files partyId={id} /> },
    { label: t('partyTabs.orders') || t('common.orders') || 'الطلبات', value: "orders", Component: <Orders partyId={id} /> },
    { label: t('partyTabs.meetings') || t('common.meetings') || 'الاجتماعات', value: "meetings", Component: <Meetings partyId={id} /> },
    { label: t('partyTabs.deals') || t('common.deals') || 'الصفقات', value: "deals", Component: <Deals partyId={id} /> },
  ]

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="info" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <TabsList className="grid grid-cols-6 w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.Component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default PartyDetailsPage