'use client';

import React, { useState } from 'react';
import { 
  Banknote, 
  Wallet, 
  CreditCard,
  Building,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const CashAccountCard = ({ account, onEdit, onDelete, onView }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${account.color}`}>
          <account.icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{account.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{account.type}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onView(account)}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(account)}
          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(account)}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">الرصيد الحالي</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {account.balance.toLocaleString()} ر.س
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">آخر معاملة</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{account.lastTransaction}</span>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">الداخل هذا الشهر</span>
        <span className="text-green-600 dark:text-green-400 font-medium">
          +{account.monthlyIncome.toLocaleString()} ر.س
        </span>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-600 dark:text-gray-400">الخارج هذا الشهر</span>
        <span className="text-red-600 dark:text-red-400 font-medium">
          -{account.monthlyExpense.toLocaleString()} ر.س
        </span>
      </div>
    </div>
  </div>
);

const TransactionRow = ({ transaction }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
        }`}>
          {transaction.type === 'income' ? (
            <ArrowUpDown className="w-4 h-4 text-green-600 dark:text-green-400 rotate-180" />
          ) : (
            <ArrowUpDown className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-gray-900 dark:text-white">
      {transaction.account}
    </td>
    <td className="px-6 py-4">
      <span className={`font-medium ${
        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ر.س
      </span>
    </td>
    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
      {transaction.date}
    </td>
    <td className="px-6 py-4">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        transaction.status === 'completed' 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : transaction.status === 'pending'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {transaction.status === 'completed' ? 'مكتملة' : 
         transaction.status === 'pending' ? 'معلقة' : 'ملغاة'}
      </span>
    </td>
  </tr>
);

export default function CashManagementPage() {
  const t = useTranslations();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with actual data from your API
  const cashAccounts = [
    {
      id: 1,
      name: 'الحساب الجاري الرئيسي',
      type: 'حساب بنكي',
      balance: 125500,
      lastTransaction: '14 أغسطس 2025',
      monthlyIncome: 45230,
      monthlyExpense: 18750,
      icon: Building,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'الخزنة النقدية',
      type: 'نقد',
      balance: 8500,
      lastTransaction: '13 أغسطس 2025',
      monthlyIncome: 12000,
      monthlyExpense: 8200,
      icon: Wallet,
      color: 'bg-green-600'
    },
    {
      id: 3,
      name: 'حساب الطوارئ',
      type: 'حساب توفير',
      balance: 50000,
      lastTransaction: '10 أغسطس 2025',
      monthlyIncome: 0,
      monthlyExpense: 0,
      icon: CreditCard,
      color: 'bg-purple-600'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'إيجار سيارة BMW X5',
      category: 'إيجار',
      account: 'الحساب الجاري الرئيسي',
      amount: 2500,
      type: 'income',
      date: '14 أغسطس 2025',
      status: 'completed'
    },
    {
      id: 2,
      description: 'صيانة السيارة رقم 123',
      category: 'صيانة',
      account: 'الحساب الجاري الرئيسي',
      amount: 450,
      type: 'expense',
      date: '13 أغسطس 2025',
      status: 'completed'
    },
    {
      id: 3,
      description: 'إيجار سيارة Mercedes C200',
      category: 'إيجار',
      account: 'الحساب الجاري الرئيسي',
      amount: 1800,
      type: 'income',
      date: '12 أغسطس 2025',
      status: 'pending'
    },
    {
      id: 4,
      description: 'وقود',
      category: 'تشغيل',
      account: 'الخزنة النقدية',
      amount: 200,
      type: 'expense',
      date: '11 أغسطس 2025',
      status: 'completed'
    },
    {
      id: 5,
      description: 'تأمين شهري',
      category: 'تأمين',
      account: 'الحساب الجاري الرئيسي',
      amount: 1200,
      type: 'expense',
      date: '10 أغسطس 2025',
      status: 'completed'
    }
  ];

  const totalBalance = cashAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleEditAccount = (account) => {
    // Implement edit functionality
    console.log('Edit account:', account);
  };

  const handleDeleteAccount = (account) => {
    // Implement delete functionality
    console.log('Delete account:', account);
  };

  const handleViewAccount = (account) => {
    // Implement view details functionality
    console.log('View account:', account);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            إدارة النقد
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            إدارة الحسابات البنكية والنقد والمحافظ الرقمية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة حساب جديد
        </button>
      </div>

      {/* Total Balance Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">إجمالي الرصيد</p>
            <p className="text-3xl font-bold">{totalBalance.toLocaleString()} ر.س</p>
          </div>
          <div className="p-3 bg-blue-500/30 rounded-lg">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Cash Accounts Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          الحسابات المالية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cashAccounts.map((account) => (
            <CashAccountCard
              key={account.id}
              account={account}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
              onView={handleViewAccount}
            />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              المعاملات الأخيرة
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'income', label: 'الداخل' },
                  { key: 'expense', label: 'الخارج' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  المعاملة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  الحساب
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
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions
                .filter(transaction => 
                  selectedFilter === 'all' || transaction.type === selectedFilter
                )
                .map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
