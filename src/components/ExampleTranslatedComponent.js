"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const ExampleTranslatedComponent = () => {
  const t = useTranslations();
  const tNav = useTranslations('navigation');
  const tButtons = useTranslations('buttons');
  const { isRTL } = useLanguage();

  return (
    <div className={`p-6 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <h2 className="text-2xl font-bold">
        {t('navigation.dashboard')}
      </h2>
      
      <div className="space-y-2">
        <p>{tNav('cars')}</p>
        <p>{tNav('clients')}</p>
        <p>{tNav('contracts')}</p>
        <p>{tNav('payments')}</p>
      </div>

      <div className="flex gap-2">
        <Button>{tButtons('save')}</Button>
        <Button variant="outline">{tButtons('cancel')}</Button>
        <Button variant="destructive">{tButtons('delete')}</Button>
      </div>
    </div>
  );
};

export default ExampleTranslatedComponent;
