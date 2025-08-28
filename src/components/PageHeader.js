"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const PageHeader = ({ title, description, children }) => {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`mb-8 flex justify-between items-start select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
        {children}
      <div className="flex items-center gap-4">
        {/* <ThemeSwitcher /> */}
      </div>
    </div>
  );
};

export default PageHeader;
