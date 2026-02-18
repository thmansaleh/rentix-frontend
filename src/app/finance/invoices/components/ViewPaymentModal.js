"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/ui/custom-modal";
import InfoRow from "./InfoRow";
import { formatAmount, formatDateLocale } from "../utils/formatters";
import { getPaymentMethodLabel } from "../utils/helpers";
import { printPaymentReceipt } from "../utils/printPaymentReceipt";

/**
 * Modal displaying read-only details of a single payment.
 */
export default function ViewPaymentModal({
  open,
  onClose,
  payment,
  invoice,
  language,
  isRTL,
  companySettings,
}) {
  if (!payment) return null;

  return (
    <CustomModal
      isOpen={open}
      onClose={onClose}
      title={language === "ar" ? "تفاصيل الدفعة" : "Payment Details"}
      size="sm"
    >
      <div dir={isRTL ? "rtl" : "ltr"} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow
            label={language === "ar" ? "المبلغ" : "Amount"}
            value={formatAmount(payment.amount, language)}
          />
          <InfoRow
            label={language === "ar" ? "طريقة الدفع" : "Payment Method"}
            value={getPaymentMethodLabel(payment.payment_method, language)}
          />
          <InfoRow
            label={language === "ar" ? "تاريخ الدفع" : "Payment Date"}
            value={formatDateLocale(payment.payment_date, language)}
          />
          <InfoRow
            label={language === "ar" ? "رقم المرجع" : "Reference #"}
            value={payment.reference_number || "-"}
          />
          <InfoRow
            label={language === "ar" ? "بواسطة" : "Created By"}
            value={payment.created_by_name || "-"}
          />
          {payment.created_at && (
            <InfoRow
              label={language === "ar" ? "تاريخ الإنشاء" : "Created At"}
              value={formatDateLocale(payment.created_at, language)}
            />
          )}
        </div>
        {payment.notes && (
          <div className="rounded-md border p-3 text-sm">
            <span className="font-medium">
              {language === "ar" ? "ملاحظات: " : "Notes: "}
            </span>
            {payment.notes}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="default"
            onClick={() => printPaymentReceipt(payment, invoice, { companySettings })}
          >
            <Printer className="me-2 h-4 w-4" />
            {language === "ar" ? "طباعة إيصال" : "Print Receipt"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            {language === "ar" ? "إغلاق" : "Close"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
