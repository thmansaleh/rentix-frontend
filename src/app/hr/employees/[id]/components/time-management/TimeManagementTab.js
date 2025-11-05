import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OtherLeave from "./OtherLeave"
import SickLeave from "./SickLeave"
import AnnualLeave from "./AnnualLeave"
import Deductions from "./Deductions"
import Attendance from "./Attendance"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslations } from "@/hooks/useTranslations"

function TimeManagementTab({ employeeId }) {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();

  return <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="attendance" className="w-full mt-4">
    <TabsList
      className="bg-white rounded-none shadow-none border-b border-b-blue-400 p-1 flex flex-wrap gap-1">
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="attendance">{t('employees.timeManagementTabs.attendance')}</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="deductions">{t('employees.timeManagementTabs.deductions')}</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="annual-leave">{t('employees.timeManagementTabs.annualLeave')}</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
        value="sick-leave">{t('employees.timeManagementTabs.sickLeave')}</TabsTrigger>
      <TabsTrigger
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white  px-3 py-1 text-sm font-medium transition"
       value="other-leave">{t('employees.timeManagementTabs.otherLeave')}</TabsTrigger>
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