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
import { useCallLog } from '@/hooks/useCallLogs';
import { updateCallLog } from '@/app/services/api/callLogs';

const EditCallModal = ({ isOpen, onClose, callId, onSuccess }) => {
  const { callLog, isLoading: fetchLoading, error, mutate } = useCallLog(callId);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    call_type: '',
    caller_name: '',
    phone_number: '',
    call_date: '',
    call_time: '',
    topic: '',
    details: '',
    duration_minutes: 0,
    file_case_number: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form when data is loaded
  useEffect(() => {
    if (callLog) {
      setFormData({
        call_type: callLog.call_type || '',
        caller_name: callLog.caller_name || '',
        phone_number: callLog.phone_number || '',
        call_date: callLog.call_date ? callLog.call_date.split('T')[0] : '',
        call_time: callLog.call_time || '',
        topic: callLog.topic || '',
        details: callLog.details || '',
        duration_minutes: callLog.duration_minutes || 0,
        file_case_number: callLog.file_case_number || ''
      });
    }
  }, [callLog]);

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

    if (!formData.call_type) {
      newErrors.call_type = 'نوع المكالمة مطلوب';
    }

    if (!formData.caller_name.trim()) {
      newErrors.caller_name = 'اسم المتصل مطلوب';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'رقم الهاتف مطلوب';
    }

    if (!formData.call_date) {
      newErrors.call_date = 'تاريخ المكالمة مطلوب';
    }

    if (!formData.call_time) {
      newErrors.call_time = 'وقت المكالمة مطلوب';
    }

    if (formData.duration_minutes < 0) {
      newErrors.duration_minutes = 'مدة المكالمة لا يمكن أن تكون سالبة';
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
      
      const result = await updateCallLog(callId, formData);

      if (result.success) {
        toast.success('تم تحديث المكالمة بنجاح');
        mutate(); // Refresh single call data
        handleClose();
        onSuccess();
      } else {
        throw new Error(result.message || 'فشل في تحديث المكالمة');
      }
    } catch (error) {

      toast.error('فشل في تحديث المكالمة');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      call_type: '',
      caller_name: '',
      phone_number: '',
      call_date: '',
      call_time: '',
      topic: '',
      details: '',
      duration_minutes: 0,
      file_case_number: ''
    });
    setErrors({});
    onClose();
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>خطأ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-red-600">فشل في تحميل بيانات المكالمة</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleClose}>إغلاق</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل المكالمة</DialogTitle>
        </DialogHeader>

        {fetchLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call Type */}
              <div className="space-y-2">
                <Label htmlFor="call_type">نوع المكالمة *</Label>
                <Select value={formData.call_type} onValueChange={(value) => handleChange('call_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المكالمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incoming">واردة</SelectItem>
                    <SelectItem value="outgoing">صادرة</SelectItem>
                  </SelectContent>
                </Select>
                {errors.call_type && (
                  <p className="text-sm text-red-600">{errors.call_type}</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">المدة (دقيقة)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min="0"
                  value={formData.duration_minutes}
                  onChange={(e) => handleChange('duration_minutes', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                {errors.duration_minutes && (
                  <p className="text-sm text-red-600">{errors.duration_minutes}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Caller Name */}
              <div className="space-y-2">
                <Label htmlFor="caller_name">اسم المتصل *</Label>
                <Input
                  id="caller_name"
                  value={formData.caller_name}
                  onChange={(e) => handleChange('caller_name', e.target.value)}
                  placeholder="أدخل اسم المتصل"
                />
                {errors.caller_name && (
                  <p className="text-sm text-red-600">{errors.caller_name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone_number">رقم الهاتف *</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="0500000000"
                  dir="ltr"
                  className="text-left"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-600">{errors.phone_number}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call Date */}
              <div className="space-y-2">
                <Label htmlFor="call_date">تاريخ المكالمة *</Label>
                <Input
                  id="call_date"
                  type="date"
                  value={formData.call_date}
                  onChange={(e) => handleChange('call_date', e.target.value)}
                />
                {errors.call_date && (
                  <p className="text-sm text-red-600">{errors.call_date}</p>
                )}
              </div>

              {/* Call Time */}
              <div className="space-y-2">
                <Label htmlFor="call_time">وقت المكالمة *</Label>
                <Input
                  id="call_time"
                  type="time"
                  value={formData.call_time}
                  onChange={(e) => handleChange('call_time', e.target.value)}
                />
                {errors.call_time && (
                  <p className="text-sm text-red-600">{errors.call_time}</p>
                )}
              </div>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label htmlFor="topic">موضوع المكالمة</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                placeholder="أدخل موضوع المكالمة"
              />
            </div>

            {/* Case File Number */}
            <div className="space-y-2">
              <Label htmlFor="file_case_number">رقم القضية (اختياري)</Label>
              <Input
                id="file_case_number"
                value={formData.file_case_number}
                onChange={(e) => handleChange('file_case_number', e.target.value)}
                placeholder="أدخل رقم القضية إن وجد"
              />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="details">تفاصيل المكالمة</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                placeholder="أدخل تفاصيل المكالمة..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                حفظ التعديلات
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCallModal;