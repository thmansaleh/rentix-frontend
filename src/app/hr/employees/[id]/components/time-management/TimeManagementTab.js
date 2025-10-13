import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OtherLeave from "./OtherLeave"
import SickLeave from "./SickLeave"
import AnnualLeave from "./AnnualLeave"
import Deductions from "./Deductions"
import Attendance from "./Attendance"

function TimeManagementTab({ employeeId }) {
  return <Tabs dir="rtl" defaultValue="attendance" className="w-full mt-4">
    <TabsList
      className="bg-white rounded-none shadow-none border-b border-b-blue-400 p-1 flex space-x-1">
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"

       value="attendance">سجل الحضور</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="deductions">الخصومات</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="annual-leave">رصيد الإجازات السنوية</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
        value="sick-leave">رصيد الإجازات المرضية</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="other-leave"> الإجازات الأخرى</TabsTrigger>
    </TabsList>
    <TabsContent value="attendance">
      <Attendance employeeId={employeeId} />
    </TabsContent>
    <TabsContent value="deductions">
      <Deductions employeeId={employeeId} />
    </TabsContent>
    <TabsContent value="annual-leave">
      <AnnualLeave employeeId={employeeId} />
    </TabsContent>
    <TabsContent value="sick-leave">
      <SickLeave employeeId={employeeId} />
    </TabsContent>
    <TabsContent value="other-leave">
      <OtherLeave employeeId={employeeId} />
    </TabsContent>
  </Tabs>
}

export default TimeManagementTab