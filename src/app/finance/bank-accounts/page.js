'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';
import { getAllBankAccounts, deleteBankAccount } from '@/app/services/api/bankAccounts';
import AddAccountModal from './components/AddAccountModal';
import EditAccountModal from './components/EditAccountModal';
import { toast } from 'react-toastify';

function BankAccountsPage() {
  const { isRTL } = useLanguage();
  const { hasPermission: canAdd } = usePermission('Add Bank Account');
  const { hasPermission: canEdit } = usePermission('Edit Bank Account');
  const { hasPermission: canDelete } = usePermission('Delete Bank Account');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const response = await getAllBankAccounts();
      if (response.success) {
        setBankAccounts(response.data);
      } else {
        toast.error('حدث خطأ في تحميل الحسابات البنكية');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('حدث خطأ في تحميل الحسابات البنكية');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const handleEdit = (accountId) => {
    setSelectedAccountId(accountId);
    setShowEditModal(true);
  };

  const handleDelete = async (accountId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteBankAccount(accountId);
      
      if (response.success) {
        toast.success('تم حذف الحساب بنجاح');
        fetchBankAccounts(); // Refresh the list
      } else {
        toast.error('حدث خطأ في حذف الحساب');
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast.error('حدث خطأ في حذف الحساب');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE');
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            الحسابات البنكية
          </h1>
        </div>

        {/* Bank Accounts Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>قائمة الحسابات البنكية</CardTitle>
              {canAdd && (
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة حساب جديد
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="mr-3">جاري تحميل الحسابات...</span>
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">لا توجد حسابات بنكية مضافة</p>
                {canAdd && (
                  <Button onClick={() => setShowAddModal(true)}>
                    إضافة حساب جديد
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم البنك</TableHead>
                    <TableHead>اسم الحساب</TableHead>
                    <TableHead>رقم الحساب</TableHead>
                    <TableHead>IBAN</TableHead>
                    <TableHead>الفرع</TableHead>
                    <TableHead>الرصيد الحالي</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.bank_name}
                      </TableCell>
                      <TableCell>{account.account_name}</TableCell>
                      <TableCell className="font-mono">
                        {account.account_number}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {account.iban || '-'}
                      </TableCell>
                      <TableCell>
                        {account.branch_name_ar || '-'}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(account.current_balance)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={account.status === 'active' ? 'default' : 'secondary'}
                        >
                          {account.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(account.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(account.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {canDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={deleteLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف الحساب البنكي {account.account_name}؟ 
                                    لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(account.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddAccountModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchBankAccounts}
        />

        <EditAccountModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccountId(null);
          }}
          onSuccess={fetchBankAccounts}
          accountId={selectedAccountId}
        />
      </div>
    </div>
  );
}

export default BankAccountsPage;