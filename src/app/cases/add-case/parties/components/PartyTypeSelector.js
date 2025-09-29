"use client";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { is } from "date-fns/locale";

const PartyTypeSelector = ({ 
  value, 
  onValueChange, 
  disabled = false,
  className = ""
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  
  const partyTypes = [
    { value: 'client', label: t('parties.client') },
    { value: 'opponent', label: t('parties.opponent') }
  ];

  return (
    <Select  dir={isRTL ? "rtl" : "ltr"}
      value={value} 
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={t('parties.choosePartyType')} />
      </SelectTrigger>
      <SelectContent>
        {partyTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PartyTypeSelector;