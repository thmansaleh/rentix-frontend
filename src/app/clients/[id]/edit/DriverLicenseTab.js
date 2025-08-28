"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BadgeCheck, Globe, Landmark, Calendar as CalendarIcon } from "lucide-react";
import LicenseImages from "./LicenseImages";

export default function DriverLicenseTab() {
  return (
    <div className=" rounded-lg min-h-80 overflow-auto max-h-80  p-4">
      <h4 className="text-lg font-semibold mb-4  flex items-center gap-2">
        <BadgeCheck className="w-5 h-5" />
        بيانات رخصة القيادة
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ...existing code for form fields... */}
        <div className="space-y-2">
          <Label htmlFor="driver_license_number" className="text-sm font-medium text-gray-700">
            رقم رخصة القيادة
          </Label>
          <div className="relative">
            <BadgeCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="driver_license_number"
              name="driver_license_number"
              placeholder="رقم رخصة القيادة"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_country" className="text-sm font-medium text-gray-700">
            بلد إصدار الرخصة
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="license_country"
              name="license_country"
              placeholder="أدخل بلد إصدار الرخصة"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_city" className="text-sm font-medium text-gray-700">
            مدينة إصدار الرخصة
          </Label>
          <div className="relative">
            <Landmark className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="license_city"
              name="license_city"
              placeholder="أدخل مدينة إصدار الرخصة"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver_license_issue" className="text-sm font-medium text-gray-700">
            تاريخ إصدار الرخصة
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver_license_expiry" className="text-sm font-medium text-gray-700">
            تاريخ انتهاء الرخصة
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
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
