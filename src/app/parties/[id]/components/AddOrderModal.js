"use client"

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createPartyOrder } from '@/app/services/api/partiesOrders'

const AddOrderModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  partyId 
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.jobId)

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    date: null,
    status: 'pending',
    case_number: '',
    details: ''
  })

  // Status options
  const statusOptions = [
    { value: 'pending', label: t('orders.pending') || (isArabic ? 'قيد الانتظار' : 'Pending') },
    { value: 'approved', label: t('orders.approved') || (isArabic ? 'موافق عليه' : 'Approved') },
    { value: 'rejected', label: t('orders.rejected') || (isArabic ? 'مرفوض' : 'Rejected') },
  ]

  // Type options - matching client-app request types
  const typeOptions = isArabic ? [
    { value: 'استشارة قانونية', label: 'استشارة قانونية' },
    { value: 'طلب مستند', label: 'طلب مستند' },
    { value: 'تحديث حالة القضية', label: 'تحديث حالة القضية' },
    { value: 'موعد', label: 'موعد' },
    { value: 'استفسار مالي', label: 'استفسار مالي' },
    { value: 'أخرى', label: 'أخرى' }
  ] : [
    { value: 'Legal Consultation', label: 'Legal Consultation' },
    { value: 'Document Request', label: 'Document Request' },
    { value: 'Case Update', label: 'Case Update' },
    { value: 'Appointment', label: 'Appointment' },
    { value: 'Financial Inquiry', label: 'Financial Inquiry' },
    { value: 'Other', label: 'Other' }
  ]

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        type: 'document_request',
        date: null,
        status: 'pending',
        case_number: '',
        details: ''
      })
    }
  }, [isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.type) {
      toast.error(t('orders.typeRequired') || (isArabic ? 'يرجى اختيار نوع الأمر' : 'Please select order type'))
      return false
    }
    if (!formData.date) {
      toast.error(t('orders.dateRequired') || (isArabic ? 'يرجى اختيار التاريخ' : 'Please select a date'))
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const createData = {
        party_id: parseInt(partyId),
        type: formData.type,
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
        status: formData.status,
        case_number: formData.case_number || null,
        details: formData.details || null,
        created_by: currentUser || null
      }

      const response = await createPartyOrder(createData)
      
      if (response.id || response.message) {
        toast.success(t('orders.createSuccess') || (isArabic ? 'تم إنشاء الأمر بنجاح' : 'Order created successfully'))
        onSuccess?.()
        onClose()
      } else {
        toast.error(response.error || t('orders.createError') || (isArabic ? 'حدث خطأ أثناء إنشاء الأمر' : 'Error creating order'))
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error(t('orders.createError') || (isArabic ? 'حدث خطأ أثناء إنشاء الأمر' : 'Error creating order'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={isArabic ? 'text-right' : 'text-left'}>
            {t('orders.addOrder') || (isArabic ? 'إضافة أمر جديد' : 'Add New Order')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className={isArabic ? 'text-right block' : ''}>
              {t('orders.type') || (isArabic ? 'نوع الطلب' : 'Order Type')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('orders.selectType') || (isArabic ? 'اختر نوع الطلب' : 'Select order type')} />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className={isArabic ? 'text-right block' : ''}>
              {t('orders.date') || (isArabic ? 'التاريخ' : 'Date')} <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={formData.date}
              onDateChange={(date) => handleInputChange('date', date)}
              placeholder={t('orders.selectDate') || (isArabic ? 'اختر التاريخ' : 'Select date')}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className={isArabic ? 'text-right block' : ''}>
              {t('orders.status') || (isArabic ? 'الحالة' : 'Status')}
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('orders.selectStatus') || (isArabic ? 'اختر الحالة' : 'Select status')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Case Number */}
          <div className="space-y-2">
            <Label htmlFor="case_number" className={isArabic ? 'text-right block' : ''}>
              {t('orders.caseNumber') || (isArabic ? 'رقم القضية' : 'Case Number')}
            </Label>
            <Input
              id="case_number"
              value={formData.case_number}
              onChange={(e) => handleInputChange('case_number', e.target.value)}
              placeholder={t('orders.enterCaseNumber') || (isArabic ? 'أدخل رقم القضية' : 'Enter case number')}
              className={isArabic ? 'text-right' : ''}
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details" className={isArabic ? 'text-right block' : ''}>
              {t('orders.details') || (isArabic ? 'التفاصيل' : 'Details')}
            </Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder={t('orders.enterDetails') || (isArabic ? 'أدخل التفاصيل...' : 'Enter details...')}
              rows={4}
              className={isArabic ? 'text-right' : ''}
            />
          </div>
        </div>

        <DialogFooter className={isArabic ? 'flex-row-reverse' : ''}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common.cancel') || (isArabic ? 'إلغاء' : 'Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? (t('orders.saving') || (isArabic ? 'جاري الحفظ...' : 'Saving...')) : (t('common.save') || (isArabic ? 'إضافة' : 'Add'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddOrderModal
