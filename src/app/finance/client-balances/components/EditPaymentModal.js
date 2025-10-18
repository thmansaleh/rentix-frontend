'use client';

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPaymentById, updateClientPayment } from '@/app/services/api/clientPayments';
import { getAllClientInvoices } from '@/app/services/api/clientInvoices';
import { toast } from 'react-toastify';

const EditPaymentModal = ({ isOpen, onClose, onSuccess, paymentId }) => {
  const { isRTL } = useLanguage();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPayment, setIsFetchingPayment] = useState(false);

  const validationSchema = Yup.object({
    invoice_id: Yup.number().required('الفاتورة مطلوبة'),
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
      invoice_id: '',
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      note: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const paymentData = {
          invoice_id: parseInt(values.invoice_id),
          amount: parseFloat(values.amount),
          payment_date: values.payment_date,
          payment_method: values.payment_method,
          note: values.note || null
        };
        
        const response = await updateClientPayment(paymentId, paymentData);
        
        if (response.success) {
          toast.success('تم تحديث الدفعة بنجاح');
          formik.resetForm();
          onSuccess();
          onClose();
        } else {
          toast.error(response.message || 'حدث خطأ في تحديث الدفعة');
        }
      } catch (error) {
        console.error('Error updating payment:', error);
        toast.error('حدث خطأ في تحديث الدفعة');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch payment data and invoices
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !paymentId) return;

      try {
        setIsFetchingPayment(true);

        // Fetch all invoices (unpaid and partial)
        const invoicesResponse = await getAllClientInvoices({ status: 'unpaid,partial', limit: 1000 });
        
        // Fetch payment data
        const paymentResponse = await getPaymentById(paymentId);
        
        if (paymentResponse.success) {
          const payment = paymentResponse.data;
          
          // Add the current invoice to the list if not already there
          let allInvoices = invoicesResponse.success ? invoicesResponse.data : [];
          const currentInvoiceExists = allInvoices.find(inv => inv.id === payment.invoice_id);
          
          if (!currentInvoiceExists && payment.invoice_id) {
            // Fetch the current invoice details
            allInvoices.push({
              id: payment.invoice_id,
              invoice_number: payment.invoice_number,
              client_name: payment.client_name,
              total_amount: payment.invoice_total
            });
          }
          
          setInvoices(allInvoices);
          
          formik.setValues({
            invoice_id: payment.invoice_id,
            amount: payment.amount,
            payment_date: payment.payment_date.split('T')[0],
            payment_method: payment.payment_method,
            note: payment.note || ''
          });
        } else {
          toast.error('فشل في تحميل بيانات الدفعة');
          onClose();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
        onClose();
      } finally {
        setIsFetchingPayment(false);
      }
    };

    fetchData();
  }, [isOpen, paymentId]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Get selected invoice details
  const selectedInvoice = invoices.find(inv => inv.id === parseInt(formik.values.invoice_id));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-md ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            تعديل الدفعة
          </DialogTitle>
        </DialogHeader>

        {isFetchingPayment ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="mr-3">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Invoice Selection */}
            <div className="space-y-2">
              <Label htmlFor="invoice_id">
                الفاتورة <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.invoice_id.toString()}
                onValueChange={(value) => formik.setFieldValue('invoice_id', value)}
              >
                <SelectTrigger className={formik.errors.invoice_id && formik.touched.invoice_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="اختر الفاتورة" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id.toString()}>
                      {invoice.invoice_number} - {invoice.client_name} - {new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED' }).format(invoice.total_amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.errors.invoice_id && formik.touched.invoice_id && (
                <p className="text-sm text-red-500">{formik.errors.invoice_id}</p>
              )}
            </div>

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
                disabled={isLoading || isFetchingPayment}
              >
                {isLoading ? 'جاري التحديث...' : 'تحديث'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentModal;
