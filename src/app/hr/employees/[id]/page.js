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

function EmployeeDetailPage({ params }) {
  const { id } = use(params);
  
  return (
    <div className="container mx-auto p-6">
      <Tabs dir="rtl" defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
          <TabsTrigger value="time-management">إدارة الوقت</TabsTrigger>
          <TabsTrigger value="performance-reviews">الاداء والتقييمات</TabsTrigger>
          {/* <TabsTrigger value="salary">معلومات الراتب</TabsTrigger> */}
          <TabsTrigger value="files">الوثائق</TabsTrigger>
          <TabsTrigger value="requests">الطلبات</TabsTrigger>
          <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
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