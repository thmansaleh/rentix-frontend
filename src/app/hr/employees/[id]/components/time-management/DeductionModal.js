"use client"

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createDeduction, updateDeduction } from '@/app/services/api/deductions'

const DeductionModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  employeeId,
  deduction = null // If provided, we're editing
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const isEditMode = !!deduction

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: employeeId,
    date: null,
    amount: '',
    reason: ''
  })

  // Reason options
  const reasonOptions = [
    { value: 'غياب', label: isArabic ? 'غياب' : 'Absence' },
    { value: 'تأخير', label: isArabic ? 'تأخير' : 'Late Arrival' },
    { value: 'خصم جزائي', label: isArabic ? 'خصم جزائي' : 'Penalty Deduction' },
    { value: 'إهمال', label: isArabic ? 'إهمال' : 'Negligence' },
    { value: 'أخرى', label: isArabic ? 'أخرى' : 'Other' }
  ]

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && deduction) {
      setFormData({
        employee_id: deduction.employee_id,
        date: deduction.date ? new Date(deduction.date) : null,
        amount: deduction.amount.toString(),
        reason: deduction.reason
      })
    } else {
      setFormData({
        employee_id: employeeId,
        date: null,
        amount: '',
        reason: ''
      })
    }
  }, [deduction, isEditMode, employeeId])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        employee_id: employeeId,
        date: null,
        amount: '',
        reason: ''
      })
    }
  }, [isOpen, employeeId])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.date) {
      toast.error(isArabic ? 'يرجى اختيار التاريخ' : 'Please select a date')
      return false
    }
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      toast.error(isArabic ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount')
      return false
    }
    if (parseFloat(formData.amount) <= 0) {
      toast.error(isArabic ? 'المبلغ يجب أن يكون أكبر من الصفر' : 'Amount must be greater than zero')
      return false
    }
    if (!formData.reason || formData.reason.trim() === '') {
      toast.error(isArabic ? 'يرجى اختيار سبب الخصم' : 'Please select a deduction reason')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const submitData = {
        employee_id: formData.employee_id,
        date: format(formData.date, 'yyyy-MM-dd'),
        amount: parseFloat(formData.amount),
        reason: formData.reason.trim()
      }

      let response
      if (isEditMode) {
        response = await updateDeduction(deduction.id, submitData)
      } else {
        response = await createDeduction(submitData)
      }

      if (response.success) {
        toast.success(
          isArabic 
            ? (isEditMode ? 'تم تحديث الخصم بنجاح' : 'تم إضافة الخصم بنجاح')
            : (isEditMode ? 'Deduction updated successfully' : 'Deduction added successfully')
        )
        onSuccess?.()
        onClose()
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error saving deduction:', error)
      toast.error(
        error.response?.data?.message || 
        (isArabic ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving deduction')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isArabic 
              ? (isEditMode ? 'تعديل خصم' : 'إضافة خصم جديد')
              : (isEditMode ? 'Edit Deduction' : 'Add New Deduction')
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">
              {isArabic ? 'التاريخ' : 'Date'} <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={formData.date}
              onDateChange={(date) => handleInputChange('date', date)}
              placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {isArabic ? 'المبلغ' : 'Amount'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder={isArabic ? 'أدخل المبلغ' : 'Enter amount'}
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              {isArabic ? 'السبب' : 'Reason'} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => handleInputChange('reason', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'اختر السبب' : 'Select reason'} />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isArabic ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              isArabic ? 'حفظ' : 'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeductionModal
