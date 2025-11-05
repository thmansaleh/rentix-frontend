'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { createGoamlRecord } from '@/app/services/api/goaml';
import { useTranslations } from '@/hooks/useTranslations';

const AddGoamlModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'فرد',
    status: 'under_review',
    note: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data
      const submitData = {
        name: formData.name,
        phone: formData.phone || null,
        type: formData.type,
        status: formData.status,
        note: formData.note || null
      };

      const result = await createGoamlRecord(submitData);

      if (result.success) {
        toast.success(t('goaml.createRecordSuccess'));
        handleClose();
        onSuccess();
      } else {
        throw new Error(result.message || t('goaml.createRecordError'));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('goaml.createRecordError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: '',
      type: 'فرد',
      status: 'under_review',
      note: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg" dir={t('common.direction')}>
        <DialogHeader>
          <DialogTitle>{t('goaml.addModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">{t('goaml.table.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={t('goaml.placeholders.nameExample')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t('goaml.table.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={t('goaml.placeholders.phoneExample')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">{t('goaml.table.type')} *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('goaml.placeholders.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="فرد">{t('goaml.types.individual')}</SelectItem>
                  <SelectItem value="شركة">{t('goaml.types.company')}</SelectItem>
                  <SelectItem value="كيان">{t('goaml.types.entity')}</SelectItem>
                  <SelectItem value="منظمة">{t('goaml.types.organization')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">{t('goaml.table.status')} *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('goaml.placeholders.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_review">{t('goaml.status.under_review')}</SelectItem>
                  <SelectItem value="compliant">{t('goaml.status.compliant')}</SelectItem>
                  <SelectItem value="safe">{t('goaml.status.safe')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">{t('goaml.table.note')}</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder={t('goaml.placeholders.noteExample')}
                rows={3}
                className={errors.note ? 'border-red-500' : ''}
              />
              {errors.note && (
                <p className="text-sm text-red-500">{errors.note}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {loading ? t('buttons.saving') : t('buttons.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoamlModal;
