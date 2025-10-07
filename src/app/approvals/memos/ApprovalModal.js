'use client';

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MEMO_STATUSES = [
  { value: "Draft", label: "مسودة" },
  { value: "Approved", label: "معتمد" },
  { value: "Pending Approval", label: "في انتظار الموافقة" },
  { value: "Submitted to Court", label: "مقدم للمحكمة" },
  { value: "Rejected", label: "مرفوض" }
];

const ApprovalModal = ({ isOpen, onClose, onConfirm, memoTitle, isLoading, currentStatus }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'Pending Approval');

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus || 'Pending Approval'); // Reset to current status
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'ar' ? 'تغيير حالة المذكرة' : 'Change Memo Status'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? `تحديث حالة المذكرة: "${memoTitle}"`
              : `Update the status for memo: "${memoTitle}"`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="status" className="mb-2 block">
            {language === 'ar' ? 'الحالة' : 'Status'}
          </Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder={language === 'ar' ? 'اختر الحالة' : 'Select status'} />
            </SelectTrigger>
            <SelectContent>
              {MEMO_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {language === 'ar' ? status.label : status.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('buttons.cancel') || (language === 'ar' ? 'إلغاء' : 'Cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading 
              ? (language === 'ar' ? 'جاري التحديث...' : 'Updating...')
              : (language === 'ar' ? 'تحديث' : 'Update')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;
