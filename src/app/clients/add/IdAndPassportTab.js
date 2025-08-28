"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdCard, Globe, BadgeCheck, Landmark, Calendar as CalendarIcon } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useCountries } from "@/hooks/useApiData";
import { useLanguage } from "@/contexts/LanguageContext";
import IdImages from "./IdImages";

export default function IdAndPassportTab({ form, handleChange, handleDateChange, formatDate }) {
  const t = useTranslations();
  const { countries, isLoading, isError } = useCountries();
  const { language, isRTL } = useLanguage();
  return (
    <>
      {/* ID Section */}
      <div className=" rounded-lg min-h-80 overflow-auto max-h-80 p-4">
        <h4 className="text-lg font-semibold mb-4  flex items-center gap-2">
          <IdCard className="w-5 h-5" />
          {t('clients.registrationForm.idAndPassportInfo.title')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_number" className="text-sm font-medium dark:text-white text-gray-700">
              {t('clients.registrationForm.idAndPassportInfo.idNumber')}
            </Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="id_number"
                name="id_number"
                placeholder={t('clients.registrationForm.idAndPassportInfo.idNumberPlaceholder')}
                value={form.id_number}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_issue_country" className="text-sm font-medium dark:text-white text-gray-700">
              {t('clients.registrationForm.idAndPassportInfo.idIssueCountry')}
            </Label>
            <div className="relative">
              {/* <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> */}
              <Select dir={isRTL ? "rtl" : "ltr"}
                value={form.id_issue_country}
                onValueChange={(value) =>
                  handleChange({ target: { name: "id_issue_country", value } })
                }
              >
                <SelectTrigger className="pl-10 w-full">
                  <SelectValue 
                    placeholder={
                      isLoading 
                        ? t('common.loading')
                        : isError 
                        ? t('common.errorLoading')
                        : t('clients.registrationForm.idAndPassportInfo.idIssueCountryPlaceholder')
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
            <Label htmlFor="id_issue" className="text-sm font-medium dark:text-white text-gray-700">
              {t('clients.registrationForm.idAndPassportInfo.idIssueDate')}
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
                <Label htmlFor="id_expiry" className="text-sm font-medium dark:text-white text-gray-700">
                  {t('clients.registrationForm.idAndPassportInfo.idExpiryDate')}
                </Label>
              </TooltipTrigger>
              <TooltipContent>
                {t('clients.registrationForm.idAndPassportInfo.idExpiryTooltip')}
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