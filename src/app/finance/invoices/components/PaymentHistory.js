"use client";

import React from "react";
import { Plus, Pencil, Trash2, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount, formatDateLocale } from "../utils/formatters";
import { getPaymentMethodLabel } from "../utils/helpers";
import { printPaymentReceipt } from "../utils/printPaymentReceipt";

/**
 * Payment history table inside InvoiceDetailDialog.
 */
export default function PaymentHistory({
  payments,
  invoiceStatus,
  invoice,
  language,
  t,
  onAdd,
  onEdit,
  onView,
  onDelete,
  companySettings,
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {language === "ar" ? "سجل الدفعات" : "Payment History"}
        </h4>
        {invoiceStatus !== "paid" && (
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus className="me-1 h-3 w-3" />
            {language === "ar" ? "إضافة دفعة" : "Add Payment"}
          </Button>
        )}
      </div>

      {payments && payments.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {language === "ar" ? "التاريخ" : "Date"}
                </TableHead>
                <TableHead>
                  {language === "ar" ? "المبلغ" : "Amount"}
                </TableHead>
                <TableHead>
                  {language === "ar" ? "طريقة الدفع" : "Method"}
                </TableHead>
                <TableHead>
                  {language === "ar" ? "بواسطة" : "By"}
                </TableHead>
                <TableHead className="w-[120px] text-end">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {formatDateLocale(p.payment_date, language)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(p.amount, language)}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(p.payment_method, language)}
                  </TableCell>
                  <TableCell>{p.created_by_name || "-"}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onView(p)}
                        title={language === "ar" ? "عرض" : "View"}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => printPaymentReceipt(p, invoice, { companySettings })}
                        title={language === "ar" ? "طباعة إيصال" : "Print Receipt"}
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEdit(p)}
                        title={language === "ar" ? "تعديل" : "Edit"}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => onDelete(p)}
                        title={language === "ar" ? "حذف" : "Delete"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
          {language === "ar" ? "لا توجد دفعات بعد" : "No payments yet"}
        </div>
      )}
    </div>
  );
}
