'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TransactionsTab from './components/TransactionsTab';
import ExpensesTab from './components/ExpensesTab';

function EmployeeCashTransactionsPage() {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            المالية الخاصة بالموظفين
          </h1>
        </div>

        {/* Tabs */}
        <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">عهد الموظفين</TabsTrigger>
            <TabsTrigger value="expenses">مصروفات الموظفين</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <ExpensesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EmployeeCashTransactionsPage;