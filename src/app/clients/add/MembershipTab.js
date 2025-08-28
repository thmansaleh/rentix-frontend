"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function MembershipTab({
  form,
  handleChange,
  handleDateChange,
  handleSelectChange,
  formatDate,
  setForm,
}) {
  const t = useTranslations();
  return (
    <div className="grid md:grid-cols-5 min-h-80 overflow-auto max-h-80 sm:grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="membership_level" className="text-sm  font-medium text-gray-700">
          {t('clients.registrationForm.membershipInfo.membershipLevel')}
        </Label>
        <Select dir="rtl" onValueChange={(value) => handleSelectChange(value, 'membership_level')}>
          <SelectTrigger>
            <SelectValue placeholder={t('clients.registrationForm.membershipInfo.membershipPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bronze">{t('clients.registrationForm.membershipInfo.membershipLevels.bronze')}</SelectItem>
            <SelectItem value="silver">{t('clients.registrationForm.membershipInfo.membershipLevels.silver')}</SelectItem>
            <SelectItem value="gold">{t('clients.registrationForm.membershipInfo.membershipLevels.gold')}</SelectItem>
            <SelectItem value="platinum">{t('clients.registrationForm.membershipInfo.membershipLevels.platinum')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registration_date" className="text-sm font-medium text-gray-700">
          {t('clients.registrationForm.membershipInfo.registrationDate')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="ml-2 h-4 w-4" />
              {formatDate(form.registration_date)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={form.registration_date}
              onSelect={(date) => handleDateChange(date, 'registration_date')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2 md:col-span-5">
        <Checkbox
          id="blacklisted"
          name="blacklisted"
          checked={form.blacklisted}
          onCheckedChange={(checked) =>
            setForm(prev => ({ ...prev, blacklisted: checked }))
          }
        />
        <Label htmlFor="blacklisted" className="text-sm font-medium text-gray-700">
          {t('clients.registrationForm.membershipInfo.blacklisted')}
        </Label>
      </div>

      {form.blacklisted && (
        <div className="space-y-2 md:col-span-5">
          <Label htmlFor="blacklist_reason" className="text-sm font-medium text-gray-700">
            {t('clients.registrationForm.membershipInfo.blacklistReason')}
          </Label>
          <Textarea
            id="blacklist_reason"
            name="blacklist_reason"
            placeholder={t('clients.registrationForm.membershipInfo.blacklistReasonPlaceholder')}
            value={form.blacklist_reason}
            onChange={handleChange}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}