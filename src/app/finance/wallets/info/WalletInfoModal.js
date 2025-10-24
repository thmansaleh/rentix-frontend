"use client";

import { useEffect } from "react";
import { WalletDepositsTab } from "@/app/finance/wallets/info/WalletDepositsTab";
import { WalletExpensesTab } from "@/app/finance/wallets/info/WalletExpensesTab";
import { WalletTabTrigger } from "@/app/finance/wallets/WalletTabTrigger";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Receipt, X } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function WalletInfoModal({ isOpen, onClose, walletId, clientId, walletInfo }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-7xl min-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">معلومات المحفظة</h2>
              </div>
              {walletInfo && (
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    <strong>{t('wallets.walletId')}:</strong> {walletInfo.id}
                  </span>
                  <span>
                    <strong>{t('wallets.clientName')}:</strong> {walletInfo.client_name}
                  </span>
                  <span>
                    <strong>{t('wallets.balance')}:</strong> {formatAmount(walletInfo.balance, walletInfo.currency)}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs dir={isRTL ? 'rtl' : 'ltr'} defaultValue="deposits" className="w-full h-full">
              <TabsList className="w-full mb-4">
                <WalletTabTrigger value="deposits" translationKey="walletDeposits.depositsHistory" />
                <TabsTrigger value="expenses">المصروفات</TabsTrigger>
              </TabsList>

              <TabsContent value="deposits">
                <WalletDepositsTab 
                  walletId={walletId}
                  clientId={clientId}
                  walletInfo={walletInfo}
                  isOpen={isOpen}
                />
              </TabsContent>

              <TabsContent value="expenses">
                <WalletExpensesTab 
                  walletId={walletId}
                  clientId={clientId}
                  walletInfo={walletInfo}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
