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
import { createEmployeeCashTransaction } from '@/app/services/api/employeeCashTransactions';
import { getEmployees } from '@/app/services/api/employees';
import { toast } from 'react-toastify';
import useSWR from 'swr';

const ClientCashTransactionModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  clientId, 
  clientName,
  walletId,
  walletInfo
}) => {
  const { isRTL, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const isArabic = language === 'ar';

  // Fetch employees
  const { data: employeesData } = useSWR(
    isOpen ? "/employees" : null,
    getEmployees
  );

  const employees = employeesData?.data || [];

  const validationSchema = Yup.object({
    employee_id: Yup.number().required('الموظف مطلوب'),
    amount: Yup.number().min(0.01, 'المبلغ يجب أن يكون أكبر من 0').required('المبلغ مطلوب'),
    description: Yup.string().optional()
  });

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      amount: 0,
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Check wallet balance first
        if (!walletInfo || parseFloat(walletInfo.balance || 0) < parseFloat(values.amount)) {
          toast.error('رصيد المحفظة غير كافي لإجراء هذه المعاملة');
          setIsLoading(false);
          return;
        }

        // Find selected employee (just to verify employee exists)
        const selectedEmployee = employees.find(emp => emp.id === parseInt(values.employee_id));
        if (!selectedEmployee) {
          toast.error('الموظف المحدد غير موجود');
          setIsLoading(false);
          return;
        }

        const transactionPayload = {
          employee_id: parseInt(values.employee_id),
          amount: parseFloat(values.amount),
          type: 'debit', // Always debit for expenses
          description: values.description || null,
          client_id: clientId,
          wallet_id: walletId
        };
        
        const response = await createEmployeeCashTransaction(transactionPayload);
        
        if (response.success) {
          toast.success('تم إضافة المصروف بنجاح');
          onSuccess();
          handleClose();
        } else {
          toast.error(response.message || 'فشل في إضافة المصروف');
        }
      } catch (error) {
        console.error('Error saving transaction:', error);
        const errorMessage = error.response?.data?.message || error.message || 'فشل في إضافة المصروف';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>
            اضافة مصروف
          </DialogTitle>
          {clientName && (
            <p className="text-sm text-muted-foreground">
              العميل: {clientName}
            </p>
          )}
          {walletInfo && (
            <p className="text-sm text-muted-foreground">
              رصيد المحفظة: {parseFloat(walletInfo.balance || 0).toLocaleString()} {walletInfo.currency || 'AED'}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Employee Select */}
          <div className="space-y-2">
            <Label htmlFor="employee_id">الموظف *</Label>
            <Select
              value={formik.values.employee_id}
              onValueChange={(value) => formik.setFieldValue('employee_id', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الموظف" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.employee_id && formik.errors.employee_id && (
              <p className="text-sm text-red-500">{formik.errors.employee_id}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="أدخل المبلغ"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-sm text-red-500">{formik.errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="أدخل وصف المعاملة (اختياري)"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCashTransactionModal;