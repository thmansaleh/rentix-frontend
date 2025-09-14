"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Landmark, Globe, BadgeCheck, IdCard, CalendarDays, Star, Ban, Calendar as CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "@/hooks/useTranslations";
import PersonalInfoTab from "./PersonalInfoTab";
import AddressInfoTab from "./AddressInfoTab";
import DocumentsTab from "./IdAndPassportTab";
import MembershipTab from "./MembershipTab";
import DriverLicenseTab from "./DriverLicenseTab";
import IdAndPassportTab from "./IdAndPassportTab";
import { useLanguage } from "@/contexts/LanguageContext";
const tabStyles = {
  activeBg: "bg-white",
  activeText: "text-blue-600",
  activeShadow: "shadow-sm",
  inactiveBg: "bg-transparent",
  inactiveText: "text-gray-600",
  hoverBg: "hover:bg-gray-50",
  base: "flex items-center gap-2 rounded-md transition-all px-3 py-2"
};

export default function CustomerRegistrationForm() {
  const t = useTranslations();
  const {isRTL} = useLanguage();

  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    id_number: "",
    id_expiry: null,
    id_issue: null,
    id_issue_country: "",
    driver_license_number: "123444",
    driver_license_expiry: null,
    driver_license_issue: null,
    license_country: "",
    license_city: "",
    date_of_birth: null,
    registration_date: new Date(),
    membership_level: "",
    blacklisted: false,
    blacklist_reason: "",
  });

  const [activeTab, setActiveTab] = useState("personal");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (date, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSelectChange = (value, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('clients.registrationForm.successMessage'));
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-GB') : t('clients.registrationForm.navigation.selectDate');
  };

  // Define your tabs as an array
  const tabs = [
    {
      value: "personal",
      label: t('clients.registrationForm.tabs.personal'),
      icon: <User className="w-4 h-4" />,
      content: (
        <PersonalInfoTab
          form={form}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          formatDate={formatDate}
        />
      ),
    },
    {
      value: "address",
      label: t('clients.registrationForm.tabs.address'),
      icon: <MapPin className="w-4 h-4" />,
      content: (
        <AddressInfoTab
          form={form}
          handleChange={handleChange}
        />
      ),
    },
    {
      value: "DriverLicense",
      label: t('clients.registrationForm.tabs.driverLicense'),
      icon: <MapPin className="w-4 h-4" />,
      content: (
        <DriverLicenseTab
          form={form}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          formatDate={formatDate}
        />
      ),
    },
    {
      value: "IdAndPassportTab",
      label: t('clients.registrationForm.tabs.idAndPassport'),
      icon: <IdCard className="w-4 h-4" />,
      content: (
        <IdAndPassportTab
          form={form}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          formatDate={formatDate}
        />
      ),
    },
    {
      value: "membership",
      label: t('clients.registrationForm.tabs.membership'),
      icon: <Star className="w-4 h-4" />,
      content: (
        <MembershipTab
          form={form}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          handleSelectChange={handleSelectChange}
          formatDate={formatDate}
          setForm={setForm}
        />
      ),
    },
  ];

  return (
    <TooltipProvider>
      <div className=" bg-gray-50" >
        <div className="">
          <Card className=" bg-white">
            <CardHeader className=" text-black rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <User className="w-6 h-6" />
                {t('clients.registrationForm.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 ">
              <form onSubmit={handleSubmit}>
                <Tabs dir={isRTL ? "rtl" : "ltr"} value={activeTab} onValueChange={setActiveTab} className="w-full ">
                  <TabsList className={` w-full   mb-6`}>
                    {tabs.map(tab => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="flex items-center gap-2"
                      >
                        {tab.icon}
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                      {tab.content}
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Navigation and Submit */}
                <div className="flex justify-center items-center pt-6 border-t">
                  <div className="flex gap-2">
                    {tabs.findIndex(tab => tab.value === activeTab) > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
                          if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].value);
                        }}
                        className="flex items-center gap-1"
                      >
                        <ArrowRight className="w-4 h-4" />
                        {t('clients.registrationForm.navigation.previous')}
                      </Button>
                    )}
                    {tabs.findIndex(tab => tab.value === activeTab) < tabs.length - 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          const currentIndex = tabs.findIndex(tab => tab.value === activeTab);
                          if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].value);
                        }}
                        className="flex items-center gap-1"
                      >
                        {t('clients.registrationForm.navigation.next')}
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    )}
                    {tabs.findIndex(tab => tab.value === activeTab) === tabs.length - 1 && (
                      <Button 
                        type="submit" 
                      >
                        {t('clients.registrationForm.navigation.submit')}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}