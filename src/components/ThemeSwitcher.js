"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Palette, Check, Gem } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const { isRTL } = useLanguage();
  const { t } = useTranslations();

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

  return (
    <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative cursor-pointer flex items-center gap-2 h-9 px-3"
        >
          {getThemeIcon(theme)}
          <span className="hidden sm:inline-block text-sm">
            {getThemeLabel(theme)}
          </span>
          <span className="sr-only">{t("theme.switchTheme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem 
          onClick={() => setTheme(themes.light)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <span className="flex-1">{t("theme.light")}</span>
          {theme === themes.light && <Check className="h-4 w-4 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.dark)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <span className="flex-1">{t("theme.dark")}</span>
          {theme === themes.dark && <Check className="h-4 w-4 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.blue)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Palette className="h-4 w-4" />
          <span className="flex-1">{t("theme.blue")}</span>
          {theme === themes.blue && <Check className="h-4 w-4 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(themes.orangeGold)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Gem className="h-4 w-4" />
          <span className="flex-1">{t("theme.orangeGold")}</span>
          {theme === themes.orangeGold && <Check className="h-4 w-4 text-blue-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
