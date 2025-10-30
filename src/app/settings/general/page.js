'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Building2, FileText, Save } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import InfoTab from './InfoTab';
import Condiations from './Condiations';

const GeneralSettingsPage = () => {
  const { isRTL } = useLanguage();
  const t = useTranslations('navigation');
  const router = useRouter();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const [company, setCompany] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [terms, setTerms] = useState({ ar: '', en: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 800));
      // console.log('Saved', { company, terms });
      alert('تم الحفظ');
    } catch (e) {

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="الإعدادات العامة"
        description="معلومات الشركة والشروط والأحكام"
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <BackIcon className="h-4 w-4" />
          العودة
        </Button>
      </PageHeader>

      <Tabs dir={isRTL ? 'rtl' : 'ltr'} defaultValue="info">
        <TabsList className="w-full max-w-lg">
          <TabsTrigger value="info">{t('companyInfo')}</TabsTrigger>
          <TabsTrigger value="condiations">{t('termsAndConditions')}</TabsTrigger>
        </TabsList>
<InfoTab/>
<Condiations/>
     
      </Tabs>
    </div>
  );
};

export default GeneralSettingsPage;
