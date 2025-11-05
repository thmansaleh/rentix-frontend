"use client"

import React, { useState, useEffect, useCallback } from 'react'
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
import { SearchableCombobox } from "@/components/ui/searchable-combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createPartyOrder } from '@/app/services/api/partiesOrders'
import { searchParties } from '@/app/services/api/parties'

const AddOrderModal = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // Get current user from Redux
  const currentUser = useSelector((state) => state.auth.jobId)

  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [formData, setFormData] = useState({
    party_id: '',
    type: '',
    date: null,
    status: 'pending',
    case_number: '',
    details: ''
  })

  // Handle party search
  const handlePartySearch = useCallback(async (query) => {
    try {
      const response = await searchParties(query)
      if (response.success) {
        setSearchResults(response.data)
      }
    } catch (error) {

    }
  }, [])

  // Format options for combobox
  const partyOptions = searchResults.map(party => ({
    value: party.id,
    label: `${party.name}${party.phone ? ` - ${party.phone}` : ''}`,
    phone: party.phone,
    name: party.name
  }))

  // Status options
  const statusOptions = [
    { value: 'pending', label: isArabic ? 'قيد الانتظار' : 'Pending' },
    { value: 'approved', label: isArabic ? 'موافق عليه' : 'Approved' },
    { value: 'rejected', label: isArabic ? 'مرفوض' : 'Rejected' },
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
        party_id: '',
        type: '',
        date: null,
        status: 'pending',
        case_number: '',
        details: ''
      })
      setSearchResults([])
    }
  }, [isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.party_id) {
      toast.error(isArabic ? 'يرجى اختيار الطرف' : 'Please select a party')
      return false
    }
    if (!formData.type) {
      toast.error(isArabic ? 'يرجى اختيار نوع الطلب' : 'Please select request type')
      return false
    }
    if (!formData.date) {
      toast.error(isArabic ? 'يرجى اختيار التاريخ' : 'Please select a date')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const createData = {
        party_id: parseInt(formData.party_id),
        type: formData.type,
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
        status: formData.status,
        case_number: formData.case_number || null,
        details: formData.details || null,
        created_by: currentUser || null
      }

      const response = await createPartyOrder(createData)
      
      if (response.id || response.message) {
        toast.success(isArabic ? 'تم إنشاء الطلب بنجاح' : 'Request created successfully')
        onSuccess?.()
        onClose()
      } else {
        toast.error(response.error || (isArabic ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error creating request'))
      }
    } catch (error) {

      toast.error(isArabic ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error creating request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={isArabic ? 'text-right' : 'text-left'}>
            {isArabic ? 'إضافة طلب جديد' : 'Add New Request'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Party Selection */}
          <div className="space-y-2">
            <Label htmlFor="party" className={isArabic ? 'text-right block' : ''}>
              {isArabic ? 'الطرف' : 'Party'} <span className="text-red-500">*</span>
            </Label>
            <SearchableCombobox
              value={formData.party_id}
              onValueChange={(value) => handleInputChange('party_id', value)}
              onSearch={handlePartySearch}
              options={partyOptions}
              placeholder={isArabic ? 'ابحث عن الطرف...' : 'Search for party...'}
              emptyMessage={isArabic ? 'لم يتم العثور على أطراف' : 'No parties found'}
              searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'}
            />
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className={isArabic ? 'text-right block' : ''}>
              {isArabic ? 'نوع الطلب' : 'Request Type'} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'اختر نوع الطلب' : 'Select request type'} />
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
              {isArabic ? 'التاريخ' : 'Date'} <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={formData.date}
              onDateChange={(date) => handleInputChange('date', date)}
              placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className={isArabic ? 'text-right block' : ''}>
              {isArabic ? 'الحالة' : 'Status'}
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
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
              {isArabic ? 'رقم القضية' : 'Case Number'}
            </Label>
            <Input
              id="case_number"
              value={formData.case_number}
              onChange={(e) => handleInputChange('case_number', e.target.value)}
              placeholder={isArabic ? 'أدخل رقم القضية' : 'Enter case number'}
              className={isArabic ? 'text-right' : ''}
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details" className={isArabic ? 'text-right block' : ''}>
              {isArabic ? 'التفاصيل' : 'Details'}
            </Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder={isArabic ? 'أدخل التفاصيل...' : 'Enter details...'}
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
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isArabic ? 'إضافة' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddOrderModal
