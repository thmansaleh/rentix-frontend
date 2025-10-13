import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Reviews from './Reviews'
import Training from './Training'
import Warnings from './Warnings'

function PerformanceReviewsTab({employeeId}) {
  return <Tabs dir="rtl" defaultValue="reviews" className="w-full mt-4">
    <TabsList
      className="bg-white rounded-none shadow-none border-b border-b-blue-400 p-1 flex space-x-1">
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"

       value="reviews">التقييمات</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"

       value="training">التدريب</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"

       value="warnings">الانذارات</TabsTrigger>

       </TabsList>
       

    <TabsContent value="reviews">
      <Reviews employeeId={employeeId} />
    </TabsContent>

    <TabsContent value="training">
      <Training employeeId={employeeId} />
    </TabsContent>
    <TabsContent value="warnings">
      <Warnings employeeId={employeeId} />
    </TabsContent>
  </Tabs> 
}

export default PerformanceReviewsTab