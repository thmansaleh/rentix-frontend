"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { getWalletsByClientId } from "@/app/services/api/wallets";
import { WalletDepositsTab } from "@/app/finance/wallets/info/WalletDepositsTab";
import { WalletExpensesTab } from "@/app/finance/wallets/info/WalletExpensesTab";
import { OtherInvoicesTab } from "@/app/finance/clients/tabs/OtherInvoicesTab";
import { WalletDetailsTab } from "@/app/finance/clients/tabs/WalletDetailsTab";
import { AccountStatementTab } from "@/app/finance/clients/tabs/AccountStatementTab";
import { WalletTabTrigger } from "@/app/finance/wallets/WalletTabTrigger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, Wallet, Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function ClientInfoModal({ isOpen, onClose, client }) {
  const { t } = useTranslations();
  const { isRTL, language } = useLanguage();
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Fetch wallets for this client
  const { data: walletsData, error, isLoading, mutate } = useSWR(
    isOpen && client?.id ? `/wallets/client/${client.id}` : null,
    () => getWalletsByClientId(client.id),
    {
      revalidateOnFocus: false,
    }
  );

  const wallets = walletsData?.data || [];

  // Auto-select first wallet if available
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0]);
    }
  }, [wallets, selectedWallet]);

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
          className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] max-w-7xl min-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">
                  {language === 'ar' ? 'السجل المالي للموكل' : 'Client Wallet Information'}
                </h2>
              </div>
              {client && (
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    <strong>{language === 'ar' ? 'الموكل' : 'Client'}:</strong> {client.name}
                  </span>
                  {client.phone && (
                    <span>
                      <strong>{language === 'ar' ? 'الهاتف' : 'Phone'}:</strong> {client.phone}
                    </span>
                  )}
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
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {error && (
              <div className="text-center py-12 text-red-600">
                {language === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}
              </div>
            )}

            {!isLoading && !error && (
              <Tabs dir={isRTL ? 'rtl' : 'ltr'} defaultValue="wallet-details" className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="wallet-details">
                    {language === 'ar' ? 'تفاصيل المحفظة' : 'Wallet Details'}
                  </TabsTrigger>
                  <TabsTrigger value="account-statement">
                    {language === 'ar' ? 'كشف الحساب' : 'Account Statement'}
                  </TabsTrigger>
                  <WalletTabTrigger value="deposits" translationKey="walletDeposits.depositsHistory" />
                  <TabsTrigger value="expenses">
                    {language === 'ar' ? 'المصروفات' : 'Expenses'}
                  </TabsTrigger>
                  <TabsTrigger value="invoices">
                    {language === 'ar' ? 'الفواتير الاخرى' : 'Other Invoices'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet-details">
                  <WalletDetailsTab 
                    client={client}
                    isOpen={isOpen}
                    onWalletCreated={() => mutate()}
                  />
                </TabsContent>

                <TabsContent value="account-statement">
                  {selectedWallet ? (
                    <AccountStatementTab 
                      walletId={selectedWallet.id}
                      clientId={client.id}
                      walletInfo={selectedWallet}
                      isOpen={isOpen}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {language === 'ar' 
                        ? 'لا توجد محفظة لعرض كشف الحساب' 
                        : 'No wallet available to show account statement'}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="deposits">
                  {selectedWallet ? (
                    <WalletDepositsTab 
                      walletId={selectedWallet.id}
                      clientId={client.id}
                      walletInfo={selectedWallet}
                      isOpen={isOpen}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {language === 'ar' 
                        ? 'لا توجد محفظة لعرض الإيداعات' 
                        : 'No wallet available to show deposits'}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="expenses">
                  {selectedWallet ? (
                    <WalletExpensesTab 
                      walletId={selectedWallet.id}
                      clientId={client.id}
                      walletInfo={selectedWallet}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {language === 'ar' 
                        ? 'لا توجد محفظة لعرض المصروفات' 
                        : 'No wallet available to show expenses'}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="invoices">
                  <OtherInvoicesTab 
                    client={client}
                    isOpen={isOpen}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
