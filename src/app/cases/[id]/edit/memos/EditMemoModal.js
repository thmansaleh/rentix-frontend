"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { updateMemo } from "@/app/services/api/memos"
import { toast } from "react-toastify"
import { useMemoById } from "./hooks/useMemoById"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import RichTextEditor from "@/components/RichTextEditor"

const MEMO_STATUSES = [
  { value: "Draft", labelAr: "مسودة", labelEn: "Draft" },
  { value: "Approved", labelAr: "معتمد", labelEn: "Approved" },
  { value: "Pending Approval", labelAr: "في انتظار الموافقة", labelEn: "Pending Approval" },
  { value: "Submitted to Court", labelAr: "مقدم للمحكمة", labelEn: "Submitted to Court" },
  { value: "Rejected", labelAr: "مرفوض", labelEn: "Rejected" }
]

export default function EditMemoModal({ isOpen, onClose, memoId, onSuccess, employeeRole }) {
  const { memo, isLoading, error, mutate } = useMemoById(memoId, isOpen)
  const { t } = useTranslations()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    submission_date: null,
    description: "",
    status: "",
    admin_note: "",
    files: []
  })

  // Populate form when memo data is loaded
  useEffect(() => {
    if (memo) {
      
      setFormData({
        title: memo.title || "",
        submission_date: memo.submission_date ? new Date(memo.submission_date) : null,
        description: memo.description || "",
        status: memo.status ? memo.status.trim() : "",
        admin_note: memo.admin_note || "",
        files: []
      })
    }
  }, [memo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.submission_date) {
      toast.error(t('memos.fillAllRequired'))
      return
    }
    
    if (!formData.status) {
      toast.error(t('memos.fillAllRequired'))
      return
    }

    setIsSubmitting(true)

    try {
      // Format date to YYYY-MM-DD for MySQL
      const formattedData = {
        ...formData,
        submission_date: formData.submission_date 
          ? format(formData.submission_date, 'yyyy-MM-dd')
          : null
      }

      const response = await updateMemo(memoId, formattedData)
      
      // Check if response indicates failure (permission or other errors)
      if (response?.success === false) {
        toast.error(response?.message || t('memos.errorUpdatingMemo'));
        return;
      }
      
      if (response.success) {
        toast.success(t('memos.memoUpdatedSuccessfully'))
        
        // Revalidate the memo data in cache
        mutate()
        
        // Call onSuccess to refresh the memos list
        if (onSuccess) {
          onSuccess()
        }
        
        handleClose()
      }
    } catch (error) {
      // Check if it's a permission error (403)
      const isPermissionError = error?.response?.status === 403;
      const errorMessage = isPermissionError 
        ? (error?.response?.data?.message || (language === 'ar' ? 'ليس لديك صلاحية لتحديث المذكرة' : 'You do not have permission to update this memo'))
        : (error?.response?.data?.message || error.message || t('memos.errorUpdatingMemo'));
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        submission_date: null,
        description: "",
        status: "",
        admin_note: "",
        files: []
      })
      onClose()
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }))
  }

  const handleRemoveFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('memos.editMemo')}</DialogTitle>
          <DialogDescription>
            {t('memos.updateMemoDetails')}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {t('memos.errorLoadingMemo')}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t('memos.memoTitle')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('memos.titlePlaceholder')}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Submission Date */}
              <div className="space-y-2">
                <Label>
                  {t('memos.submissionDate')} <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.submission_date && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.submission_date ? (
                        format(formData.submission_date, "PPP", { locale: language === 'ar' ? ar : undefined })
                      ) : (
                        <span>{t('memos.selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.submission_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, submission_date: date }))}
                      initialFocus
                      locale={language === 'ar' ? ar : undefined}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status - Only show for admin or secretary */}
              {/* {canEditStatus && (
                <div className="space-y-2">
                  <Label>
                    {t('memos.status')} <span className="text-red-500">*</span>
                  </Label>
                  {memo && formData.status ? (
                    <Select
                      key={`status-${memo.id}-${formData.status}`}
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('memos.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMO_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {language === 'ar' ? status.labelAr : status.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center justify-center h-10 border rounded-md bg-muted/50">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              )} */}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('memos.description')}</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
                  placeholder={t('memos.descriptionPlaceholder')}
                  disabled={isSubmitting}
                />
              </div>

              {/* Admin Note */}
              <div className="space-y-2">
                <Label htmlFor="admin_note">{t('memos.adminNote')}</Label>
                <Textarea
                  id="admin_note"
                  value={formData.admin_note}
                  onChange={(e) => setFormData(prev => ({ ...prev, admin_note: e.target.value }))}
                  placeholder={t('memos.adminNotePlaceholder')}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Existing Documents */}
              {memo?.documents && memo.documents.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('memos.existingDocuments')}:</Label>
                  <div className="space-y-2 border rounded-lg p-3">
                    {memo.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md"
                      >
                        <span className="text-sm truncate flex-1">
                          {doc.document_name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.document_url, '_blank')}
                          className="h-8 px-3"
                        >
                          {t('common.download')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <Label>{t('memos.attachments')}</Label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <Label 
                      htmlFor="file-upload" 
                      className={cn(
                        "cursor-pointer text-sm text-blue-600 hover:text-blue-700",
                        isSubmitting && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {t('memos.clickToUpload')}
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('memos.supportedFormats')}
                    </p>
                  </div>

                  {/* Display selected files */}
                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">{t('memos.selectedFiles')}:</Label>
                      <div className="space-y-2">
                        {formData.files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                          >
                            <span className="text-sm truncate flex-1">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                              className="h-8 w-8 p-0"
                              disabled={isSubmitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t('memos.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('memos.saving')}
                  </>
                ) : (
                  t('memos.saveChanges')
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
