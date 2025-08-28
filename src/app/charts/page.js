'use client';
import React, { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Car,
  Users,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from '@/components/PageHeader';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import RevenueChart from './RevenueChart';
import BookingsChart from './BookingsChart';
import FleetUtilizationChart from './FleetUtilizationChart';
import CustomerChart from './CustomerChart';

const ChartsPage = () => {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const statsCards = [
    {
      title: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: '₹2,45,000',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'معدل الاستخدام' : 'Fleet Utilization',
      value: '87.5%',
      change: '-2.1%',
      changeType: 'decrease',
      icon: Car,
      color: 'text-orange-600'
    },
    {
      title: language === 'ar' ? 'عملاء جدد' : 'New Customers',
      value: '156',
      change: '+15.3%',
      changeType: 'increase',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <PageHeader 
        title={language === 'ar' ? 'التقارير والرسوم البيانية' : 'Charts & Analytics'}
        description={language === 'ar' ? 'تحليل شامل لبيانات الأعمال والإحصائيات' : 'Comprehensive business data analysis and statistics'}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'ar' ? 'اختر الفترة' : 'Select Period'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{language === 'ar' ? 'هذا الأسبوع' : 'This Week'}</SelectItem>
              <SelectItem value="month">{language === 'ar' ? 'هذا الشهر' : 'This Month'}</SelectItem>
              <SelectItem value="quarter">{language === 'ar' ? 'هذا الربع' : 'This Quarter'}</SelectItem>
              <SelectItem value="year">{language === 'ar' ? 'هذا العام' : 'This Year'}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'ar' ? 'اختر المقياس' : 'Select Metric'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'جميع المقاييس' : 'All Metrics'}</SelectItem>
              <SelectItem value="revenue">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</SelectItem>
              <SelectItem value="bookings">{language === 'ar' ? 'الحجوزات' : 'Bookings'}</SelectItem>
              <SelectItem value="customers">{language === 'ar' ? 'العملاء' : 'Customers'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              {language === 'ar' ? 'الحجوزات اليومية' : 'Daily Bookings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsChart />
          </CardContent>
        </Card>

        {/* Fleet Utilization Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {language === 'ar' ? 'استخدام الأسطول' : 'Fleet Utilization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FleetUtilizationChart />
          </CardContent>
        </Card>

        {/* Customer Growth Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {language === 'ar' ? 'نمو العملاء' : 'Customer Growth'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartsPage;
