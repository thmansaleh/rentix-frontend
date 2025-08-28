"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Landmark, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountries } from "@/hooks/useApiData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";

export default function AddressInfoTab({ form, handleChange }) {
  const { countries, isLoading, isError } = useCountries();
  const { language } = useLanguage();
  const t = useTranslations();
  return (
    <div className="grid min-h-80 overflow-auto max-h-80 grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
          {t('clients.registrationForm.addressInfo.country')}
        </Label>
        <div className="relative">
          {/* <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" /> */}
          <Select dir="rtl"
            value={form.country}
            onValueChange={(value) =>
              handleChange({ target: { name: "country", value } })
            }
          >
            <SelectTrigger className="pl-10 w-full">
              <SelectValue placeholder={
                isLoading 
                  ? t('common.loading')
                  : isError 
                  ? t('common.errorLoading')
                  : t('clients.registrationForm.addressInfo.countryPlaceholder')
              } />
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
        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
          {t('clients.registrationForm.addressInfo.city')}
        </Label>
        <div className="relative">
          <Landmark className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="city"
            name="city"
            placeholder={t('clients.registrationForm.addressInfo.cityPlaceholder')}
            value={form.city}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          {t('clients.registrationForm.addressInfo.address')}
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Textarea
            id="address"
            name="address"
            placeholder={t('clients.registrationForm.addressInfo.addressPlaceholder')}
            value={form.address}
            onChange={handleChange}
            className="pl-10 min-h-[80px]"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}