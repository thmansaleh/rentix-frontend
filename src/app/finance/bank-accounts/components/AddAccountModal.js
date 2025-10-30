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
import { createBankAccount } from '@/app/services/api/bankAccounts';
import { getBranches } from '@/app/services/api/branches';
import { toast } from 'react-toastify';

const AddAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { isRTL } = useLanguage();
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        if (response.success) {
          setBranches(response.data);
        }
      } catch (error) {

      }
    };
    
    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen]);

  const validationSchema = Yup.object({
    bank_name: Yup.string().required('اسم البنك مطلوب'),
    account_name: Yup.string().required('اسم الحساب مطلوب'),
    account_number: Yup.string().required('رقم الحساب مطلوب'),
    iban: Yup.string().optional(),
    branch_id: Yup.number().nullable(),
    current_balance: Yup.number().min(0, 'الرصيد لا يمكن أن يكون سالباً').default(0),
    status: Yup.string().oneOf(['active', 'inactive']).default('active')
  });

  const formik = useFormik({
    initialValues: {
      bank_name: '',
      account_name: '',
      account_number: '',
      iban: '',
      branch_id: '',
      current_balance: 0,
      status: 'active'
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const accountData = {
          ...values,
          branch_id: values.branch_id || null,
          current_balance: parseFloat(values.current_balance) || 0
        };
        
        const response = await createBankAccount(accountData);
        
        if (response.success) {
          toast.success('تم إضافة الحساب البنكي بنجاح');
          formik.resetForm();
          onSuccess();
          onClose();
        } else {
          toast.error(response.message || 'حدث خطأ في إضافة الحساب');
        }
      } catch (error) {

        toast.error('حدث خطأ في إضافة الحساب البنكي');
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
            إضافة حساب بنكي جديد
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bank_name">اسم البنك *</Label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formik.values.bank_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.bank_name && formik.errors.bank_name ? 'border-red-500' : ''}
              placeholder="مثال: بنك الإمارات دبي الوطني"
            />
            {formik.touched.bank_name && formik.errors.bank_name && (
              <p className="text-sm text-red-500">{formik.errors.bank_name}</p>
            )}
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="account_name">اسم الحساب *</Label>
            <Input
              id="account_name"
              name="account_name"
              value={formik.values.account_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.account_name && formik.errors.account_name ? 'border-red-500' : ''}
              placeholder="مثال: حساب الشركة الرئيسي"
            />
            {formik.touched.account_name && formik.errors.account_name && (
              <p className="text-sm text-red-500">{formik.errors.account_name}</p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account_number">رقم الحساب *</Label>
            <Input
              id="account_number"
              name="account_number"
              value={formik.values.account_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.account_number && formik.errors.account_number ? 'border-red-500' : ''}
              placeholder="مثال: 1234567890"
            />
            {formik.touched.account_number && formik.errors.account_number && (
              <p className="text-sm text-red-500">{formik.errors.account_number}</p>
            )}
          </div>

          {/* IBAN */}
          <div className="space-y-2">
            <Label htmlFor="iban">رقم IBAN</Label>
            <Input
              id="iban"
              name="iban"
              value={formik.values.iban}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="مثال: AE070331234567890123456"
            />
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label htmlFor="branch_id">الفرع</Label>
            <Select 
              value={formik.values.branch_id} 
              onValueChange={(value) => formik.setFieldValue('branch_id', value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون فرع</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {isRTL ? branch.name_ar : branch.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Balance */}
          <div className="space-y-2">
            <Label htmlFor="current_balance">الرصيد الحالي</Label>
            <Input
              id="current_balance"
              name="current_balance"
              type="number"
              step="0.01"
              value={formik.values.current_balance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.current_balance && formik.errors.current_balance ? 'border-red-500' : ''}
              placeholder="0.00"
            />
            {formik.touched.current_balance && formik.errors.current_balance && (
              <p className="text-sm text-red-500">{formik.errors.current_balance}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">الحالة</Label>
            <Select 
              value={formik.values.status} 
              onValueChange={(value) => formik.setFieldValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formik.isValid}
              className="flex-1"
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;