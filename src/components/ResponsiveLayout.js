"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "@/app/components/navigation/AppSidebar";
import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const ResponsiveLayout = ({ children }) => {
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const { isAuth } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if we're on the login page
  const isLoginPage = pathname === '/login';

  // Don't show sidebar and header if not authenticated or on login page
  const showLayout = isAuth && !isLoginPage;

  // Prevent hydration mismatch by using consistent initial render
  if (!isClient) {
    return (
      <div className="flex h-screen overflow-hidden">
        {children}
      </div>
    );
  }

  // If not authenticated or on login page, just render children without layout
  if (!showLayout) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        {children}
      </div>
    );
  }

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
