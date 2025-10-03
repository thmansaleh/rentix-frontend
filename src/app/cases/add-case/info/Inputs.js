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
import { useFormikContext } from '../FormikContext'

function Inputs() {
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext()
  const { 
    caseNumber,
    fees,
    topic,
    caseStartDate,
    additionalNote
  } = values
  
  const { t } = useTranslations()
  const { language } = useLanguage()

  // Convert date string back to Date object for Calendar component
  const selectedDate = caseStartDate ? new Date(caseStartDate) : null

  // Helper function to format date as YYYY-MM-DD for database
  const formatDateForDatabase = (date) => {
    if (!date) return null
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Case Number */}
      <div className="space-y-2">
        <Label htmlFor="caseNumber">
          {t('caseForm.caseNumber')} 
        </Label>
        <Input
          id="caseNumber"
          type="text"
          value={caseNumber}
          onChange={(e) => setFieldValue('caseNumber', e.target.value)}
          onSubmit={() => setFieldTouched('caseNumber', true)}
          placeholder={t('caseForm.enterCaseNumber')}
          className={`w-full ${errors.caseNumber && touched.caseNumber ? 'border-red-500' : ''}`}
          
        />
        {errors.caseNumber && touched.caseNumber && (
          <div className="text-red-500 text-sm">{errors.caseNumber}</div>
        )}
      </div>

      {/* Fees and Expenses Combined */}
      <div className="space-y-2">
        <Label htmlFor="feesAndExpenses">
          {t('caseForm.feesAndExpenses')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="feesAndExpenses"
          type="number"
          value={fees}
          onChange={(e) => setFieldValue('fees', e.target.value)}
          onSubmit={() => setFieldTouched('fees', true)}
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
                errors.caseStartDate && touched.caseStartDate && "border-red-500"
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
              onSelect={(date) => {
                const formattedDate = formatDateForDatabase(date)
                setFieldTouched('caseStartDate', true)
                setFieldValue('caseStartDate', formattedDate)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.caseStartDate && touched.caseStartDate && (
          <div className="text-red-500 text-sm">{errors.caseStartDate}</div>
        )}
      </div>
      {/* Subject */}
      <div className="space-y-2 col-span-2">
        <Label htmlFor="subject">
          {t('caseForm.subject')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="subject"
          value={topic}
          onChange={(e) => setFieldValue('topic', e.target.value)}
          onSubmit={() => setFieldTouched('topic', true)}
          placeholder={t('caseForm.enterSubject')}
          className={`w-full min-h-[100px] ${errors.topic && touched.topic ? 'border-red-500' : ''}`}
          rows={4}
          required
        />
        {errors.topic && touched.topic && (
          <div className="text-red-500 text-sm">{errors.topic}</div>
        )}
      </div>

      {/* Start Date */}
    

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">
          {t('caseForm.additionalNotes')}
        </Label>
        <Textarea
          id="additionalNotes"
          value={additionalNote}
          onChange={(e) => setFieldValue('additionalNote', e.target.value)}
          onSubmit={() => setFieldTouched('additionalNote', true)}
          placeholder={t('caseForm.enterAdditionalNotes')}
          className={`w-full min-h-[120px] ${errors.additionalNote && touched.additionalNote ? 'border-red-500' : ''}`}
          rows={5}
        />
        {errors.additionalNote && touched.additionalNote && (
          <div className="text-red-500 text-sm">{errors.additionalNote}</div>
        )}
      </div>
    </div>
  )
}

export default Inputs