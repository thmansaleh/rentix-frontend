"use client";

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import React, { use } from 'react';
import BasicInfoTab from './components/BasicInfoTab';
import SalaryTab from './components/SalaryTab';
import DocumentsTab from './components/DocumentsTab';
import PermissionsTab from './components/PermissionsTab';
import TimeManagementTab from './components/time-management/TimeManagementTab';
import PerformanceReviewsTab from './components/performance-reviews/PerformanceReviewsTab';
import Requests from './components/requests/Requests';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';

function EmployeeDetailPage({ params }) {
  const { id } = use(params);
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  
  return (
    <div className="container mx-auto p-6">
      <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full gap-2">
          <TabsTrigger value="info">{t('employees.tabs.basicInfo')}</TabsTrigger>
          <TabsTrigger value="time-management">{t('employees.tabs.timeManagement')}</TabsTrigger>
          <TabsTrigger value="performance-reviews">{t('employees.tabs.performanceReviews')}</TabsTrigger>
          {/* <TabsTrigger value="salary">{t('employees.tabs.salary')}</TabsTrigger> */}
          <TabsTrigger value="files">{t('employees.tabs.documents')}</TabsTrigger>
          <TabsTrigger value="requests">{t('employees.tabs.requests')}</TabsTrigger>
          <TabsTrigger value="permissions">{t('employees.tabs.permissions')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-4">
          <BasicInfoTab employeeId={id} />
        </TabsContent>
        
        <TabsContent value="time-management" className="px-4">
          <TimeManagementTab employeeId={id} />
        </TabsContent>
      
        <TabsContent value="performance-reviews" className="px-4">
          <PerformanceReviewsTab employeeId={id} />
        </TabsContent>
        {/* <TabsContent value="salary" className="px-4">
          <SalaryTab employeeId={id} />
        </TabsContent>
         */}
        <TabsContent value="files" className="mt-4">
          <DocumentsTab employeeId={id} />
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <Requests employeeId={id} />
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <PermissionsTab employeeId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EmployeeDetailPage;