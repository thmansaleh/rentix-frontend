"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import api from "@/app/services/api/axiosInstance";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, ArrowDownToLine, ArrowUpFromLine, Calendar, TrendingUp, TrendingDown, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Fetcher function for employee account statement
const getEmployeeAccountStatement = async (employeeId, fromDate, toDate) => {
  const response = await api.get(`/employees/${employeeId}/account-statement`, {
    params: { from: fromDate, to: toDate }
  });
  return response.data;
};

export function EmployeeAccountStatementModal({ isOpen, onClose, employee }) {
  const { language } = useLanguage();
  
  // Date range state
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Default to 1 month ago
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Fetch account statement data
  const { data, error, isLoading, mutate } = useSWR(
    isOpen && employee ? `/employees/${employee.id}/statement?from=${fromDate}&to=${toDate}` : null,
    () => getEmployeeAccountStatement(employee.id, fromDate, toDate),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDateChange = () => {
    mutate(); // Refresh data with new date range
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getTransactionTypeBadge = (type) => {
    if (type === 'income' || type === 'salary' || type === 'bonus') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          {language === 'ar' ? 'دخل' : 'Income'}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          {language === 'ar' ? 'مصروف' : 'Expense'}
        </Badge>
      );
    }
  };

  // Calculate totals
  const transactions = data?.data || [];
  const totalIncome = transactions
    .filter(t => t.type === 'income' || t.type === 'salary' || t.type === 'bonus')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'deduction')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpenses;

  // Column configuration for export
  const statementColumnConfig = {
    transaction_date: {
      en: 'Date',
      ar: 'التاريخ',
      dataKey: 'transaction_date',
      type: 'date'
    },
    type: {
      en: 'Type',
      ar: 'النوع',
      dataKey: 'type',
      type: 'status',
      statusMap: {
        income: { en: 'Income', ar: 'دخل' },
        salary: { en: 'Salary', ar: 'راتب' },
        bonus: { en: 'Bonus', ar: 'مكافأة' },
        expense: { en: 'Expense', ar: 'مصروف' },
        deduction: { en: 'Deduction', ar: 'خصم' }
      }
    },
    description: {
      en: 'Description',
      ar: 'الوصف',
      dataKey: 'description'
    },
    amount: {
      en: 'Amount',
      ar: 'المبلغ',
      dataKey: 'amount',
      formatter: (value) => formatAmount(value, 'AED')
    },
    reference: {
      en: 'Reference',
      ar: 'المرجع',
      dataKey: 'reference'
    },
    created_by_name: {
      en: 'Created By',
      ar: 'أنشئ بواسطة',
      dataKey: 'created_by_name'
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold">
                {language === 'ar' ? 'كشف حساب الموظف' : 'Employee Account Statement'}
              </h2>
            </div>
            {employee && (
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span>
                  <strong>{language === 'ar' ? 'الموظف' : 'Employee'}:</strong> {employee.name}
                </span>
                {employee.email && (
                  <span>
                    <strong>{language === 'ar' ? 'البريد' : 'Email'}:</strong> {employee.email}
                  </span>
                )}
                {employee.department && (
                  <span>
                    <strong>{language === 'ar' ? 'القسم' : 'Department'}:</strong> {employee.department}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Date Range Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {language === 'ar' ? 'من تاريخ' : 'From Date'}
                    </Label>
                    <Input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                    </Label>
                    <Input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleDateChange} className="w-full md:w-auto">
                    {language === 'ar' ? 'تطبيق' : 'Apply'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'إجمالي الدخل' : 'Total Income'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatAmount(totalIncome, 'AED')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpFromLine className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatAmount(totalExpenses, 'AED')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Export Buttons */}
            <div className="flex justify-start items-center">
              <ExportButtons
                data={transactions}
                columnConfig={statementColumnConfig}
                language={language}
                exportName={`employee_statement_${employee?.name}_${fromDate}_to_${toDate}`}
                sheetName={language === 'ar' ? 'كشف الحساب' : 'Account Statement'}
              />
            </div>

            {/* Transactions Table */}
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
              ) : !transactions || transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {language === 'ar' ? 'لا توجد معاملات' : 'No transactions found'}
                  </p>
                  <p className="text-sm">
                    {language === 'ar' 
                      ? 'لا توجد معاملات في الفترة المحددة' 
                      : 'No transactions found in the selected date range'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                      <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الوصف' : 'Description'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المرجع' : 'Reference'}</TableHead>
                      <TableHead>{language === 'ar' ? 'أنشئ بواسطة' : 'Created By'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={`${transaction.type}-${transaction.id}-${index}`}>
                        <TableCell className="text-xs">
                          {formatDate(transaction.transaction_date || transaction.created_at)}
                        </TableCell>
                        <TableCell>
                          {getTransactionTypeBadge(transaction.type)}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {transaction.description || "-"}
                        </TableCell>
                        <TableCell className={`font-mono font-semibold ${
                          (transaction.type === 'income' || transaction.type === 'salary' || transaction.type === 'bonus')
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {(transaction.type === 'income' || transaction.type === 'salary' || transaction.type === 'bonus') ? '+' : '-'}
                          {formatAmount(transaction.amount, 'AED')}
                        </TableCell>
                        <TableCell>{transaction.reference || "-"}</TableCell>
                        <TableCell>{transaction.created_by_name || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Results info */}
            {transactions && transactions.length > 0 && (
              <div className="text-sm text-muted-foreground text-center">
                {language === 'ar' 
                  ? `عرض ${transactions.length} معاملة` 
                  : `Showing ${transactions.length} transaction(s)`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
