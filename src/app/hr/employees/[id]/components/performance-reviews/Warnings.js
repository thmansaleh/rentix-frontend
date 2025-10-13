"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, FileText, Loader2, Download } from 'lucide-react'
import { toast } from 'react-toastify'
import WarningModal from './WarningModal'
import { getWarnings, getWarningDocuments, deleteWarning } from '@/app/services/api/warnings'

function Warnings({ employeeId }) {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWarning, setSelectedWarning] = useState(null)
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false)
  const [selectedWarningDocuments, setSelectedWarningDocuments] = useState(null)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)

  // Fetch warnings data
  const { data: warningsData, error, mutate, isLoading } = useSWR(
    employeeId ? ['warnings', employeeId] : null,
    () => getWarnings(employeeId)
  )

  const warnings = warningsData?.data || []

  const handleAddWarning = () => {
    setSelectedWarning(null)
    setIsModalOpen(true)
  }

  const handleEditWarning = async (warning) => {
    try {
      // Fetch documents for this warning
      const response = await getWarningDocuments(warning.id)
      if (response.success) {
        setSelectedWarning({
          ...warning,
          documents: response.data || []
        })
      } else {
        setSelectedWarning(warning)
      }
    } catch (error) {
      console.error('Error fetching warning documents:', error)
      setSelectedWarning(warning)
    }
    setIsModalOpen(true)
  }

  const handleDeleteWarning = async (warningId) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الانذار؟' : 'Are you sure you want to delete this warning?')) {
      return
    }

    try {
      const response = await deleteWarning(warningId)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف الانذار بنجاح' : 'Warning deleted successfully')
        mutate()
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error deleting warning:', error)
      toast.error(isArabic ? 'حدث خطأ أثناء حذف الانذار' : 'Error deleting warning')
    }
  }

  const handleViewDocuments = async (warning) => {
    setIsLoadingDocuments(true)
    setIsDocumentsDialogOpen(true)
    try {
      const response = await getWarningDocuments(warning.id)
      if (response.success) {
        setSelectedWarningDocuments({
          ...warning,
          documents: response.data
        })
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
        setIsDocumentsDialogOpen(false)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error(isArabic ? 'حدث خطأ أثناء جلب المستندات' : 'Error fetching documents')
      setIsDocumentsDialogOpen(false)
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const handleModalSuccess = () => {
    mutate()
  }

  const getWarningTypeBadge = (type) => {
    if (type === 'verbal') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          {isArabic ? 'شفهي' : 'Verbal'}
        </Badge>
      )
    } else if (type === 'written') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {isArabic ? 'كتابي' : 'Written'}
        </Badge>
      )
    }
    return <span className="text-sm">{type}</span>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isArabic ? 'الانذارات' : 'Warnings'}</CardTitle>
          <Button onClick={handleAddWarning}>
            <Plus className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {isArabic ? 'إضافة انذار' : 'Add Warning'}
          </Button>
        </CardHeader>
        <CardContent>
          {warnings.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {isArabic ? 'لا توجد انذارات' : 'No warnings'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? '#' : '#'}</TableHead>
                    <TableHead>{isArabic ? 'النوع' : 'Type'}</TableHead>
                    <TableHead>{isArabic ? 'التاريخ' : 'Date'}</TableHead>
                    <TableHead>{isArabic ? 'السبب' : 'Reason'}</TableHead>
                    <TableHead>{isArabic ? 'المستندات' : 'Documents'}</TableHead>
                    <TableHead className="text-center">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warnings.map((warning, index) => (
                    <TableRow key={warning.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {getWarningTypeBadge(warning.type)}
                      </TableCell>
                      <TableCell>
                        {warning.date 
                          ? format(new Date(warning.date), 'yyyy-MM-dd')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <span className="text-sm line-clamp-2">
                          {warning.reason || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {warning.documents_count > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocuments(warning)}
                          >
                            <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                            {warning.documents_count} {isArabic ? 'ملف' : 'file(s)'}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            {isArabic ? 'لا يوجد' : 'None'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditWarning(warning)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWarning(warning.id)}
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

      {/* Warning Modal */}
      <WarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        employeeId={employeeId}
        warning={selectedWarning}
      />

      {/* Documents Viewer Dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isArabic ? 'مستندات الانذار' : 'Warning Documents'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isLoadingDocuments ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : selectedWarningDocuments?.documents?.length > 0 ? (
              <div className="space-y-2">
                {selectedWarningDocuments.documents.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{doc.document_name}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.document_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                {isArabic ? 'لا توجد مستندات' : 'No documents'}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Warnings