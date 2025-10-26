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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableCombobox } from "@/components/ui/searchable-combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X, Upload, FileText, Image as ImageIcon, File, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createClientDeal } from '@/app/services/api/clientsDeals'
import { searchParties } from '@/app/services/api/parties'
import { cn } from "@/lib/utils"

const AddDealModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  partyId 
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    client_id: partyId || '',
    amount: '',
    type: 'normal',
    status: 'draft',
    start_date: null,
    end_date: null
  })

  // Handle party search - wrapped in useCallback to prevent infinite re-renders
  const handlePartySearch = useCallback(async (query) => {
    try {
      const response = await searchParties(query)
      if (response.success) {
        setSearchResults(response.data)
      }
    } catch (error) {
      // Error searching parties
    }
  }, []) // Empty dependency array since searchParties is imported and stable

  // Format options for combobox
  const clientOptions = searchResults.map(client => ({
    value: client.id,
    label: `${client.name}${client.phone ? ` - ${client.phone}` : ''}`,
    phone: client.phone,
    name: client.name
  }))

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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        client_id: partyId || '',
        amount: '',
        type: 'normal',
        status: 'draft',
        start_date: null,
        end_date: null
      })
      setSearchResults([])
      setFiles([])
    }
  }, [isOpen, partyId])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // File handling functions
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const validateForm = () => {
    if (!formData.client_id) {
      toast.error(isArabic ? 'يرجى اختيار العميل' : 'Please select a client')
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
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const createData = {
        client_id: parseInt(formData.client_id),
        amount: parseFloat(formData.amount),
        type: formData.type,
        status: formData.status,
        start_date: formData.start_date ? format(formData.start_date, 'yyyy-MM-dd') : null,
        end_date: formData.end_date ? format(formData.end_date, 'yyyy-MM-dd') : null
      }

      const response = await createClientDeal(createData, files)
      
      if (response.success) {
        toast.success(isArabic ? 'تم إنشاء الاتفاقية بنجاح' : 'Deal created successfully')
        onSuccess?.()
        onClose()
      } else {
        toast.error(response.error || (isArabic ? 'حدث خطأ أثناء إنشاء الاتفاقية' : 'Error creating deal'))
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ أثناء إنشاء الاتفاقية' : 'Error creating deal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isArabic ? 'إضافة اتفاقية جديدة' : 'Add New Deal'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Client Selection - Hidden when partyId is provided */}
          {!partyId && (
            <div className="space-y-2">
              <Label htmlFor="client_id">
                {isArabic ? 'العميل *' : 'Client *'}
              </Label>
              <SearchableCombobox
                value={formData.client_id}
                onValueChange={(value) => handleInputChange('client_id', value)}
                onSearch={handlePartySearch}
                options={clientOptions}
                placeholder={isArabic ? 'ابحث عن عميل...' : 'Search for client...'}
                searchPlaceholder={isArabic ? 'ابحث بالاسم أو الهاتف...' : 'Search by name or phone...'}
                emptyMessage={isArabic ? 'لم يتم العثور على نتائج' : 'No results found'}
                disabled={isLoading}
                minSearchLength={3}
              />
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {isArabic ? 'المبلغ *' : 'Amount *'}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder={isArabic ? 'أدخل المبلغ' : 'Enter amount'}
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label>
                {isArabic ? 'نوع الاتفاقية' : 'Deal Type'}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
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
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>
                {isArabic ? 'الحالة' : 'Status'}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
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
                date={formData.start_date}
                onDateChange={(date) => handleInputChange('start_date', date)}
                placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
                disabled={isLoading}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>
                {isArabic ? 'تاريخ النهاية' : 'End Date'}
              </Label>
              <DatePicker
                date={formData.end_date}
                onDateChange={(date) => handleInputChange('end_date', date)}
                placeholder={isArabic ? 'اختر التاريخ' : 'Select date'}
                minDate={formData.start_date}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>
              {isArabic ? 'المستندات' : 'Documents'}
            </Label>
            
            {/* Upload Button */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="deal-file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('deal-file-upload')?.click()}
                disabled={isLoading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isArabic ? 'رفع ملفات' : 'Upload Files'}
              </Button>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-sm text-muted-foreground">
                  {isArabic ? `الملفات المرفوعة (${files.length})` : `Uploaded Files (${files.length})`}
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              {isArabic 
                ? 'الحقول المميزة بـ (*) مطلوبة'
                : 'Fields marked with (*) are required'
              }
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isArabic ? 'جاري الإنشاء...' : 'Creating...'}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {isArabic ? 'إضافة الاتفاقية' : 'Add Deal'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddDealModal