'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClientPayment } from '@/app/services/api/clientPayments';
import { toast } from 'react-toastify';

const AddPaymentModal = ({ isOpen, onClose, onSuccess, invoiceId }) => {
  const { isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('المبلغ مطلوب')
      .positive('المبلغ يجب أن يكون أكبر من صفر')
      .min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
    payment_date: Yup.date().required('تاريخ الدفع مطلوب'),
    payment_method: Yup.string().required('طريقة الدفع مطلوبة'),
    note: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      note: ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const paymentData = {
          invoice_id: invoiceId,
          amount: parseFloat(values.amount),
          payment_date: values.payment_date,
          payment_method: values.payment_method,
          note: values.note || null
        };
        
        const response = await createClientPayment(paymentData);
        
        if (response.success) {
          toast.success('تم إضافة الدفعة بنجاح');
          formik.resetForm();
          onSuccess();
          onClose();
        } else {
          toast.error(response.message || 'حدث خطأ في إضافة الدفعة');
        }
      } catch (error) {
        console.error('Error creating payment:', error);
        toast.error('حدث خطأ في إضافة الدفعة');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-md ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            إضافة دفعة جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
              <Label htmlFor="amount">
                المبلغ (درهم) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.amount && formik.touched.amount ? 'border-red-500' : ''}
              />
              {formik.errors.amount && formik.touched.amount && (
                <p className="text-sm text-red-500">{formik.errors.amount}</p>
              )}
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="payment_date">
                تاريخ الدفع <span className="text-red-500">*</span>
              </Label>
              <Input
                id="payment_date"
                name="payment_date"
                type="date"
                value={formik.values.payment_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.payment_date && formik.touched.payment_date ? 'border-red-500' : ''}
              />
              {formik.errors.payment_date && formik.touched.payment_date && (
                <p className="text-sm text-red-500">{formik.errors.payment_date}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment_method">
                طريقة الدفع <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.payment_method}
                onValueChange={(value) => formik.setFieldValue('payment_method', value)}
              >
                <SelectTrigger className={formik.errors.payment_method && formik.touched.payment_method ? 'border-red-500' : ''}>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقداً</SelectItem>
                  <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                  <SelectItem value="check">شيك</SelectItem>
                  <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
              {formik.errors.payment_method && formik.touched.payment_method && (
                <p className="text-sm text-red-500">{formik.errors.payment_method}</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">ملاحظة</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="أضف ملاحظة (اختياري)"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الإضافة...' : 'إضافة'}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
