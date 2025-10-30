'use client';

import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import Deals from './deals/Deals'
import Parties from './Parties'
import Orders from './orders/Orders';

function Page() {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  
  return <Tabs defaultValue="parties" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
    <TabsList>
      <TabsTrigger value="parties">{t('partiesPage.title')}</TabsTrigger>
      <TabsTrigger value="deals">{t('dealsPage.title')}</TabsTrigger>
      <TabsTrigger value="orders">{t('navigation.clientOrders')}</TabsTrigger>
    </TabsList>
    <TabsContent value="parties">
      <Parties />
    </TabsContent>
    <TabsContent value="deals">
      <Deals />
    </TabsContent>
    <TabsContent value="orders">
      <Orders />
    </TabsContent>
  </Tabs>
}

export default Page