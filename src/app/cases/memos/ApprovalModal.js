'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ApprovalModal = ({ isOpen, onClose, onConfirm, memoTitle, isLoading }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [approvalStatus, setApprovalStatus] = useState('approve');

  const handleConfirm = () => {
    const isApproved = approvalStatus === 'approve';
    onConfirm(isApproved);
  };

  const handleClose = () => {
    setApprovalStatus('approve'); // Reset to default
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'ar' ? 'تغيير حالة الموافقة' : 'Change Approval Status'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? `هل تريد تغيير حالة الموافقة للمذكرة: "${memoTitle}"؟`
              : `Do you want to change the approval status for memo: "${memoTitle}"?`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={approvalStatus} onValueChange={setApprovalStatus}>
            <div className="flex items-center gap-x-2 rtl:space-x-reverse mb-3">
              <RadioGroupItem value="approve" id="approve" />
              <Label 
                htmlFor="approve" 
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{language === 'ar' ? 'الموافقة' : 'Approve'}</span>
              </Label>
            </div>
            <div className="flex items-center gap-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="reject" id="reject" />
              <Label 
                htmlFor="reject" 
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <XCircle className="h-4 w-4 text-red-600" />
                <span>{language === 'ar' ? 'رفض' : 'Reject'}</span>
              </Label>
            </div>
          </RadioGroup>
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
            className={approvalStatus === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isLoading 
              ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
              : (t('buttons.confirm') || (language === 'ar' ? 'تأكيد' : 'Confirm'))
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;
