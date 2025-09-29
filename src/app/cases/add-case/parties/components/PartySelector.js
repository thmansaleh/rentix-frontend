"use client";

import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTranslations } from "@/hooks/useTranslations";
import { is } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

const PartySelector = ({ 
  parties = [], 
  value, 
  onValueChange, 
  placeholder, 
  disabled = false,
  className = ""
}) => {
  const { t } = useTranslations();
const { isRTL } = useLanguage();
  return (
    <Select 
      dir={isRTL ? "rtl" : "ltr"}
      value={value} 
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {parties?.length > 0 ? (
          parties.map((party) => (
            <SelectItem key={party.id} value={party.id.toString()}>
              <div className="flex flex-col">
                <span className="font-medium">{party.name}</span>
                <span className="text-sm text-muted-foreground">
                  {party.phone} • {party.party_type === 'client' ? t('parties.client') : t('parties.opponent')}
                </span>
              </div>
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-parties" disabled>
            {t('parties.noPartiesAvailable')}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default PartySelector;