'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { deleteEmployeeCashTransaction } from '@/app/services/api/employeeCashTransactions';
import { toast } from 'react-toastify';
import { Trash2, AlertTriangle } from 'lucide-react';

const DeleteEmployeeCashTransactionModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  transaction,
  walletInfo
}) => {
  const { isRTL, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!transaction?.id) return;

    setIsLoading(true);
    try {
      const response = await deleteEmployeeCashTransaction(transaction.id);
      
      if (response.success) {
        toast.success('تم حذف المصروف بنجاح');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'فشل في حذف المصروف');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      const errorMessage = error.response?.data?.message || error.message || 'فشل في حذف المصروف';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            حذف مصروف
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-700">
            هل أنت متأكد من رغبتك في حذف هذا المصروف؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">رقم المعاملة:</span>
              <span className="text-sm font-medium">#{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">الموظف:</span>
              <span className="text-sm font-medium">{transaction.employee_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">المبلغ:</span>
              <span className="text-sm font-bold text-red-600">
                {parseFloat(transaction.amount || 0).toLocaleString()} {walletInfo?.currency || 'AED'}
              </span>
            </div>
            {transaction.description && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">الوصف:</span>
                <span className="text-sm font-medium">{transaction.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">الحالة:</span>
              <span className="text-sm font-medium">{transaction.status === 'approved' ? 'معتمد' : 'قيد الانتظار'}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>تحذير:</strong> حذف هذا المصروف سيؤثر على رصيد الموظف ورصيد المحفظة.
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري الحذف...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                حذف المصروف
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEmployeeCashTransactionModal;