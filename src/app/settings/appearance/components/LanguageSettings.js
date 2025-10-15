'use client';
import React from 'react';
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/hooks/useTranslations';

const LanguageSettings = () => {
  const { t } = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('settings.language')}
        </CardTitle>
        <CardDescription>
          {t('settings.languageDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>{t('settings.interfaceLanguage')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.interfaceLanguageDescription')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;