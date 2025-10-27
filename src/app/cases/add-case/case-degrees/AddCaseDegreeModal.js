'use client';

import React, { useState } from 'react';
import { Save, CircleX } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            {editData ? t('caseDegrees.editCaseDegree') : t('caseDegrees.addCaseDegree')}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {editData ? t('caseDegrees.editDescription') : t('caseDegrees.addDescription')}
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
              onChange={(e) => handleInputChange('referral_date', e.target.value ? new Date(e.target.value) : null)}
              className={isRTL ? 'text-right' : 'text-left'}
              // max={new Date().toISOString().split('T')[0]}
              min="1900-01-01"
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
              <CircleX className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('caseDegrees.cancel')}
            </Button>
            <Button type="button" disabled={isLoading} onClick={handleSubmit}>
              <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isLoading ? t('caseDegrees.saving') : (editData ? t('common.update') : t('caseDegrees.save'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCaseDegreeModal;