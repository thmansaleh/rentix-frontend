"use client";

import { useState } from "react";
import useSWR from "swr";
import { getAccountStatement } from "@/app/services/api/wallets";
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
import { Loader2, ArrowDownToLine, ArrowUpFromLine, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function AccountStatementTab({ walletId, clientId, walletInfo, isOpen }) {
  const { t } = useTranslations();
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
    isOpen && walletId ? `/wallets/${walletId}/statement?from=${fromDate}&to=${toDate}` : null,
    () => getAccountStatement(walletId, fromDate, toDate),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

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
    if (type === 'deposit') {
      return (
        <Badge className="bg-green-100 text-green-800">
          {language === 'ar' ? 'إيداع' : 'Deposit'}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          {language === 'ar' ? 'مصروف' : 'Expense'}
        </Badge>
      );
    }
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      cash: { color: "bg-green-100 text-green-800", label: language === 'ar' ? 'نقداً' : 'Cash' },
      bank_transfer: { color: "bg-blue-100 text-blue-800", label: language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer' },
      card: { color: "bg-purple-100 text-purple-800", label: language === 'ar' ? 'بطاقة' : 'Card' },
      cheque: { color: "bg-orange-100 text-orange-800", label: language === 'ar' ? 'شيك' : 'Cheque' },
      other: { color: "bg-gray-100 text-gray-800", label: language === 'ar' ? 'أخرى' : 'Other' },
    };

    const config = methodConfig[method] || methodConfig.cash;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Calculate totals
  const transactions = data?.data || [];
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const netBalance = totalDeposits - totalExpenses;

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
        deposit: { en: 'Deposit', ar: 'إيداع' },
        expense: { en: 'Expense', ar: 'مصروف' }
      }
    },
    case_number: {
      en: 'Case Number',
      ar: 'رقم القضية',
      dataKey: 'case_number'
    },
    file_number: {
      en: 'File Number',
      ar: 'رقم الملف',
      dataKey: 'file_number'
    },
    description: {
      en: 'Description',
      ar: 'الوصف',
      dataKey: 'description'
    },
    method: {
      en: 'Payment Method',
      ar: 'طريقة الدفع',
      dataKey: 'method',
      type: 'status',
      statusMap: {
        cash: { en: 'Cash', ar: 'نقداً' },
        bank_transfer: { en: 'Bank Transfer', ar: 'تحويل بنكي' },
        card: { en: 'Card', ar: 'بطاقة' },
        cheque: { en: 'Cheque', ar: 'شيك' },
        other: { en: 'Other', ar: 'أخرى' }
      }
    },
    amount: {
      en: 'Amount',
      ar: 'المبلغ',
      dataKey: 'amount',
      formatter: (value) => formatAmount(value, walletInfo?.currency)
    },
    bank_account: {
      en: 'Bank Account',
      ar: 'الحساب البنكي',
      dataKey: 'account_name',
      formatter: (value, item) => {
        if (item.bank_account_id) {
          return `${item.account_name || ''} - ${item.bank_name || ''}`;
        }
        return '-';
      }
    },
    created_by_name: {
      en: 'Created By',
      ar: 'أنشئ بواسطة',
      dataKey: 'created_by_name'
    }
  };

  return (
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'إجمالي الإيداعات' : 'Total Deposits'}
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatAmount(totalDeposits, walletInfo?.currency)}
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
              {formatAmount(totalExpenses, walletInfo?.currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {netBalance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-blue-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-orange-600" />
              )}
              <span className="text-sm font-medium">
                {language === 'ar' ? 'الرصيد الصافي' : 'Net Balance'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatAmount(netBalance, walletInfo?.currency)}
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
          exportName={`account_statement_${fromDate}_to_${toDate}`}
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
                <TableHead>{language === 'ar' ? 'رقم القضية' : 'Case Number'}</TableHead>
                <TableHead>{language === 'ar' ? 'رقم الملف' : 'File Number'}</TableHead>
                <TableHead>{language === 'ar' ? 'الوصف' : 'Description'}</TableHead>
                <TableHead>{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</TableHead>
                <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحساب البنكي' : 'Bank Account'}</TableHead>
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
                  <TableCell className="font-medium">
                    {transaction.case_number || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.file_number || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {transaction.description || "-"}
                  </TableCell>
                  <TableCell>
                    {getMethodBadge(transaction.method)}
                  </TableCell>
                  <TableCell className={`font-mono font-semibold ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {formatAmount(transaction.amount, walletInfo?.currency)}
                  </TableCell>
                  <TableCell>
                    {transaction.bank_account_id ? (
                      <div className="text-xs">
                        <div className="font-medium">{transaction.account_name}</div>
                        <div className="text-muted-foreground">
                          {transaction.bank_name}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
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
            : `Showing ${transactions.length} transactions`}
        </div>
      )}
    </div>
  );
}
