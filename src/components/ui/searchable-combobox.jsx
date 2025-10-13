"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
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

/**
 * SearchableCombobox - A reusable searchable combobox component
 * 
 * @param {Object} props
 * @param {string} props.value - Currently selected value
 * @param {function} props.onValueChange - Callback when value changes
 * @param {function} props.onSearch - Async function to search for options (receives query string)
 * @param {Array} props.options - Array of option objects {value, label, ...otherData}
 * @param {function} props.renderOption - Optional function to customize option rendering
 * @param {string} props.placeholder - Placeholder text for trigger button
 * @param {string} props.searchPlaceholder - Placeholder text for search input
 * @param {string} props.emptyMessage - Message when no results found
 * @param {boolean} props.disabled - Whether the combobox is disabled
 * @param {number} props.minSearchLength - Minimum characters before searching (default: 3)
 * @param {boolean} props.isLoading - Loading state
 */
export function SearchableCombobox({
  value,
  onValueChange,
  onSearch,
  options = [],
  renderOption,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  minSearchLength = 3,
  isLoading = false,
  className
}) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searching, setSearching] = React.useState(false)

  // Debounce search
  React.useEffect(() => {
    if (!onSearch || searchQuery.length < minSearchLength) {
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        await onSearch(searchQuery)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch, minSearchLength])

  // Get selected option label
  const selectedOption = options.find(opt => opt.value?.toString() === value?.toString())
  const selectedLabel = selectedOption?.label || placeholder

  // Default option renderer
  const defaultRenderOption = (option) => (
    <>
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          value?.toString() === option.value?.toString() ? "opacity-100" : "opacity-0"
        )}
      />
      <span>{option.label}</span>
    </>
  )

  const optionRenderer = renderOption || defaultRenderOption

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || isLoading}
        >
          <span className="truncate">{selectedLabel}</span>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {searching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : (
              <>
                {searchQuery.length > 0 && searchQuery.length < minSearchLength && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Type at least {minSearchLength} characters to search
                  </div>
                )}
                {searchQuery.length >= minSearchLength && options.length === 0 && (
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                )}
                {options.length > 0 && (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value?.toString()}
                        onSelect={() => {
                          onValueChange(option.value?.toString() === value?.toString() ? "" : option.value?.toString())
                          setOpen(false)
                        }}
                      >
                        {optionRenderer(option)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
