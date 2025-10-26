'use client';

import React, { useState, useEffect } from 'react';
import { useFormikContext } from '../FormikContext';
import { searchCasesForAddNewCasePage } from '@/app/services/api/cases';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

function RelatedCases() {
  const formikProps = useFormikContext();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCases, setAvailableCases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 3) {
        searchCases(searchTerm);
      } else {
        setAvailableCases([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchCases = async (term) => {
    try {
      setLoading(true);
      const response = await searchCasesForAddNewCasePage(term);
      if (response.success) {
        setAvailableCases(response.data);
      } else {
        setAvailableCases([]);
      }
    } catch (error) {

      setAvailableCases([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a case to the related_cases array
  const handleSelectCase = (selectedCase) => {
    const currentRelatedCases = formikProps.values.related_cases || [];
    
    // Check if case is already added
    const isAlreadyAdded = currentRelatedCases.some(
      (c) => c.id === selectedCase.id
    );

    if (!isAlreadyAdded) {
      formikProps.setFieldValue('related_cases', [
        ...currentRelatedCases,
        selectedCase,
      ]);
    }

    setOpen(false);
    setSearchTerm(''); // Clear search after selection
  };

  // Handle removing a case from the related_cases array
  const handleRemoveCase = (caseId) => {
    const currentRelatedCases = formikProps.values.related_cases || [];
    const updatedCases = currentRelatedCases.filter((c) => c.id !== caseId);
    formikProps.setFieldValue('related_cases', updatedCases);
  };

  const relatedCases = formikProps.values.related_cases || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">القضايا المرتبطة</label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
            >
              اختر قضية مرتبطة
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="البحث عن قضية..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                {loading && (
                  <div className="p-4 text-sm text-center text-muted-foreground">
                    جاري البحث...
                  </div>
                )}
                {!loading && searchTerm.length < 3 && (
                  <div className="p-4 text-sm text-center text-muted-foreground">
                    اكتب 3 أحرف على الأقل للبحث
                  </div>
                )}
                {!loading && searchTerm.length >= 3 && availableCases.length === 0 && (
                  <CommandEmpty>لا توجد قضايا</CommandEmpty>
                )}
                <CommandGroup>
                  {availableCases.map((caseItem) => {
                    const isSelected = relatedCases.some(
                      (c) => c.id === caseItem.id
                    );
                    
                    return (
                      <CommandItem
                        key={caseItem.id}
                        value={`${caseItem.case_number || ''} ${caseItem.file_number || ''} ${caseItem.topic || ''}`}
                        onSelect={() => handleSelectCase(caseItem)}
                        disabled={isSelected}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <FileText className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {caseItem.case_number}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ملف: {caseItem.file_number}
                          </span>
                          {caseItem.topic && (
                            <span className="text-xs text-muted-foreground">
                              {caseItem.topic}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Display selected related cases */}
      {relatedCases.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">القضايا المرتبطة المختارة:</h3>
          <div className="space-y-2">
            {relatedCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="flex items-center justify-between border rounded-lg p-3 bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">{caseItem.case_number}</span>
                    <span className="text-sm text-muted-foreground">
                      ملف: {caseItem.file_number}
                    </span>
                    {caseItem.topic && (
                      <span className="text-xs text-muted-foreground">
                        {caseItem.topic}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCase(caseItem.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatedCases;
