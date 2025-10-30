'use client';

import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useTranslations } from '../../../../../hooks/useTranslations';
import { updateCaseDegree } from '../../../../services/api/caseDegrees';
import { toast } from 'react-toastify';
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

const EditCaseDegreeModal = ({ isOpen, onClose, degreeData, onSuccess }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const [formData, setFormData] = useState({
    degree: '',
    case_number: '',
    year: '',
    referral_date: null,
    client_status: '',
    opponent_status: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when degreeData changes
  useEffect(() => {
    if (degreeData) {
      setFormData({
        degree: degreeData.degree || '',
        case_number: degreeData.case_number || '',
        year: degreeData.year || '',
        referral_date: degreeData.referral_date ? new Date(degreeData.referral_date) : null,
        client_status: degreeData.client_status || '',
        opponent_status: degreeData.opponent_status || ''
      });
    }
  }, [degreeData]);

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
    
    if (!formData.degree || !formData.case_number || !formData.year || !formData.referral_date || !degreeData?.id) {
      toast.error(
        language === 'ar' 
          ? 'يرجى ملء جميع الحقول المطلوبة' 
          : 'Please fill in all required fields'
      );
      return;
    }

    setIsLoading(true);

    try {
      const updatedCaseDegreeData = {
        case_id: degreeData.case_id,
        degree: formData.degree,
        case_number: formData.case_number,
        year: formData.year,
        referral_date: formData.referral_date.toISOString().split('T')[0],
        client_status: formData.client_status,
        opponent_status: formData.opponent_status
      };

      await updateCaseDegree(degreeData.id, updatedCaseDegreeData);
      
      toast.success(
        language === 'ar' 
          ? 'تم تحديث درجة التقاضي بنجاح' 
          : 'Case degree updated successfully'
      );
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating case degree:', error);
      toast.error(
        language === 'ar' 
          ? 'حدث خطأ أثناء تحديث درجة التقاضي' 
          : 'Error occurred while updating case degree'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const isRTL = language === 'ar';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'تعديل درجة التقاضي' : 'Edit Case Degree'}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' ? 'تعديل بيانات درجة التقاضي للقضية' : 'Edit the case degree information'}
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
              <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="button" disabled={isLoading} onClick={handleSubmit}>
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isLoading 
                ? (language === 'ar' ? 'جاري التحديث...' : 'Updating...') 
                : (language === 'ar' ? 'تحديث' : 'Update')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCaseDegreeModal;