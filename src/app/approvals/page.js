'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import Memos from './memos/Memos';
import AssignedToTasks from '../cases/my-tasks/AssignedToTasks';
import MyTasks from '../cases/my-tasks/MyTasks';
import EmployeesRequests from './employees-requests/EmployeesRequests';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ApprovalsPage() {
  const t = useTranslations('navigation');
  const { isRTL } = useLanguage();

  return <Tabs dir={isRTL ? 'rtl' : 'ltr'} defaultValue="memos" className="w-full">
    <TabsList>
      <TabsTrigger value="memos">{t('memos')}</TabsTrigger>
      <TabsTrigger value="tasks">{t('tasks')}</TabsTrigger>
      <TabsTrigger value="employees requests">{t('employeesRequests')}</TabsTrigger>
    </TabsList>
      <TabsContent value="memos">
        <Memos />
      </TabsContent>
      <TabsContent value="tasks">
        <MyTasks />
      </TabsContent>
      <TabsContent value="employees requests">
        <EmployeesRequests />
      </TabsContent>
  </Tabs>;
}