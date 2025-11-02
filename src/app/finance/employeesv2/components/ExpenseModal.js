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
import { useTranslations } from '@/hooks/useTranslations';
import { createEmployeeExpense, updateEmployeeExpense } from '@/app/services/api/employeeExpenses';
import { getEmployees } from '@/app/services/api/employees';
import { toast } from 'react-toastify';

const ExpenseModal = ({ isOpen, onClose, onSuccess, expenseId = null, expenseData = null }) => {
  const { isRTL } = useLanguage();
  const t = useTranslations('employeeFinance.modal');
  const tExpenses = useTranslations('employeeFinance.expenses');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!expenseId;

  // Fetch employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await getEmployees();
        
        if (employeesRes.success) {
          setEmployees(employeesRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const validationSchema = Yup.object({
    employee_id: !isEditMode ? Yup.number().required(t('employeeRequired')) : Yup.number().notRequired(),
    amount: Yup.number().min(0.01, t('amountMinError')).required(t('amountRequired')),
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
          toast.success(isEditMode ? t('updateSuccess') : t('addSuccess'));
          onSuccess();
          handleClose();
        } else {
          toast.error(response.message || t('saveError'));
        }
      } catch (error) {
        console.error('Error saving expense:', error);
        const errorMessage = error.response?.data?.message || error.message || t('saveError');
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Update form when expense data changes
  useEffect(() => {
    if (isEditMode && expenseData) {
      formik.setValues({
        employee_id: expenseData.employee_id?.toString() || '',
        amount: expenseData.amount || 0,
        description: expenseData.description || ''
      });
    }
  }, [expenseData, isEditMode]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? tExpenses('edit') : tExpenses('addNew')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Employee Select - Only show in Add mode */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="employee_id">{t('employee')} *</Label>
              <Select
                value={formik.values.employee_id}
                onValueChange={(value) => formik.setFieldValue('employee_id', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectEmployee')} />
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
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">{t('amount')} *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder={t('amountPlaceholder')}
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
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('descriptionPlaceholder')}
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
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('saving') : (isEditMode ? t('update') : t('save'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
