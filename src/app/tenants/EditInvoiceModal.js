"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalHeader, CustomModalTitle, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { updateTenantInvoice } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

export function EditInvoiceModal({ isOpen, onClose, tenantId, invoice, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    tax_amount: "",
    total_amount: "",
    issue_date: "",
    due_date: "",
    status: "unpaid",
  });

  useEffect(() => {
    if (invoice) {
      setForm({
        amount: parseFloat(invoice.amount || 0).toFixed(2),
        tax_amount: parseFloat(invoice.tax_amount || 0).toFixed(2),
        total_amount: parseFloat(invoice.total_amount || 0).toFixed(2),
        issue_date: invoice.issue_date ? invoice.issue_date.slice(0, 10) : "",
        due_date: invoice.due_date ? invoice.due_date.slice(0, 10) : "",
        status: invoice.status || "unpaid",
      });
    }
  }, [invoice]);

  // Auto-calc total when amount or tax changes
  useEffect(() => {
    const amt = parseFloat(form.amount) || 0;
    const tax = parseFloat(form.tax_amount) || 0;
    setForm((prev) => ({ ...prev, total_amount: (amt + tax).toFixed(2) }));
  }, [form.amount, form.tax_amount]);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error(t("tenants.invoiceAmountRequired"));
      return;
    }
    if (!form.issue_date || !form.due_date) {
      toast.error(t("tenants.datesRequired"));
      return;
    }

    setSaving(true);
    try {
      await updateTenantInvoice(tenantId, invoice.id, {
        amount: parseFloat(form.amount),
        tax_amount: parseFloat(form.tax_amount) || 0,
        total_amount: parseFloat(form.total_amount),
        issue_date: form.issue_date,
        due_date: form.due_date,
        status: form.status,
      });
      toast.success(t("tenants.invoiceUpdateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("tenants.invoiceUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("tenants.editInvoice")} — ${invoice?.invoice_number || ""}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          <div className="space-y-4">
            {/* Amount + Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_amount">{t("tenants.amount")} (AED)</Label>
                <Input
                  id="edit_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={set("amount")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_tax">{t("tenants.tax")} (AED)</Label>
                <Input
                  id="edit_tax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.tax_amount}
                  onChange={set("tax_amount")}
                />
              </div>
            </div>

            {/* Total (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="edit_total">{t("tenants.total")} (AED)</Label>
              <Input
                id="edit_total"
                type="number"
                value={form.total_amount}
                readOnly
                className="bg-muted/50 font-semibold"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_issue_date">{t("tenants.issueDate")}</Label>
                <Input
                  id="edit_issue_date"
                  type="date"
                  value={form.issue_date}
                  onChange={set("issue_date")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_due_date">{t("tenants.dueDate")}</Label>
                <Input
                  id="edit_due_date"
                  type="date"
                  value={form.due_date}
                  onChange={set("due_date")}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>{t("tenants.status")}</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">{t("tenants.invoiceStatusUnpaid")}</SelectItem>
                  <SelectItem value="paid">{t("tenants.invoiceStatusPaid")}</SelectItem>
                  <SelectItem value="overdue">{t("tenants.invoiceStatusOverdue")}</SelectItem>
                  <SelectItem value="void">{t("tenants.invoiceStatusVoid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CustomModalBody>

        <CustomModalFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            {t("tenants.cancel")}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ltr:mr-2 rtl:ml-2" />
                {t("tenants.saving")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                {t("tenants.save")}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}
