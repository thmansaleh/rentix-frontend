'use client';

import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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

// Function to get all available statuses including current one if not in predefined list
const getAllStatuses = (currentStatus) => {
  const statuses = [...MEMO_STATUSES];
  
  // If current status is not in the predefined list, add it
  if (currentStatus && !statuses.some(status => status.value === currentStatus)) {
    statuses.push({ 
      value: currentStatus, 
      label: currentStatus // Use the value as label for unknown statuses
    });
  }
  
  return statuses;
};

// Validation schema - now allows any string since we might have dynamic statuses
const validationSchema = Yup.object().shape({
  status: Yup.string().required('Status is required')
});

const ApprovalModal = ({ isOpen, onClose, onConfirm, memoTitle, isLoading, currentStatus }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const initialValues = {
    status: currentStatus || 'Pending Approval'
  };

  const handleSubmit = (values) => {
    onConfirm(values.status);
  };

  const handleClose = (resetForm) => {
    resetForm();
    onClose();
  };

  // Get all available statuses including current one
  const availableStatuses = getAllStatuses(currentStatus);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, setFieldValue, resetForm, errors, touched }) => (
        <Dialog open={isOpen} onOpenChange={() => handleClose(resetForm)}>
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

            <Form>
              <div className="py-4">
                <Label htmlFor="status" className="mb-2 block">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </Label>
                <Field name="status">
                  {({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => setFieldValue('status', value)}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder={language === 'ar' ? 'اختر الحالة' : 'Select status'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {language === 'ar' ? status.label : status.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                {errors.status && touched.status && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.status}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(resetForm)}
                  disabled={isLoading}
                >
                  {t('buttons.cancel') || (language === 'ar' ? 'إلغاء' : 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (language === 'ar' ? 'جاري التحديث...' : 'Updating...')
                    : (language === 'ar' ? 'تحديث' : 'Update')
                  }
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </Formik>
  );
};

export default ApprovalModal;
