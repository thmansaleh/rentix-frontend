'use client';

import React from 'react';
import useSWR from 'swr';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
import { getAllWalletDeposits } from '@/app/services/api/walletDeposits';

const LastTransactions = () => {
  const { isRTL, language } = useLanguage();
  
  // Fetch recent deposits (we'll show last 5)
  const { data: depositsData, isLoading } = useSWR(
    '/wallet-deposits-recent',
    getAllWalletDeposits,
    { refreshInterval: 300000 }
  );

  const transactions = React.useMemo(() => {
    if (!depositsData?.success || !depositsData?.data) return [];
    // Get last 5 transactions
    return depositsData.data.slice(0, 5);
  }, [depositsData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
          {language === 'ar' ? 'آخر المعاملات' : 'Recent Transactions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-full bg-green-100">
                    <ArrowDownCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="font-medium">
                      {transaction.client_name || (language === 'ar' ? 'عميل' : 'Client')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.payment_method === 'cash' 
                        ? (language === 'ar' ? 'نقدي' : 'Cash')
                        : transaction.payment_method === 'bank' 
                        ? (language === 'ar' ? 'بنك' : 'Bank')
                        : transaction.payment_method}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {transaction.file_number || '-'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LastTransactions;
