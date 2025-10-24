"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { toast } from "react-toastify";
import { getInvoiceById, deleteInvoice } from "@/app/services/api/invoices";

export default function DeleteInvoiceModal({ isOpen, onClose, invoiceId, onSuccess }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteInvoice(invoiceId);
      
      if (response.success) {
        toast.success("تم حذف الفاتورة بنجاح");
        onSuccess();
        onClose();
      } else {
        toast.error(response.error || "فشل في حذف الفاتورة");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(error.response?.data?.error || "فشل في حذف الفاتورة");
    } finally {
      setDeleting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !deleting && !loading) {
      onClose();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <span className="text-red-600">تأكيد الحذف</span>
        </div>
      }
      size="md"
    >
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="mr-3">جاري تحميل البيانات...</span>
        </div>
      ) : invoice ? (
        <>
          <CustomModalBody>
              <p className="text-gray-700">
                هل أنت متأكد من حذف الفاتورة التالية؟ لا يمكن التراجع عن هذا الإجراء.
              </p>

              {/* Invoice Details */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">رقم الفاتورة:</span>
                  <span className="font-bold font-mono">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">العميل:</span>
                  <span className="font-semibold">{invoice.client_name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">المبلغ:</span>
                  <span className="font-bold text-red-600">{formatCurrency(invoice.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">الحالة:</span>
                  <span className="font-semibold">
                    {invoice.status === 'draft' && 'مسودة'}
                    {invoice.status === 'issued' && 'صادرة'}
                    {invoice.status === 'paid' && 'مدفوعة'}
                    {invoice.status === 'cancelled' && 'ملغاة'}
                  </span>
                </div>
              </div>

              {/* Warning for paid invoices */}
              {invoice.status === 'paid' && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                    ⚠️ تحذير: هذه الفاتورة مدفوعة. سيتم عكس المبلغ من الحساب البنكي عند الحذف.
                  </p>
                </div>
              )}
          </CustomModalBody>

          <CustomModalFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={deleting}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || loading || !invoice}
            >
              {deleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "حذف الفاتورة"
              )}
            </Button>
          </CustomModalFooter>
        </>
      ) : (
        <div className="text-center text-gray-500 p-8">
          لم يتم العثور على بيانات الفاتورة
        </div>
      )}
    </CustomModal>
  );
}
