'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Save, X } from 'lucide-react';
import { useFormikContext } from 'formik';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const AddCaseDegreeModal = ({ isOpen, onClose, editData, editIndex }) => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const { values, setFieldValue } = useFormikContext();
  const { caseDegrees = [] } = values;
  
  const [formData, setFormData] = useState({
    degree: '',
    case_number: '',
    year: '',
    referral_date: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Handle edit data when editData prop changes
  React.useEffect(() => {
    if (editData) {
      setFormData({
        degree: editData.degree || '',
        case_number: editData.case_number || '',
        year: editData.year || '',
        referral_date: editData.referral_date ? new Date(editData.referral_date) : null
      });
    } else {
      setFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null
      });
    }
  }, [editData]);

  const degreeOptions = [
    { value: 'first_instance', label: language === 'ar' ? 'ابتدائي' : 'First Instance' },
    { value: 'appeal', label: language === 'ar' ? 'الاستئناف' : 'Appeal' },
    { value: 'cassation', label: language === 'ar' ? 'النقض' : 'Cassation' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up to parent form
    }
    
    if (!formData.degree || !formData.case_number || !formData.year || !formData.referral_date) {
      return;
    }

    setIsLoading(true);

    try {
      const caseDegreeData = {
        ...formData,
        referral_date: formData.referral_date ? formData.referral_date.toISOString().split('T')[0] : null,
        id: editData ? editData.id : Date.now() // Generate ID for new entries
      };

      if (editData && editIndex !== undefined) {
        // Update existing case degree
        const updatedCaseDegrees = [...caseDegrees];
        updatedCaseDegrees[editIndex] = caseDegreeData;
        setFieldValue('caseDegrees', updatedCaseDegrees);
        
      } else {
        // Add new case degree
        const updatedCaseDegrees = [...caseDegrees, caseDegreeData];
        setFieldValue('caseDegrees', updatedCaseDegrees);
        
      }
      
      // Reset form
      setFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null
      });
      
      onClose();
    } catch (error) {
      console.error('Error with case degree:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {editData 
              ? (language === 'ar' ? 'تعديل درجة التقاضي' : 'Edit Case Degree')
              : (language === 'ar' ? 'إضافة درجة تقاضي' : 'Add Case Degree')
            }
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {editData
              ? (language === 'ar' ? 'تعديل درجة التقاضي للقضية' : 'Edit the case degree for the case')
              : (language === 'ar' ? 'أضف درجة تقاضي جديدة للقضية' : 'Add a new case degree to the case')
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Degree Select */}
          <div className="space-y-2">
            <Label htmlFor="degree" className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'درجة التقاضي' : 'Degree'} *
            </Label>
            <Select
              value={formData.degree}
              onValueChange={(value) => handleInputChange('degree', value)}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر درجة التقاضي' : 'Select degree'} />
              </SelectTrigger>
              <SelectContent>
                {degreeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Case Number Input */}
          <div className="space-y-2">
            <Label htmlFor="case_number" className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'رقم القضية' : 'Case Number'} *
            </Label>
            <Input
              id="case_number"
              type="text"
              value={formData.case_number}
              onChange={(e) => handleInputChange('case_number', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل رقم القضية' : 'Enter case number'}
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Year Input */}
          <div className="space-y-2">
            <Label htmlFor="year" className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'السنة' : 'Year'} *
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل السنة' : 'Enter year'}
              min="1900"
              max="2099"
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Referral Date Calendar */}
          <div className="space-y-2">
            <Label className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'تاريخ الإحالة' : 'Referral Date'} *
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.referral_date && "text-muted-foreground",
                    isRTL && "text-right"
                  )}
                >
                  <CalendarIcon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {formData.referral_date ? (
                    formData.referral_date.toLocaleDateString(
                      language === 'ar' ? 'ar-AE' : 'en-US',
                      { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }
                    )
                  ) : (
                    language === 'ar' ? 'اختر تاريخ الإحالة' : 'Pick referral date'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.referral_date}
                  onSelect={(date) => {
                    handleInputChange('referral_date', date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className={`${isRTL ? 'ml-auto' : 'mr-auto'}`}
            >
              <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="button" disabled={isLoading} onClick={handleSubmit}>
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isLoading 
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (editData 
                    ? (language === 'ar' ? 'تحديث' : 'Update')
                    : (language === 'ar' ? 'حفظ' : 'Save')
                  )
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCaseDegreeModal;