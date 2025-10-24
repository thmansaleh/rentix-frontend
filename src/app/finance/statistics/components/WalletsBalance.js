'use client';

import React from 'react';
import useSWR from 'swr';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Loader2, TrendingUp, Users } from 'lucide-react';
import { getWallets, getWalletStats } from '@/app/services/api/wallets';

const WalletsBalance = () => {
  const { isRTL, language } = useLanguage();
  
  // Fetch wallet stats
  const { data: statsData, isLoading: statsLoading } = useSWR(
    '/wallets-stats',
    getWalletStats,
    { refreshInterval: 300000 }
  );

  // Fetch wallets list
  const { data: walletsData, isLoading: walletsLoading } = useSWR(
    ['/wallets-list', { page: 1, limit: 100 }],
    ([url, params]) => getWallets(params),
    { refreshInterval: 300000 }
  );

  const stats = React.useMemo(() => {
    if (!statsData?.success || !statsData?.data) return null;
    return statsData.data;
  }, [statsData]);

  const wallets = React.useMemo(() => {
    if (!walletsData?.success || !walletsData?.data) return [];
    return walletsData.data;
  }, [walletsData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount || 0);
  };

  const isLoading = statsLoading || walletsLoading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Wallets */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ar' ? 'إجمالي المحافظ' : 'Total Wallets'}
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.total_wallets || wallets.length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Wallets */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : (
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ar' ? 'المحافظ النشطة' : 'Active Wallets'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.active_wallets || 
                     wallets.filter(w => w.status === 'active').length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Balance */}
      {/* <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ar' ? 'الرصيد الإجمالي' : 'Total Balance'}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(stats?.total_balance || 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}

      {/* Unique Clients */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            </div>
          ) : (
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ar' ? 'عدد الموكلين' : 'Unique Clients'}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats?.unique_clients || 
                     new Set(wallets.map(w => w.client_id)).size || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletsBalance;
