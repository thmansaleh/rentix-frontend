'use client';

import React from 'react';
import useSWR from 'swr';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getAllWalletDeposits } from '@/app/services/api/walletDeposits';
import { getAllInvoices } from '@/app/services/api/invoices';

const FinanceCharts = () => {
  const { isRTL, language } = useLanguage();
  
  const { data: depositsData, isLoading: depositsLoading } = useSWR(
    '/wallet-deposits-chart',
    getAllWalletDeposits,
    { refreshInterval: 300000 }
  );

  const { data: invoicesData, isLoading: invoicesLoading } = useSWR(
    '/invoices-chart',
    getAllInvoices,
    { refreshInterval: 300000 }
  );


  const chartData = React.useMemo(() => {
    const deposits = depositsData?.data || [];
    const invoices = invoicesData?.data || [];

    // Get last 6 months data
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { 
        month: 'short' 
      });
      
      // Calculate deposits for this month
      const monthDeposits = deposits.filter(d => {
        const depositDate = new Date(d.created_at);
        return depositDate.getFullYear() === date.getFullYear() && 
               depositDate.getMonth() === date.getMonth();
      });
      
      const depositTotal = monthDeposits.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
      
      // Calculate invoices for this month
      const monthInvoices = invoices.filter(inv => {
        const invoiceDate = new Date(inv.invoice_date);
        return invoiceDate.getFullYear() === date.getFullYear() && 
               invoiceDate.getMonth() === date.getMonth();
      });
      
      const invoiceTotal = monthInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
      
      months.push({
        month: monthName,
        income: depositTotal,
        expenses: invoiceTotal
      });
    }
    
    return months;
  }, [depositsData, invoicesData, language]);

  const totals = React.useMemo(() => {
    const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
    const netBalance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, netBalance };
  }, [chartData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount || 0);
  };

  const isLoading = depositsLoading || invoicesLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
          {language === 'ar' ? 'الرسم البياني المالي' : 'Financial Charts'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className={`text-sm text-green-600 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'إجمالي الإيرادات (6 أشهر)' : 'Total Income (6 months)'}
                </p>
                <p className={`text-2xl font-bold text-green-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {formatCurrency(totals.totalIncome)}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className={`text-sm text-red-600 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'إجمالي المصروفات (6 أشهر)' : 'Total Expenses (6 months)'}
                </p>
                <p className={`text-2xl font-bold text-red-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {formatCurrency(totals.totalExpenses)}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${totals.netBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border`}>
                <p className={`text-sm ${totals.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'} mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'صافي الربح' : 'Net Balance'}
                </p>
                <p className={`text-2xl font-bold ${totals.netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {formatCurrency(totals.netBalance)}
                </p>
              </div>
            </div>

            {/* Simple Bar Chart Representation */}
            <div className="space-y-4 mt-6">
              <h4 className={`font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'ar' ? 'الإيرادات والمصروفات الشهرية' : 'Monthly Income vs Expenses'}
              </h4>
              {chartData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-medium">{item.month}</span>
                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-green-600">
                        {formatCurrency(item.income)}
                      </span>
                      <span className="text-red-600">
                        {formatCurrency(item.expenses)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 h-8">
                    <div 
                      className="bg-green-500 rounded transition-all hover:bg-green-600"
                      style={{ 
                        width: `${Math.max((item.income / Math.max(...chartData.map(d => Math.max(d.income, d.expenses)))) * 100, 2)}%` 
                      }}
                      title={`${language === 'ar' ? 'إيرادات' : 'Income'}: ${formatCurrency(item.income)}`}
                    />
                    <div 
                      className="bg-red-500 rounded transition-all hover:bg-red-600"
                      style={{ 
                        width: `${Math.max((item.expenses / Math.max(...chartData.map(d => Math.max(d.income, d.expenses)))) * 100, 2)}%` 
                      }}
                      title={`${language === 'ar' ? 'مصروفات' : 'Expenses'}: ${formatCurrency(item.expenses)}`}
                    />
                  </div>
                </div>
              ))}
              
              {/* Legend */}
              <div className={`flex gap-6 mt-4 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">{language === 'ar' ? 'الإيرادات' : 'Income'}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">{language === 'ar' ? 'المصروفات' : 'Expenses'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinanceCharts;
