'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Calendar,
  Car,
  Wrench,
  Fuel,
  Shield,
  FileText,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'صيانة': Wrench,
      'وقود': Fuel,
      'تأمين': Shield,
      'إدارية': FileText,
      'أخرى': Receipt
    };
    return icons[category] || Receipt;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'صيانة': 'bg-orange-600',
      'وقود': 'bg-red-600',
      'تأمين': 'bg-blue-600',
      'إدارية': 'bg-purple-600',
      'أخرى': 'bg-gray-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  const Icon = getCategoryIcon(expense.category);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${getCategoryColor(expense.category)}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{expense.description}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{expense.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">المبلغ</span>
          <span className="text-lg font-bold text-red-600 dark:text-red-400">
            {expense.amount.toLocaleString()} ر.س
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">التاريخ</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{expense.date}</span>
        </div>
        {expense.vehicle && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">المركبة</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{expense.vehicle}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          expense.status === 'paid' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : expense.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {expense.status === 'paid' ? 'مدفوعة' : 
           expense.status === 'pending' ? 'معلقة' : 'ملغاة'}
        </span>
      </div>
    </div>
  );
};

const ExpenseRow = ({ expense, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'صيانة': Wrench,
      'وقود': Fuel,
      'تأمين': Shield,
      'إدارية': FileText,
      'أخرى': Receipt
    };
    return icons[category] || Receipt;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'صيانة': 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      'وقود': 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      'تأمين': 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      'إدارية': 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      'أخرى': 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
  };

  const Icon = getCategoryIcon(expense.category);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{expense.category}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {expense.vehicle || '-'}
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-red-600 dark:text-red-400">
          {expense.amount.toLocaleString()} ر.س
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
        {expense.date}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          expense.status === 'paid' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : expense.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {expense.status === 'paid' ? 'مدفوعة' : 
           expense.status === 'pending' ? 'معلقة' : 'ملغاة'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-1 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {change > 0 ? '+' : ''}{change}% من الشهر الماضي
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function ExpensesPage() {
  const t = useTranslations();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with actual data from your API
  const expenses = [
    {
      id: 1,
      description: 'صيانة دورية للسيارة',
      category: 'صيانة',
      amount: 450,
      date: '14 أغسطس 2025',
      vehicle: 'BMW X5 - لوحة 123 أ ب ج',
      status: 'paid'
    },
    {
      id: 2,
      description: 'تعبئة وقود',
      category: 'وقود',
      amount: 200,
      date: '13 أغسطس 2025',
      vehicle: 'Mercedes C200 - لوحة 456 د ه و',
      status: 'paid'
    },
    {
      id: 3,
      description: 'تجديد التأمين الشهري',
      category: 'تأمين',
      amount: 1200,
      date: '12 أغسطس 2025',
      vehicle: null,
      status: 'pending'
    },
    {
      id: 4,
      description: 'رسوم إدارية',
      category: 'إدارية',
      amount: 150,
      date: '11 أغسطس 2025',
      vehicle: null,
      status: 'paid'
    },
    {
      id: 5,
      description: 'إصلاح مكيف الهواء',
      category: 'صيانة',
      amount: 800,
      date: '10 أغسطس 2025',
      vehicle: 'Toyota Camry - لوحة 789 ز ح ط',
      status: 'paid'
    }
  ];

  const stats = [
    {
      title: 'إجمالي المصروفات',
      value: '18,750 ر.س',
      icon: Receipt,
      color: 'bg-red-600',
      change: 5
    },
    {
      title: 'مصروفات الصيانة',
      value: '8,450 ر.س',
      icon: Wrench,
      color: 'bg-orange-600',
      change: 12
    },
    {
      title: 'مصروفات الوقود',
      value: '3,200 ر.س',
      icon: Fuel,
      color: 'bg-red-500',
      change: -8
    },
    {
      title: 'المعلقة',
      value: '2,100 ر.س',
      icon: AlertCircle,
      color: 'bg-yellow-600',
      change: -15
    }
  ];

  const categories = [
    { key: 'all', label: 'جميع الفئات' },
    { key: 'صيانة', label: 'صيانة' },
    { key: 'وقود', label: 'وقود' },
    { key: 'تأمين', label: 'تأمين' },
    { key: 'إدارية', label: 'إدارية' },
    { key: 'أخرى', label: 'أخرى' }
  ];

  const statuses = [
    { key: 'all', label: 'جميع الحالات' },
    { key: 'paid', label: 'مدفوعة' },
    { key: 'pending', label: 'معلقة' },
    { key: 'cancelled', label: 'ملغاة' }
  ];

  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || expense.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const handleEditExpense = (expense) => {
    // Implement edit functionality
    console.log('Edit expense:', expense);
  };

  const handleDeleteExpense = (expense) => {
    // Implement delete functionality
    console.log('Delete expense:', expense);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            المصروفات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة ومتابعة جميع المصروفات التشغيلية والإدارية
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة مصروف
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الفلاتر:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {statuses.map((status) => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">العرض:</span>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                جدول
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                بطاقات
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المصروف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المركبة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses.map((expense) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            لا توجد مصروفات تطابق الفلاتر المحددة
          </p>
        </div>
      )}
    </div>
  );
}
