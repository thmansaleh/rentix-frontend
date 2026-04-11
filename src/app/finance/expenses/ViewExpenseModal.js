"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, DollarSign, Building2, User, CreditCard, FileText, Tag, Landmark, Paperclip, Trash2, ExternalLink, File } from "lucide-react";
import { getExpenseById, getExpenseAttachments, deleteExpenseAttachment } from "../../services/api/expenses";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "react-toastify";
import api from "../../services/api/axiosInstance";

export function ViewExpenseModal({ isOpen, onClose, expenseId }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen && expenseId) {
      loadExpense();
      loadAttachments();
    } else {
      setAttachments([]);
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

  const loadAttachments = async () => {
    try {
      const res = await getExpenseAttachments(expenseId);
      setAttachments(res?.data || []);
    } catch (error) {
      console.error("Error loading attachments:", error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    setDeletingId(attachmentId);
    try {
      await deleteExpenseAttachment(attachmentId);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      toast.success(isArabic ? "تم حذف المرفق بنجاح" : "Attachment deleted successfully");
    } catch (error) {
      toast.error(isArabic ? "فشل حذف المرفق" : "Failed to delete attachment");
    } finally {
      setDeletingId(null);
    }
  };

  const getFileUrl = async (filePath) => {
    try {
      const res = await api.post("/upload/presigned-url", { key: filePath });
      return res.data?.url || null;
    } catch {
      return null;
    }
  };

  const handleOpenFile = async (filePath) => {
    const url = await getFileUrl(filePath);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.error(isArabic ? "تعذر فتح الملف" : "Could not open file");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
                icon={Landmark}
                label={isArabic ? "الحساب " : " Account"}
                value={
                  expense.payment_method==='cash'
                    ? `${expense.account_name || t("expenses.cash")}`
                    : "-"
                }
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

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">
                    {isArabic ? "المرفقات" : "Attachments"}
                    <span className="ml-1 text-muted-foreground">({attachments.length})</span>
                  </p>
                </div>
                <div className="space-y-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800/50 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate font-medium">{att.file_name}</span>
                        {att.file_size && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatFileSize(att.file_size)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleOpenFile(att.file_path)}
                          title={isArabic ? "فتح الملف" : "Open file"}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAttachment(att.id)}
                          disabled={deletingId === att.id}
                          title={isArabic ? "حذف المرفق" : "Delete attachment"}
                        >
                          {deletingId === att.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
