"use client";

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getPublicProsecutions, createPublicProsecution } from '@/app/services/api/PublicProsecutions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormikContext } from '../FormikContext';
import { toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

function PublicProsecutions() {
  const { data: publicProsecutions, error, isLoading } = useSWR('public-prosecutions', getPublicProsecutions);
  const { language, isRTL } = useLanguage();
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext();
  const selectedProsecution = values.publicProsecutionId?.toString() || "";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: ''
  });

  const handleSubmit = async () => {
    if (!formData.name_ar.trim() || !formData.name_en.trim()) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPublicProsecution({
        name_ar: formData.name_ar.trim(),
        name_en: formData.name_en.trim()
      });
      
      // Refresh the public prosecutions list
      mutate('public-prosecutions');
      
      // Show success message
      toast.success(language === 'ar' ? 'تم إنشاء النيابة العامة بنجاح' : 'Public prosecution created successfully');
      
      // Reset form and close dialog
      setFormData({ name_ar: '', name_en: '' });
      setIsDialogOpen(false);
    } catch (error) {

      toast.error(language === 'ar' ? 'حدث خطأ أثناء إنشاء النيابة العامة' : 'Error creating public prosecution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Label>
          {language === 'ar' ? 'النيابة العامة' : 'Public Prosecution'}
        </Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Label>
          {language === 'ar' ? 'النيابة العامة' : 'Public Prosecution'}
        </Label>
        <div className="text-red-500 text-sm">
          {language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Label htmlFor="prosecution-select">
        {language === 'ar' ? 'النيابة العامة' : 'Public Prosecution'} <span className="text-red-500">*</span>
      </Label>
      <div className="flex gap-2">
        <Select 
          value={selectedProsecution} 
          onValueChange={(value) => {
            setFieldTouched('publicProsecutionId', true)
            setFieldValue('publicProsecutionId', parseInt(value))
          }}
          onOpenChange={() => setFieldTouched('publicProsecutionId', true)}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <SelectTrigger id="prosecution-select" className={`w-full ${errors.publicProsecutionId && touched.publicProsecutionId ? 'border-red-500' : ''}`}>
            <SelectValue 
              placeholder={language === 'ar' ? 'اختر النيابة العامة' : 'Select a public prosecution'} 
            />
          </SelectTrigger>
          <SelectContent>
            {publicProsecutions?.map((prosecution) => (
              <SelectItem key={prosecution.id} value={prosecution.id.toString()}>
                {language === 'ar' ? prosecution.name_ar : prosecution.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {errors.publicProsecutionId && touched.publicProsecutionId && (
        <div className="text-red-500 text-sm">
          {errors.publicProsecutionId}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
              {language === 'ar' ? 'إضافة نيابة عامة جديدة' : 'Add New Public Prosecution'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar" className={isRTL ? 'text-right' : 'text-left'}>
                {language === 'ar' ? 'اسم النيابة العامة بالعربية' : 'Public Prosecution Name in Arabic'}
              </Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                placeholder={language === 'ar' ? 'أدخل اسم النيابة العامة بالعربية' : 'Enter public prosecution name in Arabic'}
                dir="rtl"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en" className={isRTL ? 'text-right' : 'text-left'}>
                {language === 'ar' ? 'اسم النيابة العامة بالإنجليزية' : 'Public Prosecution Name in English'}
              </Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                placeholder={language === 'ar' ? 'أدخل اسم النيابة العامة بالإنجليزية' : 'Enter public prosecution name in English'}
                dir="ltr"
                className="text-left"
              />
            </div>
          </div>
          <DialogFooter className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setFormData({ name_ar: '', name_en: '' });
              }}
              disabled={isSubmitting}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name_ar.trim() || !formData.name_en.trim()}
            >
              {isSubmitting 
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (language === 'ar' ? 'حفظ' : 'Save')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PublicProsecutions;