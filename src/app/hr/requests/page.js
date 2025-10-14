"use client"

import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2, FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'
import ExportButtons from '@/components/ui/export-buttons'
import RequestModal from './components/RequestModal'
import { getEmployeeRequests, deleteEmployeeRequest } from '@/app/services/api/employeeRequests'
import { getRequestTypes } from './constants/requestTypes'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function RequestsPage() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)

  // Request types (same as in RequestModal)
  const requestTypes = getRequestTypes(isArabic)

  // Column configuration for export
  const hrRequestsColumnConfig = {
    id: {
      ar: 'المعرف',
      en: 'ID',
      dataKey: 'id'
    },
    employee_name: {
      ar: 'اسم الموظف',
      en: 'Employee Name',
      dataKey: 'employee_name'
    },
    type: {
      ar: 'النوع',
      en: 'Type',
      dataKey: 'type',
      formatter: (value) => {
        const type = requestTypes.find(t => t.value === value)
        return type ? type.label : value
      }
    },
    start_date: {
      ar: 'تاريخ البداية',
      en: 'Start Date',
      dataKey: 'start_date',
      type: 'date'
    },
    end_date: {
      ar: 'تاريخ النهاية',
      en: 'End Date',
      dataKey: 'end_date',
      type: 'date'
    },
    days: {
      ar: 'الأيام',
      en: 'Days',
      dataKey: 'days'
    },
    manager_approval: {
      ar: 'موافقة المدير',
      en: 'Manager Approval',
      dataKey: 'manager_approval',
      type: 'status',
      statusMap: {
        'approved': { ar: 'موافق', en: 'Approved' },
        'rejected': { ar: 'مرفوض', en: 'Rejected' },
        'pending': { ar: 'قيد الانتظار', en: 'Pending' }
      }
    },
    hr_approval: {
      ar: 'موافقة الموارد البشرية',
      en: 'HR Approval',
      dataKey: 'hr_approval',
      type: 'status',
      statusMap: {
        'approved': { ar: 'موافق', en: 'Approved' },
        'rejected': { ar: 'مرفوض', en: 'Rejected' },
        'pending': { ar: 'قيد الانتظار', en: 'Pending' }
      }
    },
    reason: {
      ar: 'السبب',
      en: 'Reason',
      dataKey: 'reason'
    },
    notes: {
      ar: 'الملاحظات',
      en: 'Notes',
      dataKey: 'notes'
    },
    created_at: {
      ar: 'تاريخ الإنشاء',
      en: 'Created At',
      dataKey: 'created_at',
      type: 'date'
    }
  }

  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  
  // Filter input states (not applied yet)
  const [searchTerm, setSearchTerm] = useState('')
  const [managerApprovalFilter, setManagerApprovalFilter] = useState('')
  const [hrApprovalFilter, setHrApprovalFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // Applied filters (actual API params)
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedManagerApproval, setAppliedManagerApproval] = useState('')
  const [appliedHrApproval, setAppliedHrApproval] = useState('')
  const [appliedType, setAppliedType] = useState('')

  // Build query params with applied filters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    search: appliedSearch || null,
    manager_approval: (appliedManagerApproval && appliedManagerApproval !== 'all') ? appliedManagerApproval : null,
    hr_approval: (appliedHrApproval && appliedHrApproval !== 'all') ? appliedHrApproval : null,
    type: (appliedType && appliedType !== 'all') ? appliedType : null,
  }), [currentPage, pageSize, appliedSearch, appliedManagerApproval, appliedHrApproval, appliedType])

  // Fetch requests data with pagination and filters
  const { data: requestsData, error, mutate, isLoading } = useSWR(
    ['employee-requests', queryParams],
    () => getEmployeeRequests(queryParams)
  )

  const requests = requestsData?.data || []
  const pagination = requestsData?.pagination || { total: 0, page: 1, totalPages: 1 }

  const handleAddRequest = () => {
    setSelectedRequest(null)
    setIsModalOpen(true)
  }

  const handleEditRequest = (request) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (request) => {
    setRequestToDelete(request)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return

    try {
      const response = await deleteEmployeeRequest(requestToDelete.id)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف الطلب بنجاح' : 'Request deleted successfully')
        mutate()
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error deleting request:', error)
      toast.error(isArabic ? 'حدث خطأ أثناء حذف الطلب' : 'Error deleting request')
    } finally {
      setDeleteDialogOpen(false)
      setRequestToDelete(null)
    }
  }

  const handleModalSuccess = () => {
    mutate()
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleApplyFilters = () => {
    // Apply all filters and reset to page 1
    setAppliedSearch(searchTerm)
    setAppliedManagerApproval(managerApprovalFilter)
    setAppliedHrApproval(hrApprovalFilter)
    setAppliedType(typeFilter)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    // Reset input states
    setSearchTerm('')
    setManagerApprovalFilter('')
    setHrApprovalFilter('')
    setTypeFilter('')
    // Reset applied states
    setAppliedSearch('')
    setAppliedManagerApproval('')
    setAppliedHrApproval('')
    setAppliedType('')
    setCurrentPage(1)
  }

  // Allow Enter key to apply filters
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  const getApprovalBadge = (status) => {
    if (status === 'approved') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {isArabic ? 'موافق' : 'Approved'}
        </Badge>
      )
    } else if (status === 'rejected') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {isArabic ? 'مرفوض' : 'Rejected'}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {isArabic ? 'قيد الانتظار' : 'Pending'}
        </Badge>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data'}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {isArabic ? 'طلبات الموظفين' : 'Employee Requests'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isArabic 
                  ? `إجمالي الطلبات: ${pagination.total}` 
                  : `Total Requests: ${pagination.total}`
                }
              </p>
            </div>
          </div>
          <Button onClick={handleAddRequest}>
            <Plus className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {isArabic ? 'إضافة طلب' : 'Add Request'}
          </Button>
        </CardHeader>

        {/* Export Buttons */}
        {requests && requests.length > 0 && (
          <div className="px-6 pb-4">
            <ExportButtons
              data={requests}
              columnConfig={hrRequestsColumnConfig}
              language={language}
              exportName="hr-requests"
              sheetName={language === 'ar' ? 'طلبات الموظفين' : 'HR Requests'}
            />
          </div>
        )}

        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search Input */}
              <div className="relative lg:col-span-2">
                <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <Input
                  placeholder={isArabic ? 'ابحث عن موظف أو نوع...' : 'Search employee or type...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`${isArabic ? 'pr-10' : 'pl-10'}`}
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? 'نوع الطلب' : 'Request Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'الكل' : 'All Types'}</SelectItem>
                  {requestTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Manager Approval Filter */}
              <Select value={managerApprovalFilter} onValueChange={setManagerApprovalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? 'موافقة المدير' : 'Manager Approval'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
                  <SelectItem value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                  <SelectItem value="approved">{isArabic ? 'موافق' : 'Approved'}</SelectItem>
                  <SelectItem value="rejected">{isArabic ? 'مرفوض' : 'Rejected'}</SelectItem>
                </SelectContent>
              </Select>

              {/* HR Approval Filter */}
              <Select value={hrApprovalFilter} onValueChange={setHrApprovalFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? 'موافقة HR' : 'HR Approval'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
                  <SelectItem value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                  <SelectItem value="approved">{isArabic ? 'موافق' : 'Approved'}</SelectItem>
                  <SelectItem value="rejected">{isArabic ? 'مرفوض' : 'Rejected'}</SelectItem>
                </SelectContent>
              </Select>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleApplyFilters} className="flex-1">
                  <Search className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                  {isArabic ? 'بحث' : 'Search'}
                </Button>
                <Button variant="outline" onClick={handleResetFilters}>
                  {isArabic ? 'إعادة' : 'Reset'}
                </Button>
              </div>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="text-center p-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {isArabic ? 'لا توجد طلبات' : 'No requests found'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {isArabic 
                  ? 'ابدأ بإضافة طلب جديد باستخدام الزر أعلاه' 
                  : 'Start by adding a new request using the button above'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">{isArabic ? '#' : '#'}</TableHead>
                    <TableHead>{isArabic ? 'الموظف' : 'Employee'}</TableHead>
                    <TableHead>{isArabic ? 'النوع' : 'Type'}</TableHead>
                    <TableHead>{isArabic ? 'تاريخ الطلب' : 'Request Date'}</TableHead>
                    {/* <TableHead>{isArabic ? 'من تاريخ' : 'From Date'}</TableHead>
                    <TableHead>{isArabic ? 'إلى تاريخ' : 'To Date'}</TableHead> */}
                    <TableHead>{isArabic ? 'موافقة المدير' : 'Manager'}</TableHead>
                    <TableHead>{isArabic ? 'موافقة HR' : 'HR'}</TableHead>
                    <TableHead className="text-center">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request, index) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {(pagination.page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {request.employee_name || '-'}
                          </span>
                        
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{request.type || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {request.date 
                          ? format(new Date(request.date), 'yyyy-MM-dd')
                          : '-'
                        }
                      </TableCell>
                      {/* <TableCell>
                        {request.from_date 
                          ? format(new Date(request.from_date), 'yyyy-MM-dd')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {request.to_date 
                          ? format(new Date(request.to_date), 'yyyy-MM-dd')
                          : '-'
                        }
                      </TableCell> */}
                      <TableCell>
                        {getApprovalBadge(request.manager_approval)}
                      </TableCell>
                      <TableCell>
                        {getApprovalBadge(request.hr_approval)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRequest(request)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(request)}
                            className="hover:bg-red-50 hover:text-red-600"
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
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {isArabic 
                  ? `عرض ${((pagination.page - 1) * pageSize) + 1} - ${Math.min(pagination.page * pageSize, pagination.total)} من ${pagination.total}`
                  : `Showing ${((pagination.page - 1) * pageSize) + 1} - ${Math.min(pagination.page * pageSize, pagination.total)} of ${pagination.total}`
                }
              </div>

              <div className="flex items-center gap-2">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'عرض:' : 'Show:'}
                  </span>
                  <Select value={pageSize.toString()} onValueChange={(value) => {
                    setPageSize(Number(value))
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {isArabic ? 'السابق' : 'Previous'}
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  {isArabic ? 'التالي' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Modal */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        request={selectedRequest}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? 'تأكيد الحذف' : 'Confirm Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic 
                ? 'هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this request? This action cannot be undone.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isArabic ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              {isArabic ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RequestsPage