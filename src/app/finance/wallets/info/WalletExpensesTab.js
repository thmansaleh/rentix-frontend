"use client";

import { useState } from "react";
import useSWR from "swr";
import { getEmployeeCashTransactionsByClientId } from "@/app/services/api/employeeCashTransactions";
import ClientCashTransactionModal from "@/app/finance/wallets/info/ClientCashTransactionModal";
import EditEmployeeCashTransactionModal from "@/app/finance/wallets/info/EditEmployeeCashTransactionModal";
import DeleteEmployeeCashTransactionModal from "@/app/finance/wallets/info/DeleteEmployeeCashTransactionModal";
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
import { Loader2, Plus, FileText, ArrowUpFromLine, CheckCircle, XCircle, Clock, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function WalletExpensesTab({ walletId, clientId, walletInfo }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [isDeleteTransactionOpen, setIsDeleteTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch employee cash transactions for this client (only approved expenses)
  const { data, error, isLoading, mutate } = useSWR(
    clientId ? `/employee-cash-transactions/client/${clientId}/approved` : null,
    () => getEmployeeCashTransactionsByClientId(clientId, { status: 'approved', type: 'debit' }),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const handleAddTransaction = () => {
    setIsAddTransactionOpen(true);
  };

  const handleCloseAddTransaction = () => {
    setIsAddTransactionOpen(false);
  };

  const handleTransactionSuccess = () => {
    mutate(); // Refresh the transactions list
    setIsAddTransactionOpen(false);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionOpen(true);
  };

  const handleCloseEditTransaction = () => {
    setIsEditTransactionOpen(false);
    setSelectedTransaction(null);
  };

  const handleEditSuccess = () => {
    mutate(); // Refresh the transactions list
    setIsEditTransactionOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteTransactionOpen(true);
  };

  const handleCloseDeleteTransaction = () => {
    setIsDeleteTransactionOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteSuccess = () => {
    mutate(); // Refresh the transactions list
    setIsDeleteTransactionOpen(false);
    setSelectedTransaction(null);
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
      approved: { label: "معتمد", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
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

  const getTypeBadge = (type) => {
    const typeConfig = {
      credit: { label: "إيداع", color: "bg-green-100 text-green-800 border-green-200" },
      debit: { label: "مصروف", color: "bg-red-100 text-red-800 border-red-200" },
    };
    
    const config = typeConfig[type] || typeConfig.debit;
    
    return (
      <Badge variant="outline" className={`${config.color} w-fit`}>
        {config.label}
      </Badge>
    );
  };

  // All transactions are filtered by API, but add extra frontend filter for approved debit transactions only
  const transactions = data?.data || [];
  const expenses = transactions.filter(transaction => 
    transaction.type === 'debit' && transaction.status === 'approved'
  );
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  // Column configuration for export
  const expenseColumnConfig = {
    employee_name: {
      en: 'Employee Name',
      ar: 'اسم الموظف',
      dataKey: 'employee_name'
    },
    amount: {
      en: 'Amount',
      ar: 'المبلغ',
      dataKey: 'amount',
      formatter: (value) => formatAmount(value, walletInfo?.currency)
    },
    type: {
      en: 'Type',
      ar: 'النوع',
      dataKey: 'type',
      type: 'status',
      statusMap: {
        credit: { en: 'Credit', ar: 'إيداع' },
        debit: { en: 'Debit', ar: 'مصروف' }
      }
    },
    status: {
      en: 'Status',
      ar: 'الحالة',
      dataKey: 'status',
      type: 'status',
      statusMap: {
        pending: { en: 'Pending', ar: 'قيد الانتظار' },
        approved: { en: 'Approved', ar: 'معتمد' },
        rejected: { en: 'Rejected', ar: 'مرفوض' }
      }
    },
    description: {
      en: 'Description',
      ar: 'الوصف',
      dataKey: 'description'
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
              <p className="text-2xl font-bold">{expenses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Export and Add Transaction Buttons */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <ExportButtons
            data={expenses || []}
            columnConfig={expenseColumnConfig}
            language={language}
            exportName="client_cash_transactions"
            sheetName={language === 'ar' ? 'المعاملات النقدية' : 'Cash Transactions'}
          />
          <Button onClick={handleAddTransaction} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            اضافة مصروف
          </Button>
        </div>

        {/* Cash Transactions Table */}
        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">جاري تحميل المعاملات...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <p>خطأ في تحميل المعاملات</p>
            </div>
          ) : !expenses || expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">لا توجد مصروفات معتمدة</p>
              <p className="text-sm">قم بإضافة أول مصروف للعميل</p>
              <Button onClick={handleAddTransaction} className="mt-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                اضافة مصروف
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم المعاملة</TableHead>
                  <TableHead>اسم الموظف</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>أنشئ بواسطة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{transaction.id}</TableCell>
                    <TableCell>{transaction.employee_name || "-"}</TableCell>
                    <TableCell>
                      {getTypeBadge(transaction.type)}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-red-600">
                      {formatAmount(transaction.amount, walletInfo?.currency)}
                    </TableCell>
                    <TableCell>{transaction.description || "-"}</TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>{transaction.created_by_name || "-"}</TableCell>
                    <TableCell className="text-xs">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTransaction(transaction)}
                          title="تعديل"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTransaction(transaction)}
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
        {expenses && expenses.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            عرض {expenses.length} مصروف معتمد
          </div>
        )}
      </div>

      {/* Add Cash Transaction Modal */}
      <ClientCashTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={handleCloseAddTransaction}
        onSuccess={handleTransactionSuccess}
        clientId={clientId}
        clientName={walletInfo?.client_name}
        walletId={walletId}
        walletInfo={walletInfo}
      />

      {/* Edit Cash Transaction Modal */}
      <EditEmployeeCashTransactionModal
        isOpen={isEditTransactionOpen}
        onClose={handleCloseEditTransaction}
        onSuccess={handleEditSuccess}
        transaction={selectedTransaction}
        walletInfo={walletInfo}
      />

      {/* Delete Cash Transaction Modal */}
      <DeleteEmployeeCashTransactionModal
        isOpen={isDeleteTransactionOpen}
        onClose={handleCloseDeleteTransaction}
        onSuccess={handleDeleteSuccess}
        transaction={selectedTransaction}
        walletInfo={walletInfo}
      />
    </>
  );
}
