'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Download, Eye, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllEmployeeExpenses, deleteEmployeeExpense } from '@/app/services/api/employeeExpenses';
import { useTranslations } from '@/hooks/useTranslations';
import ExpenseModal from './ExpenseModal';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const ExpensesTab = () => {
  const t = useTranslations('employeeFinance.expenses');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
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
      ? `/api/employee-expenses?page=${currentPage}&limit=${itemsPerPage}&search=${searchDebounce}`
      : `/api/employee-expenses?page=${currentPage}&limit=${itemsPerPage}`,
    [currentPage, itemsPerPage, searchDebounce]
  );

  const fetcher = async (url) => {
    const response = await getAllEmployeeExpenses({
      page: currentPage,
      limit: itemsPerPage,
      search: searchDebounce
    });
    
    if (!response.success) {
      throw new Error('حدث خطأ في تحميل مصروفات الموظفين');
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
        toast.error(err.message || 'حدث خطأ في تحميل مصروفات الموظفين');
      }
    }
  );

  const expenses = data?.data || [];
  const expensesPagination = data?.pagination || {};

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseModal(true);
  };

  const handleViewExpense = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setShowDetailsModal(true);
  };

  const handleSuccess = () => {
    // Revalidate data after successful add/edit
    mutate();
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteEmployeeExpense(expenseId);
      
      if (response.success) {
        toast.success(t('deleteSuccess'));
        // Revalidate data with SWR
        await mutate();
      } else {
        toast.error(t('deleteError'));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error(t('deleteError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = expenses.map((expense, index) => ({
        '#': index + 1,
        'اسم الموظف': expense.employee_name || '-',
        'رقم الهاتف': expense.employee_phone || '-',
        'الرصيد الحالي': expense.employee_balance || 0,
        'المبلغ': expense.amount,
        'الموكل': expense.client_name || '-',
        'الوصف': expense.description || '-',
        'أضيف بواسطة': expense.created_by_name || '-',
        'تاريخ الإضافة': formatDateTime(expense.created_at)
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 5 },   // #
        { wch: 20 },  // اسم الموظف
        { wch: 15 },  // رقم الهاتف
        { wch: 15 },  // الرصيد الحالي
        { wch: 12 },  // المبلغ
        { wch: 20 },  // العميل/الطرف
        { wch: 30 },  // الوصف
        { wch: 20 },  // أضيف بواسطة
        { wch: 15 }   // تاريخ الإضافة
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'مصروفات الموظفين');

      // Generate filename with current date
      const filename = `مصروفات_الموظفين_${new Date().toLocaleDateString('ar-AE').replace(/\//g, '-')}.xlsx`;

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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>{t('title')}</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportToExcel}
                variant="outline"
                className="flex items-center gap-2"
                disabled={expenses.length === 0}
              >
                <Download className="h-4 w-4" />
                تصدير Excel
              </Button>
              <Button 
                onClick={handleAddExpense}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('addNew')}
              </Button>
            </div>
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
          ) : expenses.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">
                {searchQuery ? t('noResults') : t('noData')}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddExpense}>
                  {t('addNew')}
                </Button>
              )}
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
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>الموكل</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('addedBy')}</TableHead>
                    <TableHead>{t('addedAt')}</TableHead>
                    <TableHead className="text-center">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {expenses.map((expense, index) => (
                    <TableRow key={expense.id}>
                      <TableCell className="text-center font-medium">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {expense.employee_name || '-'}
                      </TableCell>
                      <TableCell className="font-mono">
                        {expense.employee_phone || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          expense.employee_balance > 0 
                            ? 'text-green-600' 
                            : expense.employee_balance < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {formatCurrency(expense.employee_balance || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-semibold">
                          - {formatCurrency(expense.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {expense.client_name ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{expense.client_name}</span>
                            {expense.client_phone && (
                              <span className="text-xs text-gray-500">{expense.client_phone}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {expense.description || '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          expense.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : expense.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {expense.status === 'approved' ? t('approved') : expense.status === 'rejected' ? t('rejected') : t('pending')}
                        </span>
                      </TableCell>
                      <TableCell>
                        {expense.created_by_name || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDateTime(expense.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewExpense(expense.id)}
                            className="hover:bg-green-50"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                            className="hover:bg-blue-50"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('deleteConfirm')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('deleteMessage')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('cancel', { scope: 'employeeFinance.modal' })}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? t('deleting', { scope: 'common' }) : t('delete', { scope: 'common' })}
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
              </div>

              {/* Pagination */}
              {expensesPagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    {t('showing', { scope: 'employeeFinance.pagination' })} {((currentPage - 1) * itemsPerPage) + 1} {t('to', { scope: 'employeeFinance.pagination' })} {Math.min(currentPage * itemsPerPage, expensesPagination.total)} {t('of', { scope: 'employeeFinance.pagination' })} {expensesPagination.total}
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
                      {Array.from({ length: Math.min(expensesPagination.totalPages, 10) }, (_, i) => {
                        // Show first 5 and last 5 pages if more than 10 pages
                        if (expensesPagination.totalPages <= 10) {
                          return i + 1;
                        } else if (currentPage <= 5) {
                          return i + 1;
                        } else if (currentPage >= expensesPagination.totalPages - 4) {
                          return expensesPagination.totalPages - 9 + i;
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, expensesPagination.totalPages))}
                      disabled={currentPage === expensesPagination.totalPages}
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

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false);
          setSelectedExpense(null);
        }}
        onSuccess={handleSuccess}
        expenseId={selectedExpense?.id}
        expenseData={selectedExpense}
      />

      {/* Expense Details Modal */}
      <ExpenseDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedExpenseId(null);
        }}
        expenseId={selectedExpenseId}
      />
    </>
  );
};

export default ExpensesTab;
