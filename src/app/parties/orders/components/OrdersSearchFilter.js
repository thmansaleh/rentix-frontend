"use client"

import React, { useState } from 'react'
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from 'lucide-react'
import { cn } from "@/lib/utils"

const OrdersSearchFilter = ({ onSearch, onClear }) => {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [searchInput, setSearchInput] = useState('')

  const handleSearch = () => {
    if (searchInput.trim()) {
      onSearch(searchInput.trim())
    }
  }

  const handleClear = () => {
    setSearchInput('')
    onClear()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
      {/* Search Input */}
      <div className="relative flex-1 md:w-80">
        <Search className={cn(
          "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
          isArabic ? "right-3" : "left-3"
        )} />
        <Input
          type="text"
          placeholder={isArabic ? 'ابحث بالاسم أو رقم الهاتف...' : 'Search by name or phone...'}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className={cn(
            isArabic ? "pr-10 text-right" : "pl-10"
          )}
        />
      </div>

      {/* Search Button */}
      <Button 
        onClick={handleSearch} 
        variant="secondary"
        className="whitespace-nowrap"
      >
        <Search className={cn("h-4 w-4", isArabic ? "ml-2" : "mr-2")} />
        {isArabic ? 'بحث' : 'Search'}
      </Button>

      {/* Clear Button */}
      {searchInput && (
        <Button 
          onClick={handleClear} 
          variant="outline"
          className="whitespace-nowrap"
        >
          <X className={cn("h-4 w-4", isArabic ? "ml-2" : "mr-2")} />
          {isArabic ? 'مسح' : 'Clear'}
        </Button>
      )}
    </div>
  )
}

export default OrdersSearchFilter
