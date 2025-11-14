'use client';

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useTranslations } from '../../../../../hooks/useTranslations';
import { createCaseDegree } from '../../../../services/api/caseDegrees';
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

const AddCaseDegreeModal = ({ isOpen, onClose, caseId, onSuccess }) => {
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

  const degreeOptions = [
    { value: 'first_instance', label: t('caseDegrees.firstInstance') },
    { value: 'appeal', label: t('caseDegrees.appeal') },
    { value: 'cassation', label: t('caseDegrees.cassation') },
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
      toast.error(t('tasks.pleaseFillAllRequiredFields'));
      return;
    }

    setIsLoading(true);

    try {
      const caseDegreeData = {
        case_id: caseId,
        degree: formData.degree,
        case_number: formData.case_number,
        year: formData.year,
        referral_date: formData.referral_date.toISOString().split('T')[0],
        client_status: formData.client_status,
        opponent_status: formData.opponent_status
      };

      await createCaseDegree(caseDegreeData);
      
      toast.success(t('caseDegrees.addSuccess') || (language === 'ar' ? 'تم إضافة درجة التقاضي بنجاح' : 'Case degree added successfully'));
      
      // Reset form
      setFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null,
        client_status: '',
        opponent_status: ''
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating case degree:', error);
      toast.error(t('caseDegrees.addError') || (language === 'ar' ? 'حدث خطأ أثناء إضافة درجة التقاضي' : 'Error occurred while adding case degree'));
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
        referral_date: null,
        client_status: '',
        opponent_status: ''
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
            {t('caseDegrees.addCaseDegree')}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('caseDegrees.addDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Degree Select */}
          <div className="space-y-2">
            <Label htmlFor="degree" className={isRTL ? 'text-right block' : 'text-left block'}>
              {t('caseDegrees.degree')} *
            </Label>
            <Select
              value={formData.degree}
              onValueChange={(value) => handleInputChange('degree', value)}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('caseDegrees.selectDegree')} />
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
              {t('caseDegrees.caseNumber')} *
            </Label>
            <Input
              id="case_number"
              type="text"
              value={formData.case_number}
              onChange={(e) => handleInputChange('case_number', e.target.value)}
              placeholder={t('caseDegrees.enterCaseNumber')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Year Input */}
          <div className="space-y-2">
            <Label htmlFor="year" className={isRTL ? 'text-right block' : 'text-left block'}>
              {t('caseDegrees.year')} *
            </Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder={t('caseDegrees.enterYear')}
              min="1900"
              max="2099"
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Referral Date Input */}
          <div className="space-y-2">
            <Label htmlFor="referral_date" className={isRTL ? 'text-right block' : 'text-left block'}>
              {t('caseDegrees.referralDate')} *
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
              {t('caseDegrees.clientStatus') || (language === 'ar' ? 'صفة الموكل' : 'Client Status')}
            </Label>
            <Input
              id="client_status"
              type="text"
              value={formData.client_status}
              onChange={(e) => handleInputChange('client_status', e.target.value)}
              placeholder={t('caseDegrees.enterClientStatus') || (language === 'ar' ? 'أدخل صفة الموكل' : 'Enter client status')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
          </div>

          {/* Opponent Status Input */}
          <div className="space-y-2">
            <Label htmlFor="opponent_status" className={isRTL ? 'text-right block' : 'text-left block'}>
              {t('caseDegrees.opponentStatus') || (language === 'ar' ? 'صفة الخصم' : 'Opponent Status')}
            </Label>
            <Input
              id="opponent_status"
              type="text"
              value={formData.opponent_status}
              onChange={(e) => handleInputChange('opponent_status', e.target.value)}
              placeholder={t('caseDegrees.enterOpponentStatus') || (language === 'ar' ? 'أدخل صفة الخصم' : 'Enter opponent status')}
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
              {t('caseDegrees.cancel')}
            </Button>
            <Button type="button" disabled={isLoading} onClick={handleSubmit}>
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isLoading ? t('caseDegrees.saving') : t('caseDegrees.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCaseDegreeModal;