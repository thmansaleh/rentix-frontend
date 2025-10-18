'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';

export default function PaymentsTab({
  payments,
  paymentsLoading,
  deleteLoading,
  handleEditPayment,
  handleDeletePayment
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>قائمة المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="mr-3">جاري تحميل المدفوعات...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500">لا توجد مدفوعات مضافة</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>اسم العميل</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>تاريخ الدفع</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>تم الإضافة بواسطة</TableHead>
                  <TableHead>تاريخ الإضافة</TableHead>
                  <TableHead>ملاحظة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.invoice_number}
                    </TableCell>
                    <TableCell>{payment.client_name}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(payment.payment_date)}
                    </TableCell>
                    <TableCell>
                      {payment.payment_method === 'cash' && 'نقداً'}
                      {payment.payment_method === 'bank_transfer' && 'تحويل بنكي'}
                      {payment.payment_method === 'check' && 'شيك'}
                      {payment.payment_method === 'credit_card' && 'بطاقة ائتمان'}
                      {payment.payment_method === 'other' && 'أخرى'}
                    </TableCell>
                    <TableCell>
                      {payment.created_by_name || '-'}
                    </TableCell>
                    <TableCell>
                      {formatDate(payment.created_at)}
                    </TableCell>
                    <TableCell>
                      {payment.note || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPayment(payment.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deleteLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف الدفعة بمبلغ {formatCurrency(payment.amount)}؟
                                سيتم تحديث حالة الفاتورة تلقائياً.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePayment(payment.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
