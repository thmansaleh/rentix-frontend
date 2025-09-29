'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, TrendingUp, Users, Calendar } from 'lucide-react';

const SalariesPage = () => {
  const { isRTL } = useLanguage();
  const t = useTranslations();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title={t('navigation.salaries')} 
          description="إدارة رواتب الموظفين والمكافآت والحوافز"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الرواتب الشهرية
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                عدد الموظفين
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المكافآت
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الحضور الشهري
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 منذ ساعة واحدة
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>الرواتب الحديثة</CardTitle>
              <CardDescription>
                آخر الرواتب المدفوعة للموظفين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">أحمد محمد</p>
                    <p className="text-sm text-muted-foreground">
                      ahmed@example.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">فاطمة علي</p>
                    <p className="text-sm text-muted-foreground">
                      fatima@example.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$39.00</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">محمد سالم</p>
                    <p className="text-sm text-muted-foreground">
                      mohammed@example.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$299.00</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نظرة عامة على الرواتب</CardTitle>
              <CardDescription>
                ملخص الرواتب والمكافآت الشهرية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">الراتب الأساسي</span>
                  <span className="font-medium">$25,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">المكافآت</span>
                  <span className="font-medium">$5,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">العلاوات</span>
                  <span className="font-medium">$3,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">الخصومات</span>
                  <span className="font-medium text-red-600">-$2,000</span>
                </div>
                <hr />
                <div className="flex justify-between items-center font-medium">
                  <span>إجمالي الرواتب</span>
                  <span>$31,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalariesPage;