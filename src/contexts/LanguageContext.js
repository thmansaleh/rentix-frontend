"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";

const LanguageContext = createContext();

export const languages = {
  ar: "ar",
  en: "en"
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(languages.ar);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage on component mount
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && Object.values(languages).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Apply language and direction to document
    const root = document.documentElement;
    const body = document.body;
    
    // Set language attribute
    root.setAttribute("lang", language);
    
    // Set direction
    const direction = language === languages.ar ? "rtl" : "ltr";
    root.setAttribute("dir", direction);
    body.setAttribute("dir", direction);
    
    // Update document classes for styling
    root.classList.remove("rtl", "ltr");
    root.classList.add(direction);
    
    // Save language to localStorage
    localStorage.setItem("language", language);

    // Set header for i18n
    document.cookie = `NEXT_LOCALE=${language}; path=/; max-age=31536000`;
    
  }, [language, isLoading]);

  const switchLanguage = () => {
    const newLanguage = language === languages.ar ? languages.en : languages.ar;
    setLanguage(newLanguage);
    
    // Refresh the page to apply new language
    // window.location.reload();
    // router.refresh();
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case languages.en:
        return "English";
      case languages.ar:
        return "العربية";
      default:
        return "العربية";
    }
  };

  const getLanguageDirection = (lang) => {
    return lang === languages.ar ? "rtl" : "ltr";
  };

  const isRTL = language === languages.ar;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        switchLanguage,
        languages,
        getLanguageLabel,
        getLanguageDirection,
        isRTL,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
