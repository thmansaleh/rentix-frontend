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
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { createTenantPayment } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

const PAYMENT_METHODS = ["cash", "card", "bank_transfer", "online", "wallet", "cheque"];

export function AddPaymentModal({ isOpen, onClose, tenantId, invoices, onSuccess }) {
  const { t } = useTranslations();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    invoice_id: "",
    amount: "",
    payment_method: "cash",
    reference_number: "",
    payment_date: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      // Pre-select first unpaid invoice
      const unpaid = invoices?.find((inv) => inv.status !== "paid" && inv.status !== "void");
      setForm({
        invoice_id: unpaid ? String(unpaid.id) : "",
        amount: unpaid ? (parseFloat(unpaid.total_amount) - (parseFloat(unpaid.paid_amount) || 0)).toFixed(2) : "",
        payment_method: "cash",
        reference_number: "",
        payment_date: new Date().toISOString().slice(0, 10),
        notes: "",
      });
    }
  }, [isOpen, invoices]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleInvoiceChange = (invoiceId) => {
    const inv = invoices?.find((i) => String(i.id) === invoiceId);
    setForm((prev) => ({
      ...prev,
      invoice_id: invoiceId,
      amount: inv ? parseFloat(inv.total_amount || 0).toFixed(2) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.invoice_id) {
      toast.error(t("tenants.paymentInvoiceRequired"));
      return;
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error(t("tenants.paymentAmountRequired"));
      return;
    }

    setSaving(true);
    try {
      await createTenantPayment(tenantId, {
        invoice_id: Number(form.invoice_id),
        amount: parseFloat(form.amount),
        payment_method: form.payment_method,
        reference_number: form.reference_number || null,
        payment_date: form.payment_date,
        notes: form.notes || null,
      });
      toast.success(t("tenants.paymentCreateSuccess"));
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || t("tenants.paymentCreateError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("tenants.addPayment")} size="md">
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          <div className="space-y-4">
            {/* Invoice */}
            <div className="space-y-2">
              <Label>{t("tenants.invoiceNumber")}</Label>
              <Select value={form.invoice_id} onValueChange={handleInvoiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("tenants.selectInvoice")} />
                </SelectTrigger>
                <SelectContent>
                  {invoices?.map((inv) => (
                    <SelectItem key={inv.id} value={String(inv.id)}>
                      {inv.invoice_number} — {parseFloat(inv.total_amount).toFixed(2)} AED ({inv.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount + Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pay_amount">{t("tenants.amount")} (AED)</Label>
                <Input
                  id="pay_amount"
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
                <Label htmlFor="pay_ref">{t("tenants.referenceNumber")}</Label>
                <Input
                  id="pay_ref"
                  placeholder="TXN-..."
                  value={form.reference_number}
                  onChange={set("reference_number")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay_date">{t("tenants.paymentDate")}</Label>
                <Input
                  id="pay_date"
                  type="date"
                  value={form.payment_date}
                  onChange={set("payment_date")}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="pay_notes">{t("tenants.notes")}</Label>
              <Textarea
                id="pay_notes"
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
                <CreditCard className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                {t("tenants.addPayment")}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}
