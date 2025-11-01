'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Download, Eye, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllEmployeeCashTransactions, deleteEmployeeCashTransaction, deleteEmployeeCashTransactionAttachment } from '@/app/services/api/employeeCashTransactions';
import TransactionModal from './TransactionModal';
import ViewTransactionModal from './ViewTransactionModal';
import PrintTransactionModal from './PrintTransactionModal';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsPagination, setTransactionsPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewTransactionId, setViewTransactionId] = useState(null);
  const [printTransactionId, setPrintTransactionId] = useState(null);
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

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployeeCashTransactions({
        page: currentPage,
        limit: itemsPerPage,
        search: searchDebounce,
        type: 'credit'
      });
      if (response.success) {
        setTransactions(response.data);
        setTransactionsPagination(response.pagination || {});
      } else {
        toast.error('حدث خطأ في تحميل عهد الموظفين');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('حدث خطأ في تحميل عهد الموظفين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchDebounce]);

  const handleAdd = () => {
    setSelectedTransaction(null);
    setShowModal(true);
  };

  const handleView = (transactionId) => {
    setViewTransactionId(transactionId);
    setShowViewModal(true);
  };

  const handlePrint = (transactionId) => {
    setPrintTransactionId(transactionId);
    setShowPrintModal(true);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteAttachment = async (transactionId, attachmentId) => {
    try {
      const response = await deleteEmployeeCashTransactionAttachment(transactionId, attachmentId);
      
      if (response.success) {
        // Refresh the transaction list
        await fetchTransactions();
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Failed to delete attachment'));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteEmployeeCashTransaction(transactionId);
      
      if (response.success) {
        toast.success('تم حذف العهدة بنجاح');
        fetchTransactions();
      } else {
        toast.error('حدث خطأ في حذف العهدة');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('حدث خطأ في حذف العهدة');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = transactions.map((transaction, index) => ({
        '#': index + 1,
        'اسم الموظف': transaction.employee_name || '-',
        'رقم الهاتف': transaction.employee_phone || '-',
        'المبلغ': transaction.amount,
        'الوصف': transaction.description || '-',
        'أضيف بواسطة': transaction.created_by_name || '-',
        'تاريخ الإضافة': formatDate(transaction.created_at)
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 5 },   // #
        { wch: 20 },  // اسم الموظف
        { wch: 15 },  // رقم الهاتف
        { wch: 12 },  // المبلغ
        { wch: 30 },  // الوصف
        { wch: 20 },  // أضيف بواسطة
        { wch: 15 }   // تاريخ الإضافة
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'عهد الموظفين');

      // Generate filename with current date
      const filename = `عهد_الموظفين_${new Date().toLocaleDateString('ar-AE').replace(/\//g, '-')}.xlsx`;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ar-AE');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>قائمة عهد الموظفين</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportToExcel}
                variant="outline"
                className="flex items-center gap-2"
                disabled={transactions.length === 0}
              >
                <Download className="h-4 w-4" />
                تصدير Excel
              </Button>
              <Button 
                onClick={handleAdd}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة عهدة جديدة
              </Button>
            </div>
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
              <span className="mr-3">جاري تحميل العهد...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد عهد مضافة'}
              </p>
              {!searchQuery && (
                <Button onClick={handleAdd}>
                  إضافة عهدة جديدة
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
                        <span className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description || '-'}
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
                            onClick={() => handleView(transaction.id)}
                            className="hover:bg-green-50"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint(transaction.id)}
                            className="hover:bg-purple-50"
                            title="طباعة السند"
                          >
                            <Printer className="h-4 w-4 text-purple-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
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
                                  هل أنت متأكد من حذف هذه العهدة؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(transaction.id)}
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
              {transactionsPagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, transactionsPagination.total)} من أصل {transactionsPagination.total}
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

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTransaction(null);
        }}
        onSuccess={fetchTransactions}
        transactionId={selectedTransaction?.id}
        transactionData={selectedTransaction}
      />

      {/* View Transaction Modal */}
      <ViewTransactionModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewTransactionId(null);
        }}
        transactionId={viewTransactionId}
        onDeleteAttachment={handleDeleteAttachment}
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

export default TransactionsTab;
