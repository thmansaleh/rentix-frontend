"use client"

import React from 'react'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

function Inputs({ formikProps }) {
  const { values, errors, touched, setFieldValue, handleChange, handleBlur } = formikProps
  
  const { t } = useTranslations()
  const { language } = useLanguage()

  // Convert date string back to Date object for Calendar component
  const selectedDate = values.start_date ? new Date(values.start_date) : null

  // Helper function to format date as YYYY-MM-DD for database
  const formatDateForDatabase = (date) => {
    if (!date) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (date) => {
    const formattedDate = formatDateForDatabase(date)
    setFieldValue('start_date', formattedDate)
  }

  return (
    <div className="space-y-4 grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Case Number */}
      <div className="space-y-2">
        <Label htmlFor="case_number">
          {t('caseForm.caseNumber')} 
        </Label>
        <Input
          id="case_number"
          name="case_number"
          type="text"
          value={values.case_number}
          onChange={handleChange}
          placeholder={t('caseForm.enterCaseNumber')}
          className={`w-full ${errors.case_number && touched.case_number ? 'border-red-500' : ''}`}
          
        />
        {errors.case_number && touched.case_number && (
          <div className="text-red-500 text-sm">{errors.case_number}</div>
        )}
      </div>

      {/* Fees and Expenses Combined */}
      <div className="space-y-2">
        <Label htmlFor="fees">
          {t('caseForm.feesAndExpenses')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fees"
          name="fees"
          type="number"
          value={values.fees}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('caseForm.enterFeesAndExpenses')}
          className={`w-full ${errors.fees && touched.fees ? 'border-red-500' : ''}`}
          min="0"
          step="1"
          required
        />
        {errors.fees && touched.fees && (
          <div className="text-red-500 text-sm">{errors.fees}</div>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label>
          {t('caseForm.startDate')} <span className="text-red-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                errors.start_date && touched.start_date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>{t('caseForm.selectDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.start_date && touched.start_date && (
          <div className="text-red-500 text-sm">{errors.start_date}</div>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-2 col-span-2">
        <Label htmlFor="topic">
          {t('caseForm.subject')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="topic"
          name="topic"
          value={values.topic}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('caseForm.enterSubject')}
          className={`w-full min-h-[100px] ${errors.topic && touched.topic ? 'border-red-500' : ''}`}
          rows={4}
          required
        />
        {errors.topic && touched.topic && (
          <div className="text-red-500 text-sm">{errors.topic}</div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additional_note">
          {t('caseForm.additionalNotes')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="additional_note"
          name="additional_note"
          value={values.additional_note}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t('caseForm.enterAdditionalNotes')}
          className={`w-full min-h-[120px] ${errors.additional_note && touched.additional_note ? 'border-red-500' : ''}`}
          rows={5}
        />
        {errors.additional_note && touched.additional_note && (
          <div className="text-red-500 text-sm">{errors.additional_note}</div>
        )}
      </div>
    </div>
  )
}

export default Inputs