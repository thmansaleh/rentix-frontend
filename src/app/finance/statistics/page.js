'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Invoices from './components/Invoices';
import EmployeeTransactions from './components/EmployeeTransactions';
import BankAccountsTransactions from './components/BankAccountsTransactions';

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
        <CardContent className='space-y-6'>
          <BankAccountsTransactions />
          <div className="border-t my-6"></div>
          <Invoices />
          <div className="border-t my-6"></div>
          <EmployeeTransactions />
        </CardContent>
      </Card>
      


    </div>
  );
};

export default FinanceStatisticsPage;
