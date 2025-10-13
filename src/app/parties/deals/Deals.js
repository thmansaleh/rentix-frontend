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
import { Eye, Edit, Trash2, FileText, Plus, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { deleteClientDeal } from '@/app/services/api/clientsDeals'
import { useClientsDeals } from './hooks/useClientsDeals'
import DealsSearchFilter from './components/DealsSearchFilter'
import EditDealModal from './components/EditDealModal'
import AddDealModal from './components/AddDealModal'
import ViewDealModal from './components/ViewDealModal'
import { cn } from "@/lib/utils"

function Deals() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    start_date: null,
    end_date: null,
    created_by: null
  })

  // Modal states
  const [editModal, setEditModal] = useState({ isOpen: false, dealId: null })
  const [addModal, setAddModal] = useState({ isOpen: false })
  const [viewModal, setViewModal] = useState({ isOpen: false, dealId: null })
  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    dealId: null, 
    dealInfo: null,
    isDeleting: false 
  })

  // Build API parameters
  const apiParams = useMemo(() => {
    const params = {
      page,
      limit: 10,
      search: searchTerm.trim() || undefined,
    }

    // Add filters only if they're not default values
    if (filters.status !== 'all') params.status = filters.status
    if (filters.type !== 'all') params.type = filters.type
    if (filters.start_date) params.start_date = format(filters.start_date, 'yyyy-MM-dd')
    if (filters.end_date) params.end_date = format(filters.end_date, 'yyyy-MM-dd')
    if (filters.created_by) params.created_by = filters.created_by

    return params
  }, [page, searchTerm, filters])

  // Fetch data using SWR
  const { 
    deals, 
    pagination, 
    isLoading, 
    isError, 
    error, 
    mutate, 
    totalCount 
  } = useClientsDeals(apiParams)

  // Handle search
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setPage(1) // Reset to first page when searching
  }

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
    setPage(1) // Reset to first page when filtering
  }

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      start_date: null,
      end_date: null,
      created_by: null
    })
    setSearchTerm('')
    setPage(1)
  }

  // Get status badge variant and text
  const getStatusDisplay = (status) => {
    const statusMap = {
     
      draft: { 
        variant: 'secondary', 
        text: isArabic ? 'مسودة' : 'Draft' 
      },
      completed: { 
        variant: 'outline', 
        text: isArabic ? 'مكتمل' : 'Completed' 
      }
    }
    return statusMap[status] || { variant: 'secondary', text: status }
  }

  // Get type display text
  const getTypeDisplay = (type) => {
    const typeMap = {
      consultation: isArabic ? 'استشارة' : 'Consultation',
      representation: isArabic ? 'تمثيل قانوني' : 'Legal Representation',
      contract: isArabic ? 'عقد' : 'Contract',
      mediation: isArabic ? 'وساطة' : 'Mediation'
    }
    return typeMap[type] || type
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
  const handleViewDeal = (dealId) => {
    setViewModal({ isOpen: true, dealId })
  }

  const handleEditDeal = (dealId) => {
    setEditModal({ isOpen: true, dealId })
  }

  const handleAddDeal = () => {
    setAddModal({ isOpen: true })
  }

  const handleDeleteDeal = (deal) => {
    setDeleteModal({
      isOpen: true,
      dealId: deal.id,
      dealInfo: deal,
      isDeleting: false
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.dealId) return

    setDeleteModal(prev => ({ ...prev, isDeleting: true }))
    
    try {
      const response = await deleteClientDeal(deleteModal.dealId)
      
      if (response.success) {
        toast.success(isArabic ? 'تم حذف الاتفاقية بنجاح' : 'Deal deleted successfully')
        handleModalSuccess()
        setDeleteModal({ isOpen: false, dealId: null, dealInfo: null, isDeleting: false })
      } else {
        toast.error(response.error || (isArabic ? 'حدث خطأ أثناء حذف الاتفاقية' : 'Error deleting deal'))
      }
    } catch (error) {
      console.error('Error deleting deal:', error)
      toast.error(isArabic ? 'حدث خطأ أثناء حذف الاتفاقية' : 'Error deleting deal')
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, dealId: null, dealInfo: null, isDeleting: false })
  }

  const handleModalSuccess = () => {
    // Refresh the data when a deal is added or updated
    mutate()
  }

  // Loading state
  if (isLoading && !deals.length) {
    return (
      <div className="space-y-6">
        <DealsSearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isArabic ? 'اتفاقيات العملاء' : 'Client Deals'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <DealsSearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isArabic ? 'اتفاقيات العملاء' : 'Client Deals'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
                <h3 className="text-lg font-semibold mb-2">
                  {isArabic ? 'خطأ في تحميل البيانات' : 'Error Loading Data'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'An error occurred while loading data'}
                </p>
                <Button onClick={() => mutate()} variant="outline">
                  {isArabic ? 'إعادة المحاولة' : 'Try Again'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Component */}
      <DealsSearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isArabic ? 'اتفاقيات العملاء' : 'Client Deals'}
              {totalCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalCount}
                </Badge>
              )}
            </CardTitle>
            <Button className="flex items-center gap-2" onClick={handleAddDeal}>
              <Plus className="h-4 w-4" />
              {isArabic ? 'إضافة اتفاقية' : 'Add Deal'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-0">
          {deals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'لا توجد اتفاقيات' : 'No Deals Found'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic 
                  ? 'لم يتم العثور على اتفاقيات تطابق معايير البحث'
                  : 'No deals found matching your search criteria'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'الرقم' : 'ID'}
                    </TableHead>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'العميل' : 'Client'}
                    </TableHead>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'النوع' : 'Type'}
                    </TableHead>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'الحالة' : 'Status'}
                    </TableHead>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'المبلغ' : 'Amount'}
                    </TableHead>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'تاريخ الإنشاء' : 'Created Date'}
                    </TableHead>
                    <TableHead className={cn("font-semibold", isArabic && "text-right")}>
                      {isArabic ? 'أنشئ بواسطة' : 'Created By'}
                    </TableHead>
                    <TableHead className={cn("font-semibold text-center")}>
                      {isArabic ? 'الإجراءات' : 'Actions'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className={cn("font-medium", isArabic && "text-right")}>
                        #{deal.id}
                      </TableCell>
                      <TableCell className={cn(isArabic && "text-right")}>
                        {deal.client_name || deal.client_id || '-'}
                      </TableCell>
                      <TableCell className={cn(isArabic && "text-right")}>
                        {getTypeDisplay(deal.type)}
                      </TableCell>
                      <TableCell className={cn(isArabic && "text-right")}>
                        <Badge variant={getStatusDisplay(deal.status).variant}>
                          {getStatusDisplay(deal.status).text}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(isArabic && "text-right")}>
                        {deal.amount ? `${deal.amount} ${deal.currency || 'AED'}` : '-'}
                      </TableCell>
                      <TableCell className={cn(isArabic && "text-right")}>
                        {formatDate(deal.created_at)}
                      </TableCell>
                      <TableCell className={cn(isArabic && "text-right")}>
                        {deal.created_by_name || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDeal(deal.id)}
                            title={isArabic ? 'عرض' : 'View'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditDeal(deal.id)}
                            title={isArabic ? 'تعديل' : 'Edit'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDeal(deal)}
                            title={isArabic ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isArabic 
              ? `عرض ${((pagination.currentPage - 1) * pagination.limit) + 1} - ${Math.min(pagination.currentPage * pagination.limit, pagination.total)} من ${pagination.total}`
              : `Showing ${((pagination.currentPage - 1) * pagination.limit) + 1} - ${Math.min(pagination.currentPage * pagination.limit, pagination.total)} of ${pagination.total}`
            }
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || isLoading}
            >
              {isArabic ? 'السابق' : 'Previous'}
            </Button>
            
            <span className="text-sm">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages || isLoading}
            >
              {isArabic ? 'التالي' : 'Next'}
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewDealModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, dealId: null })}
        dealId={viewModal.dealId}
      />

      <EditDealModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, dealId: null })}
        dealId={editModal.dealId}
        onSuccess={handleModalSuccess}
      />

      <AddDealModal
        isOpen={addModal.isOpen}
        onClose={() => setAddModal({ isOpen: false })}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteModal.isOpen} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              {isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {isArabic 
                ? `هل أنت متأكد من أنك تريد حذف هذه الاتفاقية؟`
                : `Are you sure you want to delete this deal?`
              }
              {deleteModal.dealInfo && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <div className="text-sm space-y-1">
                    <div><strong>{isArabic ? 'الرقم:' : 'ID:'}</strong> #{deleteModal.dealInfo.id}</div>
                    <div><strong>{isArabic ? 'العميل:' : 'Client:'}</strong> {deleteModal.dealInfo.client_name || deleteModal.dealInfo.client_id || '-'}</div>
                    <div><strong>{isArabic ? 'المبلغ:' : 'Amount:'}</strong> {deleteModal.dealInfo.amount || '-'} {deleteModal.dealInfo.currency || 'AED'}</div>
                  </div>
                </div>
              )}
              <div className="mt-3 text-sm text-muted-foreground">
                {isArabic 
                  ? 'هذا الإجراء لا يمكن التراجع عنه.'
                  : 'This action cannot be undone.'
                }
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              disabled={deleteModal.isDeleting}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteModal.isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteModal.isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isArabic ? 'جاري الحذف...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isArabic ? 'حذف' : 'Delete'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Deals