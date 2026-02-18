"use client";

import React, { useState, useEffect } from "react";
import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
} from "@/components/ui/custom-modal";
import { formatAmount, formatDateLocale } from "../invoices/utils/formatters";
import { getPaymentMethodLabel } from "../invoices/utils/helpers";
import { printPaymentReceipt } from "./printPaymentReceipt";
import { getPaymentById } from "../../services/api/payments";

const InfoRow = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

/**
 * Modal displaying read-only details of a single payment.
 *
 * Supports two modes:
 *  1) Invoice context: pass `payment` object + `invoice` + `language` etc.
 *  2) Payments page:   pass `paymentId` + `isOpen`/`onClose` (will fetch data).
 */
export default function ViewPaymentModal({
  // Common
  onClose,
  language,
  isRTL,
  companySettings,
  // Mode 1 — invoice context (payment object passed directly)
  open,
  payment: paymentProp,
  invoice,
  // Mode 2 — payments page (fetch by ID)
  isOpen,
  paymentId,
}) {
  const modalOpen = open ?? isOpen ?? false;
  const lang = language || "en";

  const [fetchedPayment, setFetchedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modalOpen && paymentId && !paymentProp) {
      loadPayment();
    }
  }, [modalOpen, paymentId]);

  useEffect(() => {
    if (!modalOpen) {
      setFetchedPayment(null);
    }
  }, [modalOpen]);

  const loadPayment = async () => {
    setIsLoading(true);
    try {
      const res = await getPaymentById(paymentId);
      setFetchedPayment(res?.data || null);
    } catch (error) {
      console.error("Error loading payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const payment = paymentProp || fetchedPayment;

  return (
    <CustomModal
      isOpen={modalOpen}
      onClose={onClose}
      title={lang === "ar" ? "تفاصيل الدفعة" : "Payment Details"}
      size="sm"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !payment ? (
        <div className="text-center py-8 text-muted-foreground">
          {lang === "ar" ? "لا توجد بيانات" : "No data found"}
        </div>
      ) : (
        <>
          <CustomModalBody>
            <div dir={isRTL ? "rtl" : "ltr"} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow
                  label={lang === "ar" ? "المبلغ" : "Amount"}
                  value={`${formatAmount(payment.amount, lang)} AED`}
                />
                <InfoRow
                  label={lang === "ar" ? "طريقة الدفع" : "Payment Method"}
                  value={getPaymentMethodLabel(payment.payment_method, lang)}
                />
                <InfoRow
                  label={lang === "ar" ? "تاريخ الدفع" : "Payment Date"}
                  value={formatDateLocale(payment.payment_date, lang)}
                />
                <InfoRow
                  label={lang === "ar" ? "رقم المرجع" : "Reference #"}
                  value={payment.reference_number || "-"}
                />
                {(payment.invoice_number || payment.invoice_id) && (
                  <InfoRow
                    label={lang === "ar" ? "رقم الفاتورة" : "Invoice #"}
                    value={payment.invoice_number || payment.invoice_id}
                  />
                )}
                {(payment.branch_name_en || payment.branch_name_ar) && (
                  <InfoRow
                    label={lang === "ar" ? "الفرع" : "Branch"}
                    value={
                      lang === "ar"
                        ? payment.branch_name_ar
                        : payment.branch_name_en
                    }
                  />
                )}
                <InfoRow
                  label={lang === "ar" ? "بواسطة" : "Created By"}
                  value={payment.created_by_name || "-"}
                />
                {payment.created_at && (
                  <InfoRow
                    label={lang === "ar" ? "تاريخ الإنشاء" : "Created At"}
                    value={formatDateLocale(payment.created_at, lang)}
                  />
                )}
              </div>
              {payment.notes && (
                <div className="rounded-md border p-3 text-sm">
                  <span className="font-medium">
                    {lang === "ar" ? "ملاحظات: " : "Notes: "}
                  </span>
                  {payment.notes}
                </div>
              )}
            </div>
          </CustomModalBody>

          <CustomModalFooter>
            <Button
              type="button"
              variant="default"
              onClick={() =>
                printPaymentReceipt(payment, invoice || {}, { companySettings })
              }
            >
              <Printer className="me-2 h-4 w-4" />
              {lang === "ar" ? "طباعة إيصال" : "Print Receipt"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {lang === "ar" ? "إغلاق" : "Close"}
            </Button>
          </CustomModalFooter>
        </>
      )}
    </CustomModal>
  );
}
