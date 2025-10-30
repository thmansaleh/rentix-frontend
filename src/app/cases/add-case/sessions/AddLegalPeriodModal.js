"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import { createLegalPeriod } from "@/app/services/api/legalPeriods"
import { CircleX, Save } from "lucide-react"

function AddLegalPeriodModal({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    objection_days: "",
    appeal_days: "",
    cassation_days: ""
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    // Name is required
    if (!formData.name || formData.name.trim() === '') {
      toast.error("اسم المدة القانونية مطلوب")
      return false
    }

    // At least one day field must have a value
    const hasAtLeastOneDay = 
      (formData.objection_days && parseInt(formData.objection_days) > 0) ||
      (formData.appeal_days && parseInt(formData.appeal_days) > 0) ||
      (formData.cassation_days && parseInt(formData.cassation_days) > 0)

    if (!hasAtLeastOneDay) {
      toast.error("يجب إدخال على الأقل واحد من الأيام (التظلم، الاستئناف، أو الطعن)")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const data = await createLegalPeriod({
        name: formData.name,
        objection_days: formData.objection_days ? parseInt(formData.objection_days) : null,
        appeal_days: formData.appeal_days ? parseInt(formData.appeal_days) : null,
        cassation_days: formData.cassation_days ? parseInt(formData.cassation_days) : null
      })

      if (data.success) {
        toast.success("تم إضافة المدة القانونية بنجاح")
        // Reset form
        setFormData({
          name: "",
          objection_days: "",
          appeal_days: "",
          cassation_days: ""
        })
        onSuccess()
      } else {
        toast.error(data.error || "فشل في إضافة المدة القانونية")
      }
    } catch (error) {
      console.error('Error adding legal period:', error)
      toast.error(error.response?.data?.error || "حدث خطأ أثناء إضافة المدة القانونية")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      objection_days: "",
      appeal_days: "",
      cassation_days: ""
    })
    onOpenChange(false)
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <div className="pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              إضافة مدة قانونية جديدة
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
            >
              <CircleX className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">
                اسم المدة القانونية <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="مثال: القضايا الجزائية"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="text-right"
              />
            </div>

            {/* Objection Days Input */}
            <div className="space-y-2">
              <Label htmlFor="objection_days">عدد أيام التظلم</Label>
              <Input
                id="objection_days"
                type="number"
                min="0"
                placeholder="أدخل عدد الأيام"
                value={formData.objection_days}
                onChange={(e) => handleInputChange("objection_days", e.target.value)}
                className="text-right"
              />
            </div>

            {/* Appeal Days Input */}
            <div className="space-y-2">
              <Label htmlFor="appeal_days">عدد أيام الاستئناف</Label>
              <Input
                id="appeal_days"
                type="number"
                min="0"
                placeholder="أدخل عدد الأيام"
                value={formData.appeal_days}
                onChange={(e) => handleInputChange("appeal_days", e.target.value)}
                className="text-right"
              />
            </div>

            {/* Cassation Days Input */}
            <div className="space-y-2">
              <Label htmlFor="cassation_days">عدد أيام الطعن</Label>
              <Input
                id="cassation_days"
                type="number"
                min="0"
                placeholder="أدخل عدد الأيام"
                value={formData.cassation_days}
                onChange={(e) => handleInputChange("cassation_days", e.target.value)}
                className="text-right"
              />
            </div>

            <p className="text-sm text-muted-foreground text-right">
              * (التظلم، الاستئناف، الطعن) يجب إدخال على الأقل واحد من الحقول
            </p>
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="border-t p-6 bg-white rounded-b-lg">
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              disabled={loading}
              className="flex items-center gap-2 px-6"
            >
              <CircleX className="h-4 w-4" />
              إلغاء
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex items-center gap-2 px-6 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              {loading ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AddLegalPeriodModal
