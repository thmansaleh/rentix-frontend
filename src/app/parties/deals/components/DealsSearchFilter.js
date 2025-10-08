"use client"

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"

const DealsSearchFilter = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  className
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // Status options for client deals
  const statusOptions = [
    { value: 'all', label: isArabic ? 'جميع الحالات' : 'All Status' },
    { value: 'draft', label: isArabic ? 'مسودة' : 'Draft' },
    { value: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
  ]

  // Deal type options
  const typeOptions = [
    { value: 'all', label: isArabic ? 'جميع الأنواع' : 'All Types' },
    { value: 'normal', label: isArabic ? 'عادية' : 'normal' },
    { value: 'yearly', label: isArabic ? 'سنوية' : 'yearly' },
  ]

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.type !== 'all' || 
                          filters.start_date || 
                          filters.end_date ||
                          filters.created_by

  return (
    <div className={cn("w-full bg-muted/30 border rounded-lg p-3", className)}>
      <div className="space-y-3">
        {/* Compact Header and Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search Input - Takes priority space */}
          <div className="relative  min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isArabic ? 'البحث...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-8"
            />
          </div>

          {/* Compact Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue placeholder={isArabic ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select
              value={filters.type}
              onValueChange={(value) => onFilterChange('type', value)}
            >
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue placeholder={isArabic ? 'النوع' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filters */}
            <DatePicker
              date={filters.start_date}
              onDateChange={(date) => onFilterChange('start_date', date)}
              placeholder={isArabic ? 'من' : 'From'}
              className="h-8 w-44 text-xs"
            />
            
            <DatePicker
              date={filters.end_date}
              onDateChange={(date) => onFilterChange('end_date', date)}
              placeholder={isArabic ? 'إلى' : 'To'}
              className="h-8 w-44 text-xs"
              minDate={filters.start_date}
            />

            {/* Clear Button */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="h-8 px-2 text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display - Compact */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1">
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-2">
                <span>
                  {statusOptions.find(opt => opt.value === filters.status)?.label}
                </span>
                <X 
                  className="h-2 w-2 cursor-pointer" 
                  onClick={() => onFilterChange('status', 'all')}
                />
              </Badge>
            )}
            
            {filters.type !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-2">
                <span>
                  {typeOptions.find(opt => opt.value === filters.type)?.label}
                </span>
                <X 
                  className="h-2 w-2 cursor-pointer" 
                  onClick={() => onFilterChange('type', 'all')}
                />
              </Badge>
            )}
            
            {filters.start_date && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-2">
                <span>
                  {isArabic ? 'من: ' : 'From: '}
                  {new Date(filters.start_date).toLocaleDateString()}
                </span>
                <X 
                  className="h-2 w-2 cursor-pointer" 
                  onClick={() => onFilterChange('start_date', null)}
                />
              </Badge>
            )}
            
            {filters.end_date && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-2">
                <span>
                  {isArabic ? 'إلى: ' : 'To: '}
                  {new Date(filters.end_date).toLocaleDateString()}
                </span>
                <X 
                  className="h-2 w-2 cursor-pointer" 
                  onClick={() => onFilterChange('end_date', null)}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DealsSearchFilter