"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check, Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage, languages, getLanguageLabel, isRTL } = useLanguage();

  const getLanguageIcon = (currentLanguage) => {
    return <Globe className="h-4 w-4" />;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Refresh the page to apply new language and direction
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative cursor-pointer flex items-center gap-2 h-9 px-3"
        >
          {getLanguageIcon(language)}
          <span className="hidden sm:inline-block text-sm">
            {getLanguageLabel(language)}
          </span>
          <span className="sr-only">
            {isRTL ? "تبديل اللغة" : "Switch Language"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange(languages.ar)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Globe className="h-4 w-4" />
          <span className="flex-1">العربية</span>
          {language === languages.ar && <Check className="h-4 w-4 " />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange(languages.en)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Globe className="h-4 w-4" />
          <span className="flex-1">English</span>
          {language === languages.en && <Check className="h-4 w-4 " />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
