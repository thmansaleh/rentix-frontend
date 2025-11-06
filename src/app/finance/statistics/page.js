'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BankAccountsOverview from './components/BankAccountsOverview';
import LastInvoices from './components/LastInvoices';
import Transactions from './components/Transactions';

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

      <Transactions />
      {/* Bank Accounts Overview */}
      <BankAccountsOverview />

      {/* Last Invoices */}
      <LastInvoices />
    </div>
  );
};

export default FinanceStatisticsPage;
