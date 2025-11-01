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
import { createEmployeeExpense, updateEmployeeExpense } from '@/app/services/api/employeeExpenses';
import { getEmployees } from '@/app/services/api/employees';
import { toast } from 'react-toastify';

const ExpenseModal = ({ isOpen, onClose, onSuccess, expenseId = null, expenseData = null }) => {
  const { isRTL } = useLanguage();
  const [employees, setEmployees] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!expenseId;

  // Fetch employees and bank accounts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await getEmployees();
        
        if (employeesRes.success) {
          setEmployees(employeesRes.data);
        }

        // Fetch bank accounts
        const bankAccountsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bank-accounts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const bankAccountsData = await bankAccountsRes.json();
        if (bankAccountsData.success) {
          setBankAccounts(bankAccountsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Update form when expense data changes
  useEffect(() => {
    if (isEditMode && expenseData) {
      formik.setValues({
        employee_id: expenseData.employee_id?.toString() || '',
        amount: expenseData.amount || 0,
        bank_account_id: expenseData.bank_account_id?.toString() || '',
        description: expenseData.description || ''
      });
    }
  }, [expenseData, isEditMode]);

  const validationSchema = Yup.object({
    employee_id: Yup.number().required('يجب اختيار الموظف'),
    amount: Yup.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر').required('المبلغ مطلوب'),
    bank_account_id: Yup.number().optional(),
    description: Yup.string().optional()
  });

  const formik = useFormik({
    initialValues: {
      employee_id: '',
      amount: 0,
      bank_account_id: '',
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const expensePayload = {
          employee_id: parseInt(values.employee_id),
          amount: parseFloat(values.amount),
          description: values.description || null
        };
        
        let response;
        if (isEditMode) {
          response = await updateEmployeeExpense(expenseId, expensePayload);
        } else {
          response = await createEmployeeExpense(expensePayload);
        }
        
        if (response.success) {
          toast.success(isEditMode ? 'تم تحديث المصروف بنجاح' : 'تم إضافة المصروف بنجاح');
          onSuccess();
          handleClose();
        } else {
          toast.error(response.message || 'حدث خطأ في حفظ المصروف');
        }
      } catch (error) {
        console.error('Error saving expense:', error);
        toast.error('حدث خطأ في حفظ المصروف');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'تعديل مصروف' : 'إضافة مصروف جديد'}
          </DialogTitle>
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
              placeholder="أدخل وصف المصروف"
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
              {isLoading ? 'جاري الحفظ...' : (isEditMode ? 'تحديث' : 'إضافة')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
