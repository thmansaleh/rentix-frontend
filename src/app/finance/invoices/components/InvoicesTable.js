"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Eye, Edit, Trash2, Printer } from "lucide-react";
import { toast } from "react-toastify";
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
import { useTranslations } from "@/hooks/useTranslations";
import { deleteInvoice } from "@/app/services/api/invoices";
import { getTenantSettings } from "@/app/services/api/tenantSettings";
import { formatAmount, formatDateShort } from "../utils/formatters";
import { getStatusLabel, getStatusVariant } from "../utils/helpers";
import { printInvoice } from "../utils/printInvoice";
import InvoiceDialog from "./InvoiceDialog";
import InvoiceDetailDialog from "./InvoiceDetailDialog";
import DeleteInvoiceDialog from "./DeleteInvoiceDialog";

const InvoicesTable = forwardRef(function InvoicesTable(
  { invoices, language, isRTL, onDataChange },
  ref
) {
  const t = useTranslations("invoices");

  const [companySettings, setCompanySettings] = useState(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState(null);

  useEffect(() => {
    getTenantSettings().then((res) => {
      if (res.success) setCompanySettings(res.data);
    });
  }, []);

  useImperativeHandle(ref, () => ({
    openAddNew: () => {
      setEditingInvoice(null);
      setInvoiceDialogOpen(true);
    },
  }));

  const handlePrint = (invoice) => {
    printInvoice(invoice, { isRTL, language, t, companySettings });
  };

  const handleView = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setDetailDialogOpen(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  const handleDeleteClick = (invoice) => {
    setDeletingInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvoice) return;
    try {
      const result = await deleteInvoice(deletingInvoice.invoice_id);
      if (result.success) {
        toast.success(t("deleteSuccess"));
        onDataChange?.();
      } else {
        toast.error(result.message || t("deleteError"));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("deleteError"));
    } finally {
      setDeleteDialogOpen(false);
      setDeletingInvoice(null);
    }
  };

  const handleInvoiceSaved = () => {
    setInvoiceDialogOpen(false);
    setEditingInvoice(null);
    onDataChange?.();
  };

  return (
    <>
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
                  <Badge variant={getStatusVariant(inv.status)}>
                    {getStatusLabel(inv.status, language)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleView(inv.invoice_id)}
                      title={t("view")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(inv)}
                      title={t("edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePrint(inv)}
                      title={t("print")}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(inv)}
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

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={editingInvoice}
        onSaved={handleInvoiceSaved}
        language={language}
        isRTL={isRTL}
      />

      <InvoiceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        invoiceId={selectedInvoiceId}
        onRefresh={onDataChange}
        language={language}
        isRTL={isRTL}
        companySettings={companySettings}
      />

      <DeleteInvoiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        invoice={deletingInvoice}
        onConfirm={handleDeleteConfirm}
        language={language}
      />
    </>
  );
});

export default InvoicesTable;
