'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createEmployeeRequest } from '@/app/services/api/employeeRequests';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function CreateRequestDialog({ isOpen, onClose, onSuccess }) {
  const { language } = useLanguage();
  const jobId = useSelector((state) => state.auth.jobId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    from_date: '',
    to_date: '',
  });

  // Request types - matching HR requests format (using Arabic values)
  const requestTypes = [
    { 
      value: 'اجازة سنوية', 
      label: language === 'ar' ? 'اجازة سنوية' : 'Annual Leave',
      isLeave: true 
    },
    { 
      value: 'اجازة مرضية', 
      label: language === 'ar' ? 'اجازة مرضية' : 'Sick Leave',
      isLeave: true 
    },
    { 
      value: 'اجازة الوضع', 
      label: language === 'ar' ? 'اجازة الوضع' : 'Paternity Leave',
      isLeave: true 
    },
    { 
      value: 'اجازة الحداد', 
      label: language === 'ar' ? 'اجازة الحداد' : 'Mourning Leave',
      isLeave: true 
    },
    { 
      value: 'اجازة التفرغ لإداء الخدمة الوطنية', 
      label: language === 'ar' ? 'اجازة التفرغ لإداء الخدمة الوطنية' : 'National Service Leave',
      isLeave: true 
    },
    { 
      value: 'اجازة الحج والعمرة', 
      label: language === 'ar' ? 'اجازة الحج والعمرة' : 'Hajj and Umrah Leave',
      isLeave: true 
    },
    { 
      value: 'شهادة راتب', 
      label: language === 'ar' ? 'شهادة راتب' : 'Salary Certificate',
      isLeave: false 
    },
    { 
      value: 'شهادة خبرة', 
      label: language === 'ar' ? 'شهادة خبرة' : 'Experience Certificate',
      isLeave: false 
    },
    { 
      value: 'شهادة لا مانع', 
      label: language === 'ar' ? 'شهادة لا مانع' : 'No Objection Certificate',
      isLeave: false 
    },
    { 
      value: 'بدل اجازة سنوية', 
      label: language === 'ar' ? 'بدل اجازة سنوية' : 'Annual Leave Allowance',
      isLeave: false 
    },
    { 
      value: 'اخرى', 
      label: language === 'ar' ? 'اخرى' : 'Other',
      isLeave: false 
    }
  ];

  // Check if selected type is a leave type (requires dates)
  const isLeaveType = requestTypes.find(rt => rt.value === formData.type)?.isLeave || false;

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (name, value) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // If changing from_date and to_date is before the new from_date, clear to_date
      if (name === 'from_date' && prev.to_date && value > prev.to_date) {
        newData.to_date = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.type) {
      toast.error(language === 'ar' ? 'الرجاء اختيار نوع الطلب' : 'Please select request type');
      return;
    }

    // Validate dates for leave types only
    if (isLeaveType) {
      if (!formData.from_date) {
        toast.error(language === 'ar' ? 'الرجاء اختيار تاريخ البداية' : 'Please select from date');
        return;
      }
      if (!formData.to_date) {
        toast.error(language === 'ar' ? 'الرجاء اختيار تاريخ النهاية' : 'Please select to date');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const requestData = {
        employee_id: jobId,
        type: formData.type,
        from_date: formData.from_date || null,
        to_date: formData.to_date || null,
      };

      await createEmployeeRequest(requestData);
      
      toast.success(language === 'ar' ? 'تم إنشاء الطلب بنجاح' : 'Request created successfully');
      
      // Reset form
      setFormData({
        type: '',
        from_date: '',
        to_date: '',
      });
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'Error creating request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'ar' ? 'طلب جديد' : 'New Request'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'املأ البيانات التالية لإنشاء طلب جديد'
              : 'Fill in the details to create a new request'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Request Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              {language === 'ar' ? 'نوع الطلب' : 'Request Type'}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر نوع الطلب' : 'Select request type'} />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.type && (
              <p className="text-xs text-muted-foreground">
                {isLeaveType 
                  ? (language === 'ar' 
                      ? 'يتطلب هذا النوع تحديد تواريخ البداية والنهاية' 
                      : 'This type requires start and end dates')
                  : (language === 'ar' 
                      ? 'لا يتطلب هذا النوع تحديد تواريخ' 
                      : 'This type does not require dates')
                }
              </p>
            )}
          </div>

          {/* From Date - Only for leave types */}
          {isLeaveType && (
            <div className="space-y-2">
              <Label htmlFor="from_date">
                {language === 'ar' ? 'من تاريخ' : 'From Date'}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="from_date"
                type="date"
                value={formData.from_date}
                min={today}
                onChange={(e) => handleInputChange('from_date', e.target.value)}
              />
            </div>
          )}

          {/* To Date - Only for leave types */}
          {isLeaveType && (
            <div className="space-y-2">
              <Label htmlFor="to_date">
                {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="to_date"
                type="date"
                value={formData.to_date}
                min={formData.from_date || today}
                onChange={(e) => handleInputChange('to_date', e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (language === 'ar' ? 'جاري الإنشاء...' : 'Creating...')
              : (language === 'ar' ? 'إنشاء' : 'Create')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateRequestDialog;
