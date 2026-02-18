
'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import BookingsTab from "./BookingsTab"
import AboutTab from "./AboutTab";
import ContactTab from "./ContactTab";
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from "@/contexts/LanguageContext";


function Page() {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  return <div >
     <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="about" className="w-full">
      <TabsList>
        <TabsTrigger value="about">{t('website.aboutUsTab', 'من نحن')}</TabsTrigger>
        <TabsTrigger value="contact">{t('website.contactUsTab', 'اتصل بنا')}</TabsTrigger>
        <TabsTrigger value="bookings">{t('website.bookingsTab', 'الحجوزات')}</TabsTrigger>
      </TabsList>
      <AboutTab />
      <ContactTab />
      <BookingsTab />
    </Tabs>
  </div>
}

export default Page