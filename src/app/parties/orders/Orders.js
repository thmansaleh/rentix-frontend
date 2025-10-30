"use client"

import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import ExportButtons from '@/components/ui/export-buttons'
import { deletePartyOrder } from '@/app/services/api/partiesOrders'
import { usePartiesOrders } from './hooks/usePartiesOrders'
import AddOrderModal from './components/AddOrderModal'
import EditOrderModal from './components/EditOrderModal'
import OrdersSearchFilter from './components/OrdersSearchFilter'
import { cn } from "@/lib/utils"

function Orders() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  // Modal states
  const [editModal, setEditModal] = useState({ isOpen: false, orderId: null })
  const [addModal, setAddModal] = useState({ isOpen: false })
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    orderId: null, 
    orderInfo: null,
    isDeleting: false 
  })

  // Build API parameters
  const apiParams = useMemo(() => {
    const params = {
      page,
      limit: 10
    }

    if (searchTerm.trim()) {
      params.search = searchTerm.trim()
    }

    return params
  }, [page, searchTerm])

  // Fetch data using SWR
  const { 
    orders, 
    pagination, 
    isLoading, 
    isError, 
    error, 
    mutate, 
    totalCount 
  } = usePartiesOrders(apiParams)

  // Handle search
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue)
    setPage(1) // Reset to first page when searching
  }

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('')
    setPage(1)
  }

  // Get status badge variant and text
  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { 
        variant: 'secondary', 
        text: isArabic ? 'قيد الانتظار' : 'Pending' 
      },
      approved: { 
        variant: 'default', 
        text: isArabic ? 'موافق عليه' : 'Approved' 
      },
      rejected: { 
        variant: 'destructive', 
        text: isArabic ? 'مرفوض' : 'Rejected' 
      },
   
    }
    return statusMap[status] || { variant: 'secondary', text: status }
  }

  // Get type display text
  const getTypeDisplay = (type) => {
    const typeMap = {
      document_request: isArabic ? 'طلب مستندات' : 'Document Request',
      case_details: isArabic ? 'تفاصيل عن القضية' : 'Case Details',
      other: isArabic ? 'أخرى' : 'Other'
    }
    return typeMap[type] || type
  }

  // Column configuration for export
  const ordersColumnConfig = {
    id: {
      ar: 'المعرف',
      en: 'ID',
      dataKey: 'id'
    },
    party_name: {
      ar: 'اسم العميل',
      en: 'Party Name',
      dataKey: 'party_name'
    },
    type: {
      ar: 'نوع الطلب',
      en: 'Order Type',
      dataKey: 'type',
      formatter: (value) => {
        const typeMap = {
          document_request: isArabic ? 'طلب مستندات' : 'Document Request',
          case_details: isArabic ? 'تفاصيل عن القضية' : 'Case Details',
          other: isArabic ? 'أخرى' : 'Other'
        }
        return typeMap[value] || value
      }
    },
    date: {
      ar: 'التاريخ',
      en: 'Date',
      dataKey: 'date',
      type: 'date'
    },
    status: {
      ar: 'الحالة',
      en: 'Status',
      dataKey: 'status',
      type: 'status',
      statusMap: {
        'pending': { ar: 'قيد الانتظار', en: 'Pending' },
        'approved': { ar: 'موافق عليه', en: 'Approved' },
        'rejected': { ar: 'مرفوض', en: 'Rejected' }
      }
    },
    case_number: {
      ar: 'رقم القضية',
      en: 'Case Number',
      dataKey: 'case_number'
    },
    details: {
      ar: 'التفاصيل',
      en: 'Details',
      dataKey: 'details'
    },
    created_by_name: {
      ar: 'أنشئ بواسطة',
      en: 'Created By',
      dataKey: 'created_by_name',
      formatter: (value, row) => {
        return value || (row.party_name ? `${row.party_name} (${isArabic ? 'العميل' : 'Client'})` : '-')
      }
    },
    created_at: {
      ar: 'تاريخ الإنشاء',
      en: 'Created At',
      dataKey: 'created_at',
      type: 'date'
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return format(date, 'dd/MM/yyyy', { 
      locale: isArabic ? ar : undefined 
    })
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  // Modal handlers
  const handleEditOrder = (orderId) => {
    setEditModal({ isOpen: true, orderId })
  }

  const handleAddOrder = () => {
    setAddModal({ isOpen: true })
  }

  const handleDeleteOrder = (order) => {
    setDeleteModal({
      isOpen: true,
      orderId: order.id,
      orderInfo: order,
      isDeleting: false
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.orderId) return

    setDeleteModal(prev => ({ ...prev, isDeleting: true }))
    
    try {
      const response = await deletePartyOrder(deleteModal.orderId)
      
      if (response.message) {
        toast.success(isArabic ? 'تم حذف الأمر بنجاح' : 'Order deleted successfully')
        handleModalSuccess()
        setDeleteModal({ isOpen: false, orderId: null, orderInfo: null, isDeleting: false })
      } else {
        toast.error(response.error || (isArabic ? 'حدث خطأ أثناء حذف الأمر' : 'Error deleting order'))
      }
    } catch (error) {

      toast.error(isArabic ? 'حدث خطأ أثناء حذف الأمر' : 'Error deleting order')
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, orderId: null, orderInfo: null, isDeleting: false })
  }

  const handleModalSuccess = () => {
    // Refresh the data when an order is added or updated
    mutate()
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className={cn("text-2xl font-bold", isArabic && "text-right")}>
              {isArabic ? 'أوامر الأطراف' : 'Party Orders'}
            </CardTitle>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              {/* Search Component */}
              <OrdersSearchFilter 
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />

              {/* Add Button */}
              <Button onClick={handleAddOrder} className="whitespace-nowrap">
                <Plus className={cn("h-4 w-4", isArabic ? "ml-2" : "mr-2")} />
                {isArabic ? 'إضافة طلب' : 'Add Order'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Export Buttons */}
        {orders && orders.length > 0 && !isLoading && !isError && (
          <div className="px-6 pb-4">
            <ExportButtons
              data={orders}
              columnConfig={ordersColumnConfig}
              language={language}
              exportName="client-requests"
              sheetName={language === 'ar' ? 'طلبات العملاء' : 'Client Requests'}
            />
          </div>
        )}

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              {isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data'}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {isArabic ? 'لا توجد طلبات' : 'No orders found'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? '#' : '#'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'الموكل' : 'Party Name'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'نوع الطلب' : 'Order Type'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'التاريخ' : 'Date'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'الحالة' : 'Status'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'رقم القضية' : 'Case Number'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'تم الإنشاء بواسطة' : 'Created By'}
                      </TableHead>
                      <TableHead className={isArabic ? "text-right" : ""}>
                        {isArabic ? 'الإجراءات' : 'Actions'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => {
                      const statusDisplay = getStatusDisplay(order.status)
                      return (
                        <TableRow key={order.id}>
                          <TableCell className={isArabic ? "text-right" : ""}>
                            {(page - 1) * 10 + index + 1}
                          </TableCell>
                          <TableCell className={cn("font-medium", isArabic && "text-right")}>
                            {order.party_name || '-'}
                          </TableCell>
                          <TableCell className={isArabic ? "text-right" : ""}>
                            {getTypeDisplay(order.type)}
                          </TableCell>
                          <TableCell className={isArabic ? "text-right" : ""}>
                            {formatDate(order.date)}
                          </TableCell>
                          <TableCell className={isArabic ? "text-right" : ""}>
                            <Badge variant={statusDisplay.variant}>
                              {statusDisplay.text}
                            </Badge>
                          </TableCell>
                          <TableCell className={isArabic ? "text-right" : ""}>
                            {order.case_number || '-'}
                          </TableCell>
                          <TableCell className={isArabic ? "text-right" : ""}>
                            {order.created_by_name || (order.party_name ? `${order.party_name} (${isArabic ? 'الموكل' : 'Client'})` : '-')}
                          </TableCell>
                          <TableCell>
                            <div className={cn("flex gap-2", isArabic && "flex-row-reverse")}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOrder(order.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteOrder(order)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className={cn(
                  "flex items-center justify-between mt-4 pt-4 border-t",
                  isArabic && "flex-row-reverse"
                )}>
                  <div className={cn("text-sm text-muted-foreground", isArabic && "text-right")}>
                    {isArabic 
                      ? `عرض ${(page - 1) * 10 + 1} إلى ${Math.min(page * 10, totalCount)} من ${totalCount} نتيجة`
                      : `Showing ${(page - 1) * 10 + 1} to ${Math.min(page * 10, totalCount)} of ${totalCount} results`
                    }
                  </div>
                  <div className={cn("flex gap-2", isArabic && "flex-row-reverse")}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      {isArabic ? 'السابق' : 'Previous'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= pagination.totalPages}
                    >
                      {isArabic ? 'التالي' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Order Modal */}
      <AddOrderModal
        isOpen={addModal.isOpen}
        onClose={() => setAddModal({ isOpen: false })}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Order Modal */}
      <EditOrderModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, orderId: null })}
        orderId={editModal.orderId}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteModal.isOpen} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isArabic ? "text-right" : ""}>
              {isArabic ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isArabic ? "text-right" : ""}>
              {isArabic 
                ? `سيتم حذف أمر الطرف "${deleteModal.orderInfo?.party_name || ''}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.`
                : `This will permanently delete the order for "${deleteModal.orderInfo?.party_name || ''}". This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isArabic ? "flex-row-reverse" : ""}>
            <AlertDialogCancel disabled={deleteModal.isDeleting}>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteModal.isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteModal.isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isArabic ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Orders
