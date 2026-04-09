"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { updateExpense, getExpenseById, getExpenseCategories } from "../../services/api/expenses";
import { getAllBankAccounts } from "../../services/api/bankAccounts";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export function EditExpenseModal({ isOpen, onClose, onSuccess, expenseId }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [formData, setFormData] = useState({
    expense_date: "",
    category_id: "",
    amount: "",
    description: "",
    payment_method: "cash",
    recipient: "",
    account_id: "",
  });

  useEffect(() => {
    if (isOpen && expenseId) {
      loadData();
    }
  }, [isOpen, expenseId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [expenseRes, catRes, accRes] = await Promise.all([
        getExpenseById(expenseId),
        getExpenseCategories(),
        getAllBankAccounts(),
      ]);

      const expense = expenseRes?.data;
      setCategories(catRes?.data || []);
      setBankAccounts(accRes?.data || []);

      if (expense) {
        setFormData({
          expense_date: expense.expense_date
            ? new Date(expense.expense_date).toISOString().split("T")[0]
            : "",
          category_id: expense.category_id || "",
          amount: expense.amount || "",
          description: expense.description || "",
          payment_method: expense.payment_method || "cash",
          recipient: expense.recipient || "",
          account_id: expense.account_id ? String(expense.account_id) : "",
        });
      }
    } catch (error) {
      console.error("Error loading expense:", error);
      toast.error(t("expenses.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter accounts based on payment method
  const getFilteredAccounts = () => {
    return bankAccounts.filter(
      (a) =>
        a.status === "active" &&
        (formData.payment_method === "cash"
          ? a.account_type === "cash"
          : a.account_type !== "cash")
    );
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-select first matching account when payment method changes
      if (field === "payment_method") {
        const matching = bankAccounts.filter(
          (a) =>
            a.status === "active" &&
            (value === "cash" ? a.account_type === "cash" : a.account_type !== "cash")
        );
        updated.account_id = matching.length > 0 ? String(matching[0].id) : "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id || !formData.amount || !formData.description) {
      toast.error(t("expenses.fillRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await updateExpense(expenseId, {
        ...formData,
        amount: parseFloat(formData.amount),
        account_id: formData.account_id ? parseInt(formData.account_id) : null,
      });
      toast.success(t("expenses.updateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.message || t("expenses.updateError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("expenses.editExpense")}
      size="md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CustomModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label>{t("expenses.date")}</Label>
                <Input
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => handleChange("expense_date", e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>{t("expenses.category")}</Label>
                <Select
                  value={formData.category_id?.toString()}
                  onValueChange={(val) => handleChange("category_id", parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("expenses.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                        {isArabic ? cat.name_ar : cat.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label>{t("expenses.amount")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>{t("expenses.paymentMethod")}</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(val) => handleChange("payment_method", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t("expenses.cash")}</SelectItem>
                    <SelectItem value="bank_transfer">{t("expenses.bankTransfer")}</SelectItem>
                    <SelectItem value="credit_card">{t("expenses.creditCard")}</SelectItem>
                    <SelectItem value="cheque">{t("expenses.cheque")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Account */}
              <div className="space-y-2">
                <Label>{isArabic ? "الحساب البنكي" : "Bank Account"}</Label>
                <Select
                  value={formData.account_id?.toString()}
                  onValueChange={(val) => handleChange("account_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر حساب بنكي" : "Select bank account"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredAccounts().map((account) => (
                      <SelectItem key={account.id} value={String(account.id)}>
                        {account.bank_name} - {account.account_name} ({account.account_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <Label>{t("expenses.recipient")}</Label>
                <Input
                  value={formData.recipient}
                  onChange={(e) => handleChange("recipient", e.target.value)}
                  placeholder={t("expenses.recipientPlaceholder")}
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label>{t("expenses.description")}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder={t("expenses.descriptionPlaceholder")}
                  rows={3}
                  required
                />
              </div>
            </div>
          </CustomModalBody>

          <CustomModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("expenses.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("expenses.saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("expenses.update")}
                </>
              )}
            </Button>
          </CustomModalFooter>
        </form>
      )}
    </CustomModal>
  );
}
