'use client';

import React from 'react';
import useSWR from 'swr';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Loader2, AlertCircle } from 'lucide-react';
import { getAllExpenses } from '@/app/services/api/walletExpenses';

const LastExpenses = () => {
  const { isRTL, language } = useLanguage();
  
  // Fetch all expenses (latest 10)
  const { data: expensesData, isLoading, error: expensesError } = useSWR(
    '/wallet-expenses-all',
    () => getAllExpenses({ page: 1, limit: 10 }),
    { refreshInterval: 300000 }
  );

  const expenses = React.useMemo(() => {
    if (!expensesData?.success || !Array.isArray(expensesData?.data)) return [];
    // Already limited to 10 from API, just return them
    return expensesData.data;
  }, [expensesData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: language === 'ar' ? 'قيد الانتظار' : 'Pending', variant: 'secondary' },
      verified: { label: language === 'ar' ? 'موافق عليه' : 'Verified', variant: 'default' },
      rejected: { label: language === 'ar' ? 'مرفوض' : 'Rejected', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
          {language === 'ar' ? 'آخر المصروفات' : 'Recent Expenses'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expensesError ? (
          <div className="text-center py-8 text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p className="font-medium">{language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}</p>
            <p className="text-sm text-gray-500 mt-2">
              {expensesError?.message || 'Unknown error'}
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language === 'ar' ? 'لا توجد مصروفات' : 'No expenses found'}
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className={`flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-full bg-red-100">
                    <Receipt className="h-5 w-5 text-red-600" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="font-medium">
                      {expense.invoice_number || (language === 'ar' ? 'مصروف' : 'Expense')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {expense.employee_name || '-'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(expense.invoice_date || expense.created_at)}
                    </p>
                  </div>
                </div>
                <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(expense.status)}
                  </div>
                  {expense.case_number && (
                    <p className="text-xs text-gray-500 mt-1">
                      {expense.case_number}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LastExpenses;
