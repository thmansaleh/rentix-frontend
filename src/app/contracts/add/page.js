'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MoneyTransactions from "./MoneyTransactions"
import Review from "./Review"
import VehicleImages from "./VehicleImages"
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from "@/contexts/LanguageContext"
import Info from "./Info"
import SubmitBtn from "./SubmitBtn"

function page() {
  const t = useTranslations('contracts.tabs');
    const { isRTL } = useLanguage();


  
  return <div className="p-4">
    <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="info" >
      <TabsList className='w-[800px] '>
        <TabsTrigger  value="info">{t('clientInfo')}</TabsTrigger>
        <TabsTrigger value="money">{t('money')}</TabsTrigger>
        <TabsTrigger value="vehicleImages">{t('vehicleImages')}</TabsTrigger>
        <TabsTrigger value="Review">{t('review')}</TabsTrigger>
      </TabsList>

      <TabsContent value="info"><Info/> </TabsContent>
      <TabsContent value="vehicleImages"><VehicleImages/> </TabsContent>
      <TabsContent value="money"><MoneyTransactions/> </TabsContent>
      <TabsContent value="Review"><Review/> </TabsContent>
    </Tabs>
    <SubmitBtn/>
  </div>
}

export default page