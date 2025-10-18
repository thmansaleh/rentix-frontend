'use client';

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDepositById, updateDeposit } from '@/app/services/api/deposits';
import { getAllBankAccounts } from '@/app/services/api/bankAccounts';
import { toast } from 'react-toastify';

const EditDepositModal = ({ isOpen, onClose, onSuccess, depositId }) => {
  const { isRTL } = useLanguage();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDeposit, setIsFetchingDeposit] = useState(false);

  const validationSchema = Yup.object({
    bank_account_id: Yup.number().required('الحساب البنكي مطلوب'),
    amount: Yup.number()
      .required('المبلغ مطلوب')
      .positive('المبلغ يجب أن يكون أكبر من صفر')
      .min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
    deposit_date: Yup.date().required('تاريخ الإيداع مطلوب')
  });

  const formik = useFormik({
    initialValues: {
      bank_account_id: '',
      amount: '',
      deposit_date: new Date().toISOString().split('T')[0]
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const depositData = {
          bank_account_id: parseInt(values.bank_account_id),
          amount: parseFloat(values.amount),
          deposit_date: values.deposit_date
        };
        
        const response = await updateDeposit(depositId, depositData);
        
        if (response.success) {
          toast.success('تم تحديث الإيداع بنجاح');
          formik.resetForm();
          onSuccess();
          onClose();
        } else {
          toast.error(response.message || 'حدث خطأ في تحديث الإيداع');
        }
      } catch (error) {
        console.error('Error updating deposit:', error);
        toast.error('حدث خطأ في تحديث الإيداع');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch bank accounts and deposit data
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !depositId) return;

      try {
        setIsFetchingDeposit(true);

        // Fetch bank accounts
        const accountsResponse = await getAllBankAccounts();
        if (accountsResponse.success) {
          setBankAccounts(accountsResponse.data);
        }

        // Fetch deposit data
        const depositResponse = await getDepositById(depositId);
        if (depositResponse.success) {
          const deposit = depositResponse.data;
          formik.setValues({
            bank_account_id: deposit.bank_account_id,
            amount: deposit.amount,
            deposit_date: deposit.deposit_date.split('T')[0]
          });
        } else {
          toast.error('فشل في تحميل بيانات الإيداع');
          onClose();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
        onClose();
      } finally {
        setIsFetchingDeposit(false);
      }
    };

    fetchData();
  }, [isOpen, depositId]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-md ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            تعديل الإيداع
          </DialogTitle>
        </DialogHeader>

        {isFetchingDeposit ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="mr-3">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Bank Account Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank_account_id">
                الحساب البنكي <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.bank_account_id.toString()}
                onValueChange={(value) => formik.setFieldValue('bank_account_id', value)}
              >
                <SelectTrigger className={formik.errors.bank_account_id && formik.touched.bank_account_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="اختر الحساب البنكي" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.bank_name} - {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.errors.bank_account_id && formik.touched.bank_account_id && (
                <p className="text-sm text-red-500">{formik.errors.bank_account_id}</p>
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

            {/* Deposit Date */}
            <div className="space-y-2">
              <Label htmlFor="deposit_date">
                تاريخ الإيداع <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deposit_date"
                name="deposit_date"
                type="date"
                value={formik.values.deposit_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.deposit_date && formik.touched.deposit_date ? 'border-red-500' : ''}
              />
              {formik.errors.deposit_date && formik.touched.deposit_date && (
                <p className="text-sm text-red-500">{formik.errors.deposit_date}</p>
              )}
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
                disabled={isLoading || isFetchingDeposit}
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

export default EditDepositModal;
