'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import ViewInvoiceModal from './ViewInvoiceModal';

export default function InvoicesTab({
  invoices,
  loading,
  deleteLoading,
  currentPage,
  totalPages,
  total,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleApplyFilters,
  clearFilters,
  handleDelete,
  handleEdit,
  handlePayInvoice,
  handlePageChange,
  setShowAddModal
}) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const handleViewInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowViewModal(true);
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
      paid: { label: 'مدفوعة', variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
      unpaid: { label: 'غير مدفوعة', variant: 'destructive', className: 'bg-red-500 hover:bg-red-600' },
      partial: { label: 'مدفوعة جزئياً', variant: 'secondary', className: 'bg-yellow-500 hover:bg-yellow-600' }
    };
    
    const config = statusConfig[status] || statusConfig.unpaid;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة فاتورة جديدة
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="mb-2 block">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="البحث برقم الفاتورة أو اسم العميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyFilters();
                    }
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status" className="mb-2 block">حالة الفاتورة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="paid">مدفوعة</SelectItem>
                  <SelectItem value="unpaid">غير مدفوعة</SelectItem>
                  <SelectItem value="partial">مدفوعة جزئياً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate" className="mb-2 block">من تاريخ</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate" className="mb-2 block">إلى تاريخ</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleApplyFilters} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              بحث
            </Button>
            
            {(searchTerm || statusFilter || startDate || endDate) && (
              <Button variant="outline" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>قائمة الفواتير</CardTitle>
            <div className="text-sm text-gray-500">
              إجمالي: {total} فاتورة
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
              <p className="text-gray-500 mb-4">لا توجد فواتير</p>
              <Button onClick={() => setShowAddModal(true)}>
                إضافة فاتورة جديدة
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الفاتورة</TableHead>
                      <TableHead>اسم العميل</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>رقم القضية</TableHead>
                      <TableHead>رقم الملف</TableHead>
                      <TableHead>الفاتورة لـ</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ الإجمالي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تم الإنشاء بواسطة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell>{invoice.client_name || '-'}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {invoice.client_phone || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {invoice.case_number || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {invoice.file_number || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {invoice.invoice_for || '-'}
                        </TableCell>
                        <TableCell>
                          {formatDate(invoice.date)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(invoice.total_amount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {invoice.created_by_name || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(invoice.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invoice.status !== 'paid' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePayInvoice(invoice.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="إضافة دفعة"
                              >
                                <Plus className="h-4 w-4 ml-1" />
                                دفع
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(invoice.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={deleteLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف الفاتورة {invoice.invoice_number}؟ 
                                    لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(invoice.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    صفحة {currentPage} من {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                      السابق
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Invoice Modal */}
      <ViewInvoiceModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedInvoiceId(null);
        }}
        invoiceId={selectedInvoiceId}
      />
    </>
  );
}
