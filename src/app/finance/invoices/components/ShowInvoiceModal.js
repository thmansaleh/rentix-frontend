"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, Trash2, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { toast } from "react-toastify";
import { getInvoiceById, deleteInvoiceAttachment } from "@/app/services/api/invoices";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function ShowInvoiceModal({ isOpen, onClose, invoiceId }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingAttachment, setDeletingAttachment] = useState(null);

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

      toast.error("فشل في تحميل بيانات الفاتورة");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'AED') => {
    const currencyMap = {
      'AED': 'ar-AE',
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'SAR': 'ar-SA'
    };
    
    return new Intl.NumberFormat(currencyMap[currency] || 'ar-AE', {
      style: 'currency',
      currency: currency
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
      pending: { label: 'قيد الانتظار', variant: 'secondary' },
      approved: { label: 'معتمدة', variant: 'success' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleDownloadAttachment = (attachment) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const fileUrl = `${API_URL}${attachment.file_path}`;
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = attachment.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المرفق؟')) return;
    
    try {
      setDeletingAttachment(attachmentId);
      const response = await deleteInvoiceAttachment(attachmentId);
      
      if (response.success) {
        toast.success('تم حذف المرفق بنجاح');
        loadInvoiceData(); // Reload to get updated data
      } else {
        toast.error(response.error || 'فشل في حذف المرفق');
      }
    } catch (error) {
      toast.error('فشل في حذف المرفق');
    } finally {
      setDeletingAttachment(null);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) {
      return <File className="h-5 w-5 text-gray-500" />;
    }
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
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
                <label className="text-sm font-medium text-gray-600">العملة</label>
                <p className="text-lg font-semibold">{invoice.currency || 'AED'}</p>
              </div>
            </div>

            {/* Client & Branch Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg border-b pb-2">معلومات أساسية</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">الموكل</label>
                  <p className="text-base">{invoice.client_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الفرع</label>
                  <p className="text-base">{invoice.branch_name || '-'}</p>
                </div>
              </div>
            </div>

            {/* Bank Account Info */}
            {invoice.bank_name && (
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
                </div>
              </div>
            )}

            {/* Invoice Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg border-b pb-2">تفاصيل الفاتورة</h3>
              
              {invoice.items && invoice.items.length > 0 ? (
                <div className="space-y-2">
                  {invoice.items.map((item, index) => (
                    <div key={item.id || index} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">{index + 1}. </span>
                        <span>{item.description}</span>
                      </div>
                      <div className="font-semibold text-blue-600 mr-4">
                        {formatCurrency(item.amount, invoice.currency)}
                      </div>
                    </div>
                  ))}
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                    <span className="font-medium">المجموع الفرعي</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        invoice.items.reduce((sum, item) => sum + parseFloat(item.amount), 0),
                        invoice.currency
                      )}
                    </span>
                  </div>
                  
                  {/* VAT */}
                  {invoice.vat > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
                      <span className="font-medium">ضريبة القيمة المضافة ({invoice.vat}%)</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          (invoice.items.reduce((sum, item) => sum + parseFloat(item.amount), 0) * invoice.vat) / 100,
                          invoice.currency
                        )}
                      </span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded font-bold text-lg border-t-2 border-blue-200 mt-4">
                    <span>الإجمالي</span>
                    <span className="text-blue-600 text-xl">{formatCurrency(invoice.amount, invoice.currency)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد بنود</p>
              )}
            </div>

            {/* Attachments */}
            {invoice.attachments && invoice.attachments.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg border-b pb-2">المرفقات</h3>
                
                <div className="space-y-2">
                  {invoice.attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(attachment.attachment_name)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{attachment.attachment_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadAttachment(attachment)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>تحميل</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          disabled={deletingAttachment === attachment.id}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          {deletingAttachment === attachment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span>حذف</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
