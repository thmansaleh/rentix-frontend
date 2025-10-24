'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LastTransactions from './components/LastTransactions';
import BankAccountsOverview from './components/BankAccountsOverview';
import WalletsBalance from './components/WalletsBalance';
import FinanceCharts from './components/FinanceCharts';
import LastExpenses from './components/LastExpenses';
import LastInvoices from './components/LastInvoices';

const FinanceStatisticsPage = () => {
  const { isRTL, language } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'الإحصائيات المالية' : 'Finance Statistics'}
          </CardTitle>
          <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' 
              ? 'نظرة شاملة على الوضع المالي للمكتب'
              : 'Comprehensive overview of the office financial status'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Wallets Balance Summary */}
      <WalletsBalance />

      {/* Bank Accounts Overview */}
      <BankAccountsOverview />

      {/* Finance Charts - Income vs Expenses */}
      <FinanceCharts />

      {/* Two Column Layout for Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Transactions */}
        <LastTransactions />

        {/* Last Expenses */}
        <LastExpenses />
      </div>

      {/* Last Invoices */}
      <LastInvoices />
    </div>
  );
};

export default FinanceStatisticsPage;
