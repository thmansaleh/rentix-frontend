"use client"

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { caseClassifications, createCaseClassification } from "@/app/services/api/cases"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslations } from "@/hooks/useTranslations"
import { toast } from 'react-toastify'
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CaseClassifications({ formikProps }) {
  const { values, errors, touched, setFieldValue } = formikProps
  
  const { language } = useLanguage()
  const { t } = useTranslations()
  const { data, error, isLoading, mutate } = useSWR('case-classifications', caseClassifications)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: ''
  })

  const handleCaseClassificationChange = (value) => {
    setFieldValue('case_classification_id', value)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name_ar.trim() || !formData.name_en.trim()) {
      toast.error(t('caseClassifications.pleaseFillBothNames'))
      return
    }

    setIsSubmitting(true)
    
    try {
      await createCaseClassification(formData)
      toast.success(t('caseClassifications.caseClassificationCreatedSuccessfully'))
      
      // Refresh the data
      mutate()
      
      // Reset form and close dialog
      setFormData({ name_ar: '', name_en: '' })
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(t('caseClassifications.failedToCreateCaseClassification'))
      console.error('Error creating case classification:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return <div className="text-red-500">{t('caseClassifications.failedToLoadCaseClassifications')}</div>
  }

  if (isLoading) {
    return <div className="text-gray-500">{t('caseClassifications.loadingCaseClassifications')}</div>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select dir={language === 'ar' ? 'rtl' : 'ltr'} value={values.case_classification_id} onValueChange={handleCaseClassificationChange}>
          <SelectTrigger className={`w-full ${errors.case_classification_id && touched.case_classification_id ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={t('caseClassifications.selectCaseClassification')} />
          </SelectTrigger>
          <SelectContent>
            {data?.data?.map((caseClassification) => (
              <SelectItem key={caseClassification.id} value={caseClassification.id.toString()}>
                {language === 'ar' ? caseClassification.name_ar : caseClassification.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t('caseClassifications.addNewCaseClassification')}</DialogTitle>
              <DialogDescription>
                {t('caseClassifications.addNewCaseClassification')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name_ar" className="text-right">
                  {t('caseClassifications.arabicName')}
                </Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => handleInputChange('name_ar', e.target.value)}
                  className="col-span-3"
                  placeholder={t('caseClassifications.enterArabicName')}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name_en" className="text-right">
                  {t('caseClassifications.englishName')}
                </Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  className="col-span-3"
                  placeholder={t('caseClassifications.enterEnglishName')}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                {t('buttons.cancel')}
              </Button>
              <Button type="button" disabled={isSubmitting}>
                {isSubmitting ? t('caseClassifications.creating') : t('caseClassifications.createCaseClassification')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
      {errors.case_classification_id && touched.case_classification_id && (
        <div className="text-red-500 text-sm">{errors.case_classification_id}</div>
      )}
    </div>
  )
}

export default CaseClassifications