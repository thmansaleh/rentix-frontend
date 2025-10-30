'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { createCaseDegree } from '@/app/services/api/caseDegrees';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
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

const AddCaseDegreeModal = ({ isOpen, onClose, caseId, onCaseDegreeAdded }) => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  
  const [formData, setFormData] = useState({
    case_id: caseId || '',
    degree: '',
    case_number: '',
    year: '',
    referral_date: null,
    client_status: '',
    opponent_status: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Update case_id when caseId prop changes
  React.useEffect(() => {
    if (caseId) {
      setFormData(prev => ({ ...prev, case_id: caseId }));
    }
  }, [caseId]);

  const degreeOptions = [
      { value: 'first_instance', label: language === 'ar' ? 'ابتدائي' : 'First Instance' },
    { value: 'cassation', label: language === 'ar' ? 'النقض' : 'Cassation' },
    { value: 'appeal', label: language === 'ar' ? 'الاستئناف' : 'Appeal' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.degree || !formData.case_number || !formData.year || !formData.referral_date) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const caseDegreeData = {
        ...formData,
        referral_date: formData.referral_date ? formData.referral_date.toISOString().split('T')[0] : null,
      };

      const response = await createCaseDegree(caseDegreeData);

      if (response.success) {
        toast.success(language === 'ar' ? 'تم إضافة درجة التقاضي بنجاح' : 'Case degree added successfully');
        
        // Reset form
        setFormData({
          case_id: caseId || '',
          degree: '',
          case_number: '',
          year: '',
          referral_date: null,
          client_status: '',
          opponent_status: ''
        });
        
        // Call callback if provided
        if (onCaseDegreeAdded) {
          onCaseDegreeAdded(response);
        }
        
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create case degree');
      }
    } catch (error) {

      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء إضافة درجة التقاضي' 
          : 'Error occurred while adding case degree'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        case_id: caseId || '',
        degree: '',
        case_number: '',
        year: '',
        referral_date: null,
        client_status: '',
        opponent_status: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'إضافة درجة تقاضي' : 'Add Case Degree'}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' 
              ? 'أضف درجة تقاضي جديدة للقضية' 
              : 'Add a new case degree to the case'}
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

          {/* Client Status Input */}
          <div className="space-y-2">
            <Label htmlFor="client_status" className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'صفة الموكل' : 'Client Status'}
            </Label>
            <Input
              id="client_status"
              type="text"
              value={formData.client_status}
              onChange={(e) => handleInputChange('client_status', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل صفة الموكل' : 'Enter client status'}
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Opponent Status Input */}
          <div className="space-y-2">
            <Label htmlFor="opponent_status" className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'صفة الخصم' : 'Opponent Status'}
            </Label>
            <Input
              id="opponent_status"
              type="text"
              value={formData.opponent_status}
              onChange={(e) => handleInputChange('opponent_status', e.target.value)}
              placeholder={language === 'ar' ? 'أدخل صفة الخصم' : 'Enter opponent status'}
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className={`${isRTL ? 'ml-auto' : 'mr-auto'}`}
            >
              {/* < className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> */}
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isLoading 
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                : (language === 'ar' ? 'حفظ' : 'Save')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCaseDegreeModal;