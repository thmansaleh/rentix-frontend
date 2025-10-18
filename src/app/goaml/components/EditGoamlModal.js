'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { updateGoamlRecord } from '@/app/services/api/goaml';

const EditGoamlModal = ({ record, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    status: 'under_review',
    amount: '',
    note: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form with record data
  useEffect(() => {
    if (record) {
      setFormData({
        name: record.name || '',
        phone: record.phone || '',
        status: record.status || 'under_review',
        amount: record.amount ? record.amount.toString() : '',
        note: record.note || ''
      });
    }
  }, [record]);

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
      newErrors.name = 'الاسم مطلوب';
    }

    if (formData.amount && isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'المبلغ يجب أن يكون رقم صحيح';
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
        status: formData.status,
        amount: formData.amount ? parseFloat(formData.amount) : 0,
        note: formData.note || null
      };

      const result = await updateGoamlRecord(record.id, submitData);

      if (result.success) {
        toast.success('تم تحديث السجل بنجاح');
        handleClose();
        onSuccess();
      } else {
        throw new Error(result.message || 'فشل في تحديث السجل');
      }
    } catch (error) {
      console.error('Error updating GoAML record:', error);
      toast.error(error.response?.data?.message || 'فشل في تحديث السجل');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل سجل GoAML</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-name">الاسم *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="أدخل الاسم"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="أدخل رقم الهاتف"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">الحالة *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_review">قيد المراجعة</SelectItem>
                  <SelectItem value="compliant">مطابق</SelectItem>
                  <SelectItem value="safe">آمن</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-amount">المبلغ</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="أدخل المبلغ"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-note">ملاحظة</Label>
              <Textarea
                id="edit-note"
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="أدخل ملاحظة (اختياري)"
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
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {loading ? 'جار التحديث...' : 'تحديث'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoamlModal;
