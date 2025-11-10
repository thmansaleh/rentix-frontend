import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslations } from "@/hooks/useTranslations"
import { NoticeForm } from "./NoticeForm"

/**
 * EditNoticeDialog component for editing existing judicial notices
 */
export const EditNoticeDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  onInputChange, 
  onFileChange, 
  onRemoveFile, 
  onUpdate 
}) => {
  const { t } = useTranslations()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('judicialNotices.editNotice')}</DialogTitle>
        </DialogHeader>
        
        <NoticeForm
          formData={formData}
          onInputChange={onInputChange}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
          idPrefix="edit-"
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('judicialNotices.cancel')}
          </Button>
          <Button onClick={onUpdate}>
            {t('judicialNotices.update')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
