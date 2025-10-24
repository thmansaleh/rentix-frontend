"use client";

import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { deleteWalletExpense } from "@/app/services/api/walletExpenses";

export function DeleteWalletExpenseModal({ isOpen, onClose, onSuccess, expense }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!expense?.id) return;

    setIsDeleting(true);
    try {
      await deleteWalletExpense(expense.id);
      
      toast.success("تم حذف المصروف بنجاح");
      onSuccess();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "فشل في حذف المصروف");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  if (!isOpen || !expense) return null;

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تأكيد حذف المصروف</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            هل أنت متأكد من حذف هذا المصروف؟ سيتم استرجاع المبلغ إلى رصيد المحفظة.
          </p>

          {/* Expense Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">رقم المصروف:</span>
              <span className="font-medium">#{expense.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">رقم الفاتورة:</span>
              <span className="font-medium">{expense.invoice_number || "-"}</span>
            </div>
            {expense.file_number && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">رقم الملف:</span>
                <span className="font-medium">{expense.file_number}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-gray-600">المبلغ:</span>
              <span className="text-lg font-bold text-red-600">
                {formatAmount(expense.amount)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>ملاحظة:</strong> سيتم إضافة المبلغ {formatAmount(expense.amount)} إلى رصيد المحفظة بعد الحذف.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              "تأكيد الحذف"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
