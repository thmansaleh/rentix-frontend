"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { toast } from "react-toastify";
import { getInvoiceById } from "@/app/services/api/invoices";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function PrintInvoiceModal({ isOpen, onClose, invoiceId }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

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

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-area');
    if (!printContent) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>فاتورة - ${invoice?.invoice_number || ''}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              direction: rtl;
              padding: 20px;
            }
            .border-b-2 { border-bottom: 2px solid #1f2937; }
            .border-gray-800 { border-color: #1f2937; }
            .pb-6 { padding-bottom: 1.5rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mt-12 { margin-top: 3rem; }
            .pt-6 { padding-top: 1.5rem; }
            .p-4 { padding: 1rem; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .gap-6 { gap: 1.5rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .font-mono { font-family: monospace; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-500 { color: #6b7280; }
            .text-blue-600 { color: #2563eb; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-gray-800 { background-color: #1f2937; }
            .text-white { color: white; }
            .border { border: 1px solid; }
            .border-t-2 { border-top: 2px solid; }
            .border-gray-300 { border-color: #d1d5db; }
            .rounded-t { border-top-left-radius: 0.25rem; border-top-right-radius: 0.25rem; }
            .rounded-b { border-bottom-left-radius: 0.25rem; border-bottom-right-radius: 0.25rem; }
            .w-80 { width: 20rem; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 0.75rem; text-align: right; border: 1px solid #d1d5db; }
            th { background-color: #f3f4f6; font-weight: 600; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      draft: 'مسودة',
      issued: 'صادرة',
      paid: 'مدفوعة',
      cancelled: 'ملغاة'
    };
    return statusLabels[status] || status;
  };

  if (!isOpen) return null;

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title="طباعة الفاتورة"
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
              {/* Print Area */}
              <div id="invoice-print-area" ref={printRef} className="bg-white">
                {/* Header */}
                <div className="border-b-2 border-gray-800 pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">فاتورة</h1>
                      <p className="text-gray-600 mt-1">INVOICE</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        التاريخ: {formatDate(invoice.invoice_date)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* From/To */}
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">من:</h3>
                    <div className="text-gray-600">
                      <p className="font-semibold text-gray-900">مكتب المحاماة</p>
                      <p className="text-sm">Law Office</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">إلى:</h3>
                    <div className="text-gray-600">
                      {invoice.client_name ? (
                        <p className="font-semibold text-gray-900">{invoice.client_name}</p>
                      ) : (
                        <p className="text-gray-500 italic">غير محدد</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm font-medium text-gray-600">الموظف المحول:</span>
                    <p className="font-semibold text-gray-900">{invoice.referred_by_employee_name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">الحالة:</span>
                    <p className="font-semibold text-gray-900">{getStatusLabel(invoice.status)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">الحساب البنكي:</span>
                    <p className="font-semibold text-gray-900">
                      {invoice.bank_name} - {invoice.account_number}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-700 p-3 text-right" style={{ width: '60px' }}>#</th>
                        <th className="border border-gray-700 p-3 text-right">الوصف</th>
                        <th className="border border-gray-700 p-3 text-left" style={{ width: '150px' }}>المبلغ (AED)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((item, index) => (
                          <tr key={item.id || index} className="border-b">
                            <td className="border border-gray-300 p-3 text-center font-medium">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 p-3">
                              {item.description}
                            </td>
                            <td className="border border-gray-300 p-3 text-left font-mono font-semibold">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="border border-gray-300 p-6 text-center text-gray-500">
                            لا توجد بنود
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total with VAT breakdown */}
                <div className="flex justify-end mb-8">
                  <div className="w-80">
                    <div className="bg-gray-50 border border-gray-300 p-4 space-y-2 rounded-t">
                      <div className="flex justify-between text-sm">
                        <span>المجموع الفرعي / Subtotal</span>
                        <span className="font-mono">{formatCurrency(invoice.amount / 1.05)} AED</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ضريبة القيمة المضافة (5%) / VAT</span>
                        <span className="font-mono">{formatCurrency(invoice.amount - (invoice.amount / 1.05))} AED</span>
                      </div>
                    </div>
                    <div className="bg-gray-800 text-white p-4 rounded-b">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">الإجمالي / Total</span>
                        <span className="text-2xl font-bold font-mono">
                          {formatCurrency(invoice.amount)} AED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-300 pt-6 mt-12">
                  <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">أضيف بواسطة:</p>
                      <p>{invoice.created_by_name || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">تاريخ الإصدار:</p>
                      <p>{formatDate(invoice.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-xs text-gray-500">
                    <p>شكراً لتعاملكم معنا</p>
                    <p>Thank you for your business</p>
                  </div>
                </div>
              </div>
            </CustomModalBody>

            <CustomModalFooter>
              <Button
                variant="outline"
                onClick={onClose}
              >
                إغلاق
              </Button>
              <Button
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                طباعة
              </Button>
            </CustomModalFooter>
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            لم يتم العثور على بيانات الفاتورة
          </div>
        )}
      </CustomModal>
    </>
  );
}
