'use client';

import React, { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableCombobox } from '@/components/ui/searchable-combobox';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClientInvoice } from '@/app/services/api/clientInvoices';
import { searchParties } from '@/app/services/api/parties';
import { searchCasesForAddNewCasePage } from '@/app/services/api/cases';
import { toast } from 'react-toastify';

const AddInvoiceModal = ({ isOpen, onClose, onSuccess, preSelectedClientId = null }) => {
  const { isRTL } = useLanguage();
  const [searchResults, setSearchResults] = useState([]);
  const [caseSearchResults, setCaseSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle party search
  const handlePartySearch = useCallback(async (query) => {
    try {
      const response = await searchParties(query);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching parties:', error);
    }
  }, []);

  // Handle case search
  const handleCaseSearch = useCallback(async (query) => {
    try {
      const response = await searchCasesForAddNewCasePage(query);
      if (response.success) {
        setCaseSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching cases:', error);
    }
  }, []);

  // Format options for combobox
  const clientOptions = searchResults.map(client => ({
    value: client.id,
    label: `${client.name}${client.phone ? ` - ${client.phone}` : ''}`,
    phone: client.phone,
    name: client.name
  }));

  // Format case options for combobox
  const caseOptions = caseSearchResults.map(caseItem => ({
    value: caseItem.id,
    label: `  ${caseItem.topic} ${caseItem.case_number} - ${caseItem.file_number}`,
    case_number: caseItem.case_number,
    file_number: caseItem.file_number,
  }));

  const validationSchema = Yup.object({
    client_id: Yup.number().required('العميل مطلوب'),
    case_id: Yup.number().nullable(),
    invoice_for: Yup.string().nullable(),
    date: Yup.date().required('التاريخ مطلوب'),
    total_amount: Yup.number().min(0, 'المبلغ لا يمكن أن يكون سالباً').required('المبلغ الإجمالي مطلوب'),
    status: Yup.string().oneOf(['unpaid', 'paid', 'partial']).default('unpaid')
  });

  const formik = useFormik({
    initialValues: {
      client_id: preSelectedClientId?.toString() || '',
      case_id: '',
      invoice_for: '',
      date: new Date().toISOString().split('T')[0],
      total_amount: '',
      status: 'unpaid'
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const invoiceData = {
          ...values,
          client_id: parseInt(values.client_id),
          case_id: values.case_id ? parseInt(values.case_id) : null,
          invoice_for: values.invoice_for || null,
          total_amount: parseFloat(values.total_amount)
        };
        
        const response = await createClientInvoice(invoiceData);
        
        if (response.success) {
          toast.success(`تم إضافة الفاتورة بنجاح - رقم الفاتورة: ${response.invoice_number}`);
          formik.resetForm();
          setSearchResults([]);
          setCaseSearchResults([]);
          onSuccess();
          onClose();
        } else {
          toast.error(response.message || 'حدث خطأ في إضافة الفاتورة');
        }
      } catch (error) {
        console.error('Error creating invoice:', error);
        toast.error('حدث خطأ في إضافة الفاتورة');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setSearchResults([]);
    setCaseSearchResults([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-md ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            إضافة فاتورة جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          {/* Client SearchableCombobox */}
          <div className="space-y-2">
            <Label htmlFor="client_id">العميل *</Label>
            <SearchableCombobox
              value={formik.values.client_id}
              onValueChange={(value) => formik.setFieldValue('client_id', value)}
              onSearch={handlePartySearch}
              options={clientOptions}
              placeholder="اختر العميل"
              searchPlaceholder="ابحث عن عميل..."
              emptyMessage="لا توجد نتائج"
              minSearchLength={2}
              disabled={!!preSelectedClientId}
              className={formik.errors.client_id && formik.touched.client_id ? 'border-red-500' : ''}
            />
            {formik.errors.client_id && formik.touched.client_id && (
              <p className="text-sm text-red-500">{formik.errors.client_id}</p>
            )}
            <p className="text-xs text-gray-500">سيتم إنشاء رقم الفاتورة تلقائياً</p>
          </div>

          {/* Case SearchableCombobox */}
          <div className="space-y-2">
            <Label htmlFor="case_id">القضية (اختياري)</Label>
            <SearchableCombobox
              value={formik.values.case_id}
              onValueChange={(value) => formik.setFieldValue('case_id', value)}
              onSearch={handleCaseSearch}
              options={caseOptions}
              placeholder="اختر القضية"
              searchPlaceholder="ابحث برقم القضية أو رقم الملف..."
              emptyMessage="لا توجد نتائج"
              minSearchLength={2}
              className={formik.errors.case_id && formik.touched.case_id ? 'border-red-500' : ''}
            />
            {formik.errors.case_id && formik.touched.case_id && (
              <p className="text-sm text-red-500">{formik.errors.case_id}</p>
            )}
          </div>

          {/* Invoice For */}
          <div className="space-y-2">
            <Label htmlFor="invoice_for">الفاتورة لـ (اختياري)</Label>
            <Input
              id="invoice_for"
              name="invoice_for"
              type="text"
              placeholder=" ...مصروف محكمة  رسوم فتح ملف"
              value={formik.values.invoice_for}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.invoice_for && formik.touched.invoice_for ? 'border-red-500' : ''}
            />
            {formik.errors.invoice_for && formik.touched.invoice_for && (
              <p className="text-sm text-red-500">{formik.errors.invoice_for}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">التاريخ *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.date && formik.touched.date ? 'border-red-500' : ''}
            />
            {formik.errors.date && formik.touched.date && (
              <p className="text-sm text-red-500">{formik.errors.date}</p>
            )}
          </div>

          {/* Total Amount */}
          <div className="space-y-2">
            <Label htmlFor="total_amount">المبلغ الإجمالي *</Label>
            <Input
              id="total_amount"
              name="total_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formik.values.total_amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.errors.total_amount && formik.touched.total_amount ? 'border-red-500' : ''}
            />
            {formik.errors.total_amount && formik.touched.total_amount && (
              <p className="text-sm text-red-500">{formik.errors.total_amount}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">الحالة *</Label>
            <Select
              value={formik.values.status}
              onValueChange={(value) => formik.setFieldValue('status', value)}
            >
              <SelectTrigger className={formik.errors.status && formik.touched.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">غير مدفوعة</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="partial">مدفوعة جزئياً</SelectItem>
              </SelectContent>
            </Select>
            {formik.errors.status && formik.touched.status && (
              <p className="text-sm text-red-500">{formik.errors.status}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
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
              {isLoading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceModal;
