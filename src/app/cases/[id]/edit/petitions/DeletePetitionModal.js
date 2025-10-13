"use client"

import { useTranslations } from "@/hooks/useTranslations"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

function DeletePetitionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  petitionId,
  petitionData,
  isLoading = false
}) {
  const { t } = useTranslations()

  const handleConfirm = () => {
    if (petitionId) {
      onConfirm(petitionId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {t('petitions.deletePetition')}
          </DialogTitle>
          <DialogDescription className="pt-4">
            {t('petitions.deletePetitionConfirmation')}
          </DialogDescription>
        </DialogHeader>

        {petitionData && (
          <div className="py-4 space-y-2">
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">{t('petitions.id')}:</span>
                <span className="text-gray-900">{petitionData.id}</span>
              </div>
              {petitionData.type && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">{t('petitions.type')}:</span>
                  <span className="text-gray-900">{petitionData.type}</span>
                </div>
              )}
              {petitionData.date && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">{t('petitions.date')}:</span>
                  <span className="text-gray-900">
                    {new Date(petitionData.date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-red-600 font-medium">
              {t('petitions.deleteWarning')}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePetitionModal
