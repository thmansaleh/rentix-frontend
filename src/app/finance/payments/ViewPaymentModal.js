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
import { useLanguage } from "@/contexts/LanguageContext";

const CHEQUE_PREFIX = "[CHEQUE]";

function decodeChequeNotes(rawNotes) {
  if (!rawNotes || !rawNotes.startsWith(CHEQUE_PREFIX)) {
    return null;
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
    bankName: parts.bank || "",
    chequeDate: parts.date || "",
    chequeNumber: parts.number || "",
    notes: rest,
  };
}

const InfoRow = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="text-sm font-medium">{value}</div>
  </div>
);

/**
 * Modal displaying read-only details of a single payment.
 * Fetches all data (payment + invoice details + company settings) internally.
 * Only requires: paymentId, isOpen/open, onClose.
 */
export default function ViewPaymentModal({
  onClose,
  open,
  isOpen,
  paymentId,
}) {
  const modalOpen = open ?? isOpen ?? false;
  const { language } = useLanguage();
  const lang = language || "en";
  const isRTL = lang === "ar";

  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modalOpen && paymentId) {
      loadPayment();
    }
  }, [modalOpen, paymentId]);

  useEffect(() => {
    if (!modalOpen) {
      setPayment(null);
    }
  }, [modalOpen]);

  const loadPayment = async () => {
    setIsLoading(true);
    try {
      const res = await getPaymentById(paymentId);
      setPayment(res?.data || null);
    } catch (error) {
      console.error("Error loading payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    printPaymentReceipt(payment.id);
  };

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
                {(payment.account_bank_name || payment.account_name) && (
                  <InfoRow
                    label={lang === "ar" ? "الحساب البنكي" : "Bank Account"}
                    value={
                      payment.account_bank_name
                        ? `${payment.account_bank_name} - ${payment.account_name || ""}`
                        : payment.account_name || "-"
                    }
                  />
                )}
                {payment.account_number && (
                  <InfoRow
                    label={lang === "ar" ? "رقم الحساب" : "Account Number"}
                    value={payment.account_number}
                  />
                )}
                {payment.created_at && (
                  <InfoRow
                    label={lang === "ar" ? "تاريخ الإنشاء" : "Created At"}
                    value={formatDateLocale(payment.created_at, lang)}
                  />
                )}
              </div>
              {payment.notes && (() => {
                const cheque = decodeChequeNotes(payment.notes);
                if (cheque) {
                  return (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border rounded-md p-3">
                        <InfoRow
                          label={lang === "ar" ? "اسم البنك (شيك)" : "Bank Name (Cheque)"}
                          value={cheque.bankName || "-"}
                        />
                        <InfoRow
                          label={lang === "ar" ? "رقم الشيك" : "Cheque Number"}
                          value={cheque.chequeNumber || "-"}
                        />
                        <InfoRow
                          label={lang === "ar" ? "تاريخ الشيك" : "Cheque Date"}
                          value={cheque.chequeDate || "-"}
                        />
                      </div>
                      {cheque.notes && (
                        <div className="rounded-md border p-3 text-sm">
                          <span className="font-medium">
                            {lang === "ar" ? "ملاحظات: " : "Notes: "}
                          </span>
                          {cheque.notes}
                        </div>
                      )}
                    </>
                  );
                }
                return (
                  <div className="rounded-md border p-3 text-sm">
                    <span className="font-medium">
                      {lang === "ar" ? "ملاحظات: " : "Notes: "}
                    </span>
                    {payment.notes}
                  </div>
                );
              })()}
            </div>
          </CustomModalBody>

          <CustomModalFooter>
            <Button type="button" variant="default" onClick={handlePrint}>
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

