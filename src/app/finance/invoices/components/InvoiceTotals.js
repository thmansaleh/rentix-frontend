"use client";

import React from "react";
import { formatAmount } from "../utils/formatters";

/**
 * Displays a summary of invoice totals (subtotal, tax, discount, grand total, paid, due).
 * Used in both InvoiceDialog (create/edit) and InvoiceDetailDialog (read-only).
 *
 * @param {object} props
 * @param {number} props.subTotal
 * @param {number} props.taxAmount
 * @param {number} [props.discountAmount]
 * @param {number} props.grandTotal
 * @param {number} [props.paidAmount] – only shown in detail view
 * @param {number} [props.dueAmount]  – only shown in detail view
 * @param {string} props.language
 * @param {Function} props.t – translation function
 */
export default function InvoiceTotals({
  subTotal,
  taxAmount,
  discountAmount,
  grandTotal,
  paidAmount,
  dueAmount,
  language,
  t,
}) {
  return (
    <div className="flex justify-end">
      <div className="w-full max-w-xs space-y-1 text-sm">
        <div className="flex justify-between">
          <span>{t("subtotal")}</span>
          <span className="font-medium">
            {formatAmount(subTotal, language)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{language === "ar" ? "الضريبة (5%):" : "Tax (5%):"}</span>
          <span>{formatAmount(taxAmount, language)}</span>
        </div>
        {discountAmount != null && (
          <div className="flex justify-between">
            <span>{language === "ar" ? "الخصم:" : "Discount:"}</span>
            <span>-{formatAmount(discountAmount, language)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2 text-base font-bold">
          <span>{paidAmount != null ? t("totalAmount") : t("total")}</span>
          <span>{formatAmount(grandTotal, language)}</span>
        </div>
        {paidAmount != null && (
          <div className="flex justify-between text-green-600">
            <span>{language === "ar" ? "المدفوع:" : "Paid:"}</span>
            <span>{formatAmount(paidAmount, language)}</span>
          </div>
        )}
        {dueAmount != null && (
          <div className="flex justify-between font-semibold text-red-600">
            <span>{language === "ar" ? "المتبقي:" : "Due:"}</span>
            <span>{formatAmount(dueAmount, language)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
