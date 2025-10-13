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
import TrainingModal from './TrainingModal'
import { getTrainings, getTrainingDocuments, deleteTraining } from '@/app/services/api/trainings'

function Training({ employeeId }) {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState(null)
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false)
  const [selectedTrainingDocuments, setSelectedTrainingDocuments] = useState(null)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)

  // Fetch trainings data
  const { data: trainingsData, error, mutate, isLoading } = useSWR(
    employeeId ? ['trainings', employeeId] : null,
    () => getTrainings(employeeId)
  )

  const trainings = trainingsData?.data || []

  const handleAddTraining = () => {
    setSelectedTraining(null)
    setIsModalOpen(true)
  }

  const handleEditTraining = async (training) => {
    try {
      // Fetch documents for this training
      const response = await getTrainingDocuments(training.id)
      if (response.success) {
        setSelectedTraining({
          ...training,
          documents: response.data || []
        })
      } else {
        setSelectedTraining(training)
      }
    } catch (error) {
      console.error('Error fetching training documents:', error)
      setSelectedTraining(training)
    }
    setIsModalOpen(true)
  }

  const handleDeleteTraining = async (trainingId) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا التدريب؟' : 'Are you sure you want to delete this training?')) {
      return
    }

    try {
      const response = await deleteTraining(trainingId)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف التدريب بنجاح' : 'Training deleted successfully')
        mutate()
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error deleting training:', error)
      toast.error(isArabic ? 'حدث خطأ أثناء حذف التدريب' : 'Error deleting training')
    }
  }

  const handleViewDocuments = async (training) => {
    setIsLoadingDocuments(true)
    setIsDocumentsDialogOpen(true)
    try {
      const response = await getTrainingDocuments(training.id)
      if (response.success) {
        setSelectedTrainingDocuments({
          ...training,
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
          <CardTitle>{isArabic ? 'التدريب' : 'Training'}</CardTitle>
          <Button onClick={handleAddTraining}>
            <Plus className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {isArabic ? 'إضافة تدريب' : 'Add Training'}
          </Button>
        </CardHeader>
        <CardContent>
          {trainings.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {isArabic ? 'لا توجد سجلات تدريب' : 'No training records'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? '#' : '#'}</TableHead>
                    <TableHead>{isArabic ? 'النوع' : 'Type'}</TableHead>
                    <TableHead>{isArabic ? 'التاريخ' : 'Date'}</TableHead>
                    <TableHead>{isArabic ? 'المستندات' : 'Documents'}</TableHead>
                    <TableHead className="text-center">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training, index) => (
                    <TableRow key={training.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <span className="text-sm">{training.type || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {training.training_date 
                          ? format(new Date(training.training_date), 'yyyy-MM-dd')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {training.documents_count > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocuments(training)}
                          >
                            <FileText className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                            {training.documents_count} {isArabic ? 'ملف' : 'file(s)'}
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
                            onClick={() => handleEditTraining(training)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTraining(training.id)}
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

      {/* Training Modal */}
      <TrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        employeeId={employeeId}
        training={selectedTraining}
      />

      {/* Documents Viewer Dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isArabic ? 'مستندات التدريب' : 'Training Documents'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isLoadingDocuments ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : selectedTrainingDocuments?.documents?.length > 0 ? (
              <div className="space-y-2">
                {selectedTrainingDocuments.documents.map((doc, index) => (
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

export default Training