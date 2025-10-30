'use client';

import React, { useState } from 'react';
import { Save, CircleX, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
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
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import api from '@/app/services/api/axiosInstance';
import { toast } from 'react-toastify';

const AppealDecisionModal = ({ isOpen, onClose, caseId, onSuccess }) => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  
  const [decisionType, setDecisionType] = useState('appealed'); // 'appealed' or 'not_appealed'
  const [isLoading, setIsLoading] = useState(false);

  // Form data for "تم الاستئناف والطعن" (Appealed)
  const [appealFormData, setAppealFormData] = useState({
    degree: '',
    case_number: '',
    year: '',
    referral_date: null,
    client_status: '',
    opponent_status: ''
  });

  // Form data for "لم يتم الاستئناف والطعن" (Not Appealed)
  const [reasonText, setReasonText] = useState('');

  const degreeOptions = [
    { value: 'appeal', label: 'استئناف' },
    { value: 'cassation', label: 'طعن' },
  ];

  const handleAppealInputChange = (field, value) => {
    setAppealFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!caseId) {
      toast.error('معرف القضية مفقود');
      return;
    }

    setIsLoading(true);

    try {
      if (decisionType === 'appealed') {
        // Validate appeal form
        if (!appealFormData.degree || !appealFormData.case_number || !appealFormData.year || !appealFormData.referral_date) {
          toast.error('يرجى ملء جميع الحقول المطلوبة');
          setIsLoading(false);
          return;
        }

        // Create case degree
        const caseDegreeData = {
          case_id: caseId,
          degree: appealFormData.degree,
          case_number: appealFormData.case_number,
          year: appealFormData.year,
          referral_date: format(appealFormData.referral_date, 'yyyy-MM-dd'),
          client_status: appealFormData.client_status,
          opponent_status: appealFormData.opponent_status
        };

        await api.post('/case-degrees', caseDegreeData);
        toast.success('تم إضافة درجة القضية بنجاح');
        
      } else {
        // Validate reason text
        if (!reasonText.trim()) {
          toast.error('يرجى إدخال سبب عدم الطعن أو الاستئناف');
          setIsLoading(false);
          return;
        }

        // Update case additional note using dedicated endpoint
        await api.patch(`/cases/${caseId}/additional-note`, {
          additional_note: reasonText
        });
        toast.success('تم تحديث القضية بنجاح');
      }

      // Reset form
      setAppealFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null,
        client_status: '',
        opponent_status: ''
      });
      setReasonText('');
      setDecisionType('appealed');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving appeal decision:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAppealFormData({
        degree: '',
        case_number: '',
        year: '',
        referral_date: null,
        client_status: '',
        opponent_status: ''
      });
      setReasonText('');
      setDecisionType('appealed');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
             الاستئناف والطعن
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            اختر ما إذا تم الاستئناف/الطعن أو لم يتم
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Toggle Buttons */}
          <div className="space-y-2">
            <Label className={isRTL ? 'text-right block' : 'text-left block'}>
              اختر الحالة *
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={decisionType === 'appealed' ? 'default' : 'outline'}
                onClick={() => setDecisionType('appealed')}
                className={cn(
                  "h-auto py-3 px-4 transition-all",
                  decisionType === 'appealed' && "bg-green-500 hover:bg-green-600 text-white border-green-500"
                )}
              >
                <div className="text-center w-full">
                  <div className="font-semibold">تم الاستئناف والطعن</div>
                  <div className="text-xs mt-1 opacity-90">إضافة درجة قضائية جديدة</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={decisionType === 'not_appealed' ? 'default' : 'outline'}
                onClick={() => setDecisionType('not_appealed')}
                className={cn(
                  "h-auto py-3 px-4 transition-all",
                  decisionType === 'not_appealed' && "bg-red-500 hover:bg-red-600 text-white border-red-500"
                )}
              >
                <div className="text-center w-full">
                  <div className="font-semibold">لم يتم الاستئناف والطعن</div>
                  <div className="text-xs mt-1 opacity-90">توضيح السبب</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Conditional Content Based on Decision Type */}
          {decisionType === 'appealed' ? (
            // Appeal Form
            <>
              {/* Degree Select */}
              <div className="space-y-2">
                <Label htmlFor="degree" className={isRTL ? 'text-right block' : 'text-left block'}>
                  الدرجة *
                </Label>
                <Select
                  value={appealFormData.degree}
                  onValueChange={(value) => handleAppealInputChange('degree', value)}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدرجة" />
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
                  رقم القضية *
                </Label>
                <Input
                  id="case_number"
                  type="text"
                  value={appealFormData.case_number}
                  onChange={(e) => handleAppealInputChange('case_number', e.target.value)}
                  placeholder="أدخل رقم القضية"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              {/* Year Input */}
              <div className="space-y-2">
                <Label htmlFor="year" className={isRTL ? 'text-right block' : 'text-left block'}>
                  السنة *
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={appealFormData.year}
                  onChange={(e) => handleAppealInputChange('year', e.target.value)}
                  placeholder="أدخل السنة"
                  min="1900"
                  max="2099"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              {/* Referral Date Input */}
              <div className="space-y-2">
                <Label htmlFor="referral_date" className={isRTL ? 'text-right block' : 'text-left block'}>
                  تاريخ الإحالة *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start font-normal",
                        !appealFormData.referral_date && "text-muted-foreground",
                        isRTL ? "text-right" : "text-left"
                      )}
                    >
                      <CalendarIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                      {appealFormData.referral_date ? (
                        format(appealFormData.referral_date, "PPP", { locale: language === 'ar' ? ar : undefined })
                      ) : (
                        <span>اختر تاريخ الإحالة</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <Calendar
                      mode="single"
                      selected={appealFormData.referral_date}
                      onSelect={(date) => handleAppealInputChange('referral_date', date)}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Client Status Input */}
              <div className="space-y-2">
                <Label htmlFor="client_status" className={isRTL ? 'text-right block' : 'text-left block'}>
                  صفة الموكل
                </Label>
                <Input
                  id="client_status"
                  type="text"
                  value={appealFormData.client_status}
                  onChange={(e) => handleAppealInputChange('client_status', e.target.value)}
                  placeholder="أدخل صفة الموكل"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              {/* Opponent Status Input */}
              <div className="space-y-2">
                <Label htmlFor="opponent_status" className={isRTL ? 'text-right block' : 'text-left block'}>
                  صفة الخصم
                </Label>
                <Input
                  id="opponent_status"
                  type="text"
                  value={appealFormData.opponent_status}
                  onChange={(e) => handleAppealInputChange('opponent_status', e.target.value)}
                  placeholder="أدخل صفة الخصم"
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
            </>
          ) : (
            // Reason Text Area
            <div className="space-y-2">
              <Label htmlFor="reason" className={isRTL ? 'text-right block' : 'text-left block'}>
                سبب عدم الطعن أو الاستئناف *
              </Label>
              <Textarea
                id="reason"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="أدخل السبب..."
                rows={6}
                className={cn("resize-none", isRTL ? 'text-right' : 'text-left')}
              />
            </div>
          )}
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
            إلغاء
          </Button>
          <Button type="button" disabled={isLoading} onClick={handleSubmit}>
            <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppealDecisionModal;
