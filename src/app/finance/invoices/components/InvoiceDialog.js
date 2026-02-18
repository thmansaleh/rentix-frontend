"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomModal } from "@/components/ui/custom-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/hooks/useTranslations";
import {
  createInvoice,
  updateInvoice,
  getInvoiceById,
} from "@/app/services/api/invoices";
import { getBranches } from "@/app/services/api/branches";
import { getCustomers } from "@/app/services/api/customers";
import { getContractsByCustomerId } from "@/app/services/api/contracts";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import { TAX_RATE, DEFAULT_INVOICE_ITEM } from "../constants";

// ─── Helpers ────────────────────────────────────────────────
function buildValidationSchema(language) {
  return Yup.object({
    issue_date: Yup.string().required(
      language === "ar" ? "تاريخ الفاتورة مطلوب" : "Invoice date is required"
    ),
    branch_id: Yup.string().required(
      language === "ar" ? "الفرع مطلوب" : "Branch is required"
    ),
    contract_id: Yup.string().required(
      language === "ar" ? "العقد مطلوب" : "Contract is required"
    ),
  });
}

const INITIAL_VALUES = {
  issue_date: new Date().toISOString().split("T")[0],
  due_date: "",
  customer_id: "",
  branch_id: "",
  contract_id: "",
  tax_amount: 0,
  discount_amount: 0,
  status: "unpaid",
  notes: "",
};

// ─── Component ──────────────────────────────────────────────
export default function InvoiceDialog({
  open,
  onOpenChange,
  invoice,
  onSaved,
  language,
  isRTL,
  defaultContractId,
  defaultCustomerId,
  defaultBranchId,
}) {
  const isFromContract = !!defaultContractId && !!defaultCustomerId;
  const t = useTranslations("invoices");
  const isEdit = !!invoice;

  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([{ ...DEFAULT_INVOICE_ITEM }]);

  // ── Formik ──────────────────────────────────────────────
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: buildValidationSchema(language),
    onSubmit: async (values) => {
      const validItems = items.filter(
        (itm) => itm.description.trim() && parseFloat(itm.unit_price) > 0
      );
      if (validItems.length === 0) {
        toast.error(t("pleaseAddOneItem"));
        return;
      }

      setSaving(true);
      try {
        const payload = {
          ...values,
          customer_id: values.customer_id ? parseInt(values.customer_id) : null,
          branch_id: values.branch_id ? parseInt(values.branch_id) : null,
          contract_id: values.contract_id ? parseInt(values.contract_id) : null,
          tax_amount: parseFloat(values.tax_amount) || 0,
          discount_amount: parseFloat(values.discount_amount) || 0,
          items: validItems.map((itm) => ({
            description: itm.description,
            quantity: parseInt(itm.quantity) || 1,
            unit_price: parseFloat(itm.unit_price),
            item_type: itm.item_type || "service",
          })),
        };

        const result = isEdit
          ? await updateInvoice(invoice.invoice_id, payload)
          : await createInvoice(payload);

        if (result.success) {
          toast.success(isEdit ? t("updateSuccess") : t("createSuccess"));
          onSaved();
        } else {
          toast.error(
            result.message || (isEdit ? t("updateError") : t("createError"))
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            (isEdit ? t("updateError") : t("createError"))
        );
      } finally {
        setSaving(false);
      }
    },
  });

  // ── Load dropdown data ──────────────────────────────────
  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingData(true);
      try {
        const [branchRes, customerRes] = await Promise.all([
          getBranches(),
          getCustomers(),
        ]);
        setBranches(
          Array.isArray(branchRes)
            ? branchRes
            : branchRes?.data || branchRes?.branches || []
        );
        setCustomers(
          Array.isArray(customerRes)
            ? customerRes
            : customerRes?.data || customerRes?.customers || []
        );
      } catch (err) {
        console.error("Error loading form data:", err);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [open]);

  // ── Populate form when editing ──────────────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && invoice) {
      (async () => {
        try {
          const res = await getInvoiceById(invoice.invoice_id);
          if (res.success && res.data) {
            const d = res.data;
            formik.setValues({
              issue_date: d.issue_date
                ? new Date(d.issue_date).toISOString().split("T")[0]
                : "",
              due_date: d.due_date
                ? new Date(d.due_date).toISOString().split("T")[0]
                : "",
              customer_id: d.customer_id ? String(d.customer_id) : "",
              branch_id: d.branch_id ? String(d.branch_id) : "",
              contract_id: d.contract_id ? String(d.contract_id) : "",
              tax_amount: d.tax_amount || 0,
              discount_amount: d.discount_amount || 0,
              status: d.status || "unpaid",
              notes: d.notes || "",
            });
            if (d.items?.length > 0) {
              setItems(
                d.items.map((itm) => ({
                  description: itm.description || "",
                  quantity: itm.quantity || 1,
                  unit_price: itm.unit_price || 0,
                  item_type: itm.item_type || "service",
                }))
              );
            }
          }
        } catch (err) {
          console.error("Error loading invoice:", err);
        }
      })();
    } else {
      formik.resetForm();
      if (defaultContractId) {
        formik.setFieldValue("contract_id", String(defaultContractId));
      }
      if (defaultCustomerId) {
        formik.setFieldValue("customer_id", String(defaultCustomerId));
      }
      if (defaultBranchId) {
        formik.setFieldValue("branch_id", String(defaultBranchId));
      }
      setItems([{ ...DEFAULT_INVOICE_ITEM }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit]);

  // ── Load contracts when customer changes ────────────────
  useEffect(() => {
    const customerId = formik.values.customer_id;
    if (!customerId) {
      setContracts([]);
      return;
    }
    (async () => {
      setLoadingContracts(true);
      try {
        const res = await getContractsByCustomerId(customerId);
        setContracts(
          Array.isArray(res) ? res : res?.data || res?.contracts || []
        );
      } catch (err) {
        console.error("Error loading contracts:", err);
        setContracts([]);
      } finally {
        setLoadingContracts(false);
      }
    })();
  }, [formik.values.customer_id]);

  // ── Calculations ────────────────────────────────────────
  const subTotal = items.reduce(
    (s, itm) =>
      s + parseFloat(itm.unit_price || 0) * (parseInt(itm.quantity) || 1),
    0
  );
  const taxAmount = parseFloat((subTotal * TAX_RATE).toFixed(2));
  const discountAmount = parseFloat(formik.values.discount_amount) || 0;
  const grandTotal = subTotal + taxAmount - discountAmount;

  // Sync tax into formik
  useEffect(() => {
    formik.setFieldValue("tax_amount", taxAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxAmount]);

  // ── Render ──────────────────────────────────────────────
  return (
    <CustomModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={isEdit ? t("editInvoice") : t("addNewInvoice")}
      size="lg"
    >
      <div dir={isRTL ? "rtl" : "ltr"}>
        {loadingData ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ms-2">{t("loadingData")}</span>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label={t("invoiceDateRequired")}
                error={formik.touched.issue_date && formik.errors.issue_date}
              >
                <Input
                  type="date"
                  name="issue_date"
                  value={formik.values.issue_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </FormField>
              <FormField
                label={language === "ar" ? "تاريخ الاستحقاق" : "Due Date"}
              >
                <Input
                  type="date"
                  name="due_date"
                  value={formik.values.due_date}
                  onChange={formik.handleChange}
                />
              </FormField>
            </div>

            {/* Customer & Branch — hidden when opened from contract context */}
            {!isFromContract && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label={t("client")}>
                  <Select
                    value={formik.values.customer_id}
                    onValueChange={(v) => {
                      formik.setFieldValue("customer_id", v);
                      formik.setFieldValue("contract_id", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectClient")} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField
                  label={t("branchRequired")}
                  error={formik.touched.branch_id && formik.errors.branch_id}
                >
                  <Select
                    value={formik.values.branch_id}
                    onValueChange={(v) => formik.setFieldValue("branch_id", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBranch")} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {isRTL ? b.name_ar : b.name_en || b.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            )}

            {/* Contract — hidden when opened from contract context */}
            {!isFromContract && formik.values.customer_id && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label={t("contractRequired")}
                  error={
                    formik.touched.contract_id && formik.errors.contract_id
                  }
                >
                  {loadingContracts ? (
                    <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === "ar"
                        ? "جاري تحميل العقود..."
                        : "Loading contracts..."}
                    </div>
                  ) : (
                    <Select
                      value={formik.values.contract_id}
                      onValueChange={(v) =>
                        formik.setFieldValue("contract_id", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectContract")} />
                      </SelectTrigger>
                      <SelectContent>
                        {contracts.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.contract_number}
                            {c.car_details ? ` - ${c.car_details}` : ""}
                            {c.start_date
                              ? ` (${new Date(c.start_date).toLocaleDateString()})`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
              </div>
            )}

            {/* Discount & Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                label={
                  language === "ar" ? "الخصم (مبلغ)" : "Discount Amount"
                }
              >
                <Input
                  type="number"
                  name="discount_amount"
                  step="0.01"
                  min="0"
                  value={formik.values.discount_amount}
                  onChange={formik.handleChange}
                />
              </FormField>
              <FormField label={t("status")}>
                <Select
                  value={formik.values.status}
                  onValueChange={(v) => formik.setFieldValue("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">
                      {language === "ar" ? "غير مدفوعة" : "Unpaid"}
                    </SelectItem>
                    <SelectItem value="partial">
                      {language === "ar" ? "مدفوعة جزئياً" : "Partial"}
                    </SelectItem>
                    <SelectItem value="paid">{t("statusPaid")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Notes */}
            <FormField label={language === "ar" ? "ملاحظات" : "Notes"}>
              <Textarea
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                rows={2}
                placeholder={
                  language === "ar"
                    ? "ملاحظات إضافية..."
                    : "Additional notes..."
                }
              />
            </FormField>

            {/* Items */}
            <InvoiceItemsTable
              items={items}
              onItemsChange={setItems}
              language={language}
              t={t}
            />

            {/* Totals */}
            <InvoiceTotals
              subTotal={subTotal}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              grandTotal={grandTotal}
              language={language}
              t={t}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {saving
                  ? t("saving")
                  : isEdit
                  ? t("saveChanges")
                  : t("saveInvoice")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </CustomModal>
  );
}

// ─── Private sub-component ──────────────────────────────────
function FormField({ label, error, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
