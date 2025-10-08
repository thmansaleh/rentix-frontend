"use client"

import React, { useEffect } from 'react'
import { format } from 'date-fns'
import useSWR from 'swr'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Loader2, Save, X, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { getClientDealById, updateClientDeal } from '@/app/services/api/clientsDeals'
import { getPartiesByBranch } from '@/app/services/api/parties'

const EditDealModal = ({ 
  isOpen, 
  onClose, 
  dealId, 
  onSuccess 
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // Validation schema
  const validationSchema = Yup.object({
    client_id: Yup.string().required(isArabic ? 'العميل مطلوب' : 'Client is required'),
    amount: Yup.number()
      .required(isArabic ? 'المبلغ مطلوب' : 'Amount is required')
      .positive(isArabic ? 'المبلغ يجب أن يكون أكبر من الصفر' : 'Amount must be greater than zero'),
    type: Yup.string().required(isArabic ? 'نوع الصفقة مطلوب' : 'Deal type is required'),
    status: Yup.string().required(isArabic ? 'الحالة مطلوبة' : 'Status is required'),
    start_date: Yup.date().nullable(),
    end_date: Yup.date().nullable()
      .when('start_date', (start_date, schema) => 
        start_date ? schema.min(start_date, isArabic ? 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية' : 'End date must be after start date') : schema
      )
  })

  // Formik setup
  const formik = useFormik({
    initialValues: {
      client_id: '',
      amount: '',
      type: 'normal',
      status: 'draft',
      start_date: null,
      end_date: null
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updateData = {
          client_id: parseInt(values.client_id),
          amount: parseFloat(values.amount),
          type: values.type,
          status: values.status,
          start_date: values.start_date ? format(values.start_date, 'yyyy-MM-dd') : null,
          end_date: values.end_date ? format(values.end_date, 'yyyy-MM-dd') : null
        }

        const response = await updateClientDeal(dealId, updateData)
        
        if (response.success) {
          toast.success(isArabic ? 'تم تحديث الصفقة بنجاح' : 'Deal updated successfully')
          onSuccess?.()
          onClose()
        } else {
          toast.error(response.error || (isArabic ? 'حدث خطأ أثناء تحديث الصفقة' : 'Error updating deal'))
        }
      } catch (error) {
        console.error('Error updating deal:', error)
        toast.error(isArabic ? 'حدث خطأ أثناء تحديث الصفقة' : 'Error updating deal')
      } finally {
        setSubmitting(false)
      }
    }
  })

  // Fetch deal data
  const { data: dealData, error: dealError, isLoading: dealLoading } = useSWR(
    dealId && isOpen ? `deal-${dealId}` : null,
    () => getClientDealById(dealId),
    {
      revalidateOnFocus: false,
    }
  )

  // Fetch clients/parties for dropdown
  const { data: partiesResponse } = useSWR(
    'parties-branch-1',
    () => getPartiesByBranch(1),
    {
      revalidateOnFocus: false,
    }
  )

  const clients = partiesResponse?.success ? partiesResponse.data : []

  // Status options
  const statusOptions = [
    { value: 'draft', label: isArabic ? 'مسودة' : 'Draft' },
    { value: 'completed', label: isArabic ? 'مكتمل' : 'Completed' }
  ]

  // Type options
  const typeOptions = [
    { value: 'normal', label: isArabic ? 'عادية' : 'Normal' },
    { value: 'yearly', label: isArabic ? 'سنوية' : 'Yearly' }
  ]

  // Load deal data into form when modal opens
  useEffect(() => {
    if (dealData?.success && dealData.data) {
      const deal = dealData.data
      formik.setValues({
        client_id: deal.client_id?.toString() || '',
        amount: deal.amount?.toString() || '',
        type: deal.type || 'normal',
        status: deal.status || 'draft',
        start_date: deal.start_date ? new Date(deal.start_date) : null,
        end_date: deal.end_date ? new Date(deal.end_date) : null
      })
    }
  }, [dealData])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm()
    }
  }, [isOpen])

  // Helper function to get error message
  const getErrorMessage = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : null
  }

  if (dealError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {isArabic ? 'خطأ' : 'Error'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {isArabic ? 'حدث خطأ أثناء تحميل بيانات الصفقة' : 'Error loading deal data'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {isArabic ? 'إغلاق' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {isArabic ? 'تعديل الاتفاقية' : 'Edit Deal'}
          </DialogTitle>
        </DialogHeader>

        {dealLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Client Selection */}
              <div className="space-y-2">
                <Label htmlFor="client_id">
                  {isArabic ? 'العميل *' : 'Client *'}
                </Label>
                <Select
                  name="client_id"
                  value={formik.values.client_id}
                  onValueChange={(value) => formik.setFieldValue('client_id', value)}
                  disabled={formik.isSubmitting}
                >
                  <SelectTrigger className={getErrorMessage('client_id') ? 'border-destructive' : ''}>
                    <SelectValue placeholder={isArabic ? 'اختر العميل' : 'Select client'} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getErrorMessage('client_id') && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {getErrorMessage('client_id')}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {isArabic ? 'المبلغ *' : 'Amount *'}
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={isArabic ? 'أدخل المبلغ' : 'Enter amount'}
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                  className={getErrorMessage('amount') ? 'border-destructive' : ''}
                />
                {getErrorMessage('amount') && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {getErrorMessage('amount')}
                  </div>
                )}
              </div>

              {/* Type and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-2">
                  <Label>
                    {isArabic ? 'نوع الصفقة *' : 'Deal Type *'}
                  </Label>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onValueChange={(value) => formik.setFieldValue('type', value)}
                    disabled={formik.isSubmitting}
                  >
                    <SelectTrigger className={getErrorMessage('type') ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getErrorMessage('type') && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {getErrorMessage('type')}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>
                    {isArabic ? 'الحالة *' : 'Status *'}
                  </Label>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onValueChange={(value) => formik.setFieldValue('status', value)}
                    disabled={formik.isSubmitting}
                  >
                    <SelectTrigger className={getErrorMessage('status') ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getErrorMessage('status') && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {getErrorMessage('status')}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label>
                    {isArabic ? 'تاريخ البداية' : 'Start Date'}
                  </Label>
                  <DatePicker
                    date={formik.values.start_date}
                    onDateChange={(date) => formik.setFieldValue('start_date', date)}
                    placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
                    disabled={formik.isSubmitting}
                  />
                  {getErrorMessage('start_date') && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {getErrorMessage('start_date')}
                    </div>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label>
                    {isArabic ? 'تاريخ النهاية' : 'End Date'}
                  </Label>
                  <DatePicker
                    date={formik.values.end_date}
                    onDateChange={(date) => formik.setFieldValue('end_date', date)}
                    placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
                    minDate={formik.values.start_date}
                    disabled={formik.isSubmitting}
                  />
                  {getErrorMessage('end_date') && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {getErrorMessage('end_date')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}

        <DialogFooter className="flex gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={onClose}
            disabled={formik.isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            type="button"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting || dealLoading || !formik.isValid}
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isArabic ? 'جاري التحديث...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isArabic ? 'تحديث' : 'Update'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditDealModal