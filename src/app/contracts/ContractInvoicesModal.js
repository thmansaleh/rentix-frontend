"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Loader2,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Receipt,
} from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getInvoicesByContractId,
  deleteInvoice,
} from "@/app/services/api/invoices";
import { getTenantSettings } from "@/app/services/api/tenantSettings";
import { getContractById } from "@/app/services/api/contracts";

// Reuse invoice dialogs from the finance/invoices route
import InvoiceDialog from "@/app/finance/invoices/components/InvoiceDialog";
import InvoiceDetailDialog from "@/app/finance/invoices/components/InvoiceDetailDialog";
import DeleteInvoiceDialog from "@/app/finance/invoices/components/DeleteInvoiceDialog";

import {
  getStatusVariant,
  getStatusLabel,
} from "@/app/finance/invoices/utils/helpers";
import { formatAmount, formatDateLocale } from "@/app/finance/invoices/utils/formatters";

export default function ContractInvoicesModal({
  isOpen,
  onClose,
  contractId,
  contractNumber,
}) {
  const { t } = useTranslations();
  const { language, isRTL } = useLanguage();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenantSettings, setTenantSettings] = useState(null);
  const [contractDetails, setContractDetails] = useState(null);

  // Sub-dialog states
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState(null);

  // Load invoices for this contract
  const loadInvoices = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const res = await getInvoicesByContractId(contractId);
      if (res.success) {
        setInvoices(res.data || []);
      }
    } catch (err) {
      console.error("Error loading contract invoices:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  // Load company settings and contract details
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getTenantSettings();
        if (res.success) setTenantSettings(res.data);
      } catch (err) {
        console.error("Error loading company settings:", err);
      }
    })();
  }, [isOpen]);

  // Load contract details (customer_id, branch_id)
  useEffect(() => {
    if (!isOpen || !contractId) return;
    (async () => {
      try {
        const data = await getContractById(contractId);
        setContractDetails(data);
      } catch (err) {
        console.error("Error loading contract details:", err);
      }
    })();
  }, [isOpen, contractId]);

  useEffect(() => {
    if (isOpen && contractId) {
      loadInvoices();
    }
    if (!isOpen) {
      setInvoices([]);
      setContractDetails(null);
      setInvoiceDialogOpen(false);
      setDetailDialogOpen(false);
      setDeleteDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, contractId]);

  // Handlers
  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setInvoiceDialogOpen(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  const handleViewInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (invoice) => {
    setDeletingInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingInvoice) return;
    try {
      const res = await deleteInvoice(deletingInvoice.invoice_id);
      if (res.success) {
        toast.success(t("invoices.deleteSuccess"));
        setDeleteDialogOpen(false);
        setDeletingInvoice(null);
        loadInvoices();
      } else {
        toast.error(res.message || t("invoices.deleteError"));
      }
    } catch (err) {
      console.error("Error deleting invoice:", err);
      toast.error(t("invoices.deleteError"));
    }
  };

  const handleInvoiceSaved = () => {
    setInvoiceDialogOpen(false);
    setEditingInvoice(null);
    loadInvoices();
  };

  // Calculate totals
  const totalAmount = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.total_amount || 0),
    0
  );
  const paidAmount = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.paid_amount || 0),
    0
  );
  const dueAmount = totalAmount - paidAmount;

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        title={`${t("contracts.invoices.title")} - ${t("contracts.invoices.contractLabel")} #${contractNumber || contractId}`}
        size="xl"
      >
        <div dir={isRTL ? "rtl" : "ltr"} className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-3">
              <p className="text-xs text-muted-foreground">
                {t("contracts.invoices.totalInvoices")}
              </p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {invoices.length}
              </p>
            </div>
            <div className="rounded-lg border bg-green-50 dark:bg-green-950/30 p-3">
              <p className="text-xs text-muted-foreground">
                {t("contracts.invoices.totalPaid")}
              </p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                AED {formatAmount(paidAmount, language)}
              </p>
            </div>
            <div className="rounded-lg border bg-orange-50 dark:bg-orange-950/30 p-3">
              <p className="text-xs text-muted-foreground">
                {t("contracts.invoices.totalDue")}
              </p>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-400">
                AED {formatAmount(dueAmount, language)}
              </p>
            </div>
          </div>

          {/* Add Invoice Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleAddInvoice}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              {t("contracts.invoices.addInvoice")}
            </Button>
          </div>

          {/* Invoices Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("invoices.invoiceNumber")}</TableHead>
                  <TableHead>{t("invoices.invoiceDate")}</TableHead>
                  <TableHead>{t("invoices.clientName")}</TableHead>
                  <TableHead>{t("invoices.status")}</TableHead>
                  <TableHead className="text-end">
                    {t("invoices.total")}
                  </TableHead>
                  <TableHead className="text-end">
                    {t("contracts.invoices.paidCol")}
                  </TableHead>
                  <TableHead className="text-end">
                    {t("contracts.invoices.dueCol")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("invoices.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t("invoices.loading")}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Receipt className="w-8 h-8 opacity-40" />
                        <span>{t("contracts.invoices.noInvoices")}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.invoice_id}>
                      <TableCell className="font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>
                        {formatDateLocale(invoice.issue_date, language)}
                      </TableCell>
                      <TableCell>{invoice.customer_name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {getStatusLabel(invoice.status, language)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-end font-medium">
                        AED {formatAmount(invoice.total_amount, language)}
                      </TableCell>
                      <TableCell className="text-end">
                        AED {formatAmount(invoice.paid_amount, language)}
                      </TableCell>
                      <TableCell className="text-end">
                        AED{" "}
                        {formatAmount(
                          invoice.payment_due_amount || 
                            (parseFloat(invoice.total_amount || 0) -
                              parseFloat(invoice.paid_amount || 0)),
                          language
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                             variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleViewInvoice(invoice.invoice_id)
                            }
                            title={t("invoices.view")}
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                             variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditInvoice(invoice)}
                            title={t("invoices.edit")}
                          >
                            <Edit className="w-4 h-4 text-amber-600" />
                          </Button>
                          <Button
                             variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteClick(invoice)}
                            title={t("invoices.delete")}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              {t("invoices.cancel")}
            </Button>
          </div>
        </div>
      </CustomModal>

      {/* Add / Edit Invoice Dialog */}
      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={editingInvoice}
        onSaved={handleInvoiceSaved}
        language={language}
        isRTL={isRTL}
        defaultContractId={contractId}
        defaultCustomerId={contractDetails?.customer_id}
      />

      {/* View Invoice Detail Dialog */}
      <InvoiceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        invoiceId={selectedInvoiceId}
        onRefresh={loadInvoices}
        language={language}
        isRTL={isRTL}
        companySettings={tenantSettings}
      />

      {/* Delete Invoice Confirmation */}
      <DeleteInvoiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        invoice={deletingInvoice}
        onConfirm={handleDeleteConfirm}
        language={language}
      />
    </>
  );
}
