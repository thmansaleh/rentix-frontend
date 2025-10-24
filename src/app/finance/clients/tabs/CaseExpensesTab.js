"use client";

import { useState } from "react";
import useSWR from "swr";
import { getWalletsByClientId } from "@/app/services/api/wallets";
import { getExpensesByWalletId } from "@/app/services/api/walletExpenses";
import { AddWalletExpenseModal } from "@/app/finance/wallets/info/AddWalletExpenseModal";
import { EditWalletExpenseModal } from "@/app/finance/wallets/info/EditWalletExpenseModal";
import { DeleteWalletExpenseModal } from "@/app/finance/wallets/info/DeleteWalletExpenseModal";
import { ViewWalletExpenseModal } from "@/app/finance/wallets/info/ViewWalletExpenseModal";
import { printExpenseVoucher } from "@/app/finance/wallets/PrintExpenseVoucher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Scale, Edit, Trash2, Eye, Printer, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function CaseExpensesTab({ client, isOpen }) {
  const { language } = useLanguage();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [isViewExpenseOpen, setIsViewExpenseOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch wallet info only when this tab is active
  const { data: walletData, error: walletError, isLoading: isLoadingWallet } = useSWR(
    isOpen && client ? `/wallets/client/${client.id}` : null,
    () => getWalletsByClientId(client.id),
    {
      revalidateOnFocus: false,
      onError: (err) => {
        if (err.response?.status === 404) {
          return null;
        }
      }
    }
  );

  // API returns { success: true, data: [wallet] }, get the first wallet from the array
  const walletInfo = walletData?.data?.[0] || null;

  // Fetch expenses for this wallet and filter by case type
  const { data, error, isLoading, mutate } = useSWR(
    isOpen && walletInfo?.id ? `/wallet-expenses/wallet/${walletInfo.id}` : null,
    () => walletInfo?.id ? getExpensesByWalletId(walletInfo.id) : null,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Filter only case-related expenses (expenses with case_id)
  const caseExpenses = data?.data?.filter(expense => expense.case_id !== null && expense.case_id !== undefined) || [];

  const handleAddExpense = () => {
    setIsAddExpenseOpen(true);
  };

  const handleCloseAddExpense = () => {
    setIsAddExpenseOpen(false);
  };

  const handleExpenseSuccess = () => {
    mutate();
    setIsAddExpenseOpen(false);
  };

  const handleEditClick = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setIsEditExpenseOpen(true);
  };

  const handleCloseEditExpense = () => {
    setIsEditExpenseOpen(false);
    setSelectedExpenseId(null);
  };

  const handleEditSuccess = () => {
    mutate();
    setIsEditExpenseOpen(false);
    setSelectedExpenseId(null);
  };

  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteExpenseOpen(true);
  };

  const handleCloseDeleteExpense = () => {
    setIsDeleteExpenseOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteSuccess = () => {
    mutate();
    setIsDeleteExpenseOpen(false);
    setSelectedExpense(null);
  };

  const handleViewClick = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setIsViewExpenseOpen(true);
  };

  const handleCloseViewExpense = () => {
    setIsViewExpenseOpen(false);
    setSelectedExpenseId(null);
  };

  const handlePrintExpenseVoucher = (expense) => {
    printExpenseVoucher(expense, walletInfo);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        label: language === 'ar' ? "قيد الانتظار" : "Pending", 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: Clock 
      },
      verified: { 
        label: language === 'ar' ? "تم التحقق" : "Verified", 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle 
      },
      rejected: { 
        label: language === 'ar' ? "مرفوض" : "Rejected", 
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: XCircle 
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const totalCaseExpenses = caseExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  if (isLoadingWallet) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {language === 'ar' ? 'جاري تحميل بيانات المحفظة...' : 'Loading wallet data...'}
        </span>
      </div>
    );
  }

  if (!walletInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {language === 'ar' ? 'لم يتم إنشاء محفظة لهذا الموكل بعد' : 'No wallet created for this client yet'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'إجمالي مصروفات القضايا' : 'Total Case Expenses'}
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(totalCaseExpenses, walletInfo?.currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'عدد المصروفات' : 'Number of Expenses'}
                </span>
              </div>
              <p className="text-2xl font-bold">{caseExpenses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense Button */}
        <div className="flex justify-end">
          <Button onClick={handleAddExpense} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إضافة مصروف قضية' : 'Add Case Expense'}
          </Button>
        </div>

        {/* Expenses Table */}
        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <p>{language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}</p>
            </div>
          ) : caseExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {language === 'ar' ? 'لا توجد مصروفات قضايا' : 'No case expenses found'}
              </p>
              <p className="text-sm">
                {language === 'ar' ? 'أضف أول مصروف للبدء' : 'Add your first expense to get started'}
              </p>
              <Button onClick={handleAddExpense} className="mt-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'ar' ? 'إضافة مصروف' : 'Add Expense'}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ar' ? 'الرقم' : 'ID'}</TableHead>
                  <TableHead>{language === 'ar' ? 'رقم القضية' : 'Case Number'}</TableHead>
                  <TableHead>{language === 'ar' ? 'رقم الملف' : 'File Number'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الوصف' : 'Description'}</TableHead>
                  <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                  <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">#{expense.id}</TableCell>
                    <TableCell>{expense.case_number || "-"}</TableCell>
                    <TableCell>{expense.file_number || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description || "-"}</TableCell>
                    <TableCell className="font-mono font-semibold text-red-600">
                      {formatAmount(expense.amount, walletInfo?.currency)}
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(expense.expense_date)}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewClick(expense.id)}
                          title={language === 'ar' ? 'عرض' : 'View'}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintExpenseVoucher(expense)}
                          title={language === 'ar' ? 'طباعة' : 'Print'}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(expense.id)}
                          title={language === 'ar' ? 'تعديل' : 'Edit'}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(expense)}
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {caseExpenses.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            {language === 'ar' 
              ? `عرض ${caseExpenses.length} مصروف`
              : `Showing ${caseExpenses.length} expense(s)`}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <AddWalletExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={handleCloseAddExpense}
        onSuccess={handleExpenseSuccess}
        walletId={walletInfo?.id}
        clientId={client?.id}
        walletInfo={walletInfo}
      />

      {/* Edit Expense Modal */}
      <EditWalletExpenseModal
        isOpen={isEditExpenseOpen}
        onClose={handleCloseEditExpense}
        onSuccess={handleEditSuccess}
        expenseId={selectedExpenseId}
        clientId={client?.id}
        walletInfo={walletInfo}
      />

      {/* Delete Expense Modal */}
      <DeleteWalletExpenseModal
        isOpen={isDeleteExpenseOpen}
        onClose={handleCloseDeleteExpense}
        onSuccess={handleDeleteSuccess}
        expense={selectedExpense}
      />

      {/* View Expense Modal */}
      <ViewWalletExpenseModal
        isOpen={isViewExpenseOpen}
        onClose={handleCloseViewExpense}
        expenseId={selectedExpenseId}
      />
    </>
  );
}
