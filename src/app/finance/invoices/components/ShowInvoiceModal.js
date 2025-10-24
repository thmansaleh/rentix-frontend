"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { toast } from "react-toastify";
import { getInvoiceById } from "@/app/services/api/invoices";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function ShowInvoiceModal({ isOpen, onClose, invoiceId }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      loadInvoiceData();
    }
  }, [isOpen, invoiceId]);

  const loadInvoiceData = async () => {
    try {
      setLoading(true);
      const response = await getInvoiceById(invoiceId);
      
      if (response.success) {
        setInvoice(response.data);
      } else {
        toast.error("فشل في تحميل بيانات الفاتورة");
        onClose();
      }
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast.error("فشل في تحميل بيانات الفاتورة");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), "PPP", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'مسودة', variant: 'secondary' },
      issued: { label: 'صادرة', variant: 'default' },
      paid: { label: 'مدفوعة', variant: 'success' },
      cancelled: { label: 'ملغاة', variant: 'destructive' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل الفاتورة"
      size="lg"
    >
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="mr-3">جاري تحميل البيانات...</span>
        </div>
      ) : invoice ? (
        <>
          <CustomModalBody>
            {/* Invoice Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-600">رقم الفاتورة</label>
                <p className="text-lg font-bold font-mono">{invoice.invoice_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">التاريخ</label>
                <p className="text-lg font-semibold">{formatDate(invoice.invoice_date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">الحالة</label>
                <div className="mt-1">
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">المبلغ الإجمالي</label>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(invoice.amount)}</p>
              </div>
            </div>

            {/* Client & Employee Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg border-b pb-2">معلومات إضافية</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">العميل</label>
                  <p className="text-base">{invoice.client_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الموظف المحول</label>
                  <p className="text-base">{invoice.referred_by_employee_name || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bank Account Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg border-b pb-2">معلومات الحساب البنكي</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">اسم البنك</label>
                  <p className="text-base">{invoice.bank_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم الحساب</label>
                  <p className="text-base font-mono">{invoice.account_number}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">اسم الحساب</label>
                  <p className="text-base">{invoice.account_name}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg border-b pb-2">بنود الفاتورة</h3>
              
              {invoice.items && invoice.items.length > 0 ? (
                <div className="space-y-2">
                  {invoice.items.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">{index + 1}. </span>
                        <span>{item.description}</span>
                      </div>
                      <div className="font-semibold text-blue-600 mr-4">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                  
                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded font-bold text-lg border-t-2 border-blue-200 mt-4">
                    <span>الإجمالي</span>
                    <span className="text-blue-600 text-xl">{formatCurrency(invoice.amount)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد بنود</p>
              )}
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-medium">أضيف بواسطة:</span> {invoice.created_by_name || '-'}
              </p>
              <p>
                <span className="font-medium">تاريخ الإضافة:</span> {formatDate(invoice.created_at)}
              </p>
            </div>
          </CustomModalBody>

          <CustomModalFooter>
            <Button
              variant="outline"
              onClick={onClose}
            >
              إغلاق
            </Button>
          </CustomModalFooter>
        </>
      ) : (
        <div className="p-12 text-center text-gray-500">
          لم يتم العثور على بيانات الفاتورة
        </div>
      )}
    </CustomModal>
  );
}
