'use client';
import React, { useState } from 'react';
import { Receipt, PlusCircle, Search, Filter, Calendar, DollarSign } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/PageHeader';
import AddExpenseDialog from './AddExpenseDialog';
import { useTranslations } from '@/hooks/useTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

// Sample expenses data - replace with your API data
const expenses = [
  {
    id: 'EXP-001',
    description: 'صيانة السيارة رقم 123',
    category: 'صيانة',
    date: '2025-07-01',
    amount: 500,
    status: 'مدفوع',
    vendor: 'ورشة الإتقان'
  },
  {
    id: 'EXP-002',
    description: 'وقود شهر يوليو',
    category: 'وقود',
    date: '2025-07-03',
    amount: 1200,
    status: 'قيد المراجعة',
    vendor: 'محطة أدنوك'
  },
  {
    id: 'EXP-003',
    description: 'تأمين السيارات',
    category: 'تأمين',
    date: '2025-07-05',
    amount: 800,
    status: 'مدفوع',
    vendor: 'شركة التأمين الوطنية'
  },
  {
    id: 'EXP-004',
    description: 'رسوم تجديد الرخصة',
    category: 'رسوم حكومية',
    date: '2025-07-07',
    amount: 300,
    status: 'معلق',
    vendor: 'دائرة النقل'
  },
];

const statusColor = {
  'مدفوع': 'success',
  'قيد المراجعة': 'secondary',
  'معلق': 'destructive',
  'ملغي': 'outline',
};

const categoryColor = {
  'صيانة': 'bg-blue-100 text-blue-800',
  'وقود': 'bg-green-100 text-green-800',
  'تأمين': 'bg-purple-100 text-purple-800',
  'رسوم حكومية': 'bg-orange-100 text-orange-800',
  'أخرى': 'bg-gray-100 text-gray-800',
};

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { isRTL } = useLanguage();
  const t = useTranslations();

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' ? true : expense.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = filteredExpenses.filter(e => e.status === 'مدفوع').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'قيد المراجعة').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader 
        title="المصروفات"
        description="إدارة ومتابعة جميع المصروفات والنفقات"
      >
        <AddExpenseDialog />
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المصروفات</p>
                <p className="text-2xl font-bold">{totalExpenses.toLocaleString()} د.إ</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">المدفوع</p>
                <p className="text-2xl font-bold text-green-600">{paidExpenses.toLocaleString()} د.إ</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">قيد المراجعة</p>
                <p className="text-2xl font-bold text-orange-600">{pendingExpenses.toLocaleString()} د.إ</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المصروفات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مدفوع">مدفوع</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="معلق">معلق</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="تصفية حسب الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="صيانة">صيانة</SelectItem>
                <SelectItem value="وقود">وقود</SelectItem>
                <SelectItem value="تأمين">تأمين</SelectItem>
                <SelectItem value="رسوم حكومية">رسوم حكومية</SelectItem>
                <SelectItem value="أخرى">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            قائمة المصروفات ({filteredExpenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم المصروف</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>المورد</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={categoryColor[expense.category] || categoryColor['أخرى']}
                    >
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="font-semibold">{expense.amount.toLocaleString()} د.إ</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[expense.status]}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد مصروفات تطابق معايير البحث
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
