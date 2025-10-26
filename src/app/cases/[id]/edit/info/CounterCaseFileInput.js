"use client"

import React, { useState, useEffect } from 'react'
import { useTranslations } from "@/hooks/useTranslations"
import { searchCasesForAddNewCasePage } from '@/app/services/api/cases'
import { Check, ChevronsUpDown, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function CounterCaseFileInput({ formikProps }) {
  const { values, setFieldValue } = formikProps
  const { t } = useTranslations()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(values.counter_file_number || '')
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.length >= 3) {
        searchCases(searchTerm)
      } else {
        setCases([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const searchCases = async (term) => {
    try {
      setIsLoading(true)
      const response = await searchCasesForAddNewCasePage(term)
      if (response.success) {
        setCases(response.data)
      } else {
        setCases([])
      }
    } catch (error) {
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCaseSelect = (caseId) => {
    const newCounterCaseId = caseId === values.counter_case_id ? null : caseId
    setFieldValue('counter_case_id', newCounterCaseId)
    setOpen(false)
  }

  const selectedCase = cases.find((caseItem) => caseItem.id === values.counter_case_id)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('counterClaim.title')}
      </h3>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full max-w-md justify-between",
              !selectedCase && "text-muted-foreground"
            )}
          >
            {selectedCase ? (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="truncate">
                  {selectedCase.case_number} - {selectedCase.file_number}
                </span>
              </div>
            ) : (
              t('counterClaim.caseNumberPlaceholder')
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-md p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={t('counterClaim.searchPlaceholder') || "Search by case number or file number..."}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  Searching...
                </div>
              )}
              {!isLoading && searchTerm.length >= 3 && cases.length === 0 && (
                <CommandEmpty>No cases found.</CommandEmpty>
              )}
              {!isLoading && searchTerm.length < 3 && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  Type at least 3 characters to search
                </div>
              )}
              <CommandGroup>
                {cases.map((caseItem) => (
                  <CommandItem
                    key={caseItem.id}
                    value={`${caseItem.case_number} ${caseItem.file_number} ${caseItem.topic}`}
                    onSelect={() => handleCaseSelect(caseItem.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        values.counter_case_id === caseItem.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        Case: {caseItem.case_number}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        File: {caseItem.file_number}
                      </div>
                      {caseItem.topic && (
                        <div className="text-sm text-muted-foreground truncate">
                          Topic: {caseItem.topic}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CounterCaseFileInput