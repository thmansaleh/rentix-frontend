'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Eye, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllEmployeeExpenses, deleteEmployeeExpense } from '@/app/services/api/employeeExpenses';
import ExpenseModal from './ExpenseModal';
import { toast } from 'react-toastify';

const ExpensesTab = () => {
  const [expenses, setExpenses] = useState([]);
  const [expensesPagination, setExpensesPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
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

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployeeExpenses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchDebounce
      });
      if (response.success) {
        setExpenses(response.data);
        setExpensesPagination(response.pagination || {});
      } else {
        toast.error('حدث خطأ في تحميل مصروفات الموظفين');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('حدث خطأ في تحميل مصروفات الموظفين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, searchDebounce]);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteEmployeeExpense(expenseId);
      
      if (response.success) {
        toast.success('تم حذف المصروف بنجاح');
        fetchExpenses();
      } else {
        toast.error('حدث خطأ في حذف المصروف');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('حدث خطأ في حذف المصروف');
    } finally {
      setDeleteLoading(false);
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
            <CardTitle>قائمة مصروفات الموظفين</CardTitle>
            <Button 
              onClick={handleAddExpense}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة مصروف جديد
            </Button>
          </div>
          {/* Search Filter */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="بحث بالاسم، الهاتف، المبلغ، أو الوصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="mr-3">جاري تحميل المصروفات...</span>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مصروفات مضافة'}
              </p>
              {!searchQuery && (
                <Button onClick={handleAddExpense}>
                  إضافة مصروف جديد
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
                      <TableHead>اسم الموظف</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>الرصيد الحالي</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>أضيف بواسطة</TableHead>
                      <TableHead>تاريخ الإضافة</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
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
                      <TableCell className="max-w-xs truncate">
                        {expense.description || '-'}
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
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? 'جاري الحذف...' : 'حذف'}
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
                    عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, expensesPagination.total)} من أصل {expensesPagination.total}
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
        onSuccess={fetchExpenses}
        expenseId={selectedExpense?.id}
        expenseData={selectedExpense}
      />
    </>
  );
};

export default ExpensesTab;
