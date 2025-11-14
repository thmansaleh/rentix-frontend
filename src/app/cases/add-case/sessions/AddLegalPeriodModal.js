"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { createLegalPeriod } from "@/app/services/api/legalPeriods"
import { Save } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

function AddLegalPeriodModal({ open, onOpenChange, onSuccess }) {
  const { t } = useTranslations()
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
      toast.error(t('legalPeriods.nameRequired'))
      return false
    }

    // At least one day field must have a value
    const hasAtLeastOneDay = 
      (formData.objection_days && parseInt(formData.objection_days) > 0) ||
      (formData.appeal_days && parseInt(formData.appeal_days) > 0) ||
      (formData.cassation_days && parseInt(formData.cassation_days) > 0)

    if (!hasAtLeastOneDay) {
      toast.error(t('legalPeriods.atLeastOneDayRequired'))
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
        toast.success(t('legalPeriods.addSuccess'))
        // Reset form
        setFormData({
          name: "",
          objection_days: "",
          appeal_days: "",
          cassation_days: ""
        })
        onSuccess()
      } else {
        toast.error(data.error || t('legalPeriods.addError'))
      }
    } catch (error) {
      console.error('Error adding legal period:', error)
      toast.error(error.response?.data?.error || t('legalPeriods.addError'))
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('legalPeriods.addNewPeriod')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('legalPeriods.periodName')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t('legalPeriods.periodNamePlaceholder')}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="text-right"
            />
          </div>

          {/* Objection Days Input */}
          <div className="space-y-2">
            <Label htmlFor="objection_days">{t('legalPeriods.objectionDays')}</Label>
            <Input
              id="objection_days"
              type="number"
              min="0"
              placeholder={t('legalPeriods.enterDays')}
              value={formData.objection_days}
              onChange={(e) => handleInputChange("objection_days", e.target.value)}
              className="text-right"
            />
          </div>

          {/* Appeal Days Input */}
          <div className="space-y-2">
            <Label htmlFor="appeal_days">{t('legalPeriods.appealDays')}</Label>
            <Input
              id="appeal_days"
              type="number"
              min="0"
              placeholder={t('legalPeriods.enterDays')}
              value={formData.appeal_days}
              onChange={(e) => handleInputChange("appeal_days", e.target.value)}
              className="text-right"
            />
          </div>

          {/* Cassation Days Input */}
          <div className="space-y-2">
            <Label htmlFor="cassation_days">{t('legalPeriods.cassationDays')}</Label>
            <Input
              id="cassation_days"
              type="number"
              min="0"
              placeholder={t('legalPeriods.enterDays')}
              value={formData.cassation_days}
              onChange={(e) => handleInputChange("cassation_days", e.target.value)}
              className="text-right"
            />
          </div>

          <p className="text-sm text-muted-foreground text-right">
            {t('legalPeriods.atLeastOneFieldNote')}
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel} 
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? t('legalPeriods.adding') : t('common.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddLegalPeriodModal
