"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Mail, Phone, Calendar as CalendarIcon } from "lucide-react";

export default function PersonalInfoTab({ form, handleChange, handleDateChange, formatDate }) {
  return (
    <div className="space-y-6 pb-3 min-h-80 overflow-auto max-h-80">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="name_en" className="text-sm font-medium text-gray-700">
                الاسم الكامل بالإنجليزية *
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              أدخل الاسم كما هو في جواز السفر أو الهوية.
            </TooltipContent>
          </Tooltip>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name_en"
              name="name_en"
              placeholder="Enter full name in English"
              value={form.name_en}
              onChange={handleChange}
              required
              className="pl-10"
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="name_ar" className="text-sm font-medium text-gray-700">
                الاسم الكامل بالعربية *
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              أدخل الاسم كما هو في جواز السفر أو الهوية.
            </TooltipContent>
          </Tooltip>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name_ar"
              name="name_ar"
              placeholder="أدخل الاسم الكامل بالعربية"
              value={form.name_ar}
              onChange={handleChange}
              required
              className="pl-10"
              dir="rtl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                البريد الإلكتروني *
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              سيتم إرسال التأكيدات على هذا البريد.
            </TooltipContent>
          </Tooltip>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                رقم الهاتف *
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              أدخل رقم الهاتف المحمول الخاص بك.
            </TooltipContent>
          </Tooltip>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              placeholder="+971 50 123 4567"
              value={form.phone}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">
            تاريخ الميلاد
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formatDate(form.date_of_birth)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.date_of_birth}
                onSelect={(date) => handleDateChange(date, 'date_of_birth')}
                initialFocus
                captionLayout="dropdown"
                fromYear={1950}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}