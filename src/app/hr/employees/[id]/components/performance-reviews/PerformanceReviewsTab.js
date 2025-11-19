import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Reviews from './Reviews'
import Training from './Training'
import Warnings from './Warnings'
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslations } from "@/hooks/useTranslations"

function PerformanceReviewsTab({employeeId}) {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();

  return <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="reviews" className="w-full mt-4">
    <TabsList
      className="bg-white dark:bg-gray-800 rounded-none shadow-none border-b border-b-blue-400 dark:border-b-blue-600 p-1 flex flex-wrap gap-1">
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:text-gray-300 px-3 py-1 text-sm font-medium transition"
       value="reviews">{t('employees.performanceReviewsTabs.reviews')}</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:text-gray-300 px-3 py-1 text-sm font-medium transition"
       value="training">{t('employees.performanceReviewsTabs.training')}</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:text-gray-300 px-3 py-1 text-sm font-medium transition"
       value="warnings">{t('employees.performanceReviewsTabs.warnings')}</TabsTrigger>
       </TabsList>
       

    <TabsContent value="reviews">
      <Reviews employeeId={employeeId} />
    </TabsContent>

    <TabsContent value="training">
      <Training employeeId={employeeId} />
    </TabsContent>
    <TabsContent value="warnings">
      <Warnings employeeId={employeeId} />
    </TabsContent>
  </Tabs> 
}

export default PerformanceReviewsTab