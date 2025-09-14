"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck, Globe, Landmark, Calendar as CalendarIcon } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useCountries } from "@/hooks/useApiData";
import { useLanguage } from "@/contexts/LanguageContext";
import LicenseImages from "./LicenseImages";

export default function DriverLicenseTab({ form, handleChange, handleDateChange, formatDate }) {
  const t = useTranslations();
  const { countries, isLoading, isError } = useCountries();
  const { language, isRTL } = useLanguage();
  
  // Safety check to ensure form object exists and has required properties
  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" rounded-lg min-h-80 overflow-auto max-h-80  p-4">
      <h4 className="text-lg font-semibold mb-4  flex items-center gap-2">
        <BadgeCheck className="w-5 h-5" />
        {t('clients.registrationForm.driverLicenseInfo.title')}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ...existing code for form fields... */}
        <div className="space-y-2">
          <Label htmlFor="driver_license_number" className="text-sm font-medium text-gray-700">
            {t('clients.registrationForm.driverLicenseInfo.licenseNumber')}
          </Label>
          <div className="relative">
            <BadgeCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="driver_license_number"
              name="driver_license_number"
              placeholder={t('clients.registrationForm.driverLicenseInfo.licenseNumberPlaceholder')}
              value={form.driver_license_number || ""}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_country" className="text-sm font-medium text-gray-700">
            {t('clients.registrationForm.driverLicenseInfo.licenseCountry')}
          </Label>
          <div className="relative">
            {/* <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> */}
            <Select dir={isRTL ? "rtl" : "ltr"}
              value={form.license_country || ""}
              onValueChange={(value) =>
                handleChange({ target: { name: "license_country", value } })
              }
            >
              <SelectTrigger className="pl-10 w-full">
                <SelectValue 
                  placeholder={
                    isLoading 
                      ? t('common.loading')
                      : isError 
                      ? t('common.errorLoading')
                      : t('clients.registrationForm.driverLicenseInfo.licenseCountryPlaceholder')
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.en} value={country[language]}>
                    {country[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_city" className="text-sm font-medium text-gray-700">
            {t('clients.registrationForm.driverLicenseInfo.licenseCity')}
          </Label>
          <div className="relative">
            <Landmark className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="license_city"
              name="license_city"
              placeholder={t('clients.registrationForm.driverLicenseInfo.licenseCityPlaceholder')}
              value={form.license_city || ""}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver_license_issue" className="text-sm font-medium text-gray-700">
            {t('clients.registrationForm.driverLicenseInfo.licenseIssueDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formatDate(form.driver_license_issue)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.driver_license_issue}
                onSelect={(date) => handleDateChange(date, "driver_license_issue")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver_license_expiry" className="text-sm font-medium text-gray-700">
            {t('clients.registrationForm.driverLicenseInfo.licenseExpiryDate')}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formatDate(form.driver_license_expiry)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.driver_license_expiry}
                onSelect={(date) => handleDateChange(date, "driver_license_expiry")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* License images upload */}
      <LicenseImages />
    </div>
  );
}
