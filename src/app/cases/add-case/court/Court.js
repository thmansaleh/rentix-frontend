"use client";

import React, { useState } from 'react';
import { useFormikContext } from '../FormikContext';
import useSWR, { mutate } from 'swr';
import { getCourts, createCourt } from '@/app/services/api/courts';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-toastify';
import CourtFiles from './CourtFiles';
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

function Court() {
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext();
  const { courtId } = values;
  const { data: courts, error, isLoading } = useSWR('courts', getCourts);
  const { language, isRTL } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    court_ar: '',
    court_en: ''
  });

  const handleSubmit = async () => {
    if (!formData.court_ar.trim() || !formData.court_en.trim()) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCourt({
        court_ar: formData.court_ar.trim(),
        court_en: formData.court_en.trim()
      });
      
      // Refresh the courts list
      mutate('courts');
      
      // Show success message
      toast.success(language === 'ar' ? 'تم إنشاء المحكمة بنجاح' : 'Court created successfully');
      
      // Reset form and close dialog
      setFormData({ court_ar: '', court_en: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating court:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إنشاء المحكمة' : 'Error creating court');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Label>
          {language === 'ar' ? 'المحكمة' : 'Court'}
        </Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Label>
          {language === 'ar' ? 'المحكمة' : 'Court'}
        </Label>
        <div className="text-red-500 text-sm">
          {language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Court Selection Section */}
      <div className="space-y-2">
        <Label htmlFor="court-select">
          {language === 'ar' ? 'المحكمة' : 'Court'} <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Select 
            value={courtId} 
            onValueChange={(value) => {
              setFieldTouched('courtId', true)
              setFieldValue('courtId', value)
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <SelectTrigger id="court-select" className={`w-full ${errors.courtId && touched.courtId ? 'border-red-500' : ''}`}>
              <SelectValue 
                placeholder={language === 'ar' ? 'اختر المحكمة' : 'Select a court'} 
              />
            </SelectTrigger>
            <SelectContent>
              {courts.data?.map((court) => (
                <SelectItem key={court.id} value={court.id.toString()}>
                  {language === 'ar' ? court.court_ar : court.court_en}
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
        {errors.courtId && touched.courtId && (
          <div className="text-red-500 text-sm">{errors.courtId}</div>
        )}
      </div>

      {/* Court Files Section */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
              {language === 'ar' ? 'إضافة محكمة جديدة' : 'Add New Court'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="court_ar" className={isRTL ? 'text-right' : 'text-left'}>
                {language === 'ar' ? 'اسم المحكمة بالعربية' : 'Court Name in Arabic'}
              </Label>
              <Input
                id="court_ar"
                value={formData.court_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, court_ar: e.target.value }))}
                placeholder={language === 'ar' ? 'أدخل اسم المحكمة بالعربية' : 'Enter court name in Arabic'}
                dir="rtl"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="court_en" className={isRTL ? 'text-right' : 'text-left'}>
                {language === 'ar' ? 'اسم المحكمة بالإنجليزية' : 'Court Name in English'}
              </Label>
              <Input
                id="court_en"
                value={formData.court_en}
                onChange={(e) => setFormData(prev => ({ ...prev, court_en: e.target.value }))}
                placeholder={language === 'ar' ? 'أدخل اسم المحكمة بالإنجليزية' : 'Enter court name in English'}
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
                setFormData({ court_ar: '', court_en: '' });
              }}
              disabled={isSubmitting}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.court_ar.trim() || !formData.court_en.trim()}
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

export default Court;