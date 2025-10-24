'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, Eye, Printer } from 'lucide-react';
import { getAllInvoices } from '@/app/services/api/invoices';
import AddInvoiceModal from './components/AddInvoiceModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import ShowInvoiceModal from './components/ShowInvoiceModal';
import DeleteInvoiceModal from './components/DeleteInvoiceModal';
import PrintInvoiceModal from './components/PrintInvoiceModal';
import ExportButtons from '@/components/ui/export-buttons';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function InvoicesPage() {
  const { isRTL, language } = useLanguage();
  const { hasPermission: canAdd } = usePermission('Add Invoice');
  const { hasPermission: canEdit } = usePermission('Edit Invoice');
  const { hasPermission: canDelete } = usePermission('Delete Invoice');
  const { hasPermission: canView } = usePermission('View Invoice');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // Fetch invoices using SWR
  const { data: invoicesData, error, mutate } = useSWR('/invoices', getAllInvoices);

  const invoices = invoicesData?.data || [];
  const loading = !invoicesData && !error;

  const handleEdit = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowEditModal(true);
  };

  const handleView = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowViewModal(true);
  };

  const handleDelete = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowDeleteModal(true);
  };

  const handlePrint = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowPrintModal(true);
  };

  const handleSuccess = () => {
    mutate(); // Refresh the list
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-AE');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'مسودة', variant: 'secondary' },
      issued: { label: 'صادرة', variant: 'default' },
      paid: { label: 'مدفوعة', variant: 'success' },
      cancelled: { label: 'ملغاة', variant: 'destructive' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  // Column configuration for export
  const invoiceColumnConfig = {
    invoice_number: {
      en: 'Invoice Number',
      ar: 'رقم الفاتورة',
      dataKey: 'invoice_number'
    },
    invoice_date: {
      en: 'Date',
      ar: 'التاريخ',
      dataKey: 'invoice_date',
      type: 'date'
    },
    client_name: {
      en: 'Client',
      ar: 'العميل',
      dataKey: 'client_name'
    },
    bank_info: {
      en: 'Bank Account',
      ar: 'الحساب البنكي',
      dataKey: 'bank_name',
      formatter: (value, item) => {
        return `${item.bank_name || ''} - ${item.account_number || ''}`;
      }
    },
    amount: {
      en: 'Amount',
      ar: 'المبلغ',
      dataKey: 'amount',
      formatter: (value) => formatCurrency(value)
    },
    status: {
      en: 'Status',
      ar: 'الحالة',
      dataKey: 'status',
      type: 'status',
      statusMap: {
        draft: { en: 'Draft', ar: 'مسودة' },
        issued: { en: 'Issued', ar: 'صادرة' },
        paid: { en: 'Paid', ar: 'مدفوعة' },
        cancelled: { en: 'Cancelled', ar: 'ملغاة' }
      }
    },
    created_by_name: {
      en: 'Created By',
      ar: 'أضيف بواسطة',
      dataKey: 'created_by_name'
    }
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            الفواتير العامة
          </h1>
        </div>

        {/* Invoices Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <CardTitle>قائمة الفواتير</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <ExportButtons
                  data={invoices}
                  columnConfig={invoiceColumnConfig}
                  language={language}
                  exportName="invoices"
                  sheetName={language === 'ar' ? 'الفواتير' : 'Invoices'}
                />
                {canAdd && (
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة فاتورة جديدة
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="mr-3">جاري تحميل الفواتير...</span>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 mb-4">لا توجد فواتير مضافة</p>
                {canAdd && (
                  <Button onClick={() => setShowAddModal(true)}>
                    إضافة فاتورة جديدة
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الفاتورة</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>الحساب البنكي</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>أضيف بواسطة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium font-mono">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell>
                          {formatDate(invoice.invoice_date)}
                        </TableCell>
                        <TableCell>
                          {invoice.client_name || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {invoice.bank_name}
                          <br />
                          <span className="text-gray-500 font-mono">
                            {invoice.account_number}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.status)}
                        </TableCell>
                        <TableCell>
                          {invoice.created_by_name || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {canView && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(invoice.id)}
                                title="عرض"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrint(invoice.id)}
                              title="طباعة"
                            >
                              <Printer className="h-4 w-4 text-blue-600" />
                            </Button>
                            {canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(invoice.id)}
                                title="تعديل"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(invoice.id)}
                                title="حذف"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddInvoiceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
        />

        <EditInvoiceModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInvoiceId(null);
          }}
          invoiceId={selectedInvoiceId}
          onSuccess={handleSuccess}
        />

        <ShowInvoiceModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoiceId(null);
          }}
          invoiceId={selectedInvoiceId}
        />

        <DeleteInvoiceModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedInvoiceId(null);
          }}
          invoiceId={selectedInvoiceId}
          onSuccess={handleSuccess}
        />

        <PrintInvoiceModal
          isOpen={showPrintModal}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedInvoiceId(null);
          }}
          invoiceId={selectedInvoiceId}
        />
      </div>
    </div>
  );
}

export default InvoicesPage;
