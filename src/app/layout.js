'use client';

import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import SWRProvider from "@/providers/SWRProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Noto_Sans_Arabic } from 'next/font/google';
import RouteGuard from "@/components/RouteGuard";
import Script from 'next/script';
import DynamicLayout from "@/components/DynamicLayout";
import NavigationProgressBar from "@/components/NavigationProgressBar";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-arabic',
});

export default function RootLayout({ children }) {
  
  
  return (
    <html 
    className={`${notoSansArabic.className} ${notoSansArabic.variable}`}
    >
      <body
        className="font-system-arabic antialiased"
      >
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" 
          strategy="lazyOnload"
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" 
          strategy="lazyOnload"
        />
        <NavigationProgressBar />
        <LanguageProvider>
          <ThemeProvider>
            <SWRProvider>
              <ReduxProvider>
                <AuthProvider>
                  <RouteGuard>
                    <DynamicLayout>
                      <ResponsiveLayout>
                        {children}
                      </ResponsiveLayout>
                    </DynamicLayout>
                  </RouteGuard>
                </AuthProvider>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={true}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                  style={{ zIndex: 9999 }}
                />
              </ReduxProvider>
            </SWRProvider>
          </ThemeProvider>
        </LanguageProvider>
   
      </body>
    </html>
  );
}
