"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, DollarSign, Building2, User, CreditCard, FileText, Tag } from "lucide-react";
import { getExpenseById } from "../../services/api/expenses";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function ViewExpenseModal({ isOpen, onClose, expenseId }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && expenseId) {
      loadExpense();
    }
  }, [isOpen, expenseId]);

  const loadExpense = async () => {
    setIsLoading(true);
    try {
      const res = await getExpenseById(expenseId);
      setExpense(res?.data || null);
    } catch (error) {
      console.error("Error loading expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: t("expenses.cash"),
      bank_transfer: t("expenses.bankTransfer"),
      credit_card: t("expenses.creditCard"),
      cheque: t("expenses.cheque"),
    };
    return labels[method] || method;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(isArabic ? "ar-AE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="p-2 rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("expenses.viewExpense")}
      size="md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : expense ? (
        <>
          <CustomModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DetailRow
                icon={Calendar}
                label={t("expenses.date")}
                value={formatDate(expense.expense_date)}
              />
              <DetailRow
                icon={Tag}
                label={t("expenses.category")}
                value={isArabic ? expense.category_name_ar : expense.category_name_en}
              />
              <DetailRow
                icon={Building2}
                label={t("expenses.branch")}
                value={isArabic ? expense.branch_name_ar : expense.branch_name_en}
              />
              <DetailRow
                icon={DollarSign}
                label={t("expenses.amount")}
                value={`${formatCurrency(expense.amount)} AED`}
              />
              <DetailRow
                icon={CreditCard}
                label={t("expenses.paymentMethod")}
                value={getPaymentMethodLabel(expense.payment_method)}
              />
              <DetailRow
                icon={User}
                label={t("expenses.recipient")}
                value={expense.recipient}
              />
              <div className="md:col-span-2">
                <DetailRow
                  icon={FileText}
                  label={t("expenses.description")}
                  value={expense.description}
                />
              </div>
              <DetailRow
                icon={User}
                label={t("expenses.enteredBy")}
                value={expense.entered_by_name}
              />
              <DetailRow
                icon={Calendar}
                label={t("expenses.createdAt")}
                value={formatDate(expense.created_at)}
              />
            </div>
          </CustomModalBody>

          <CustomModalFooter>
            <Button variant="outline" onClick={onClose}>
              {t("expenses.close")}
            </Button>
          </CustomModalFooter>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {t("expenses.notFound")}
        </div>
      )}
    </CustomModal>
  );
}
