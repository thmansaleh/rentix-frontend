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
import Memos from "./memos/Memos"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
function Page() {
    const { id } = useParams();
    const { t} = useTranslations();
    const { language } = useLanguage();
    const isRTL = language === 'ar';
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
                
                if (response.success && response.data) {
                    setCaseData(response.data);
                } else {
                    setError('Failed to fetch case data');
                }
            } catch (err) {
                // Store the full error object to check status code later
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCaseData();
    }, [id]);
    
    const tabs =[
        {label: t('caseTabs.info'), value: "info", Component:<Info caseId={id}/> },
        {label: t('caseTabs.courts'), value: "courts", Component:<Court caseId={id}/>},
        {label: t('caseTabs.employees'), value: "employees", Component:<Employees caseId={id}/>},
        {label: t('caseTabs.parties'), value: "parties", Component:<Parties caseId={id}/>},
        {label: t('caseTabs.stages'), value: "stages", Component:<Stages caseId={id}/>},
        {label: t('caseTabs.sessions'), value: "sessions", Component:<Sessions caseId={id}/>},
        {label: t('caseTabs.petitions'), value: "petitions", Component:<Petitions caseId={id}/>},
        {label: t('caseTabs.executions'), value: "executions", Component:<Executions caseId={id}/>},
        {label: t('caseTabs.notifications'), value: "notifications", Component:<Notifications caseId={id}/>},
        {label: t('caseTabs.tasks'), value: "tasks", Component:<Tasks caseId={id}/>},
        {label: t('caseTabs.memos'), value: "memos", Component:<Memos caseId={id}/>},
    ];
    
    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>تحميل بيانات القضية...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        // Check if it's a permission error (403)
        const isPermissionError = error?.response?.status === 403;
        const errorTitle = isPermissionError 
            ? (language === 'ar' ? 'غير مصرح' : 'Unauthorized')
            : (language === 'ar' ? 'خطأ' : 'Error');
        const errorMessage = isPermissionError 
            ? (error?.response?.data?.message || (language === 'ar' ? 'ليس لديك صلاحية لعرض تفاصيل هذه القضية' : 'You do not have permission to view this case details'))
            : (error?.message || (language === 'ar' ? 'حدث خطأ أثناء تحميل بيانات القضية' : 'Failed to load case data'));
        
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center text-red-600">
                    <p className="mb-2 font-semibold">{errorTitle}</p>
                    <p className="text-sm">{errorMessage}</p>
                </div>
            </div>
        );
    }
    
    // Don't render FormikProvider until we have data
    if (!caseData) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p>No case data available</p>
                </div>
            </div>
        );
    }
    
    return (
        <FormikProvider caseId={id} caseData={caseData}>
            <div className="w-full">
                <Tabs dir={isRTL ? "rtl" : "ltr"} defaultValue="info" className="w-full">
                    <div className="sticky top-0 z-10 bg-background pb-2 md:pb-4">
                        <TabsList className="w-full md:w-auto">
                            {tabs.map((tab) => (
                                <TabsTrigger className='px-3 md:px-4' key={tab.value} value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
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