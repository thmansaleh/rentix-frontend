'use client';
import React from 'react';
import { DollarSign, Download } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { useTranslations } from '@/hooks/useTranslations';

const FinancialReports = () => {
  const t = useTranslations();
  const financialReportsData = {
    id: 'financial',
    title: t('financialReports.title', 'التقارير المالية'),
    description: t('financialReports.description', 'تقارير الإيرادات والمصروفات والأرباح'),
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    reports: [
      { name: t('financialReports.revenueReport', 'تقرير الإيرادات الشهرية'), lastGenerated: '2024-01-15', format: 'PDF' },
      { name: t('financialReports.expensesReport', 'تقرير المصروفات'), lastGenerated: '2024-01-10', format: 'Excel' },
      { name: t('financialReports.profitLossReport', 'تقرير الأرباح والخسائر'), lastGenerated: '2024-01-08', format: 'PDF' }
    ]
  };

  // Function to generate fake financial data
  const generateFinancialData = (reportType) => {
    const data = [];
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    if (reportType === t('financialReports.revenueReport', 'تقرير الإيرادات الشهرية')) {
      months.forEach((month) => {
        const revenue = Math.floor(Math.random() * 50000) + 20000;
        data.push({
          'الشهر': month,
          'الإيرادات (درهم)': revenue.toLocaleString(),
        });
      });
    } else if (reportType === t('financialReports.expensesReport', 'تقرير المصروفات')) {
      months.forEach((month) => {
        const expenses = Math.floor(Math.random() * 30000) + 10000;
        data.push({
          'الشهر': month,
          'المصروفات (درهم)': expenses.toLocaleString(),
          'نوع المصروف': ['صيانة', 'تأمين', 'رواتب', 'إيجار', 'وقود'][Math.floor(Math.random() * 5)]
        });
      });
    } else if (reportType === t('financialReports.profitLossReport', 'تقرير الأرباح والخسائر')) {
      months.forEach((month) => {
        const revenue = Math.floor(Math.random() * 50000) + 20000;
        const expenses = Math.floor(Math.random() * 30000) + 10000;
        const profit = revenue - expenses;
        data.push({
          'الشهر': month,
          'الإيرادات (درهم)': revenue.toLocaleString(),
          'المصروفات (درهم)': expenses.toLocaleString(),
          'صافي الربح (درهم)': profit.toLocaleString(),
          'نسبة الربح (%)': ((profit / revenue) * 100).toFixed(2) + '%'
        });
      });
    } else {
      // Default: all-in-one
      months.forEach((month) => {
        const revenue = Math.floor(Math.random() * 50000) + 20000;
        const expenses = Math.floor(Math.random() * 30000) + 10000;
        const profit = revenue - expenses;
        data.push({
          'الشهر': month,
          'الإيرادات (درهم)': revenue.toLocaleString(),
          'المصروفات (درهم)': expenses.toLocaleString(),
          'صافي الربح (درهم)': profit.toLocaleString(),
          'نسبة الربح (%)': ((profit / revenue) * 100).toFixed(2) + '%'
        });
      });
    }
    return data;
  };

  // Function to download Excel file
  const downloadExcelReport = (reportName) => {
    const data = generateFinancialData(reportName);
    const workbook = XLSX.utils.book_new();
    let worksheet, sheetName;
    if (reportName === t('financialReports.revenueReport', 'تقرير الإيرادات الشهرية')) {
      worksheet = XLSX.utils.json_to_sheet(data);
      sheetName = t('financialReports.revenueReport', 'الإيرادات الشهرية');
    } else if (reportName === t('financialReports.expensesReport', 'تقرير المصروفات')) {
      worksheet = XLSX.utils.json_to_sheet(data);
      sheetName = t('financialReports.expensesReport', 'المصروفات');
    } else if (reportName === t('financialReports.profitLossReport', 'تقرير الأرباح والخسائر')) {
      worksheet = XLSX.utils.json_to_sheet(data);
      sheetName = t('financialReports.profitLossReport', 'الأرباح والخسائر');
    } else {
      worksheet = XLSX.utils.json_to_sheet(data);
      sheetName = 'التقرير المالي';
    }
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const fileName = `${reportName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const Icon = financialReportsData.icon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${financialReportsData.bgColor}`}>
            <Icon className={`w-6 h-6 ${financialReportsData.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{financialReportsData.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {financialReportsData.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {financialReportsData.reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <p className="font-medium">{report.name}</p>
               
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadExcelReport(report.name)}
                >
                  <Download className="w-4 h-4" />
                </Button>
            
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialReports;
