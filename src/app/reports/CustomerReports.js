'use client';
import React from 'react';
import { Users, Download } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { useTranslations } from '@/hooks/useTranslations';

const CustomerReports = () => {
  const t = useTranslations();
  const customerReportsData = {
    id: 'customers',
    title: t('customerReports.title', 'تقارير العملاء'),
    description: t('customerReports.description', 'تقارير نشاط العملاء والحجوزات'),
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    reports: [
      { name: t('customerReports.newCustomersReport', 'تقرير العملاء الجدد'), lastGenerated: '2024-01-14', format: 'Excel' },
      { name: t('customerReports.bookingsReport', 'تقرير الحجوزات'), lastGenerated: '2024-01-11', format: 'PDF' }
    ]
  };

  // Function to generate fake customer data
  const generateCustomerData = (reportType) => {
    const firstNames = ['أحمد', 'محمد', 'علي', 'فاطمة', 'عائشة', 'خديجة', 'عمر', 'حسن', 'سارة', 'مريم', 'يوسف', 'إبراهيم', 'نور', 'ليلى', 'زينب'];
    const lastNames = ['الأحمد', 'المحمد', 'العلي', 'الحسن', 'السالم', 'الخالد', 'الصالح', 'الرشيد', 'النجار', 'الطيار', 'العتيبي', 'الدوسري', 'القحطاني', 'الغامدي', 'الشهري'];
    const nationalities = ['مصري', 'سعودي', 'أردني', 'سوري', 'لبناني', 'هندي', 'باكستاني', 'فلسطيني', 'سوداني', 'يمني', 'عراقي', 'إماراتي', 'كويتي', 'قطري', 'بحريني'];
    const customerTypes = ['VIP', 'عادي', 'شركة', 'حكومي'];
    const data = [];
    if (reportType === t('customerReports.newCustomersReport', 'تقرير العملاء الجدد')) {
      for (let i = 1; i <= 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
        const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
        const joinDate = new Date(2024, Math.floor(Math.random() * 7), Math.floor(Math.random() * 28) + 1);
        data.push({
          'رقم العميل': `CUST-${String(i).padStart(4, '0')}`,
          'الاسم الكامل': `${firstName} ${lastName}`,
          'الجنسية': nationality,
          'نوع العميل': customerType,
          'تاريخ التسجيل': joinDate.toISOString().split('T')[0],
        });
      }
    } else if (reportType === t('customerReports.bookingsReport', 'تقرير الحجوزات')) {
      for (let i = 1; i <= 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
        const totalBookings = Math.floor(Math.random() * 50) + 1;
        const lastBooking = new Date(2024, Math.floor(Math.random() * 7), Math.floor(Math.random() * 28) + 1);
        data.push({
          'رقم العميل': `CUST-${String(i).padStart(4, '0')}`,
          'الاسم الكامل': `${firstName} ${lastName}`,
          'الجنسية': nationality,
          'عدد الحجوزات الإجمالي': totalBookings,
          'آخر حجز': lastBooking.toISOString().split('T')[0],
        });
      }
    } else {
      for (let i = 1; i <= 100; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
        const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
        const joinDate = new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const totalBookings = Math.floor(Math.random() * 50) + 1;
        const totalSpent = Math.floor(Math.random() * 50000) + 1000;
        const lastBooking = new Date(2024, Math.floor(Math.random() * 7), Math.floor(Math.random() * 28) + 1);
        data.push({
          'رقم العميل': `CUST-${String(i).padStart(4, '0')}`,
          'الاسم الكامل': `${firstName} ${lastName}`,
          'الجنسية': nationality,
          'نوع العميل': customerType,
          'تاريخ التسجيل': joinDate.toISOString().split('T')[0],
          'عدد الحجوزات الإجمالي': totalBookings,
          'إجمالي المبلغ المدفوع (درهم)': totalSpent.toLocaleString(),
          'آخر حجز': lastBooking.toISOString().split('T')[0],
          'الحالة': Math.random() > 0.1 ? 'نشط' : 'غير نشط',
          'رقم الهاتف': `+971-${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          'البريد الإلكتروني': `${firstName.toLowerCase()}.${lastName.toLowerCase().replace('ال', '')}@email.com`
        });
      }
    }
    return data;
  };

  // Function to download Excel file
  const downloadExcelReport = (reportName) => {
    const data = generateCustomerData(reportName);
    const workbook = XLSX.utils.book_new();
    let worksheet, columnWidths, sheetName;
    if (reportName === t('customerReports.newCustomersReport', 'تقرير العملاء الجدد')) {
      worksheet = XLSX.utils.json_to_sheet(data);
      columnWidths = [
        { wch: 15 }, // رقم العميل
        { wch: 20 }, // الاسم الكامل
        { wch: 15 }, // الجنسية
        { wch: 12 }, // نوع العميل
        { wch: 15 }  // تاريخ التسجيل
      ];
      sheetName = t('customerReports.newCustomersReport', 'العملاء الجدد');
    } else if (reportName === t('customerReports.bookingsReport', 'تقرير الحجوزات')) {
      worksheet = XLSX.utils.json_to_sheet(data);
      columnWidths = [
        { wch: 15 }, // رقم العميل
        { wch: 20 }, // الاسم الكامل
        { wch: 15 }, // الجنسية
        { wch: 18 }, // عدد الحجوزات
        { wch: 15 }  // آخر حجز
      ];
      sheetName = t('customerReports.bookingsReport', 'الحجوزات');
    } else {
      worksheet = XLSX.utils.json_to_sheet(data);
      columnWidths = [
        { wch: 15 }, // رقم العميل
        { wch: 20 }, // الاسم الكامل
        { wch: 15 }, // الجنسية
        { wch: 12 }, // نوع العميل
        { wch: 15 }, // تاريخ التسجيل
        { wch: 18 }, // عدد الحجوزات
        { wch: 20 }, // إجمالي المبلغ
        { wch: 15 }, // آخر حجز
        { wch: 10 }, // الحالة
        { wch: 18 }, // رقم الهاتف
        { wch: 25 }  // البريد الإلكتروني
      ];
      sheetName = 'تقرير العملاء';
    }
    worksheet['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const fileName = `${reportName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const Icon = customerReportsData.icon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${customerReportsData.bgColor}`}>
            <Icon className={`w-6 h-6 ${customerReportsData.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{customerReportsData.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {customerReportsData.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {customerReportsData.reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-muted-foreground">
                  آخر إنشاء: {report.lastGenerated} • {report.format}
                </p>
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

export default CustomerReports;
