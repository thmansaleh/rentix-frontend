"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const DynamicLayout = ({ children }) => {
  const { language, isRTL, isLoading } = useLanguage();

  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    const body = document.body;
    
    // Set language attribute
    root.setAttribute("lang", language);
    
    // Set direction
    const direction = isRTL ? "rtl" : "ltr";
    root.setAttribute("dir", direction);
    body.setAttribute("dir", direction);
    
    // Update document classes for styling
    root.classList.remove("rtl", "ltr");
    root.classList.add(direction);
    
  }, [language, isRTL, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DynamicLayout;
