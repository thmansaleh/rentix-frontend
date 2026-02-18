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

const PAYMENT_METHODS = [
  { value: "cash", labelAr: "نقداً", labelEn: "Cash" },
  { value: "card", labelAr: "بطاقة", labelEn: "Card" },
  { value: "bank_transfer", labelAr: "تحويل بنكي", labelEn: "Bank Transfer" },
  { value: "online", labelAr: "أونلاين", labelEn: "Online" },
  { value: "wallet", labelAr: "محفظة", labelEn: "Wallet" },
];

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
  });

  const initialValues = {
    amount: payment?.amount || "",
    payment_method: payment?.payment_method || "cash",
    reference_number: payment?.reference_number || "",
    payment_date: payment?.payment_date
      ? new Date(payment.payment_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    notes: payment?.notes || "",
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        amount: parseFloat(values.amount),
        invoice_id: invoiceId,
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
          {({ errors, touched, setFieldValue, values }) => (
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
                  onValueChange={(v) => setFieldValue("payment_method", v)}
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
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
