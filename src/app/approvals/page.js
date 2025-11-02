'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import Memos from './memos/Memos';
import EmployeesRequests from './employees-requests/EmployeesRequests';
import EmployeeTransactions from './employee-transactions/EmployeeTransactions';
import Invoices from './invoices/Invoices';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import MyTasksPage from '../cases/my-tasks/page';

export default function ApprovalsPage() {
  const t = useTranslations('navigation');
  const { isRTL } = useLanguage();

  return <Tabs dir={isRTL ? 'rtl' : 'ltr'} defaultValue="memos" className="w-full">
    <TabsList>
      <TabsTrigger value="memos">{t('memos')}</TabsTrigger>
      <TabsTrigger value="tasks">{t('tasks')}</TabsTrigger>
      <TabsTrigger value="employees requests">{t('employeesRequests')}</TabsTrigger>
      <TabsTrigger value="employee transactions">{t('employeeTransactions')}</TabsTrigger>
      <TabsTrigger value="invoices">{t('invoices')}</TabsTrigger>
    </TabsList>
      <TabsContent value="memos">
        <Memos />
      </TabsContent>
      <TabsContent value="tasks">
        <MyTasksPage />
      </TabsContent>
      <TabsContent value="employees requests">
        <EmployeesRequests />
      </TabsContent>
      <TabsContent value="employee transactions">
        <EmployeeTransactions />
      </TabsContent>
      <TabsContent value="invoices">
        <Invoices />
      </TabsContent>
  </Tabs>;
}