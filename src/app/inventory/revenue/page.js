'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  Calendar,
  Car,
  Users,
  Building,
  FileText,
  DollarSign,
  Eye,
  BarChart3
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const RevenueCard = ({ revenue, onEdit, onDelete, onView }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'إيجار': Car,
      'خدمات إضافية': Building,
      'غرامات': FileText,
      'أخرى': DollarSign
    };
    return icons[category] || DollarSign;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'إيجار': 'bg-green-600',
      'خدمات إضافية': 'bg-blue-600',
      'غرامات': 'bg-orange-600',
      'أخرى': 'bg-purple-600'
    };
    return colors[category] || 'bg-purple-600';
  };

  const Icon = getCategoryIcon(revenue.category);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${getCategoryColor(revenue.category)}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{revenue.description}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{revenue.category}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView(revenue)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(revenue)}
            className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(revenue)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">المبلغ</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {revenue.amount.toLocaleString()} ر.س
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">التاريخ</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{revenue.date}</span>
        </div>
        {revenue.client && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">العميل</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{revenue.client}</span>
          </div>
        )}
        {revenue.vehicle && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">المركبة</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{revenue.vehicle}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          revenue.status === 'received' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : revenue.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {revenue.status === 'received' ? 'مستلمة' : 
           revenue.status === 'pending' ? 'معلقة' : 'ملغاة'}
        </span>
      </div>
    </div>
  );
};

const RevenueRow = ({ revenue, onEdit, onDelete, onView }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'إيجار': Car,
      'خدمات إضافية': Building,
      'غرامات': FileText,
      'أخرى': DollarSign
    };
    return icons[category] || DollarSign;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'إيجار': 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      'خدمات إضافية': 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      'غرامات': 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      'أخرى': 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    };
    return colors[category] || 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
  };

  const Icon = getCategoryIcon(revenue.category);

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getCategoryColor(revenue.category)}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{revenue.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{revenue.category}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {revenue.client || '-'}
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {revenue.vehicle || '-'}
      </td>
      <td className="px-6 py-4">
        <span className="font-medium text-green-600 dark:text-green-400">
          {revenue.amount.toLocaleString()} ر.س
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
        {revenue.date}
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          revenue.status === 'received' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : revenue.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {revenue.status === 'received' ? 'مستلمة' : 
           revenue.status === 'pending' ? 'معلقة' : 'ملغاة'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onView(revenue)}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(revenue)}
            className="p-1 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(revenue)}
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
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
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

export default function RevenuePage() {
  const t = useTranslations();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with actual data from your API
  const revenues = [
    {
      id: 1,
      description: 'إيجار سيارة BMW X5',
      category: 'إيجار',
      amount: 2500,
      date: '14 أغسطس 2025',
      client: 'أحمد محمد علي',
      vehicle: 'BMW X5 - لوحة 123 أ ب ج',
      status: 'received'
    },
    {
      id: 2,
      description: 'إيجار سيارة Mercedes C200',
      category: 'إيجار',
      amount: 1800,
      date: '13 أغسطس 2025',
      client: 'فاطمة أحمد',
      vehicle: 'Mercedes C200 - لوحة 456 د ه و',
      status: 'received'
    },
    {
      id: 3,
      description: 'خدمة توصيل للمطار',
      category: 'خدمات إضافية',
      amount: 150,
      date: '12 أغسطس 2025',
      client: 'محمد عبدالله',
      vehicle: 'Toyota Camry - لوحة 789 ز ح ط',
      status: 'pending'
    },
    {
      id: 4,
      description: 'غرامة تأخير',
      category: 'غرامات',
      amount: 100,
      date: '11 أغسطس 2025',
      client: 'سارة محمود',
      vehicle: 'Honda Civic - لوحة 321 ي ك ل',
      status: 'received'
    },
    {
      id: 5,
      description: 'إيجار سيارة Audi A4',
      category: 'إيجار',
      amount: 2200,
      date: '10 أغسطس 2025',
      client: 'خالد أحمد',
      vehicle: 'Audi A4 - لوحة 654 م ن س',
      status: 'pending'
    }
  ];

  const stats = [
    {
      title: 'إجمالي الإيرادات',
      value: '45,230 ر.س',
      icon: TrendingUp,
      color: 'bg-green-600',
      change: 12
    },
    {
      title: 'إيرادات الإيجار',
      value: '38,500 ر.س',
      icon: Car,
      color: 'bg-blue-600',
      change: 8
    },
    {
      title: 'الخدمات الإضافية',
      value: '4,230 ر.س',
      icon: Building,
      color: 'bg-purple-600',
      change: 25
    },
    {
      title: 'المعلقة',
      value: '6,750 ر.س',
      icon: Calendar,
      color: 'bg-yellow-600',
      change: -5
    }
  ];

  const categories = [
    { key: 'all', label: 'جميع الفئات' },
    { key: 'إيجار', label: 'إيجار' },
    { key: 'خدمات إضافية', label: 'خدمات إضافية' },
    { key: 'غرامات', label: 'غرامات' },
    { key: 'أخرى', label: 'أخرى' }
  ];

  const statuses = [
    { key: 'all', label: 'جميع الحالات' },
    { key: 'received', label: 'مستلمة' },
    { key: 'pending', label: 'معلقة' },
    { key: 'cancelled', label: 'ملغاة' }
  ];

  const filteredRevenues = revenues.filter(revenue => {
    const categoryMatch = selectedCategory === 'all' || revenue.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || revenue.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const handleEditRevenue = (revenue) => {
    // Implement edit functionality
    console.log('Edit revenue:', revenue);
  };

  const handleDeleteRevenue = (revenue) => {
    // Implement delete functionality
    console.log('Delete revenue:', revenue);
  };

  const handleViewRevenue = (revenue) => {
    // Implement view details functionality
    console.log('View revenue:', revenue);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            الإيرادات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة ومتابعة جميع مصادر الدخل والإيرادات
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <BarChart3 className="w-4 h-4" />
            التقارير
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة إيراد
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

      {/* Revenues Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRevenues.map((revenue) => (
            <RevenueCard
              key={revenue.id}
              revenue={revenue}
              onEdit={handleEditRevenue}
              onDelete={handleDeleteRevenue}
              onView={handleViewRevenue}
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
                    الإيراد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    العميل
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
                {filteredRevenues.map((revenue) => (
                  <RevenueRow
                    key={revenue.id}
                    revenue={revenue}
                    onEdit={handleEditRevenue}
                    onDelete={handleDeleteRevenue}
                    onView={handleViewRevenue}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredRevenues.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            لا توجد إيرادات تطابق الفلاتر المحددة
          </p>
        </div>
      )}
    </div>
  );
}
