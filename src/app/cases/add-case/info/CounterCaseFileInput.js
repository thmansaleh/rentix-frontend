"use client"

import React, { useState, useEffect } from 'react'
import { useTranslations } from "@/hooks/useTranslations"
import { useFormikContext } from '../FormikContext'
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

function CounterCaseFileInput() {
  const { values, setFieldValue } = useFormikContext()
  const { counterCaseId = null } = values
  const { t } = useTranslations()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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
      console.error('Error searching cases:', error)
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCase = cases.find((caseItem) => caseItem.id === counterCaseId)

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
              placeholder={t('counterClaim.searchPlaceholder')}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  {t('counterClaim.searching')}
                </div>
              )}
              {!isLoading && searchTerm.length >= 3 && cases.length === 0 && (
                <CommandEmpty>{t('counterClaim.noResults')}</CommandEmpty>
              )}
              {!isLoading && searchTerm.length < 3 && (
                <div className="p-4 text-sm text-center text-muted-foreground">
                  {t('counterClaim.minCharactersSearch')}
                </div>
              )}
              <CommandGroup>
                {cases.map((caseItem) => (
                  <CommandItem
                    key={caseItem.id}
                    value={`${caseItem.case_number} ${caseItem.file_number} ${caseItem.topic}`}
                    onSelect={() => {
                      setFieldValue('counterCaseId', caseItem.id === counterCaseId ? null : caseItem.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        counterCaseId === caseItem.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {t('counterClaim.caseLabel')} {caseItem.case_number}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {t('counterClaim.fileLabel')} {caseItem.file_number}
                      </div>
                      {caseItem.topic && (
                        <div className="text-sm text-muted-foreground truncate">
                          {t('counterClaim.topicLabel')} {caseItem.topic}
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