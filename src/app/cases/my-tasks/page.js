import { Tabs ,TabsContent,TabsTrigger,TabsList} from "@/components/ui/tabs"
import AssignedToTasks from "./AssignedToTasks"
import { useTranslations } from "@/hooks/useTranslations"
import MyTasks from "./MyTasks"

function page() {
    // const { isRTL } = useTranslations();
  return (
    <div>
        <Tabs dir="rtl" defaultValue="assigned-tasks" className="w-full">
            <TabsList className="flex border-b border-gray-200 rtl:flex-row-reverse">
                <TabsTrigger value="my-tasks" className="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    مهامي
                </TabsTrigger>
                <TabsTrigger value="assigned-tasks" className="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    المهام الموكلة
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

export default page