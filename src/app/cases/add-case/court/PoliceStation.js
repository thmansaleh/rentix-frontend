"use client";

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getPoliceStations, createPoliceStation } from '@/app/services/api/policeStaions';
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

function PoliceStation() {
  const { data: policeStations, error, isLoading } = useSWR('police-stations', getPoliceStations);
  const { language, isRTL } = useLanguage();
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext();
  const selectedPoliceStation = values.policeStationId?.toString() || "";
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
      await createPoliceStation({
        name_ar: formData.name_ar.trim(),
        name_en: formData.name_en.trim()
      });
      
      // Refresh the police stations list
      mutate('police-stations');
      
      // Show success message
      toast.success(language === 'ar' ? 'تم إنشاء مركز الشرطة بنجاح' : 'Police station created successfully');
      
      // Reset form and close dialog
      setFormData({ name_ar: '', name_en: '' });
      setIsDialogOpen(false);
    } catch (error) {

      toast.error(language === 'ar' ? 'حدث خطأ أثناء إنشاء مركز الشرطة' : 'Error creating police station');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Label>
          {language === 'ar' ? 'مركز الشرطة' : 'Police Station'}
        </Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Label>
          {language === 'ar' ? 'مركز الشرطة' : 'Police Station'}
        </Label>
        <div className="text-red-500 text-sm">
          {language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Label htmlFor="police-station-select">
        {language === 'ar' ? 'مركز الشرطة' : 'Police Station'} <span className="text-red-500">*</span>
      </Label>
      <div className="flex gap-2">
        <Select 
          value={selectedPoliceStation} 
          onValueChange={(value) => {
            setFieldTouched('policeStationId', true)
            setFieldValue('policeStationId', parseInt(value))
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <SelectTrigger id="police-station-select" className={`w-full ${errors.policeStationId && touched.policeStationId ? 'border-red-500' : ''}`}>
            <SelectValue 
              placeholder={language === 'ar' ? 'اختر مركز الشرطة' : 'Select a police station'} 
            />
          </SelectTrigger>
          <SelectContent>
            {policeStations?.data?.map((station) => (
              <SelectItem key={station.id} value={station.id.toString()}>
                {language === 'ar' ? station.name_ar : station.name_en}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
              {language === 'ar' ? 'إضافة مركز شرطة جديد' : 'Add New Police Station'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar" className={isRTL ? 'text-right' : 'text-left'}>
                {language === 'ar' ? 'اسم مركز الشرطة بالعربية' : 'Police Station Name in Arabic'}
              </Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                placeholder={language === 'ar' ? 'أدخل اسم مركز الشرطة بالعربية' : 'Enter police station name in Arabic'}
                dir="rtl"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en" className={isRTL ? 'text-right' : 'text-left'}>
                {language === 'ar' ? 'اسم مركز الشرطة بالإنجليزية' : 'Police Station Name in English'}
              </Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                placeholder={language === 'ar' ? 'أدخل اسم مركز الشرطة بالإنجليزية' : 'Enter police station name in English'}
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
      {errors.policeStationId && touched.policeStationId && (
        <div className="text-red-500 text-sm">{errors.policeStationId}</div>
      )}
    </div>
  );
}

export default PoliceStation;