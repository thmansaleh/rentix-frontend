"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "@/app/components/navigation/AppSidebar";
import Header from "@/app/components/Header";

const ResponsiveLayout = ({ children }) => {
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`flex h-screen overflow-hidden`}>
      {/* Sidebar - will be on right for RTL, left for LTR due to flex-row-reverse */}
      <AppSidebar />
      
      {/* Main content area */}
      <main className={`flex-1 flex flex-col overflow-hidden ${isMobile ? 'pt-16' : ''}`}>
        {/* Only show Header on desktop, mobile nav is handled by AppSidebar */}
        {!isMobile && <Header />}
        
        <div className="flex-1 overflow-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveLayout;
