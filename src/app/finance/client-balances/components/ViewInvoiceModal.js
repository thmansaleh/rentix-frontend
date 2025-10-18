'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getClientInvoiceById } from '@/app/services/api/clientInvoices';
import { getPaymentsByInvoiceId } from '@/app/services/api/clientPayments';
import { toast } from 'react-toastify';

const ViewInvoiceModal = ({ isOpen, onClose, invoiceId }) => {
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchInvoiceDetails();
      fetchPaymentRecords();
    }
  }, [isOpen, invoiceId]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    try {
      const response = await getClientInvoiceById(invoiceId);
      if (response.success) {
        setInvoice(response.data);
      } else {
        toast.error('فشل في جلب بيانات الفاتورة');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('حدث خطأ أثناء جلب بيانات الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentRecords = async () => {
    setPaymentsLoading(true);
    try {
      const response = await getPaymentsByInvoiceId(invoiceId);
      if (response.success) {
        setPayments(response.data);
      } else {
        toast.error('فشل في جلب سجلات الدفع');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('حدث خطأ أثناء جلب سجلات الدفع');
    } finally {
      setPaymentsLoading(false);
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
    return new Date(dateString).toLocaleDateString('ar-AE');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ar-AE');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'مدفوعة', variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
      unpaid: { label: 'غير مدفوعة', variant: 'destructive', className: 'bg-red-500 hover:bg-red-600' },
      partial: { label: 'مدفوعة جزئياً', variant: 'secondary', className: 'bg-yellow-500 hover:bg-yellow-600' }
    };
    
    const config = statusConfig[status] || statusConfig.unpaid;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cash: 'نقداً',
      bank_transfer: 'تحويل بنكي',
      cheque: 'شيك',
      credit_card: 'بطاقة ائتمان'
    };
    return methods[method] || method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تفاصيل الفاتورة</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="mr-3">جاري التحميل...</span>
          </div>
        ) : invoice ? (
          <Tabs dir="rtl" defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">معلومات الفاتورة</TabsTrigger>
              <TabsTrigger value="payments">سجلات الدفع</TabsTrigger>
            </TabsList>

            {/* Invoice Info Tab */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">رقم الفاتورة:</span>
                      <p className="text-base mt-1">{invoice.invoice_number}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">التاريخ:</span>
                      <p className="text-base mt-1">{formatDate(invoice.date)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">الحالة:</span>
                      <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">تم الإنشاء بواسطة:</span>
                      <p className="text-base mt-1">{invoice.created_by_name || '-'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">تاريخ الإنشاء:</span>
                      <p className="text-base mt-1">{formatDateTime(invoice.created_at)}</p>
                    </div>
                    {invoice.invoice_for && (
                      <div className="md:col-span-2">
                        <span className="text-sm font-semibold text-gray-600">الفاتورة لـ:</span>
                        <p className="text-base mt-1">{invoice.invoice_for}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">اسم العميل:</span>
                      <p className="text-base mt-1">{invoice.client_name || '-'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">رقم الهاتف:</span>
                      <p className="text-base mt-1 font-mono">{invoice.client_phone || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(invoice.case_number || invoice.file_number) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات القضية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-semibold text-gray-600">رقم القضية:</span>
                        <p className="text-base mt-1">{invoice.case_number || '-'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-600">رقم الملف:</span>
                        <p className="text-base mt-1">{invoice.file_number || '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المبالغ المالية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">المبلغ الإجمالي:</span>
                      <p className="text-lg font-bold mt-1 text-blue-600">
                        {formatCurrency(invoice.total_amount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">المبلغ المدفوع:</span>
                      <p className="text-lg font-bold mt-1 text-green-600">
                        {formatCurrency(invoice.paid_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600">المبلغ المتبقي:</span>
                      <p className="text-lg font-bold mt-1 text-red-600">
                        {formatCurrency((invoice.total_amount || 0) - (invoice.paid_amount || 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {invoice.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">الوصف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base whitespace-pre-wrap">{invoice.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>سجلات الدفع</CardTitle>
                    <div className="text-sm text-gray-500">
                      إجمالي: {payments.length} دفعة
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {paymentsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <span className="mr-3">جاري تحميل السجلات...</span>
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-gray-500">لا توجد دفعات مسجلة لهذه الفاتورة</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>المبلغ</TableHead>
                            <TableHead>طريقة الدفع</TableHead>
                            <TableHead>تم بواسطة</TableHead>
                            <TableHead>الملاحظات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {formatDate(payment.payment_date)}
                              </TableCell>
                              <TableCell className="font-semibold text-green-600">
                                {formatCurrency(payment.amount)}
                              </TableCell>
                              <TableCell>
                                {getPaymentMethodLabel(payment.payment_method)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {payment.employee_name || '-'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {payment.notes || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">لم يتم العثور على الفاتورة</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceModal;
