"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/hooks/useTranslations";
import {
  createPayment,
  updatePayment,
} from "@/app/services/api/payments";
import { getAllBankAccounts } from "@/app/services/api/bankAccounts";
import useSWR from "swr";

const PAYMENT_METHODS = [
  { value: "cash", labelAr: "نقداً", labelEn: "Cash" },
  { value: "card", labelAr: "بطاقة", labelEn: "Card" },
  { value: "bank_transfer", labelAr: "تحويل بنكي", labelEn: "Bank Transfer" },
  { value: "cheque", labelAr: "شيك", labelEn: "Cheque" },
];

// Prefix used to embed cheque details inside the notes field
const CHEQUE_PREFIX = "[CHEQUE]";

/**
 * Encode cheque details into a string prepended to notes.
 * Format: [CHEQUE] bank:<name>|date:<date>|number:<num>\n<rest of notes>
 */
function encodeChequeNotes(chequeBankName, chequeDate, chequeNumber, notes) {
  const chequeStr = `${CHEQUE_PREFIX} bank:${chequeBankName}|date:${chequeDate}|number:${chequeNumber}`;
  return notes ? `${chequeStr}\n${notes}` : chequeStr;
}

/**
 * Parse cheque details out of a notes string.
 * Returns { chequeBankName, chequeDate, chequeNumber, notes }
 */
function decodeChequeNotes(rawNotes) {
  if (!rawNotes || !rawNotes.startsWith(CHEQUE_PREFIX)) {
    return { chequeBankName: "", chequeDate: "", chequeNumber: "", notes: rawNotes || "" };
  }
  const lines = rawNotes.split("\n");
  const chequeStr = lines[0].replace(CHEQUE_PREFIX, "").trim();
  const rest = lines.slice(1).join("\n");
  const parts = Object.fromEntries(
    chequeStr.split("|").map((p) => {
      const idx = p.indexOf(":");
      return [p.slice(0, idx).trim(), p.slice(idx + 1).trim()];
    })
  );
  return {
    chequeBankName: parts.bank || "",
    chequeDate: parts.date || "",
    chequeNumber: parts.number || "",
    notes: rest,
  };
}

export default function PaymentDialog({
  open,
  onOpenChange,
  invoiceId,
  payment,
  onSaved,
  language,
  isRTL,
}) {
  const t = useTranslations("contracts.payments");
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!payment;

  // Fetch bank accounts for dropdown
  const { data: accountsData } = useSWR(
    open ? "bank-accounts-list" : null,
    getAllBankAccounts,
    { revalidateOnFocus: false }
  );
  const bankAccounts = accountsData?.data || [];

  // Determine which account to auto-select based on payment method
  const getDefaultAccountId = (method) => {
    const matching = bankAccounts.filter(
      (a) =>
        a.status === "active" &&
        (method === "cash" ? a.account_type === "cash" : a.account_type !== "cash")
    );
    return matching.length > 0 ? String(matching[0].id) : "";
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .min(0.01, language === "ar" ? "المبلغ مطلوب" : "Amount must be greater than 0")
      .required(language === "ar" ? "المبلغ مطلوب" : "Amount is required"),
    payment_method: Yup.string().required(
      language === "ar" ? "طريقة الدفع مطلوبة" : "Payment method is required"
    ),
    payment_date: Yup.string().required(
      language === "ar" ? "التاريخ مطلوب" : "Date is required"
    ),
    account_id: Yup.string().required(
      language === "ar" ? "الحساب البنكي مطلوب" : "Bank account is required"
    ),
  });

  // Decode cheque details from notes if editing a cheque payment
  const decoded = decodeChequeNotes(payment?.notes || "");

  const initialValues = {
    amount: payment?.amount || "",
    payment_method: payment?.payment_method || "cash",
    reference_number: payment?.reference_number || "",
    payment_date: payment?.payment_date
      ? new Date(payment.payment_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    notes: payment?.payment_method === "cheque" ? decoded.notes : (payment?.notes || ""),
    account_id: payment?.account_id
      ? String(payment.account_id)
      : getDefaultAccountId(payment?.payment_method || "cash"),
    // Cheque-specific fields
    chequeBankName: payment?.payment_method === "cheque" ? decoded.chequeBankName : "",
    chequeDate: payment?.payment_method === "cheque" ? decoded.chequeDate : "",
    chequeNumber: payment?.payment_method === "cheque" ? decoded.chequeNumber : "",
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Embed cheque details into notes when payment method is cheque
      const finalNotes =
        values.payment_method === "cheque"
          ? encodeChequeNotes(
              values.chequeBankName,
              values.chequeDate,
              values.chequeNumber,
              values.notes
            )
          : values.notes;

      const payload = {
        ...values,
        amount: parseFloat(values.amount),
        invoice_id: invoiceId,
        account_id: values.account_id ? parseInt(values.account_id) : null,
        notes: finalNotes,
      };

      let result;
      if (isEditing) {
        result = await updatePayment(payment.id, payload);
      } else {
        result = await createPayment(payload);
      }

      if (result.success) {
        toast.success(
          isEditing ? t("updateSuccess") : t("createSuccess")
        );
        onSaved?.();
      } else {
        toast.error(result.message || (isEditing ? t("updateError") : t("createError")));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || (isEditing ? t("updateError") : t("createError")));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editPayment") : t("addPayment")}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => {
            // Filter accounts: cash method → cash accounts, others → bank accounts
            const filteredAccounts = bankAccounts.filter(
              (a) =>
                a.status === "active" &&
                (values.payment_method === "cash"
                  ? a.account_type === "cash"
                  : a.account_type !== "cash")
            );

            // Auto-select first account when method changes
            const autoSelectAccount = (method) => {
              const matching = bankAccounts.filter(
                (a) =>
                  a.status === "active" &&
                  (method === "cash"
                    ? a.account_type === "cash"
                    : a.account_type !== "cash")
              );
              if (matching.length > 0) {
                setFieldValue("account_id", String(matching[0].id));
              } else {
                setFieldValue("account_id", "");
              }
            };

            return (
            <Form className="space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">{t("amount")} *</Label>
                <Field
                  as={Input}
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                {errors.amount && touched.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>{t("method")} *</Label>
                <Select
                  value={values.payment_method}
                  onValueChange={(v) => {
                    setFieldValue("payment_method", v);
                    autoSelectAccount(v);
                    // Clear cheque fields when switching away from cheque
                    if (v !== "cheque") {
                      setFieldValue("chequeBankName", "");
                      setFieldValue("chequeDate", "");
                      setFieldValue("chequeNumber", "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {language === "ar" ? m.labelAr : m.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.payment_method && touched.payment_method && (
                  <p className="text-sm text-destructive">
                    {errors.payment_method}
                  </p>
                )}
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <Label htmlFor="payment_date">{t("date")} *</Label>
                <Field
                  as={Input}
                  id="payment_date"
                  name="payment_date"
                  type="date"
                />
                {errors.payment_date && touched.payment_date && (
                  <p className="text-sm text-destructive">
                    {errors.payment_date}
                  </p>
                )}
              </div>

              {/* Reference Number */}
              <div className="space-y-2">
                <Label htmlFor="reference_number">{t("reference")}</Label>
                <Field
                  as={Input}
                  id="reference_number"
                  name="reference_number"
                  placeholder={
                    language === "ar" ? "رقم المرجع" : "Reference number"
                  }
                />
              </div>

              {/* Bank Account */}
              <div className="space-y-2">
                <Label>
                  {language === "ar" ? "الحساب البنكي" : "Bank Account"} *
                </Label>
                <Select
                  value={values.account_id}
                  onValueChange={(v) => setFieldValue("account_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        language === "ar"
                          ? "اختر حساب بنكي"
                          : "Select bank account"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={String(account.id)}
                        >
                          {account.bank_name} - {account.account_name} ({account.account_number})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.account_id && touched.account_id && (
                  <p className="text-sm text-destructive">
                    {errors.account_id}
                  </p>
                )}
              </div>

              {/* Cheque Details (shown only when payment method is cheque) */}
              {values.payment_method === "cheque" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="chequeBankName">
                      {t("cheque.bankName") || (language === "ar" ? "اسم البنك" : "Bank Name")} *
                    </Label>
                    <Field
                      as={Input}
                      id="chequeBankName"
                      name="chequeBankName"
                      placeholder={language === "ar" ? "اسم البنك" : "Bank name"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chequeDate">
                      {t("cheque.chequeDate") || (language === "ar" ? "تاريخ الشيك" : "Cheque Date")} *
                    </Label>
                    <Field
                      as={Input}
                      id="chequeDate"
                      name="chequeDate"
                      type="date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chequeNumber">
                      {t("cheque.chequeNumber") || (language === "ar" ? "رقم الشيك" : "Cheque Number")} *
                    </Label>
                    <Field
                      as={Input}
                      id="chequeNumber"
                      name="chequeNumber"
                      placeholder={language === "ar" ? "رقم الشيك" : "Cheque number"}
                    />
                  </div>
                </>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  {language === "ar" ? "ملاحظات" : "Notes"}
                </Label>
                <Field
                  as={Textarea}
                  id="notes"
                  name="notes"
                  rows={2}
                  placeholder={
                    language === "ar" ? "ملاحظات..." : "Notes..."
                  }
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing
                    ? t("updatePayment") || (language === "ar" ? "تحديث" : "Update")
                    : t("addPayment")}
                </Button>
              </DialogFooter>
            </Form>
          );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
