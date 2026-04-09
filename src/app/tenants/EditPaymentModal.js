"use client";

import { useState, useEffect } from "react";
import { CustomModal, CustomModalBody, CustomModalHeader, CustomModalTitle, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { updateTenantPayment } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

const PAYMENT_METHODS = ["cash", "card", "bank_transfer", "online", "wallet", "cheque"];

export function EditPaymentModal({ isOpen, onClose, tenantId, payment, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    payment_method: "cash",
    reference_number: "",
    payment_date: "",
    notes: "",
  });

  useEffect(() => {
    if (payment) {
      setForm({
        amount: parseFloat(payment.amount || 0).toFixed(2),
        payment_method: payment.payment_method || "cash",
        reference_number: payment.reference_number || "",
        payment_date: payment.payment_date ? payment.payment_date.slice(0, 10) : "",
        notes: payment.notes || "",
      });
    }
  }, [payment]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error(t("tenants.paymentAmountRequired"));
      return;
    }

    setSaving(true);
    try {
      await updateTenantPayment(tenantId, payment.id, {
        amount: parseFloat(form.amount),
        payment_method: form.payment_method,
        reference_number: form.reference_number || null,
        payment_date: form.payment_date,
        notes: form.notes || null,
      });
      toast.success(t("tenants.paymentUpdateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("tenants.paymentUpdateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("tenants.editPayment")} — ${payment?.invoice_number || ""}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          <div className="space-y-4">
            {/* Amount + Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_pay_amount">{t("tenants.amount")} (AED)</Label>
                <Input
                  id="edit_pay_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={set("amount")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t("tenants.paymentMethod")}</Label>
                <Select value={form.payment_method} onValueChange={(v) => setForm((p) => ({ ...p, payment_method: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m} className="capitalize">
                        {m.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reference + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_pay_ref">{t("tenants.referenceNumber")}</Label>
                <Input
                  id="edit_pay_ref"
                  placeholder="TXN-..."
                  value={form.reference_number}
                  onChange={set("reference_number")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_pay_date">{t("tenants.paymentDate")}</Label>
                <Input
                  id="edit_pay_date"
                  type="date"
                  value={form.payment_date}
                  onChange={set("payment_date")}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="edit_pay_notes">{t("tenants.notes")}</Label>
              <Textarea
                id="edit_pay_notes"
                rows={2}
                placeholder={t("tenants.optionalNotes")}
                value={form.notes}
                onChange={set("notes")}
              />
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
