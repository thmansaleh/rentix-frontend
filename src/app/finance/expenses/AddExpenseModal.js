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
import { Loader2, Save, Paperclip, X, File } from "lucide-react";
import { toast } from "react-toastify";
import { createExpense, addExpenseAttachment, getExpenseCategories } from "../../services/api/expenses";
import { getAllBankAccounts } from "../../services/api/bankAccounts";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadFiles } from "../../../../utils/fileUpload";

export function AddExpenseModal({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split("T")[0],
    category_id: "",
    amount: "",
    description: "",
    payment_method: "cash",
    recipient: "",
    account_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFormData({
        expense_date: new Date().toISOString().split("T")[0],
        category_id: "",
        amount: "",
        description: "",
        payment_method: "cash",
        recipient: "",
        account_id: "",
      });
      setSelectedFiles([]);
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [catRes, accRes] = await Promise.all([
        getExpenseCategories(),
        getAllBankAccounts(),
      ]);
      setCategories(catRes?.data || []);
      const accounts = accRes?.data || [];
      setBankAccounts(accounts);
    } catch (error) {
      console.error("Error loading data:", error);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id || !formData.amount ) {
      toast.error(t("expenses.fillRequired"));
      return;
    }

    // Check if selected account has sufficient balance
    if (formData.account_id) {
      const selectedAccount = bankAccounts.find(
        (a) => String(a.id) === String(formData.account_id)
      );
      if (
        selectedAccount &&
        parseFloat(formData.amount) > parseFloat(selectedAccount.current_balance)
      ) {
        toast.error(
          isArabic
            ? `الرصيد غير كافٍ في الحساب المحدد. الرصيد المتاح: ${parseFloat(selectedAccount.current_balance).toLocaleString("ar")}`
            : `Insufficient balance in the selected account. Available balance: ${parseFloat(selectedAccount.current_balance).toLocaleString("en")}`
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        account_id: formData.account_id ? parseInt(formData.account_id) : null,
      });

      const expenseId = result?.data?.expense_id;

      // Upload and attach files if any were selected
      if (selectedFiles.length > 0 && expenseId) {
        try {
          const uploaded = await uploadFiles(selectedFiles, "expenses");
          await Promise.all(
            uploaded.map((f) =>
              addExpenseAttachment(expenseId, {
                file_name: f.document_name,
                file_path: f.document_url,
                file_type: f.document_name.split(".").pop(),
                file_size: null,
              })
            )
          );
        } catch (attachErr) {
          console.error("Failed to upload attachments:", attachErr);
          toast.warning(
            isArabic
              ? "تم إنشاء المصروف لكن فشل رفع بعض المرفقات"
              : "Expense created but some attachments failed to upload"
          );
        }
      }

      toast.success(t("expenses.createSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error(error.response?.data?.message || t("expenses.createError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("expenses.addExpense")}
      size="md"
    >
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
              {/* Show available balance for selected account */}
              {formData.account_id && (() => {
                const acc = bankAccounts.find((a) => String(a.id) === String(formData.account_id));
                if (!acc) return null;
                const insufficient =
                  formData.amount && parseFloat(formData.amount) > parseFloat(acc.current_balance);
                return (
                  <p className={`text-xs mt-1 ${insufficient ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                    {isArabic
                      ? `الرصيد المتاح: ${parseFloat(acc.current_balance).toLocaleString("ar")}`
                      : `Available balance: ${parseFloat(acc.current_balance).toLocaleString("en")}`}
                    {insufficient && (isArabic ? " — الرصيد غير كافٍ" : " — Insufficient balance")}
                  </p>
                );
              })()}
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
                
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                {isArabic ? "المرفقات (اختياري)" : "Attachments (optional)"}
              </Label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
                    <Paperclip className="h-4 w-4" />
                    {isArabic ? "اختر ملفات" : "Choose files"}
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </label>
                {selectedFiles.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {selectedFiles.length} {isArabic ? "ملف محدد" : "file(s) selected"}
                  </span>
                )}
              </div>
              {selectedFiles.length > 0 && (
                <div className="space-y-1 mt-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-muted text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {t("expenses.save")}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}
