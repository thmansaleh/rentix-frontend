'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getInvoicesByClientId } from '@/app/services/api/clientInvoices';
import { getPaymentsByInvoiceId } from '@/app/services/api/clientPayments';
import { toast } from 'react-toastify';

const ClientFinancialModal = ({ isOpen, onClose, clientId, clientName }) => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && clientId) {
      fetchInvoices();
    }
  }, [isOpen, clientId]);

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const response = await getInvoicesByClientId(clientId);
      if (response.success) {
        const invoicesData = response.data || [];
        setInvoices(invoicesData);
        // After getting invoices, fetch payments for those invoices
        if (invoicesData.length > 0) {
          fetchPaymentsForInvoices(invoicesData);
        } else {
          setPayments([]);
          setPaymentsLoading(false);
        }
      } else {
        toast.error('فشل في جلب الفواتير');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('حدث خطأ أثناء جلب الفواتير');
    } finally {
      setInvoicesLoading(false);
    }
  };

  const fetchPaymentsForInvoices = async (invoicesData) => {
    setPaymentsLoading(true);
    try {
      // Fetch payments for each invoice
      const paymentPromises = invoicesData.map(invoice => 
        getPaymentsByInvoiceId(invoice.id)
      );
      
      const paymentResponses = await Promise.all(paymentPromises);
      
      // Combine all payments and add invoice number
      const allPayments = [];
      paymentResponses.forEach((response, index) => {
        if (response.success && response.data) {
          const paymentsWithInvoiceNumber = response.data.map(payment => ({
            ...payment,
            invoice_number: invoicesData[index].invoice_number
          }));
          allPayments.push(...paymentsWithInvoiceNumber);
        }
      });
      
      // Sort by payment date (most recent first)
      allPayments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
      
      setPayments(allPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('حدث خطأ أثناء جلب الدفعات');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-AE');
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

  // Calculate totals
  const totalInvoicesAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
  const totalPaidAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.paid_amount) || 0), 0);
  const totalRemainingAmount = totalInvoicesAmount - totalPaidAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            السجل المالي - {clientName}
          </DialogTitle>
        </DialogHeader>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">إجمالي الفواتير</div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalInvoicesAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">المبلغ المدفوع</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaidAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">المبلغ المتبقي</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalRemainingAmount)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs dir="rtl" defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invoices">
              الفواتير ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              الدفعات ({payments.length})
            </TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>فواتير العميل</CardTitle>
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="mr-3">جاري التحميل...</span>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">لا توجد فواتير لهذا العميل</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم الفاتورة</TableHead>
                          <TableHead>التاريخ</TableHead>
                          <TableHead>الفاتورة لـ</TableHead>
                          <TableHead>المبلغ الإجمالي</TableHead>
                          <TableHead>المبلغ المدفوع</TableHead>
                          <TableHead>المبلغ المتبقي</TableHead>
                          <TableHead>الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell>
                              {formatDate(invoice.date)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {invoice.invoice_for || '-'}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(invoice.total_amount)}
                            </TableCell>
                            <TableCell className="text-green-600 font-semibold">
                              {formatCurrency(invoice.paid_amount || 0)}
                            </TableCell>
                            <TableCell className="text-red-600 font-semibold">
                              {formatCurrency((invoice.total_amount || 0) - (invoice.paid_amount || 0))}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(invoice.status)}
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

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>دفعات العميل</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="mr-3">جاري التحميل...</span>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500">لا توجد دفعات لهذا العميل</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم الفاتورة</TableHead>
                          <TableHead>تاريخ الدفع</TableHead>
                          <TableHead>المبلغ</TableHead>
                          <TableHead>طريقة الدفع</TableHead>
                          <TableHead>تم بواسطة</TableHead>
                          <TableHead>الملاحظات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.invoice_number || '-'}
                            </TableCell>
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
      </DialogContent>
    </Dialog>
  );
};

export default ClientFinancialModal;
