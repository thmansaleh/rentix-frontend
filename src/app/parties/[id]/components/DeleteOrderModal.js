"use client"

import React from 'react'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
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
import { Loader2, AlertTriangle } from 'lucide-react'

const DeleteOrderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isDeleting = false
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={isArabic ? 'text-right' : ''}>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t('orders.confirmDelete') || 'تأكيد حذف الطلب'}
          </AlertDialogTitle>
          <AlertDialogDescription className={isArabic ? 'text-right' : ''}>
            {t('orders.confirmDeleteMessage') || 'هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isArabic ? 'flex-row-reverse' : ''}>
          <AlertDialogCancel disabled={isDeleting}>
            {t('common.cancel') || 'إلغاء'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? (t('orders.deleting') || 'جاري الحذف...') : (t('common.delete') || 'حذف')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteOrderModal
