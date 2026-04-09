"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
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
import { CustomModal } from "@/components/ui/custom-modal";
import { useTranslations } from "@/hooks/useTranslations";
import { getInvoiceById, deletePayment } from "@/app/services/api/invoices";

import InfoRow from "./InfoRow";
import InvoiceTotals from "./InvoiceTotals";
import PaymentHistory from "../../payments/PaymentHistory";
import ViewPaymentModal from "@/app/finance/payments/ViewPaymentModal";
import PaymentDialog from "@/app/finance/payments/PaymentDialog";
import DeletePaymentDialog from "@/app/finance/payments/DeletePaymentDialog";

import { formatAmount, formatDateLocale } from "../utils/formatters";
import { getStatusVariant, getStatusLabel, getInvoiceBranchName } from "../utils/helpers";

export default function InvoiceDetailDialog({
  open,
  onOpenChange,
  invoiceId,
  onRefresh,
  language,
  isRTL,
  companySettings,
}) {
  const t = useTranslations("invoices");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Payment sub-dialogs
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletePaymentDialogOpen, setDeletePaymentDialogOpen] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState(null);
  const [viewPaymentModalOpen, setViewPaymentModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);

  // ── Load invoice ──────────────────────────────────────
  const loadInvoice = async () => {
    setLoading(true);
    try {
      const res = await getInvoiceById(invoiceId);
      if (res.success && res.data) setInvoice(res.data);
    } catch (err) {
      console.error("Error loading invoice details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && invoiceId) loadInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, invoiceId]);

  useEffect(() => {
    if (!open) {
      setInvoice(null);
      setPaymentDialogOpen(false);
      setDeletePaymentDialogOpen(false);
      setViewPaymentModalOpen(false);
    }
  }, [open]);

  // ── Payment handlers ──────────────────────────────────
  const handleAddPayment = () => {
    setEditingPayment(null);
    setPaymentDialogOpen(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handleViewPayment = (payment) => {
    setViewingPayment(payment);
    setViewPaymentModalOpen(true);
  };

  const handleDeletePaymentClick = (payment) => {
    setDeletingPayment(payment);
    setDeletePaymentDialogOpen(true);
  };

  const handleDeletePaymentConfirm = async () => {
    if (!deletingPayment) return;
    try {
      const res = await deletePayment(deletingPayment.id);
      if (res.success) {
        toast.success(
          language === "ar"
            ? "تم حذف الدفعة بنجاح"
            : "Payment deleted successfully"
        );
        setDeletePaymentDialogOpen(false);
        setDeletingPayment(null);
        await loadInvoice();
        onRefresh?.();
      } else {
        toast.error(
          res.message ||
            (language === "ar" ? "خطأ في حذف الدفعة" : "Error deleting payment")
        );
      }
    } catch {
      toast.error(
        language === "ar" ? "خطأ في حذف الدفعة" : "Error deleting payment"
      );
    }
  };

  const handlePaymentSaved = async () => {
    setPaymentDialogOpen(false);
    setEditingPayment(null);
    await loadInvoice();
    onRefresh?.();
  };

  // ── Render ────────────────────────────────────────────
  return (
    <CustomModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={t("viewInvoice")}
      size="lg"
    >
      <div dir={isRTL ? "rtl" : "ltr"}>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ms-2">{t("loadingInvoiceData")}</span>
          </div>
        ) : !invoice ? (
          <div className="py-10 text-center text-muted-foreground">
            {t("noInvoiceData")}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow
                label={t("invoiceNumber")}
                value={invoice.invoice_number}
              />
              <InfoRow
                label={t("status")}
                value={
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {getStatusLabel(invoice.status, language)}
                  </Badge>
                }
              />
              <InfoRow
                label={t("invoiceDate")}
                value={formatDateLocale(invoice.issue_date, language)}
              />
              <InfoRow
                label={language === "ar" ? "تاريخ الاستحقاق" : "Due Date"}
                value={formatDateLocale(invoice.due_date, language)}
              />
              <InfoRow
                label={t("clientName")}
                value={invoice.customer_name || "-"}
              />
              <InfoRow
                label={t("branchName")}
                value={getInvoiceBranchName(invoice, isRTL)}
              />
              {invoice.created_by_name && (
                <InfoRow
                  label={t("createdBy")}
                  value={invoice.created_by_name}
                />
              )}
              {invoice.created_at && (
                <InfoRow
                  label={t("createdAt")}
                  value={formatDateLocale(invoice.created_at, language)}
                />
              )}
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="rounded-md border p-3 text-sm">
                <span className="font-medium">
                  {language === "ar" ? "ملاحظات: " : "Notes: "}
                </span>
                {invoice.notes}
              </div>
            )}

            {/* Items table */}
            {invoice.items?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  {t("invoiceDetails")}
                </h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("itemDescription")}</TableHead>
                        <TableHead className="w-[80px]">
                          {language === "ar" ? "الكمية" : "Qty"}
                        </TableHead>
                        <TableHead className="w-[120px]">
                          {language === "ar" ? "سعر الوحدة" : "Unit Price"}
                        </TableHead>
                        <TableHead className="w-[100px] text-end">
                          {t("total")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((itm, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{itm.description}</TableCell>
                          <TableCell>{itm.quantity}</TableCell>
                          <TableCell>
                            {formatAmount(itm.unit_price, language)}
                          </TableCell>
                          <TableCell className="text-end font-medium">
                            {formatAmount(itm.total_price, language)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Totals */}
            <InvoiceTotals
              subTotal={invoice.sub_total}
              taxAmount={invoice.tax_amount}
              discountAmount={
                parseFloat(invoice.discount_amount) > 0
                  ? invoice.discount_amount
                  : null
              }
              grandTotal={invoice.total_amount}
              paidAmount={invoice.paid_amount}
              dueAmount={invoice.payment_due_amount}
              language={language}
              t={t}
            />

            {/* Payment history */}
            <PaymentHistory
              payments={invoice.payments}
              invoiceStatus={invoice.status}
              invoice={invoice}
              language={language}
              t={t}
              onAdd={handleAddPayment}
              onEdit={handleEditPayment}
              onView={handleViewPayment}
              onDelete={handleDeletePaymentClick}
            />

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-dialogs */}
      <ViewPaymentModal
        isOpen={viewPaymentModalOpen}
        onClose={() => {
          setViewPaymentModalOpen(false);
          setViewingPayment(null);
        }}
        paymentId={viewingPayment?.id}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        invoiceId={invoice?.invoice_id}
        payment={editingPayment}
        onSaved={handlePaymentSaved}
        language={language}
        isRTL={isRTL}
      />

      <DeletePaymentDialog
        open={deletePaymentDialogOpen}
        onOpenChange={setDeletePaymentDialogOpen}
        payment={deletingPayment}
        onConfirm={handleDeletePaymentConfirm}
        language={language}
      />
    </CustomModal>
  );
}
