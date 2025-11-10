"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { deleteMemo } from "@/app/services/api/memos"

export default function DeleteMemoModal({ isOpen, onClose, memoId, memoTitle, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!memoId) return

    setIsDeleting(true)

    try {
      await deleteMemo(memoId)
      toast.success("تم حذف المذكرة بنجاح")
      onSuccess?.()
      onClose()
    } catch (error) {
      // Check if it's a permission error (403)
      const isPermissionError = error?.response?.status === 403;
      const errorMessage = isPermissionError 
        ? (error?.response?.data?.message || 'ليس لديك صلاحية لحذف المذكرة')
        : (error?.response?.data?.message || error.message || "حدث خطأ أثناء حذف المذكرة");
      
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </div>
          <DialogDescription className="text-right">
            هل أنت متأكد من حذف المذكرة &quot;{memoTitle}&quot;؟ هذا الإجراء لا يمكن التراجع عنه.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              "حذف"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
