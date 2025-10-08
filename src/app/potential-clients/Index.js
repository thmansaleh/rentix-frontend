import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import Meetings from './meetings/Meetings'
import PotentialClients from './PotentialClients'
import { TabsContent } from '@radix-ui/react-tabs'

function Index() {
  return <Tabs dir="rtl" defaultValue="potentialClients" className="w-full">
    <TabsList className="border-b">
      <TabsTrigger value="potentialClients">العملاء المحتملين</TabsTrigger>
      <TabsTrigger value="meetings">الاجتماعات</TabsTrigger>

    </TabsList>
    <TabsContent value="potentialClients">
<PotentialClients />
    </TabsContent>
    <TabsContent value="meetings" >
      <Meetings />
    </TabsContent>
  </Tabs>
}

export default Index