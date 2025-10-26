"use client";

import { useState, useCallback } from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { searchParties } from '@/app/services/api/parties';
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PartySelector = ({ 
  value, 
  onValueChange,
  onPartySelect, // NEW: callback to pass full party object
  placeholder, 
  disabled = false,
  className = ""
}) => {
  const { t } = useTranslations();
  const { isRTL, language } = useLanguage();
  const isArabic = language === 'ar';
  const [searchResults, setSearchResults] = useState([]);

  // Handle party search - no filtering by party type
  const handlePartySearch = useCallback(async (query) => {
    try {
      const response = await searchParties(query);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {

    }
  }, []);

  // Format options for combobox - store full party data
  const partyOptions = searchResults.map(party => ({
    value: party.id,
    label: party.name,
    phone: party.phone,
    party_type: party.party_type,
    name: party.name,
    email: party.email,
    category: party.category,
    address: party.address,
    e_id: party.e_id,
    nationality: party.nationality,
    // Include all party fields
    fullData: party
  }));

  // Handle selection change
  const handleSelectionChange = useCallback((selectedValue) => {
    onValueChange(selectedValue);
    
    // If onPartySelect callback provided, pass the full party object
    if (onPartySelect && selectedValue) {
      const selectedParty = partyOptions.find(
        option => option.value?.toString() === selectedValue?.toString()
      );
      if (selectedParty) {
        onPartySelect(selectedParty.fullData);
      }
    }
  }, [onValueChange, onPartySelect, partyOptions]);

  // Custom option renderer to show party details
  const renderPartyOption = (option) => (
    <>
      <Check
        className={cn(
          "h-4 w-4",
          isRTL ? "ml-2" : "mr-2",
          value?.toString() === option.value?.toString() ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="flex flex-col flex-1">
        <span className="font-medium">{option.name}</span>
        <span className="text-sm text-muted-foreground">
          {option.phone} • {option.party_type === 'client' ? t('parties.client') : t('parties.opponent')}
        </span>
      </div>
    </>
  );

  return (
    <SearchableCombobox
      value={value}
      onValueChange={handleSelectionChange}
      onSearch={handlePartySearch}
      options={partyOptions}
      renderOption={renderPartyOption}
      placeholder={placeholder || (isArabic ? 'ابحث عن طرف...' : 'Search for party...')}
      searchPlaceholder={isArabic ? 'ابحث بالاسم أو الهاتف...' : 'Search by name or phone...'}
      emptyMessage={isArabic ? 'لم يتم العثور على نتائج' : 'No results found'}
      disabled={disabled}
      minSearchLength={3}
      className={className}
    />
  );
};

export default PartySelector;