'use client';
import React, { useEffect, useState } from 'react';
import { Car, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

import { useTranslations } from '@/hooks/useTranslations';

const FleetReports = () => {
  const t = useTranslations();
  const [carBrands, setCarBrands] = useState([]);

  useEffect(() => {
    fetch('/api/car-brands.json')
      .then((res) => res.json())
      .then((data) => setCarBrands(data.brands || []));
  }, []);

  const fleetReportsData = {
    id: 'fleet',
    title: t('fleetReports.title', 'تقارير المركبات'),
    description: t('fleetReports.description', 'تقارير حالة المركبات والصيانة والاستخدام'),
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    reports: [
      { name: t('fleetReports.statusReport', 'تقرير حالة الأسطول'), lastGenerated: '2024-01-12', format: 'PDF' },
      { name: t('fleetReports.maintenanceReport', 'تقرير الصيانة المجدولة'), lastGenerated: '2024-01-09', format: 'Excel' },
      { name: t('fleetReports.usageReport', 'تقرير معدل الاستخدام'), lastGenerated: '2024-01-07', format: 'PDF' }
    ]
  };

  // Function to generate fake fleet data
  const generateFleetData = (reportType) => {
    const carModels = ['كامري', 'التيما', 'أكورد', 'X3', 'C-Class', 'A4', 'ES350', 'Q50'];
    const statuses = ['متاح', 'مؤجر', 'في الصيانة', 'خارج الخدمة'];
    const colors = ['أبيض', 'أسود', 'فضي', 'أزرق', 'أحمر', 'بيج'];
    const data = [];
    if (reportType === t('fleetReports.usageReport', 'تقرير معدل الاستخدام')) {
      // Generate usage rate report data
      for (let i = 1; i <= 50; i++) {
        const brand = carBrands.length > 0 ? carBrands[Math.floor(Math.random() * carBrands.length)] : 'تويوتا';
        const model = carModels[Math.floor(Math.random() * carModels.length)];
        const year = 2018 + Math.floor(Math.random() * 7);
        const totalDays = 30;
        const rentedDays = Math.floor(Math.random() * 30);
        const usageRate = ((rentedDays / totalDays) * 100).toFixed(1) + '%';
        data.push({
          'رقم المركبة': `CAR-${String(i).padStart(3, '0')}`,
          'الماركة': brand,
          'الموديل': model,
          'السنة': year,
          'عدد أيام الإيجار': rentedDays,
          'عدد أيام الشهر': totalDays,
          'معدل الاستخدام': usageRate
        });
      }
    } else {
      // Default fleet data
      for (let i = 1; i <= 50; i++) {
        const brand = carBrands.length > 0 ? carBrands[Math.floor(Math.random() * carBrands.length)] : 'تويوتا';
        const model = carModels[Math.floor(Math.random() * carModels.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const year = 2018 + Math.floor(Math.random() * 7);
        const mileage = Math.floor(Math.random() * 150000) + 10000;
        const lastMaintenance = `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
        const dailyRate = Math.floor(Math.random() * 200) + 100;
        data.push({
          'رقم المركبة': `CAR-${String(i).padStart(3, '0')}`,
          'الماركة': brand,
          'الموديل': model,
          'السنة': year,
          'اللون': color,
          'الحالة': status,
          'الكيلومترات': mileage.toLocaleString(),
          'آخر صيانة': lastMaintenance,
          'السعر اليومي (درهم)': dailyRate.toLocaleString(),
          'عدد أيام الإيجار (الشهر الحالي)': Math.floor(Math.random() * 30),
          'الإيراد الشهري (درهم)': (dailyRate * Math.floor(Math.random() * 30)).toLocaleString()
        });
      }
    }
    return data;
  };

  // Function to download Excel file
  const downloadExcelReport = (reportName) => {
    let data, worksheet, columnWidths, sheetName;
    if (reportName === t('fleetReports.usageReport', 'تقرير معدل الاستخدام')) {
      data = generateFleetData(t('fleetReports.usageReport', 'تقرير معدل الاستخدام'));
      worksheet = XLSX.utils.json_to_sheet(data);
      columnWidths = [
        { wch: 15 }, // رقم المركبة
        { wch: 12 }, // الماركة
        { wch: 12 }, // الموديل
        { wch: 8 },  // السنة
        { wch: 18 }, // عدد أيام الإيجار
        { wch: 15 }, // عدد أيام الشهر
        { wch: 15 }  // معدل الاستخدام
      ];
      sheetName = t('fleetReports.usageReport', 'تقرير معدل الاستخدام');
    } else {
      data = generateFleetData();
      worksheet = XLSX.utils.json_to_sheet(data);
      columnWidths = [
        { wch: 15 }, // رقم المركبة
        { wch: 12 }, // الماركة
        { wch: 12 }, // الموديل
        { wch: 8 },  // السنة
        { wch: 10 }, // اللون
        { wch: 12 }, // الحالة
        { wch: 15 }, // الكيلومترات
        { wch: 15 }, // آخر صيانة
        { wch: 18 }, // السعر اليومي
        { wch: 20 }, // عدد أيام الإيجار
        { wch: 18 }  // الإيراد الشهري
      ];
      sheetName = t('fleetReports.statusReport', 'تقرير الأسطول');
    }
    worksheet['!cols'] = columnWidths;
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    // Generate Excel file and download
    const fileName = `${reportName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const Icon = fleetReportsData.icon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${fleetReportsData.bgColor}`}>
            <Icon className={`w-6 h-6 ${fleetReportsData.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{fleetReportsData.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {fleetReportsData.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fleetReportsData.reports.map((report, index) => (
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

export default FleetReports;
