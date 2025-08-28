'use client';

import React, { useState } from 'react';
import { 
  Banknote, 
  Receipt, 
  TrendingUp, 
  Wallet, 
  Plus,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const StatsCard = ({ title, value, icon: Icon, color, change }) => (
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

const QuickAction = ({ title, description, icon: Icon, onClick, color }) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-right"
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </button>
);

const RecentTransaction = ({ type, amount, description, date, category }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        type === 'income' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
      }`}>
        {type === 'income' ? (
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <Receipt className="w-4 h-4 text-red-600 dark:text-red-400" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{description}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{category} • {date}</p>
      </div>
    </div>
    <p className={`font-medium ${
      type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }`}>
      {type === 'income' ? '+' : '-'}{amount} ر.س
    </p>
  </div>
);

export default function InventoryPage() {
  const t = useTranslations();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: 'إجمالي النقد',
      value: '125,500 ر.س',
      icon: Wallet,
      color: 'bg-blue-600',
      change: 12
    },
    {
      title: 'الإيرادات الشهرية',
      value: '45,230 ر.س',
      icon: TrendingUp,
      color: 'bg-green-600',
      change: 8
    },
    {
      title: 'المصروفات الشهرية',
      value: '18,750 ر.س',
      icon: Receipt,
      color: 'bg-red-600',
      change: -5
    },
    {
      title: 'الربح الصافي',
      value: '26,480 ر.س',
      icon: DollarSign,
      color: 'bg-purple-600',
      change: 15
    }
  ];

  const quickActions = [
    {
      title: 'إدارة النقد',
      description: 'عرض وإدارة السيولة النقدية',
      icon: Banknote,
      color: 'bg-blue-600',
      onClick: () => window.location.href = '/inventory/cash'
    },
    {
      title: 'المصروفات',
      description: 'تتبع وإدارة جميع المصروفات',
      icon: Receipt,
      color: 'bg-red-600',
      onClick: () => window.location.href = '/inventory/expenses'
    },
    {
      title: 'الإيرادات',
      description: 'مراقبة مصادر الدخل',
      icon: TrendingUp,
      color: 'bg-green-600',
      onClick: () => window.location.href = '/inventory/revenue'
    }
  ];

  const recentTransactions = [
    {
      type: 'income',
      amount: '2,500',
      description: 'إيجار سيارة BMW X5',
      date: '14 أغسطس 2025',
      category: 'إيجار'
    },
    {
      type: 'expense',
      amount: '450',
      description: 'صيانة السيارة رقم 123',
      date: '13 أغسطس 2025',
      category: 'صيانة'
    },
    {
      type: 'income',
      amount: '1,800',
      description: 'إيجار سيارة Mercedes C200',
      date: '12 أغسطس 2025',
      category: 'إيجار'
    },
    {
      type: 'expense',
      amount: '200',
      description: 'وقود',
      date: '11 أغسطس 2025',
      category: 'تشغيل'
    },
    {
      type: 'expense',
      amount: '120',
      description: 'تأمين شهري',
      date: '10 أغسطس 2025',
      category: 'تأمين'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          المخزون المالي
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إدارة النقد والإيرادات والمصروفات
        </p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          {[
            { key: 'week', label: 'أسبوع' },
            { key: 'month', label: 'شهر' },
            { key: 'quarter', label: 'ربع سنة' },
            { key: 'year', label: 'سنة' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                المعاملات الأخيرة
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <Eye className="w-4 h-4" />
                عرض الكل
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentTransactions.map((transaction, index) => (
              <RecentTransaction key={index} {...transaction} />
            ))}
          </div>
        </div>

        {/* Monthly Summary Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              ملخص الشهر الحالي
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  سيتم عرض الرسم البياني هنا
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
