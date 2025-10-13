"use client"

import React, { useState } from 'react'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import OfficesTab from './OfficesTab'
import ResourcesTab from './ResourcesTab'
import { getAssets } from '@/app/services/api/assets'

function AssetsPage() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [activeTab, setActiveTab] = useState('offices')

  // Fetch assets data
  const { data: assetsData, error, mutate, isLoading } = useSWR(
    'assets',
    getAssets
  )

  const assets = assetsData?.data || []
  
  // Filter assets by record_type
  const officeAssets = assets.filter(asset => asset.record_type === 'office')
  const resourceAssets = assets.filter(asset => asset.record_type === 'resource')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data'}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isArabic ? 'الأصول' : 'Assets'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs dir={isArabic ? 'rtl' : 'ltr'} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="offices">
              {isArabic ? 'المكاتب' : 'Offices'}
            </TabsTrigger>
            <TabsTrigger value="resources">
              {isArabic ? 'الموارد' : 'Resources'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offices">
            <OfficesTab offices={officeAssets} onMutate={mutate} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesTab resources={resourceAssets} onMutate={mutate} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AssetsPage
