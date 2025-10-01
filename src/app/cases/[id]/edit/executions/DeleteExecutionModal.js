"use client"

import React from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const DeleteExecutionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isSubmitting = false 
}) => {
  const t = useTranslations('executions')
  const tc = useTranslations('common')

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!isSubmitting) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('deleteExecutionTitle') || 'Delete Execution'}
          </DialogTitle>
          <DialogDescription>
            {t('deleteExecutionMessage') || 
             'Are you sure you want to delete this execution? This action cannot be undone and all associated data will be permanently removed.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {tc('cancel') || 'Cancel'}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (tc('deleting') || 'Deleting...') 
              : (t('deleteExecutionConfirm') || 'Yes, Delete Execution')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteExecutionModal