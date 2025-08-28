'use client'
import { Camera, Car, DollarSign, Info, Monitor, ShieldCheck } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { BasicInfoSection, ComfortSpecsSection, ImageUploader, MaintenanceInsuranceSection, PricingSection, PurchaseInfoSection, SafetySpecsSection, SubmitButton } from "./components"
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { fetchCarDetails } from '@/redux/slices/editCarSlice';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function Content() {
    const tCars = useTranslations('cars');
    const { isRTL } = useLanguage();
    const dispatch=useDispatch()
 useEffect(() => {
    // dispatch the thunk (carId optional depending on your thunk)
    dispatch(fetchCarDetails(1));
  }, []);

    return (<div className="" >
        <div className="w-full mx-auto">
            <Tabs  defaultValue="info"
                dir={isRTL ? "rtl" : "ltr"} 
                // value={currentTab} 
                // onValueChange={setCurrentTab}
                className='py-3'
            >
                <TabsList>
                    <TabsTrigger  className='px-9'  value="info">
                        <Info className="ml  w-4" />
                        {tCars('carAddForm.tabs.basicInfo')}
                    </TabsTrigger>
                    <TabsTrigger className='px-9'  value="images">
                        <Camera className="ml h-4 w-4" />
                        {tCars('carAddForm.tabs.images')}
                    </TabsTrigger>
                    <TabsTrigger className='px-9'  value="prices">
                        <DollarSign className="ml h-4 w-4" />
                        {tCars('carAddForm.tabs.pricing')}
                    </TabsTrigger>
                    <TabsTrigger className='px-9'  value="SafetySpecsSection">
                        <ShieldCheck className="ml h-4 w-4" />
                        {tCars('carAddForm.tabs.safety')}
                    </TabsTrigger>
                    <TabsTrigger className='px-9'  value="ComfortSpecsSection">
                        <Monitor className="ml  h-4 w-4" />
                        {tCars('carAddForm.tabs.comfort')}
                    </TabsTrigger>
                    <TabsTrigger className='px-9'  value="MaintenanceInsuranceSection">
                        <Car className="ml h-4 w-4" />
                        {tCars('carAddForm.tabs.maintenance')}
                    </TabsTrigger>
                    <TabsTrigger className='px-9'  value="PurchaseInfoSection">
                        <DollarSign className="ml h-4 w-4" />
                        {tCars('carAddForm.tabs.purchase')}
                    </TabsTrigger>
                </TabsList>






                <TabsContent value="info">
                    <BasicInfoSection
                    />
                </TabsContent>
                <TabsContent value="images">
                    <ImageUploader />

                </TabsContent>
                <TabsContent value="ComfortSpecsSection">
                    <ComfortSpecsSection />

                </TabsContent>
                <TabsContent value="prices">
                    <PricingSection />

                </TabsContent>
                <TabsContent value="MaintenanceInsuranceSection">
                    <MaintenanceInsuranceSection />

                </TabsContent>
                <TabsContent value="SafetySpecsSection">
                    <SafetySpecsSection />

                </TabsContent>
                <TabsContent value="PurchaseInfoSection">
                <PurchaseInfoSection/>

                </TabsContent>
            </Tabs>
        </div>
     <SubmitButton />
    </div>

    
    )
}
