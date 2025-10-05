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

const MEMO_STATUSES = [
  { value: "Draft", label: "مسودة" },
  { value: "Approved", label: "معتمد" },
  { value: "Pending Approval", label: "في انتظار الموافقة" },
  { value: "Submitted to Court", label: "مقدم للمحكمة" },
  { value: "Rejected", label: "مرفوض" }
]

export default function EditMemoModal({ isOpen, onClose, memoId, onSuccess, employeeRole }) {
  const { memo, isLoading, error, mutate } = useMemoById(memoId, isOpen)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Check if user can edit status (only admin or secretary)
  const canEditStatus = employeeRole?.toLowerCase() === 'admin' || employeeRole?.toLowerCase() === 'secretary'
//   console.log("Can edit status:", employeeRole)
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
      toast.error("الرجاء ملء جميع الحقول المطلوبة")
      return
    }
    
    // Validate status only if user can edit it
    if (canEditStatus && !formData.status) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة")
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
      
      // Remove status from formData if user can't edit it
      if (!canEditStatus) {
        delete formattedData.status
      }

      const response = await updateMemo(memoId, formattedData)
      
      if (response.success) {
        toast.success("تم تحديث المذكرة بنجاح")
        
        // Revalidate the memo data in cache
        mutate()
        
        // Call onSuccess to refresh the memos list
        if (onSuccess) {
          onSuccess()
        }
        
        handleClose()
      } else {
        throw new Error(response.message || "فشل في تحديث المذكرة")
      }
    } catch (error) {
      console.error("Error updating memo:", error)
      toast.error(error.message || "حدث خطأ أثناء تحديث المذكرة")
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
          <DialogTitle>تعديل المذكرة</DialogTitle>
          <DialogDescription>
            تعديل تفاصيل المذكرة
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            حدث خطأ أثناء تحميل المذكرة
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  العنوان <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان المذكرة"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Submission Date */}
              <div className="space-y-2">
                <Label>
                  تاريخ التقديم <span className="text-red-500">*</span>
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
                        format(formData.submission_date, "PPP", { locale: ar })
                      ) : (
                        <span>اختر التاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.submission_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, submission_date: date }))}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status - Only show for admin or secretary */}
              {canEditStatus && (
                <div className="space-y-2">
                  <Label>
                    الحالة <span className="text-red-500">*</span>
                  </Label>
                  {memo && formData.status ? (
                    <Select
                      key={`status-${memo.id}-${formData.status}`}
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMO_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف المذكرة"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              {/* Admin Note */}
              <div className="space-y-2">
                <Label htmlFor="admin_note">ملاحظة الإدارة</Label>
                <Textarea
                  id="admin_note"
                  value={formData.admin_note}
                  onChange={(e) => setFormData(prev => ({ ...prev, admin_note: e.target.value }))}
                  placeholder="أدخل ملاحظة الإدارة"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>المرفقات</Label>
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
                      انقر للتحميل
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
                      PDF, Word, Image (حتى 10MB)
                    </p>
                  </div>

                  {/* Display selected files */}
                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">الملفات المحددة:</Label>
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
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
