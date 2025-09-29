"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

const messages = {
  ar: arMessages,
  en: enMessages
};

export const useTranslations = (namespace = null) => {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = messages[language];

    // Navigate through nested keys
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found in current language
        translation = messages['en'];
        for (const fallbackKey of keys) {
          if (translation && typeof translation === 'object' && fallbackKey in translation) {
            translation = translation[fallbackKey];
          } else {
            return key; // Return key if not found in both languages
          }
        }
        break;
      }
    }

    // If translation is still an object, return the key
    if (typeof translation === 'object') {
      return key;
    }

    // Replace parameters in translation
    let result = translation || key;
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });

    return result;
  };

  // If namespace is provided, return a function that prefixes keys with namespace
  if (namespace) {
    return (key, params) => t(`${namespace}.${key}`, params);
  }

  return { t };
};
