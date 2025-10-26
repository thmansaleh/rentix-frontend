"use client"

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Loader2, FileText, Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { getReviews, deleteReview, getReviewById } from '@/app/services/api/reviews'
import ReviewModal from './ReviewModal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Reviews({ employeeId }) {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false)
  const [viewingDocuments, setViewingDocuments] = useState([])

  // SWR fetcher function
  const fetcher = async (url) => {
    const response = await getReviews(employeeId)
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
    }
  }

  // Use SWR for data fetching
  const { data: reviews, error, isLoading } = useSWR(
    employeeId ? `/api/reviews?employee_id=${employeeId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Show error toast if there's an error
  if (error) {
    toast.error(error.message || (isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading reviews'))
  }

  const handleAddReview = () => {
    setSelectedReview(null)
    setIsModalOpen(true)
  }

  const handleEditReview = async (review) => {
    try {
      // Fetch full review details with documents
      const response = await getReviewById(review.id)
      if (response.success) {
        setSelectedReview(response.data)
        setIsModalOpen(true)
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading review details')
    }
  }

  const handleViewDocuments = async (review) => {
    try {
      const response = await getReviewById(review.id)
      if (response.success && response.data.documents) {
        setViewingDocuments(response.data.documents)
        setIsDocumentsDialogOpen(true)
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ أثناء تحميل المستندات' : 'Error loading documents')
    }
  }

  const handleDeleteReview = async (id) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذه التقييم وجميع مستنداتها؟' : 'Are you sure you want to delete this review and all its documents?')) {
      return
    }

    try {
      const response = await deleteReview(id)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف التقييم بنجاح' : 'Review deleted successfully')
        // Mutate the SWR cache to refetch data
        mutate(`/api/reviews?employee_id=${employeeId}`)
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ أثناء حذف التقييم' : 'Error deleting review')
    }
  }

  const handleModalSuccess = () => {
    // Mutate the SWR cache to refetch data
    mutate(`/api/reviews?employee_id=${employeeId}`)
  }

  const getReviewTypeBadge = (type) => {
    const typeConfig = {
      annual: { color: 'bg-blue-500', label: isArabic ? 'سنوي' : 'Annual' },
      probation: { color: 'bg-purple-500', label: isArabic ? 'شهري' : 'Monthly' },
      quarterly: { color: 'bg-orange-500', label: isArabic ? 'ربع سنوي' : 'Quarterly' },
      'mid-year': { color: 'bg-green-500', label: isArabic ? 'ذاتي' : 'Self' },
      performance: { color: 'bg-pink-500', label: isArabic ? 'رفع الأداء' : 'Performance' },
    }

    const config = typeConfig[type] || { color: 'bg-gray-500', label: type }

    return (
      <Badge variant="default" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isArabic ? 'التقييمات' : 'Reviews'}</CardTitle>
              <CardDescription>
                {isArabic ? 'إدارة تقييمات أداء الموظف' : 'Manage employee performance reviews'}
              </CardDescription>
            </div>
            <Button onClick={handleAddReview}>
              <Plus className="h-4 w-4 mr-2" />
              {isArabic ? 'إضافة تقييم' : 'Add Review'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isArabic ? 'لا توجد تقييمات' : 'No reviews found'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? 'التاريخ' : 'Date'}</TableHead>
                    <TableHead>{isArabic ? 'اسم الموظف' : 'Employee Name'}</TableHead>
                    <TableHead>{isArabic ? 'نوع التقييم' : 'Review Type'}</TableHead>
                    <TableHead>{isArabic ? 'المستندات' : 'Documents'}</TableHead>
                    <TableHead>{isArabic ? 'تم الإنشاء بواسطة' : 'Created By'}</TableHead>
                    <TableHead className="text-right">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        {review.date ? format(new Date(review.date), 'yyyy-MM-dd') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {review.employee_name || '-'}
                      </TableCell>
                      <TableCell>
                        {getReviewTypeBadge(review.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{review.documents_count || 0}</span>
                          {review.documents_count > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDocuments(review)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {review.created_by_name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditReview(review)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        employeeId={employeeId}
        review={selectedReview}
      />

      {/* Documents Dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isArabic ? 'المستندات' : 'Documents'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {viewingDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {isArabic ? 'لا توجد مستندات' : 'No documents found'}
              </div>
            ) : (
              viewingDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.document_name}</p>
                      <p className="text-xs text-gray-500">
                        {isArabic ? 'تم الرفع بواسطة: ' : 'Uploaded by: '} {doc.created_by_name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.document_url, '_blank')}
                  >
                    {isArabic ? 'عرض' : 'View'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Reviews