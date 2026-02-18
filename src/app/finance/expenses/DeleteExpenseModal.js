"use client";

import { useState } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteExpense } from "../../services/api/expenses";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function DeleteExpenseModal({ isOpen, onClose, onSuccess, expense }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!expense) return;

    setIsDeleting(true);
    try {
      await deleteExpense(expense.expense_id);
      toast.success(t("expenses.deleteSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || t("expenses.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!expense) return null;

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("expenses.deleteExpenseTitle")}
      size="sm"
    >
      <CustomModalBody>
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {t("expenses.confirmDeleteTitle")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("expenses.confirmDeleteMessage")}
            </p>
          </div>

          <div className="w-full p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("expenses.amount")}</span>
              <span className="font-semibold">{formatCurrency(expense.amount)} AED</span>
            </div>
            {expense.description && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t("expenses.description")}</span>
                <span className="truncate max-w-[200px]">{expense.description}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("expenses.category")}</span>
              <span>
                {isArabic ? expense.category_name_ar : expense.category_name_en}
              </span>
            </div>
          </div>
        </div>
      </CustomModalBody>

      <CustomModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          {t("expenses.cancel")}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="min-w-[120px]"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("expenses.deleting")}
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("expenses.delete")}
            </>
          )}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
