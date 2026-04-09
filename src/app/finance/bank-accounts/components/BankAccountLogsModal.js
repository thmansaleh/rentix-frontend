'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Edit, Trash2, FileSpreadsheet, Search, Printer } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAccountTransactions } from '@/app/services/api/bankAccounts';
import { deletePayment } from '@/app/services/api/payments';
import { deleteExpense } from '@/app/services/api/expenses';
import ViewPaymentModal from '@/app/finance/payments/ViewPaymentModal';
import { printPaymentReceipt } from '@/app/finance/payments/printPaymentReceipt';
import DeletePaymentDialog from '@/app/finance/payments/DeletePaymentDialog';
import { ViewExpenseModal } from '@/app/finance/expenses/ViewExpenseModal';
import { EditExpenseModal } from '@/app/finance/expenses/EditExpenseModal';
import { DeleteExpenseModal } from '@/app/finance/expenses/DeleteExpenseModal';
import * as XLSX from 'xlsx';
import { useLanguage } from '@/contexts/LanguageContext';

function BankAccountLogsModal({ isOpen, onClose, accountId, accountName }) {
  const t = useTranslations('BankAccountLogs');
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Payment modals
  const [showViewPayment, setShowViewPayment] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [showDeletePayment, setShowDeletePayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Expense modals
  const [showViewExpense, setShowViewExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [showDeleteExpense, setShowDeleteExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  const getCurrentMonthDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };
  
  const defaultDates = getCurrentMonthDates();
  const [dateRange, setDateRange] = useState({
    from: defaultDates.start,
    to: defaultDates.end
  });

  const fetchTransactions = async (fromDate = null, toDate = null) => {
    try {
      setLoading(true);
      const params = {};
      if (fromDate) params.startDate = fromDate;
      if (toDate) params.endDate = toDate;
      const response = await getAccountTransactions(accountId, params);
      if (response.success) {
        setTransactions(response.data);
      } else {
        toast.error(t('errorLoadingTransactions'));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(t('errorLoadingTransactions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accountId) {
      fetchTransactions(dateRange.from, dateRange.to);
    }
  }, [isOpen, accountId]);

  const handleDateFilter = () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error(language === 'ar' ? 'يرجى تحديد تاريخ البداية والنهاية' : 'Please select both start and end dates');
      return;
    }
    if (dateRange.from > dateRange.to) {
      toast.error(language === 'ar' ? 'تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية' : 'Start date cannot be after end date');
      return;
    }
    fetchTransactions(dateRange.from, dateRange.to);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: language === 'ar' ? 'نقداً' : 'Cash',
      card: language === 'ar' ? 'بطاقة' : 'Card',
      bank_transfer: language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer',
      credit_card: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card',
      cheque: language === 'ar' ? 'شيك' : 'Cheque',
    };
    return labels[method] || method || '-';
  };

  const handleExportToExcel = () => {
    if (transactions.length === 0) {
      toast.error(language === 'ar' ? 'لا توجد بيانات للتصدير' : 'No data to export');
      return;
    }

    const exportData = transactions.map(row => ({
      [language === 'ar' ? 'التاريخ' : 'Date']: formatDate(row.transaction_date),
      [language === 'ar' ? 'النوع' : 'Type']: row.transaction_type === 'payment' ? t('payment') : t('expense'),
      [language === 'ar' ? 'المبلغ' : 'Amount']: row.amount,
      [language === 'ar' ? 'طريقة الدفع' : 'Payment Method']: getPaymentMethodLabel(row.payment_method),
      [language === 'ar' ? 'الوصف' : 'Description']: row.description || '-',
      [language === 'ar' ? 'بواسطة' : 'Created By']: row.created_by_name || t('unknown'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Account Transactions');
    
    const maxWidth = exportData.reduce((w, r) => Math.max(w, (Object.values(r)[4] || '').length), 10);
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: Math.min(maxWidth, 50) },
      { wch: 20 },
    ];

    const fileName = `${accountName}_transactions_${dateRange.from}_to_${dateRange.to}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(language === 'ar' ? 'تم تصدير الملف بنجاح' : 'Excel file exported successfully');
  };

  const handleView = (row) => {
    if (row.transaction_type === 'payment') {
      setSelectedPayment(row);
      setShowViewPayment(true);
    } else {
      setSelectedExpense(row);
      setShowViewExpense(true);
    }
  };

  const handleEdit = (row) => {
    if (row.transaction_type === 'payment') {
      setSelectedPayment(row);
      setShowEditPayment(true);
    } else {
      setSelectedExpense(row);
      setShowEditExpense(true);
    }
  };

  const handleDelete = (row) => {
    if (row.transaction_type === 'payment') {
      setSelectedPayment(row);
      setShowDeletePayment(true);
    } else {
      setSelectedExpense(row);
      setShowDeleteExpense(true);
    }
  };

  const handleDeletePaymentConfirm = async () => {
    if (!selectedPayment) return;
    try {
      await deletePayment(selectedPayment.id);
      toast.success(language === 'ar' ? 'تم حذف الدفعة بنجاح' : 'Payment deleted successfully');
      setShowDeletePayment(false);
      setSelectedPayment(null);
      fetchTransactions(dateRange.from, dateRange.to);
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error(language === 'ar' ? 'حدث خطأ في حذف الدفعة' : 'Error deleting payment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[95vw] max-w-7xl max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {t('title')}: {accountName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="space-y-6">

          {/* Transactions Table */}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold">{t('transactions')}</h3>
                
                <Button
                  onClick={handleExportToExcel}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={transactions.length === 0}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  {language === 'ar' ? 'تصدير إلى Excel' : 'Export to Excel'}
                </Button>
              </div>
              
              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-2">
                  <Label htmlFor="date-from">{t('fromDate')}</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-to">{t('toDate')}</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
                </div>
                
                <Button
                  onClick={handleDateFilter}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {t('filter')}
                </Button>
              </div>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ms-3">{t('loadingTransactions')}</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  {t('noTransactionsFound')}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('date')}</TableHead>
                      <TableHead>{t('type')}</TableHead>
                      <TableHead>{t('amount')}</TableHead>
                      <TableHead>{t('paymentMethod')}</TableHead>
                      <TableHead>{t('description')}</TableHead>
                      <TableHead>{t('createdBy')}</TableHead>
                      <TableHead>{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((row, index) => (
                      <TableRow key={`${row.transaction_type}-${row.id}-${index}`}>
                        <TableCell>{formatDate(row.transaction_date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={row.transaction_type === 'payment' ? 'default' : 'destructive'}
                          >
                            {row.transaction_type === 'payment' ? t('payment') : t('expense')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(row.amount)}
                        </TableCell>
                        <TableCell>{getPaymentMethodLabel(row.payment_method)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{row.description || '-'}</TableCell>
                        <TableCell>{row.created_by_name || t('unknown')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(row)}
                              title={t('viewDetails')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(row)}
                              title={t('edit')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            {row.transaction_type === 'payment' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => printPaymentReceipt(row.id)}
                                title={language === 'ar' ? 'طباعة إيصال' : 'Print Receipt'}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(row)}
                              title={t('delete')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Payment Modals */}
        <ViewPaymentModal
          isOpen={showViewPayment}
          onClose={() => {
            setShowViewPayment(false);
            setSelectedPayment(null);
          }}
          paymentId={selectedPayment?.id}
        />

       

        <DeletePaymentDialog
          open={showDeletePayment}
          onOpenChange={(open) => {
            setShowDeletePayment(open);
            if (!open) setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onConfirm={handleDeletePaymentConfirm}
          language={language}
        />

        {/* Expense Modals */}
        <ViewExpenseModal
          isOpen={showViewExpense}
          onClose={() => {
            setShowViewExpense(false);
            setSelectedExpense(null);
          }}
          expenseId={selectedExpense?.id}
        />

        <EditExpenseModal
          isOpen={showEditExpense}
          onClose={() => {
            setShowEditExpense(false);
            setSelectedExpense(null);
          }}
          expenseId={selectedExpense?.id}
          onSuccess={() => {
            setShowEditExpense(false);
            setSelectedExpense(null);
            fetchTransactions(dateRange.from, dateRange.to);
          }}
        />

        <DeleteExpenseModal
          isOpen={showDeleteExpense}
          onClose={() => {
            setShowDeleteExpense(false);
            setSelectedExpense(null);
          }}
          expense={selectedExpense ? { expense_id: selectedExpense.id, amount: selectedExpense.amount, description: selectedExpense.description } : null}
          onSuccess={() => {
            setShowDeleteExpense(false);
            setSelectedExpense(null);
            fetchTransactions(dateRange.from, dateRange.to);
          }}
        />
      </div>
    </div>
  );
}

export default BankAccountLogsModal;
