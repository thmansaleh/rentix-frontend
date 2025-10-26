"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
import { deleteTaskComment, addCommentToTask } from "@/app/services/api/tasks"
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea.jsx"
import { Card } from "@/components/ui/card.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MessageCircle, Plus, Send, Trash2, User, AlertTriangle } from "lucide-react"

function TaskComments({ comments = [], onCommentsChange, isEditable = true, taskId }) {
  const { t } = useTranslations()
  const [newComment, setNewComment] = useState("")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, commentId: null, isNew: false })

  // Handle adding new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !taskId) return

    const loadingToast = toast.loading(t('comments.addingComment') || 'جاري إضافة التعليق...')
    
    try {
      const response = await addCommentToTask(taskId, newComment.trim())
      
      // Add the new comment to local state - use response data if available
      const comment = response?.data || {
        id: Date.now() + Math.random(),
        comment: newComment.trim(),
        created_at: new Date().toISOString(),
        commented_by_name: 'انت', // This should come from auth context
        isNew: true
      }

      onCommentsChange([...comments, comment])
      setNewComment("")
      setIsAddingComment(false)
      
      toast.dismiss(loadingToast)
      toast.success(t('comments.commentAddedSuccessfully') || 'تم إضافة التعليق بنجاح')
    } catch (error) {
      toast.dismiss(loadingToast)
      const errorMessage = error?.response?.data?.message || error?.message || t('comments.errorAddingComment') || 'حدث خطأ أثناء إضافة التعليق'
      toast.error(errorMessage)
    }
  }

  // Show delete confirmation dialog
  const showDeleteConfirmation = (commentId, isNew = false) => {
    setDeleteDialog({ isOpen: true, commentId, isNew })
  }

  // Handle removing comment after confirmation
  const handleRemoveComment = async () => {
    const { commentId, isNew } = deleteDialog
    
    // If it's a new comment (not saved to backend yet), just remove from local state
    if (isNew) {
      const updatedComments = comments.filter(comment => comment.id !== commentId)
      onCommentsChange(updatedComments)
      setDeleteDialog({ isOpen: false, commentId: null, isNew: false })
      return
    }

    // For existing comments, call the API
    const loadingToast = toast.loading(t('comments.deletingComment') || 'جاري حذف التعليق...')
    
    try {
      await deleteTaskComment(commentId)
      
      // Remove from local state after successful API call
      const updatedComments = comments.filter(comment => comment.id !== commentId)
      onCommentsChange(updatedComments)
      
      toast.dismiss(loadingToast)
      toast.success(t('comments.commentDeletedSuccessfully') || 'تم حذف التعليق بنجاح')
    } catch (error) {
      toast.dismiss(loadingToast)
      const errorMessage = error?.response?.data?.message || error?.message || t('comments.errorDeletingComment') || 'حدث خطأ أثناء حذف التعليق'
      toast.error(errorMessage)
    }
    
    // Close dialog
    setDeleteDialog({ isOpen: false, commentId: null, isNew: false })
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "PPP 'في' p", { locale: ar })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {t('tasks.comments') || 'التعليقات'} 
          {comments.length > 0 && <span className="ml-2 text-muted-foreground">({comments.length})</span>}
        </Label>
        
        {/* Add Comment Button - Only show if editable */}
        {isEditable && !isAddingComment && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingComment(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('comments.addComment') || 'إضافة تعليق'}
          </Button>
        )}
      </div>

      {/* Add New Comment Form */}
      {isEditable && isAddingComment && (
        <Card className="p-4">
          <div className="space-y-3">
            <Label htmlFor="newComment" className="text-sm font-medium">
              {t('comments.newComment') || 'تعليق جديد'}
            </Label>
            <Textarea
              id="newComment"
              placeholder={t('comments.enterComment') || 'اكتب تعليقك هنا...'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddingComment(false)
                  setNewComment("")
                }}
              >
                {t('comments.cancel') || 'إلغاء'}
              </Button>
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t('comments.addComment') || 'إضافة تعليق'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="space-y-2">
                {/* Comment Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.commented_by_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    {comment.isNew && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {t('comments.new') || 'جديد'}
                      </span>
                    )}
                  </div>

                  {/* Remove Comment Button - Only show if editable */}
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showDeleteConfirmation(comment.id, comment.isNew)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title={t('comments.removeComment') || 'إزالة التعليق'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Comment Content */}
                <div className="mr-10">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">{t('comments.noComments') || 'لا توجد تعليقات'}</p>
          {isEditable && (
            <p className="text-xs mt-1">
              {t('comments.addFirstComment') || 'كن أول من يضيف تعليقاً'}
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open, commentId: null, isNew: false })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              {t('comments.confirmDelete') || 'تأكيد الحذف'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {t('comments.deleteConfirmMessage') || 'هل أنت متأكد من أنك تريد حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.'}
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, commentId: null, isNew: false })}
            >
              {t('comments.cancel') || 'إلغاء'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveComment}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('comments.delete') || 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskComments