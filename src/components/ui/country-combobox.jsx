"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCountries } from "@/app/services/api/countries";
import { useLanguage } from "@/contexts/LanguageContext";

export function CountryCombobox({
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className,
}) {
  const { isRTL } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [countries, setCountries] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const fetchCountries = React.useCallback(async () => {
    if (loaded) return;
    try {
      setLoading(true);
      const response = await getCountries();
      setCountries(response.data || []);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  React.useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const getLabel = (country) => {
    return isRTL ? country.name_ar : country.name_en;
  };

  const selectedCountry = countries.find(
    (c) => c.id?.toString() === value?.toString()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled || loading}
        >
          <span className="truncate">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : selectedCountry ? (
              getLabel(selectedCountry)
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.id}
                  value={`${country.name_en} ${country.name_ar} ${country.code}`}
                  onSelect={() => {
                    onValueChange(
                      country.id?.toString() === value?.toString()
                        ? ""
                        : country.id?.toString()
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toString() === country.id?.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span>{getLabel(country)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
