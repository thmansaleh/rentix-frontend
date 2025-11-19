"use client"

import { Tabs ,TabsContent,TabsTrigger,TabsList} from "@/components/ui/tabs"
import AssignedToTasks from "./AssignedToTasks"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import MyTasks from "./MyTasks"
import { User, Users } from "lucide-react"

function MyTasksPage() {
    const { t } = useTranslations();
    const { isRTL } = useLanguage();
  return (
    <div>
        <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="assigned-tasks" className="w-full">
            <TabsList className="flex border-b border-gray-200 rtl:flex-row-reverse">
                <TabsTrigger value="my-tasks" className="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('navigation.myTasks')}
                </TabsTrigger>
                <TabsTrigger value="assigned-tasks" className="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('navigation.assignedTasks')}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="my-tasks" className="p-4">
                <MyTasks />
            </TabsContent>
            <TabsContent value="assigned-tasks" className="p-4">
               <AssignedToTasks />
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default MyTasksPage;