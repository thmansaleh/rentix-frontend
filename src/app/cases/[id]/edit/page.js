'use client'
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Component } from "lucide-react"
import Court from "./court/Court"
import Employees from "./employees/Employees"
import Stages from "./stages/Stages"
import Sessions from "./sessions/Sessions"
import Petitions from "./petitions/Petitions"
import Executions from "./executions/Executions"
import Notifications from "./notifications/Notifications"
import Info from "./info/Info"
import Parties from "./parties/Parties"
import { useParams } from "next/navigation"
import { FormikProvider } from "./info/FormikContext"
import { getCaseById } from "@/app/services/api/cases"
import Tasks from "./tasks/Tasks"
function Page() {
    const { id } = useParams();
    const [caseData, setCaseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch case data when component mounts or id changes
    useEffect(() => {
        const fetchCaseData = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                const response = await getCaseById(id);
                console.log('🔍 API Response:', response);
                
                if (response.success && response.data) {
                    setCaseData(response.data);
                    console.log('📝 Case Data from API:', response.data);
                } else {
                    setError('Failed to fetch case data');
                }
            } catch (err) {
                console.error('Error fetching case data:', err);
                setError(err.message || 'Failed to fetch case data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaseData();
    }, [id]);
    
    const tabs =[
        {label: "المعلومات الاساسية", value: "info", Component:<Info caseId={id}/> },
        {label: "المحاكم ومراكز الشرطة", value: "courts", Component:<Court caseId={id}/>},
        {label: "الموظفين", value: "employees", Component:<Employees caseId={id}/>},
        {label: "الاطراف", value: "parties", Component:<Parties caseId={id}/>},
        {label: "مراحل القضية", value: "stages", Component:<Stages caseId={id}/>},
        {label: "الجلسات", value: "sessions", Component:<Sessions caseId={id}/>},
        {label: "العرائض", value: "petitions", Component:<Petitions caseId={id}/>},
        {label: "التنفيذات", value: "executions", Component:<Executions caseId={id}/>},
        {label: "الاشعارات القضائية", value: "notifications", Component:<Notifications caseId={id}/>},
        {label: "المهام", value: "tasks", Component:<Tasks caseId={id}/>},
    ];
    
    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Loading case data...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center text-red-600">
                    <p className="mb-2">Error loading case data</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <FormikProvider caseId={id} caseData={caseData}>
            <div>
                <Tabs dir="rtl" defaultValue="info" >
                    <TabsList>
                        {tabs.map((tab) => (
                            <TabsTrigger className='px-4' key={tab.value} value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.Component}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </FormikProvider>
    )
}

export default Page