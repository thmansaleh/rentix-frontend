'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Eye, Edit, FileText, Printer } from 'lucide-react';
import { getAllEmployeeCashTransactions } from '@/app/services/api/employeeCashTransactions';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import ViewTransactionModal from './ViewTransactionModal';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import TransactionModal from './TransactionModal';
import ExpenseModal from './ExpenseModal';
import EmployeeStatementModal from './EmployeeStatementModal';
import PrintTransactionModal from './PrintTransactionModal';
import { useLanguage } from '@/contexts/LanguageContext';

const AllTransactionsTab = () => {
  const t = useTranslations('employeeFinance.allTransactions');
  const { isRTL } = useLanguage();
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showExpenseDetailsModal, setShowExpenseDetailsModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [statementEmployee, setStatementEmployee] = useState(null);
  const [printTransactionId, setPrintTransactionId] = useState(null);
  
  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // SWR key and fetcher with best practices
  const swrKey = useMemo(() => 
    searchDebounce || currentPage !== 1 
      ? `/api/employee-cash-transactions-all?page=${currentPage}&limit=${itemsPerPage}&search=${searchDebounce}`
      : `/api/employee-cash-transactions-all?page=${currentPage}&limit=${itemsPerPage}`,
    [currentPage, itemsPerPage, searchDebounce]
  );

  const fetcher = async (url) => {
    const response = await getAllEmployeeCashTransactions({
      page: currentPage,
      limit: itemsPerPage,
      search: searchDebounce
    });
    
    if (!response.success) {
      throw new Error('حدث خطأ في تحميل المعاملات');
    }
    
    return {
      data: response.data,
      pagination: response.pagination || {}
    };
  };

  // Use SWR with best practices
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      onError: (err) => {
        toast.error(err.message || 'حدث خطأ في تحميل المعاملات');
      }
    }
  );

  const transactions = data?.data || [];
  const transactionsPagination = data?.pagination || {};

  const handleViewTransaction = (transaction) => {
    if (transaction.type === 'credit') {
      setSelectedTransactionId(transaction.id);
      setShowViewModal(true);
    } else {
      setSelectedExpenseId(transaction.id);
      setShowExpenseDetailsModal(true);
    }
  };

  const handleEditTransaction = (transaction) => {
    if (transaction.type === 'credit') {
      setSelectedTransaction(transaction);
      setShowEditTransactionModal(true);
    } else {
      setSelectedExpense(transaction);
      setShowEditExpenseModal(true);
    }
  };

  const handleStatement = (transaction) => {
    setStatementEmployee({
      id: transaction.employee_id,
      name: transaction.employee_name
    });
    setShowStatementModal(true);
  };

  const handlePrint = (transactionId) => {
    setPrintTransactionId(transactionId);
    setShowPrintModal(true);
  };

  const handleSuccess = () => {
    // Revalidate data after successful add/edit
    mutate();
  };

  const handleExportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = transactions.map((transaction, index) => ({
        '#': index + 1,
        'اسم الموظف': transaction.employee_name || '-',
        'رقم الهاتف': transaction.employee_phone || '-',
        'الرصيد الحالي': transaction.employee_balance || 0,
        'نوع المعاملة': getTransactionTypeLabel(transaction.type),
        'المبلغ': transaction.amount,
        'الوصف': transaction.description || '-',
        'أضيف بواسطة': transaction.created_by_name || '-',
        'تاريخ الإضافة': formatDateTime(transaction.created_at)
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 5 },   // #
        { wch: 20 },  // اسم الموظف
        { wch: 15 },  // رقم الهاتف
        { wch: 15 },  // الرصيد الحالي
        { wch: 12 },  // نوع المعاملة
        { wch: 12 },  // المبلغ
        { wch: 30 },  // الوصف
        { wch: 20 },  // أضيف بواسطة
        { wch: 15 }   // تاريخ الإضافة
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'جميع المعاملات');

      // Generate filename with current date
      const filename = `جميع_المعاملات_${new Date().toLocaleDateString('ar-AE').replace(/\//g, '-')}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
      
      toast.success('تم تصدير البيانات بنجاح');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('حدث خطأ في تصدير البيانات');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ar-AE');
  };

  const getTransactionTypeLabel = (type) => {
    return type === 'credit' ? t('credit') : t('debit');
  };

  const getTransactionTypeColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>{t('title')}</CardTitle>
          <Button 
            onClick={handleExportToExcel}
            variant="outline"
            className="flex items-center gap-2"
            disabled={transactions.length === 0}
          >
            <Download className="h-4 w-4" />
            تصدير Excel
          </Button>
        </div>
        {/* Search Filter */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="mr-3">{t('loading')}</span>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-red-500 mb-4">حدث خطأ في تحميل البيانات</p>
            <Button onClick={() => mutate()}>إعادة المحاولة</Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500 mb-4">
              {searchQuery ? t('noResults') : t('noData')}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">#</TableHead>
                    <TableHead>{t('employeeName')}</TableHead>
                    <TableHead>{t('phoneNumber')}</TableHead>
                    <TableHead>{t('currentBalance')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('addedBy')}</TableHead>
                    <TableHead>{t('addedAt')}</TableHead>
                    <TableHead className="text-center">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-center font-medium">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.employee_name || '-'}
                      </TableCell>
                      <TableCell className="font-mono">
                        {transaction.employee_phone || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          transaction.employee_balance > 0 
                            ? 'text-green-600' 
                            : transaction.employee_balance < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {formatCurrency(transaction.employee_balance || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                          {getTransactionTypeLabel(transaction.type)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+ ' : '- '}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status === 'approved' ? t('approved') : transaction.status === 'rejected' ? t('rejected') : t('pending')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {transaction.created_by_name || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDateTime(transaction.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatement(transaction)}
                            className="hover:bg-indigo-50"
                            title="كشف حساب الموظف"
                          >
                            <FileText className="h-4 w-4 text-indigo-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction)}
                            className="hover:bg-green-50"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          {transaction.type === 'credit' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrint(transaction.id)}
                              className="hover:bg-purple-50"
                              title="طباعة"
                            >
                              <Printer className="h-4 w-4 text-purple-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTransaction(transaction)}
                            className="hover:bg-blue-50"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {transactionsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  {t('showing')} {((currentPage - 1) * itemsPerPage) + 1} {t('to')} {Math.min(currentPage * itemsPerPage, transactionsPagination.total)} {t('of')} {transactionsPagination.total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(transactionsPagination.totalPages, 10) }, (_, i) => {
                      // Show first 5 and last 5 pages if more than 10 pages
                      if (transactionsPagination.totalPages <= 10) {
                        return i + 1;
                      } else if (currentPage <= 5) {
                        return i + 1;
                      } else if (currentPage >= transactionsPagination.totalPages - 4) {
                        return transactionsPagination.totalPages - 9 + i;
                      } else {
                        return currentPage - 4 + i;
                      }
                    }).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[2rem]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, transactionsPagination.totalPages))}
                    disabled={currentPage === transactionsPagination.totalPages}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>

      {/* View Transaction Modal (for credit transactions) */}
      <ViewTransactionModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTransactionId(null);
          // Refresh data after modal closes
          mutate();
        }}
        transactionId={selectedTransactionId}
      />

      {/* Expense Details Modal (for debit/expense transactions) */}
      <ExpenseDetailsModal
        isOpen={showExpenseDetailsModal}
        onClose={() => {
          setShowExpenseDetailsModal(false);
          setSelectedExpenseId(null);
        }}
        expenseId={selectedExpenseId}
      />

      {/* Edit Transaction Modal (for credit transactions) */}
      <TransactionModal
        isOpen={showEditTransactionModal}
        onClose={() => {
          setShowEditTransactionModal(false);
          setSelectedTransaction(null);
        }}
        onSuccess={handleSuccess}
        transactionId={selectedTransaction?.id}
        transactionData={selectedTransaction}
      />

      {/* Edit Expense Modal (for debit/expense transactions) */}
      <ExpenseModal
        isOpen={showEditExpenseModal}
        onClose={() => {
          setShowEditExpenseModal(false);
          setSelectedExpense(null);
        }}
        onSuccess={handleSuccess}
        expenseId={selectedExpense?.id}
        expenseData={selectedExpense}
      />

      {/* Employee Statement Modal */}
      <EmployeeStatementModal
        isOpen={showStatementModal}
        onClose={() => {
          setShowStatementModal(false);
          setStatementEmployee(null);
        }}
        employeeId={statementEmployee?.id}
        employeeName={statementEmployee?.name}
        onViewTransaction={(transactionId) => {
          setSelectedTransactionId(transactionId);
          setShowViewModal(true);
        }}
        onViewExpense={(expenseId) => {
          setSelectedExpenseId(expenseId);
          setShowExpenseDetailsModal(true);
        }}
        onEditTransaction={(transaction) => {
          setSelectedTransaction(transaction);
          setShowEditTransactionModal(true);
        }}
        onEditExpense={(expense) => {
          setSelectedExpense(expense);
          setShowEditExpenseModal(true);
        }}
        onPrintTransaction={(transaction) => {
          setPrintTransactionId(transaction.id);
          setShowPrintModal(true);
        }}
      />

      {/* Print Transaction Modal */}
      <PrintTransactionModal
        isOpen={showPrintModal}
        onClose={() => {
          setShowPrintModal(false);
          setPrintTransactionId(null);
        }}
        transactionId={printTransactionId}
      />
    </>
  );
};

export default AllTransactionsTab;
