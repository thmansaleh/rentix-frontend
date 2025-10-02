"use client"

import { useState } from "react"
import { useTranslations } from "@/hooks/useTranslations"
import { deleteTaskDocument } from "@/app/services/api/tasks"
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FileText, Trash2, ExternalLink, AlertTriangle } from "lucide-react"

function TaskDocuments({ documents = [], onDocumentsChange, isEditable = true, taskId }) {
  const { t } = useTranslations()
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, documentId: null })

  // Show delete confirmation dialog
  const showDeleteConfirmation = (documentId) => {
    setDeleteDialog({ isOpen: true, documentId })
  }

  // Handle document removal after confirmation
  const handleRemoveDocument = async () => {
    const { documentId } = deleteDialog
    
    // Call the API to delete the document
    const loadingToast = toast.loading(t('documents.deletingDocument') || 'جاري حذف المستند...')
    
    try {
      await deleteTaskDocument(documentId)
      
      // Remove from local state after successful API call
      const updatedDocuments = documents.filter(doc => doc.id !== documentId)
      onDocumentsChange(updatedDocuments)
      
      toast.dismiss(loadingToast)
      toast.success(t('documents.documentDeletedSuccessfully') || 'تم حذف المستند بنجاح')
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.dismiss(loadingToast)
      const errorMessage = error?.response?.data?.message || error?.message || t('documents.errorDeletingDocument') || 'حدث خطأ أثناء حذف المستند'
      toast.error(errorMessage)
    }
    
    // Close dialog
    setDeleteDialog({ isOpen: false, documentId: null })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {t('tasks.documents') || 'المستندات'} 
          {documents.length > 0 && <span className="ml-2 text-muted-foreground">({documents.length})</span>}
        </Label>
      </div>

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {documents.map((document) => (
            <Card key={document.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {document.document_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('documents.uploadedBy') || 'رفع بواسطة'}: {document.uploaded_by_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Download/View button */}
                  {document.document_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (document.document_url.startsWith('http')) {
                          window.open(document.document_url, '_blank')
                        } else {
                          // Handle relative URLs
                          window.open(document.document_url, '_blank')
                        }
                      }}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title={t('documents.viewDocument') || 'عرض المستند'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Remove button - only show if editable */}
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showDeleteConfirmation(document.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title={t('documents.removeDocument') || 'إزالة المستند'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">{t('documents.noDocuments') || 'لا توجد مستندات مرفقة'}</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open, documentId: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              {t('documents.confirmDelete') || 'تأكيد حذف المستند'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {t('documents.deleteConfirmMessage') || 'هل أنت متأكد من أنك تريد حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.'}
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, documentId: null })}
            >
              {t('documents.cancel') || 'إلغاء'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveDocument}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('documents.delete') || 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskDocuments