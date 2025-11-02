'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, XCircle, Eye, FileText, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import { getAllInvoices, updateInvoiceStatus } from '@/app/services/api/invoices';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Invoices = () => {
  const { isRTL, language } = useLanguage();
  const t = useTranslations('invoices');
  const tCommon = useTranslations('common');
  
  // Get employee role from Redux
  const employeeRole = useSelector((state) => state.auth.roleEn);
  const isAdmin = employeeRole?.toLowerCase() === 'admin';
  
  // Modal state
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState({ id: null, action: null });
  
  // Fetch all invoices
  const { data, error, isLoading, mutate } = useSWR(
    '/invoices',
    getAllInvoices,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  
  const invoices = data?.data || [];
  
  // Filter invoices with pending status
  const pendingInvoices = invoices.filter((invoice) => invoice.status === 'pending');
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US');
  };
  
  // Helper function to format currency
  const formatCurrency = (amount, currency = 'AED') => {
    if (!amount) return `0 ${currency}`;
    return `${parseFloat(amount).toLocaleString(language === 'ar' ? 'ar-AE' : 'en-US')} ${currency}`;
  };
  
  // Handle opening approval dialog
  const handleOpenApprovalDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setIsApprovalDialogOpen(true);
  };
  
  // Handle closing approval dialog
  const handleCloseApprovalDialog = () => {
    setIsApprovalDialogOpen(false);
    setSelectedInvoice(null);
  };
  
  // Handle approve action
  const handleApprove = async (invoice) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من الموافقة على هذه الفاتورة؟' : 'Are you sure you want to approve this invoice?')) {
      return;
    }
    
    setActionLoading({ id: invoice.id, action: 'approve' });
    
    try {
      await updateInvoiceStatus(invoice.id, 'approved');
      
      // Refresh the invoices list
      await mutate();
      
      toast.success(t('updateSuccess') || (language === 'ar' ? 'تم الموافقة بنجاح' : 'Approved successfully'));
    } catch (error) {
      console.error('Error approving invoice:', error);
      toast.error(t('updateError') || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };
  
  // Handle reject action
  const handleReject = async (invoice) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من رفض هذه الفاتورة؟' : 'Are you sure you want to reject this invoice?')) {
      return;
    }
    
    setActionLoading({ id: invoice.id, action: 'reject' });
    
    try {
      await updateInvoiceStatus(invoice.id, 'rejected');
      
      // Refresh the invoices list
      await mutate();
      
      toast.success(language === 'ar' ? 'تم الرفض بنجاح' : 'Rejected successfully');
    } catch (error) {
      console.error('Error rejecting invoice:', error);
      toast.error(t('updateError') || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };
  
  // Handle approval confirmation (keep for dialog if needed)
  const handleApprovalConfirm = async () => {
    if (!selectedInvoice) {
      toast.error(t('updateError'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateInvoiceStatus(selectedInvoice.id, 'approved');
      
      // Refresh the invoices list
      await mutate();
      
      toast.success(t('updateSuccess'));
      
      handleCloseApprovalDialog();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error(t('updateError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    let color, text;
    
    switch (status.toLowerCase()) {
      case 'pending':
        color = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        text = t('statusPending');
        break;
      case 'approved':
        color = 'bg-green-100 text-green-800 hover:bg-green-100';
        text = t('statusApproved');
        break;
      default:
        color = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        text = status;
    }
    
    return <Badge className={color}>{text}</Badge>;
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">{tCommon('loading')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">{tCommon('errorLoading')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
      </div>
      
      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('statusPending')} {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvoices.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                {tCommon('noData')}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      #
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('invoiceNumber')}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('invoiceDate')}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('clientName')}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('amount')}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('status')}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('createdBy')}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {t('actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvoices.map((invoice, index) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {invoice.invoice_number || '-'}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
                      <TableCell>{invoice.client_name || '-'}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>{invoice.created_by_name || '-'}</TableCell>
                      <TableCell>
                        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {isAdmin && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(invoice)}
                                disabled={actionLoading.id === invoice.id}
                              >
                                {actionLoading.id === invoice.id && actionLoading.action === 'approve' ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                <span className={isRTL ? 'mr-1' : 'ml-1'}>
                                  {language === 'ar' ? 'موافقة' : 'Approve'}
                                </span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(invoice)}
                                disabled={actionLoading.id === invoice.id}
                              >
                                {actionLoading.id === invoice.id && actionLoading.action === 'reject' ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                                <span className={isRTL ? 'mr-1' : 'ml-1'}>
                                  {language === 'ar' ? 'رفض' : 'Reject'}
                                </span>
                              </Button>
                            </>
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
      
      {/* Approval Dialog */}
      <AlertDialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('approveInvoice')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('approveInvoiceMessage', { 
                invoiceNumber: selectedInvoice?.invoice_number || '-',
                amount: formatCurrency(selectedInvoice?.amount, selectedInvoice?.currency)
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseApprovalDialog} disabled={isSubmitting}>
              {tCommon('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprovalConfirm} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? tCommon('saving') : t('approve')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Invoices;
