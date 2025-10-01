'use client';

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useTranslations } from '../../../../../hooks/useTranslations';
import { createCaseDegree } from '../../../../services/api/caseDegrees';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';

const AddCaseDegreeModal = ({ isOpen, onClose, caseId, onSuccess }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const [formData, setFormData] = useState({
    degree: '',
    case_number: '',
    year: '',
    referral_date: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const degreeOptions = [
    { value: 'first_instance', label: language === 'ar' ? 'ابتدائية' : 'First Instance' },
    { value: 'appeal', label: language === 'ar' ? 'استئناف' : 'Appeal' },
    { value: 'cassation', label: language === 'ar' ? 'الطعن' : 'Cassation' },
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
      e.stopPropagation();
    }
    
    if (!formData.degree || !formData.case_number || !formData.year || !formData.referral_date) {
      return;
    }

    setIsLoading(true);

    try {
      const caseDegreeData = {
        case_id: caseId,
        degree: formData.degree,
        case_number: formData.case_number,
        year: formData.year,
        referral_date: formData.referral_date.toISOString().split('T')[0]
      };

      await createCaseDegree(caseDegreeData);
      
      // Reset form
      setFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating case degree:', error);
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

  const isRTL = language === 'ar';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'إضافة درجة تقاضي' : 'Add Case Degree'}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'أضف درجة تقاضي جديدة للقضية' : 'Add a new case degree to the case'}
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

          {/* Referral Date Input */}
          <div className="space-y-2">
            <Label htmlFor="referral_date" className={isRTL ? 'text-right block' : 'text-left block'}>
              {language === 'ar' ? 'تاريخ الإحالة' : 'Referral Date'} *
            </Label>
            <Input
              id="referral_date"
              type="date"
              value={formData.referral_date ? formData.referral_date.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleInputChange('referral_date', date);
              }}
              max={new Date().toISOString().split('T')[0]}
              min="1900-01-01"
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
              <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="button" disabled={isLoading} onClick={handleSubmit}>
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