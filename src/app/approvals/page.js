'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import Memos from './memos/Memos';
import AssignedToTasks from '../cases/my-tasks/AssignedToTasks';
import MyTasks from '../cases/my-tasks/MyTasks';

export default function ApprovalsPage() {
  return <Tabs dir="rtl" defaultValue="memos" className="w-full">
    <TabsList>
      <TabsTrigger value="memos">المذكرات</TabsTrigger>
      <TabsTrigger value="tasks">المهام</TabsTrigger>
    </TabsList>
      <TabsContent value="memos">
        <Memos />
      </TabsContent>
      <TabsContent value="tasks">
        <MyTasks />
      </TabsContent>
  </Tabs>;
}