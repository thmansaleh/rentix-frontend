"use client";

import { useState } from "react";
import useSWR from "swr";
import { getInvoicesByClientId } from "@/app/services/api/invoices";
import AddInvoiceModal from "@/app/finance/invoices/components/AddInvoiceModal";
import ShowInvoiceModal from "@/app/finance/invoices/components/ShowInvoiceModal";
import DeleteInvoiceModal from "@/app/finance/invoices/components/DeleteInvoiceModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, FileText, Eye, Printer, CheckCircle, XCircle, Clock, DollarSign, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export function OtherExpensesTab({ client, isOpen }) {
  const { language } = useLanguage();
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // Fetch invoices for this client
  const { data, error, isLoading, mutate } = useSWR(
    isOpen && client ? `/invoices/client/${client.id}` : null,
    () => client?.id ? getInvoicesByClientId(client.id) : null,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const invoices = data?.data || [];

  // Handler functions
  const handleViewInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsShowModalOpen(true);
  };

  const handleDeleteInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsDeleteModalOpen(true);
  };

  const handleSuccess = () => {
    mutate(); // Revalidate the data
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount, currency = "AED") => {
    const value = parseFloat(amount || 0);
    return `${value.toLocaleString()} ${currency}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { 
        label: language === 'ar' ? "مسودة" : "Draft", 
        color: "bg-gray-100 text-gray-800 border-gray-200", 
        icon: Clock 
      },
      pending: { 
        label: language === 'ar' ? "قيد الانتظار" : "Pending", 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: Clock 
      },
      paid: { 
        label: language === 'ar' ? "مدفوعة" : "Paid", 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle 
      },
      cancelled: { 
        label: language === 'ar' ? "ملغاة" : "Cancelled", 
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: XCircle 
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const totalInvoices = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.total_amount || 0), 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalPaid = paidInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.total_amount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          {language === 'ar' ? 'جاري تحميل الفواتير...' : 'Loading invoices...'}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add Invoice Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'إضافة فاتورة' : 'Add Invoice'}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'إجمالي الفواتير' : 'Total Invoices'}
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatAmount(totalInvoices, 'AED')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'المدفوع' : 'Paid'}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(totalPaid, 'AED')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'عدد الفواتير' : 'Number of Invoices'}
                </span>
              </div>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <p>{language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data'}</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {language === 'ar' ? 'لا توجد فواتير' : 'No invoices found'}
              </p>
              <p className="text-sm">
                {language === 'ar' ? 'لم يتم إصدار أي فاتورة لهذا الموكل' : 'No invoices have been issued for this client'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number'}</TableHead>
                  <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</TableHead>
                  <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell className="text-xs">{formatDate(invoice.invoice_date)}</TableCell>
                    <TableCell className="text-xs">{formatDate(invoice.due_date)}</TableCell>
                    <TableCell className="font-mono font-semibold text-blue-600">
                      {formatAmount(invoice.total_amount, 'AED')}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewInvoice(invoice.id)}
                          title={language === 'ar' ? 'عرض' : 'View'}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.print()}
                          title={language === 'ar' ? 'طباعة' : 'Print'}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {invoices.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            {language === 'ar' 
              ? `عرض ${invoices.length} فاتورة`
              : `Showing ${invoices.length} invoice(s)`}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        defaultClientId={client?.id}
      />

      <ShowInvoiceModal
        isOpen={isShowModalOpen}
        onClose={() => setIsShowModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      <DeleteInvoiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        invoiceId={selectedInvoiceId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
