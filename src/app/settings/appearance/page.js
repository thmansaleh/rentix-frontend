'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Palette, 
  Monitor,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/PageHeader';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const AppearanceSettingsPage = () => {
  const t = useTranslations();
  const { isRTL, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [appearanceSettings, setAppearanceSettings] = useState({
  });

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const themeOptions = [
    {
      value: 'light',
      label: t('theme.light'),
      icon: Sun,
      description: t('theme.lightDescription')
    },
    {
      value: 'dark',
      label: t('theme.dark'),
      icon: Moon,
      description: t('theme.darkDescription')
    },
    {
      value: 'blue',
      label: t('theme.blue'),
      icon: Monitor,
      description: t('theme.blueDescription')
    }
  ];

  const handleSettingChange = (setting, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const resetToDefaults = () => {
    setTheme('light');
    setLanguage('ar');
    setAppearanceSettings({
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('navigation.appearance')}
        description={t('settings.appearanceDescription')}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={resetToDefaults}
          >
            {t('settings.resetToDefaults')}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <BackIcon className="h-4 w-4" />
            {t('buttons.back')}
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t('settings.theme')}
            </CardTitle>
            <CardDescription>
              {t('settings.themeDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-center space-x-3 space-x-reverse">
                    <Button
                      variant={theme === option.value ? "default" : "outline"}
                      className="w-full justify-start gap-3"
                      onClick={() => handleThemeChange(option.value)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
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

            <Separator />

            <div className="space-y-2">
              <Label>{t('settings.dateFormat')}</Label>
              <Select defaultValue="arabic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">العربية (DD/MM/YYYY)</SelectItem>
                  <SelectItem value="english">English (MM/DD/YYYY)</SelectItem>
                  <SelectItem value="iso">ISO (YYYY-MM-DD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('settings.timeFormat')}</Label>
              <Select defaultValue="24">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">{t('settings.12hour')}</SelectItem>
                  <SelectItem value="24">{t('settings.24hour')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppearanceSettingsPage;
