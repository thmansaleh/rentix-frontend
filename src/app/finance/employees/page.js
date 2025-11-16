'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TransactionsTab from './components/TransactionsTab';
import ExpensesTab from './components/ExpensesTab';
import AllTransactionsTab from './components/AllTransactionsTab';

function EmployeeCashTransactionsPage() {
  const { isRTL } = useLanguage();
  const t = useTranslations('employeeFinance');
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold  ">
            {t('title')}
          </h1>
        </div>

        {/* Tabs */}
        <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">{t('tabs.transactions')}</TabsTrigger>
            <TabsTrigger value="expenses">{t('tabs.expenses')}</TabsTrigger>
            <TabsTrigger value="all">{t('tabs.allTransactions')}</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <ExpensesTab />
          </TabsContent>

          {/* All Transactions Tab */}
          <TabsContent value="all">
            <AllTransactionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EmployeeCashTransactionsPage;