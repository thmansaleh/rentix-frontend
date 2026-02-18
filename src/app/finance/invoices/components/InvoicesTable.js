"use client";

import React from "react";
import { Eye, Edit, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount, formatDateShort } from "../utils/formatters";
import { getStatusLabel, getInvoiceBranchName } from "../utils/helpers";
import { printInvoice } from "../utils/printInvoice";

export default function InvoicesTable({
  invoices,
  language,
  isRTL,
  onView,
  onEdit,
  onDelete,
  statusVariant,
  t,
  companySettings,
}) {
  const handlePrint = (invoice) => {
    printInvoice(invoice, { isRTL, language, t, companySettings });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("invoiceNumber")}</TableHead>
            <TableHead>{t("clientName")}</TableHead>
            <TableHead>{t("invoiceDate")}</TableHead>
            <TableHead className="text-end">{t("amount")}</TableHead>
            <TableHead className="text-end">
              {language === "ar" ? "المدفوع" : "Paid"}
            </TableHead>
            <TableHead className="text-end">
              {language === "ar" ? "المتبقي" : "Due"}
            </TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("branchName")}</TableHead>
            <TableHead className="text-center">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow
              key={inv.invoice_id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                {inv.invoice_number}
              </TableCell>
              <TableCell>{inv.customer_name || "-"}</TableCell>
              <TableCell>{formatDateShort(inv.issue_date)}</TableCell>
              <TableCell className="text-end font-medium">
                {formatAmount(inv.total_amount, language)}
              </TableCell>
              <TableCell className="text-end text-green-600">
                {formatAmount(inv.paid_amount, language)}
              </TableCell>
              <TableCell className="text-end text-red-600">
                {formatAmount(inv.payment_due_amount, language)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(inv.status)}>
                  {getStatusLabel(inv.status, language)}
                </Badge>
              </TableCell>
              <TableCell>
                {getInvoiceBranchName(inv, isRTL)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(inv.invoice_id)}
                    title={t("view")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(inv)}
                    title={t("edit")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePrint(inv)}
                    title={t("print")}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(inv)}
                    title={t("delete")}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
