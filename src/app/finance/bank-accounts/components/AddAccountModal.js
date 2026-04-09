'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslations } from '@/hooks/useTranslations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { createBankAccount } from '@/app/services/api/bankAccounts';
import { toast } from 'react-toastify';

const AddAccountModal = ({ isOpen, onClose, onSuccess, accountType = 'bank' }) => {
  const { isRTL, language } = useLanguage();
  const t = useTranslations('AddBankAccount');
  const [isLoading, setIsLoading] = useState(false);

  const isBankAccount = accountType === 'bank';

  const validationSchema = Yup.object({
    bank_name: isBankAccount
      ? Yup.string().required(t('bankNameRequired'))
      : Yup.string().optional(),
    account_name: Yup.string().required(t('accountNameRequired')),
    account_number: isBankAccount
      ? Yup.string().required(t('accountNumberRequired'))
      : Yup.string().optional(),
    iban: Yup.string().optional(),
    current_balance: Yup.number().min(0, t('balanceNegativeError')).default(0),
    status: Yup.string().oneOf(['active', 'inactive']).default('active')
  });

  const formik = useFormik({
    initialValues: {
      bank_name: '',
      account_name: '',
      account_number: '',
      iban: '',
      current_balance: 0,
      status: 'active',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const accountData = {
          ...values,
          account_type: accountType,
          current_balance: parseFloat(values.current_balance) || 0
        };
        
        const response = await createBankAccount(accountData);
        
        if (response.success) {
          toast.success(t('accountAddedSuccess'));
          formik.resetForm();
          onSuccess();
          onClose();
        } else {
          toast.error(response.message || t('errorAddingAccount'));
        }
      } catch (error) {
        const isPermissionError = error?.response?.status === 403;
        if (isPermissionError) {
          const permissionMessage = error?.response?.data?.message || (language === 'ar' ? 'ليس لديك صلاحية لاضافة هذا الحساب' : 'You do not have permission to add this account');
          toast.error(permissionMessage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error(t('errorAddingAccount'));
        }
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
            {isBankAccount ? t('titleBank') : t('titleCash')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Bank Name - bank only */}
          {isBankAccount && (
            <div className="space-y-2">
              <Label htmlFor="bank_name">{t('bankName')} *</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={formik.values.bank_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.bank_name && formik.errors.bank_name ? 'border-red-500' : ''}
                placeholder={t('bankNamePlaceholder')}
              />
              {formik.touched.bank_name && formik.errors.bank_name && (
                <p className="text-sm text-red-500">{formik.errors.bank_name}</p>
              )}
            </div>
          )}

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="account_name">{t('accountName')} *</Label>
            <Input
              id="account_name"
              name="account_name"
              value={formik.values.account_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.account_name && formik.errors.account_name ? 'border-red-500' : ''}
              placeholder={t('accountNamePlaceholder')}
            />
            {formik.touched.account_name && formik.errors.account_name && (
              <p className="text-sm text-red-500">{formik.errors.account_name}</p>
            )}
          </div>

          {/* Account Number - bank only */}
          {isBankAccount && (
            <div className="space-y-2">
              <Label htmlFor="account_number">{t('accountNumber')} *</Label>
              <Input
                id="account_number"
                name="account_number"
                value={formik.values.account_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.account_number && formik.errors.account_number ? 'border-red-500' : ''}
                placeholder={t('accountNumberPlaceholder')}
              />
              {formik.touched.account_number && formik.errors.account_number && (
                <p className="text-sm text-red-500">{formik.errors.account_number}</p>
              )}
            </div>
          )}

          {/* IBAN - bank only */}
          {isBankAccount && (
            <div className="space-y-2">
              <Label htmlFor="iban">{t('iban')}</Label>
              <Input
                id="iban"
                name="iban"
                value={formik.values.iban}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('ibanPlaceholder')}
              />
            </div>
          )}

          {/* Current Balance */}
          <div className="space-y-2">
            <Label htmlFor="current_balance">{t('currentBalance')}</Label>
            <Input
              id="current_balance"
              name="current_balance"
              type="number"
              step="0.01"
              value={formik.values.current_balance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.current_balance && formik.errors.current_balance ? 'border-red-500' : ''}
              placeholder={t('balancePlaceholder')}
            />
            {formik.touched.current_balance && formik.errors.current_balance && (
              <p className="text-sm text-red-500">{formik.errors.current_balance}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t('status')}</Label>
            <Select 
              value={formik.values.status} 
              onValueChange={(value) => formik.setFieldValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
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
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formik.isValid}
              className="flex-1"
            >
              {isLoading ? t('saving') : t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;