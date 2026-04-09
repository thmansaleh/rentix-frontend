"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalHeader, CustomModalTitle, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Receipt } from "lucide-react";
import { toast } from "react-toastify";
import { createTenantInvoice } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

export function AddInvoiceModal({ isOpen, onClose, tenantId, subscriptions, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    subscription_id: "",
    amount: "",
    tax_amount: "",
    total_amount: "",
    issue_date: "",
    due_date: "",
  });

  // Pre-fill defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().slice(0, 10);
      const due = new Date();
      due.setDate(due.getDate() + 30);

      // Pre-select the active subscription
      const active = subscriptions?.find((s) =>
        ["trial", "active", "past_due"].includes(s.status)
      );

      setForm({
        subscription_id: active ? String(active.id) : "",
        amount: active
          ? (active.billing_cycle === "monthly" ? active.monthly_price : active.annual_price) || ""
          : "",
        tax_amount: "",
        total_amount: "",
        issue_date: today,
        due_date: due.toISOString().slice(0, 10),
      });
    }
  }, [isOpen, subscriptions]);

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

    if (!form.subscription_id) {
      toast.error(t("tenants.invoiceSubscriptionRequired"));
      return;
    }
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
      await createTenantInvoice(tenantId, {
        subscription_id: Number(form.subscription_id),
        amount: parseFloat(form.amount),
        tax_amount: parseFloat(form.tax_amount) || 0,
        total_amount: parseFloat(form.total_amount),
        issue_date: form.issue_date,
        due_date: form.due_date,
      });
      toast.success(t("tenants.invoiceCreateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("tenants.invoiceCreateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("tenants.addInvoice")}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          <div className="space-y-4">
            {/* Subscription */}
            <div className="space-y-2">
              <Label>{t("tenants.subscription")}</Label>
              <Select
                value={form.subscription_id}
                onValueChange={(v) => setForm((prev) => ({ ...prev, subscription_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("tenants.selectSubscription")} />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions?.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.plan_name_en} — {s.billing_cycle} ({s.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount + Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t("tenants.amount")} (AED)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={set("amount")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_amount">{t("tenants.tax")} (AED)</Label>
                <Input
                  id="tax_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.tax_amount}
                  onChange={set("tax_amount")}
                />
              </div>
            </div>

            {/* Total (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="total_amount">{t("tenants.total")} (AED)</Label>
              <Input
                id="total_amount"
                type="number"
                value={form.total_amount}
                readOnly
                className="bg-muted/50 font-semibold"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">{t("tenants.issueDate")}</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={form.issue_date}
                  onChange={set("issue_date")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">{t("tenants.dueDate")}</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={set("due_date")}
                  required
                />
              </div>
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
                <Receipt className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                {t("tenants.addInvoice")}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}
