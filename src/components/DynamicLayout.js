"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const DynamicLayout = ({ children }) => {
  const { language, isRTL, isLoading } = useLanguage();

  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    const body = document.body;
    
    root.setAttribute("lang", language);
    
    const direction = isRTL ? "rtl" : "ltr";
    root.setAttribute("dir", direction);
    body.setAttribute("dir", direction);
    
    root.classList.remove("rtl", "ltr");
    root.classList.add(direction);
    
  }, [language, isRTL, isLoading]);

  return <>{children}</>;
};

export default DynamicLayout;
