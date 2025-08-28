"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IdCard, Globe, BadgeCheck, Landmark, Calendar as CalendarIcon } from "lucide-react";
import IdImages from "./IdImages";

export default function IdAndPassportTab({ form, handleChange, handleDateChange, formatDate }) {
  return (
    <>
      {/* ID Section */}
      <div className=" rounded-lg min-h-80 overflow-auto max-h-80 p-4">
        <h4 className="text-lg font-semibold mb-4  flex items-center gap-2">
          <IdCard className="w-5 h-5" />
          بيانات الهوية / الجواز
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_number" className="text-sm font-medium text-gray-700">
              رقم الهوية / الجواز
            </Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="id_number"
                name="id_number"
                placeholder="رقم الهوية أو الجواز"
                value={form.id_number}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_issue_country" className="text-sm font-medium text-gray-700">
              بلد إصدار الهوية / الجواز
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="id_issue_country"
                name="id_issue_country"
                placeholder="أدخل بلد إصدار الهوية أو الجواز"
                value={form.id_issue_country}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_issue" className="text-sm font-medium text-gray-700">
              تاريخ إصدار الهوية / الجواز
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formatDate(form.id_issue)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.id_issue}
                  onSelect={(date) => handleDateChange(date, 'id_issue')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="id_expiry" className="text-sm font-medium text-gray-700">
                  تاريخ انتهاء الهوية / الجواز
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                تأكد من أن الهوية أو الجواز ساري المفعول.
              </TooltipContent>
            </Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formatDate(form.id_expiry)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.id_expiry}
                  onSelect={(date) => handleDateChange(date, 'id_expiry')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <IdImages/>

      </div>
     
    </>
  );
}