"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CustomModal } from '@/components/ui/custom-modal';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import BasicInfoTab from './[id]/components/BasicInfoTab';
import DocumentsTab from './[id]/components/DocumentsTab';
import PermissionsTab from './[id]/components/PermissionsTab';
import TimeManagementTab from './[id]/components/time-management/TimeManagementTab';
import PerformanceReviewsTab from './[id]/components/performance-reviews/PerformanceReviewsTab';
import Requests from './[id]/components/requests/Requests';

const ViewEmployeeDialog = ({ employeeId, trigger }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  return (
    <>
      <div onClick={() => {
        if (!employeeId) return;
        setOpen(true);
      }}>
        {trigger}
      </div>

      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t('employees.employeeDetails')}
        size="xl"
      >
        <div  dir={isRTL ? 'rtl' : 'ltr'}>
          <Tabs  dir={isRTL ? "rtl" : "ltr"} defaultValue="info" className="w-full min-h-[80vh]">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full gap-2">
              <TabsTrigger value="info">{t('employees.tabs.basicInfo')}</TabsTrigger>
              <TabsTrigger value="time-management">{t('employees.tabs.timeManagement')}</TabsTrigger>
              <TabsTrigger value="performance-reviews">{t('employees.tabs.performanceReviews')}</TabsTrigger>
              <TabsTrigger value="files">{t('employees.tabs.documents')}</TabsTrigger>
              <TabsTrigger value="requests">{t('employees.tabs.requests')}</TabsTrigger>
              <TabsTrigger value="permissions">{t('employees.tabs.permissions')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-4">
              <BasicInfoTab employeeId={employeeId} />
            </TabsContent>
            
            <TabsContent value="time-management" className="px-4">
              <TimeManagementTab employeeId={employeeId} />
            </TabsContent>
          
            <TabsContent value="performance-reviews" className="px-4">
              <PerformanceReviewsTab employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <DocumentsTab employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="requests" className="mt-4">
              <Requests employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="permissions" className="mt-4">
              <PermissionsTab employeeId={employeeId} />
            </TabsContent>
          </Tabs>
        </div>
      </CustomModal>
    </>
  );
};

export default ViewEmployeeDialog;