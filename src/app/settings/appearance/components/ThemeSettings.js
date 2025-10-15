'use client';
import React from 'react';
import { 
  Palette, 
  Sun,
  Moon,
  Gem,
  Check,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSettings = () => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const { theme, setTheme, themes } = useTheme();

  const getThemeIcon = (currentTheme) => {
    switch (currentTheme) {
      case themes.dark:
        return <Moon className="h-4 w-4" />;
      case themes.blue:
        return <Palette className="h-4 w-4" />;
      case themes.orangeGold:
        return <Gem className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (currentTheme) => {
    switch (currentTheme) {
      case themes.dark:
        return t("theme.dark");
      case themes.blue:
        return t("theme.blue");
      case themes.orangeGold:
        return t("theme.orangeGold");
      default:
        return t("theme.light");
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>{t('settings.currentTheme')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.themeDescription')}
            </p>
          </div>
          <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="relative cursor-pointer flex items-center gap-2 h-10 px-4 min-w-[180px] justify-between"
              >
                <div className="flex items-center gap-2">
                  {getThemeIcon(theme)}
                  <span className="text-sm">
                    {getThemeLabel(theme)}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuItem 
                onClick={() => handleThemeChange(themes.light)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Sun className="h-4 w-4" />
                <span className="flex-1">{t("theme.light")}</span>
                {theme === themes.light && <Check className="h-4 w-4 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleThemeChange(themes.dark)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Moon className="h-4 w-4" />
                <span className="flex-1">{t("theme.dark")}</span>
                {theme === themes.dark && <Check className="h-4 w-4 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleThemeChange(themes.blue)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Palette className="h-4 w-4" />
                <span className="flex-1">{t("theme.blue")}</span>
                {theme === themes.blue && <Check className="h-4 w-4 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleThemeChange(themes.orangeGold)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Gem className="h-4 w-4" />
                <span className="flex-1">{t("theme.orangeGold")}</span>
                {theme === themes.orangeGold && <Check className="h-4 w-4 text-blue-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;