"use client";

import useSWR from 'swr';
import { getWalletsByClientId } from "@/app/services/api/wallets";
import { WalletDepositsTab } from "@/app/finance/wallets/info/WalletDepositsTab";
import { useLanguage } from "@/contexts/LanguageContext";

export function ClientDepositsTab({ client, isOpen }) {
  const { language } = useLanguage();

  // Fetch wallet info only when this tab is active
  const { data: walletData, error, isLoading } = useSWR(
    isOpen && client ? `/wallets/client/${client.id}` : null,
    () => getWalletsByClientId(client.id),
    {
      revalidateOnFocus: false,
      onError: (err) => {
        if (err.response?.status === 404) {
          return null;
        }
      }
    }
  );

  // API returns { success: true, data: [wallet] }, get the first wallet from the array
  const walletInfo = walletData?.data?.[0] || null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {language === 'ar' ? 'جاري تحميل بيانات المحفظة...' : 'Loading wallet data...'}
        </span>
      </div>
    );
  }

  // If no wallet exists, show a message
  if (!walletInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          لم يتم إنشاء محفظة لهذا الموكل بعد
        </p>
      </div>
    );
  }

  // Reuse the existing WalletDepositsTab component
  return (
    <WalletDepositsTab
      walletId={walletInfo.id}
      clientId={client.id}
      walletInfo={walletInfo}
      isOpen={isOpen}
    />
  );
}
