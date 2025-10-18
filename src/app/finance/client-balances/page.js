'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllClientInvoices, deleteClientInvoice } from '@/app/services/api/clientInvoices';
import { getAllClientPayments, deleteClientPayment } from '@/app/services/api/clientPayments';
import AddInvoiceModal from './components/AddInvoiceModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import AddPaymentModal from './components/AddPaymentModal';
import EditPaymentModal from './components/EditPaymentModal';
import InvoicesTab from './components/InvoicesTab';
import PaymentsTab from './components/PaymentsTab';
import { toast } from 'react-toastify';

function ClientInvoicesPage() {
  const { isRTL } = useLanguage();
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [preSelectedInvoiceId, setPreSelectedInvoiceId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch invoices with filters
  const fetchInvoices = async (page = currentPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate })
      };

      const response = await getAllClientInvoices(params);
      
      if (response.success) {
        setInvoices(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        toast.error('حدث خطأ في تحميل الفواتير');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('حدث خطأ في تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  // Load invoices on mount only
  useEffect(() => {
    fetchInvoices(1);
    fetchPayments();
  }, []);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      const response = await getAllClientPayments();
      if (response.success) {
        setPayments(response.data);
      } else {
        toast.error('حدث خطأ في تحميل المدفوعات');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('حدث خطأ في تحميل المدفوعات');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchInvoices(1);
  };

  const handleDelete = async (invoiceId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteClientInvoice(invoiceId);
      
      if (response.success) {
        toast.success('تم حذف الفاتورة بنجاح');
        fetchInvoices();
      } else {
        toast.error('حدث خطأ في حذف الفاتورة');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('حدث خطأ في حذف الفاتورة');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowEditModal(true);
  };

  const handlePayInvoice = (invoiceId) => {
    setPreSelectedInvoiceId(invoiceId);
    setShowAddPaymentModal(true);
  };

  const handleEditPayment = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setShowEditPaymentModal(true);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      setDeleteLoading(true);
      const response = await deleteClientPayment(paymentId);
      
      if (response.success) {
        toast.success('تم حذف الدفعة بنجاح');
        fetchPayments();
        fetchInvoices(); // Refresh to update invoice statuses
      } else {
        toast.error('حدث خطأ في حذف الدفعة');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('حدث خطأ في حذف الدفعة');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchPayments();
    fetchInvoices(); // Refresh to update invoice statuses
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchInvoices(newPage);
    }
  };

  const clearFilters = async () => {
    setSearchTerm('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    
    // Fetch with cleared filters
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit
      };

      const response = await getAllClientInvoices(params);
      
      if (response.success) {
        setInvoices(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        toast.error('حدث خطأ في تحميل الفواتير');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('حدث خطأ في تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              فواتير ومدفوعات العملاء
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              إدارة ومتابعة فواتير ومدفوعات العملاء
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs dir={isRTL ? 'rtl' : 'ltr'} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="invoices">الفواتير</TabsTrigger>
            <TabsTrigger value="payments">المدفوعات</TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <InvoicesTab
              invoices={invoices}
              loading={loading}
              deleteLoading={deleteLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleApplyFilters={handleApplyFilters}
              clearFilters={clearFilters}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handlePayInvoice={handlePayInvoice}
              handlePageChange={handlePageChange}
              setShowAddModal={setShowAddModal}
            />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentsTab
              payments={payments}
              paymentsLoading={paymentsLoading}
              deleteLoading={deleteLoading}
              handleEditPayment={handleEditPayment}
              handleDeletePayment={handleDeletePayment}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchInvoices}
      />

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchInvoices}
        invoiceId={selectedInvoiceId}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={showAddPaymentModal}
        onClose={() => {
          setShowAddPaymentModal(false);
          setPreSelectedInvoiceId(null);
        }}
        onSuccess={handlePaymentSuccess}
        invoiceId={preSelectedInvoiceId}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        isOpen={showEditPaymentModal}
        onClose={() => {
          setShowEditPaymentModal(false);
          setSelectedPaymentId(null);
        }}
        onSuccess={handlePaymentSuccess}
        paymentId={selectedPaymentId}
      />
    </div>
  );
}

export default ClientInvoicesPage;