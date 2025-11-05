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
import { updateEmployeeCashTransaction } from '@/app/services/api/employeeCashTransactions';
import { getEmployees } from '@/app/services/api/employees';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { Edit } from 'lucide-react';

const EditEmployeeCashTransactionModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  transaction,
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
      employee_id: transaction?.employee_id || '',
      amount: transaction?.amount || 0,
      description: transaction?.description || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Find selected employee to check their balance
        const selectedEmployee = employees.find(emp => emp.id === parseInt(values.employee_id));
        if (!selectedEmployee) {
          toast.error('الموظف المحدد غير موجود');
          setIsLoading(false);
          return;
        }

        // Check if new amount is different and if employee has sufficient balance
        const amountDifference = parseFloat(values.amount) - parseFloat(transaction.amount);
        if (amountDifference > 0) {
          // Amount increased, check if employee has enough balance for the difference
          if (parseFloat(selectedEmployee.balance || 0) < amountDifference) {
            toast.error('رصيد الموظف غير كافي للزيادة المطلوبة');
            setIsLoading(false);
            return;
          }
        }

        const transactionPayload = {
          employee_id: parseInt(values.employee_id),
          amount: parseFloat(values.amount),
          type: 'debit', // Always debit for expenses
          description: values.description || null
        };
        
        const response = await updateEmployeeCashTransaction(transaction.id, transactionPayload);
        
        if (response.success) {
          toast.success('تم تحديث المصروف بنجاح');
          onSuccess();
          handleClose();
        } else {
          toast.error(response.message || 'فشل في تحديث المصروف');
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
        const errorMessage = error.response?.data?.message || error.message || 'فشل في تحديث المصروف';
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

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            تعديل مصروف
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            رقم المعاملة: #{transaction.id}
          </p>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Employee Select */}
          <div className="space-y-2">
            <Label htmlFor="employee_id">الموظف *</Label>
            <Select
              value={formik.values.employee_id.toString()}
              onValueChange={(value) => formik.setFieldValue('employee_id', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الموظف" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name} - رصيد: {parseFloat(employee.balance || 0).toLocaleString()} AED
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
            <p className="text-xs text-muted-foreground">
              المبلغ الأصلي: {parseFloat(transaction.amount).toLocaleString()} {walletInfo?.currency || 'AED'}
            </p>
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
              {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeCashTransactionModal;