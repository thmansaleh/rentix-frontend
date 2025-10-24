"use client";

import { useState } from "react";
import useSWR from "swr";
import { getExpensesByWalletId } from "@/app/services/api/walletExpenses";
import { AddWalletExpenseModal } from "@/app/finance/wallets/info/AddWalletExpenseModal";
import { EditWalletExpenseModal } from "@/app/finance/wallets/info/EditWalletExpenseModal";
import { DeleteWalletExpenseModal } from "@/app/finance/wallets/info/DeleteWalletExpenseModal";
import { ViewWalletExpenseModal } from "@/app/finance/wallets/info/ViewWalletExpenseModal";
import { printExpenseVoucher } from "@/app/finance/wallets/PrintExpenseVoucher";
import ExportButtons from "@/components/ui/export-buttons";
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
import { Loader2, Plus, FileText, ArrowUpFromLine, Edit, Trash2, Eye, Printer, CheckCircle, XCircle, Clock } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function WalletExpensesTab({ walletId, clientId, walletInfo }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [isViewExpenseOpen, setIsViewExpenseOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch expenses for this wallet
  const { data, error, isLoading, mutate } = useSWR(
    walletId ? `/wallet-expenses/wallet/${walletId}` : null,
    () => getExpensesByWalletId(walletId),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const handleAddExpense = () => {
    setIsAddExpenseOpen(true);
  };

  const handleCloseAddExpense = () => {
    setIsAddExpenseOpen(false);
  };

  const handleExpenseSuccess = () => {
    mutate(); // Refresh the expenses list
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
    mutate(); // Refresh the expenses list
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
    mutate(); // Refresh the expenses list
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
    return new Date(dateString).toLocaleDateString("ar-AE", {
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
      pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      verified: { label: "تم التحقق", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      rejected: { label: "مرفوض", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
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

  const totalExpenses = data?.data?.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) || 0;

  // Column configuration for export
  const expenseColumnConfig = {
    invoice_number: {
      en: 'Invoice Number',
      ar: 'رقم الفاتورة',
      dataKey: 'invoice_number'
    },
    invoice_date: {
      en: 'Invoice Date',
      ar: 'تاريخ الفاتورة',
      dataKey: 'invoice_date',
      type: 'date'
    },
    file_number: {
      en: 'File Number',
      ar: 'رقم الملف',
      dataKey: 'file_number'
    },
    amount: {
      en: 'Amount',
      ar: 'المبلغ',
      dataKey: 'amount',
      formatter: (value) => formatAmount(value, walletInfo?.currency)
    },
    status: {
      en: 'Status',
      ar: 'الحالة',
      dataKey: 'status',
      type: 'status',
      statusMap: {
        pending: { en: 'Pending', ar: 'قيد الانتظار' },
        verified: { en: 'Verified', ar: 'تم التحقق' },
        rejected: { en: 'Rejected', ar: 'مرفوض' }
      }
    },
    employee_name: {
      en: 'Related Employee',
      ar: 'الموظف المرتبط',
      dataKey: 'employee_name'
    },
    created_by_name: {
      en: 'Created By',
      ar: 'أنشئ بواسطة',
      dataKey: 'created_by_name'
    },
    created_at: {
      en: 'Created At',
      ar: 'تاريخ الإنشاء',
      dataKey: 'created_at',
      type: 'date'
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ArrowUpFromLine className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">إجمالي المصروفات</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(totalExpenses, walletInfo?.currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">عدد المصروفات</span>
              </div>
              <p className="text-2xl font-bold">{data?.data?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Export and Add Expense Buttons */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <ExportButtons
            data={data?.data || []}
            columnConfig={expenseColumnConfig}
            language={language}
            exportName="wallet_expenses"
            sheetName={language === 'ar' ? 'المصروفات' : 'Expenses'}
          />
          <Button onClick={handleAddExpense} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة مصروف
          </Button>
        </div>

        {/* Expenses Table */}
        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">جاري تحميل المصروفات...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <p>خطأ في تحميل المصروفات</p>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">لا توجد مصروفات</p>
              <p className="text-sm">قم بإضافة أول مصروف للمحفظة</p>
              <Button onClick={handleAddExpense} className="mt-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                إضافة مصروف
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>رقم المصروف</TableHead> */}
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>تاريخ الفاتورة</TableHead>
                  <TableHead>رقم الملف</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الموظف المرتبط</TableHead>
                  <TableHead>أنشئ بواسطة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((expense) => (
                  <TableRow key={expense.id}>
                    {/* <TableCell className="font-medium">#{expense.id}</TableCell> */}
                    <TableCell className="font-medium">
                      {expense.invoice_number || "-"}
                    </TableCell>
                    <TableCell>
                      {formatDate(expense.invoice_date)}
                    </TableCell>
                    <TableCell>
                      {expense.file_number || "-"}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-red-600">
                      {formatAmount(expense.amount, walletInfo?.currency)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(expense.status)}
                    </TableCell>
                    <TableCell>{expense.employee_name || "-"}</TableCell>
                    <TableCell>{expense.created_by_name || "-"}</TableCell>
                    <TableCell className="text-xs">
                      {formatDate(expense.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrintExpenseVoucher(expense)}
                          title="طباعة سند صرف"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewClick(expense.id)}
                          title="عرض التفاصيل"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(expense.id)}
                          title="تعديل"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(expense)}
                          title="حذف"
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

        {/* Results info */}
        {data?.data && data.data.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            عرض {data.data.length} مصروف
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <AddWalletExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={handleCloseAddExpense}
        onSuccess={handleExpenseSuccess}
        walletId={walletId}
        clientId={clientId}
        walletInfo={walletInfo}
      />

      {/* Edit Expense Modal */}
      <EditWalletExpenseModal
        isOpen={isEditExpenseOpen}
        onClose={handleCloseEditExpense}
        onSuccess={handleEditSuccess}
        expenseId={selectedExpenseId}
        clientId={clientId}
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
