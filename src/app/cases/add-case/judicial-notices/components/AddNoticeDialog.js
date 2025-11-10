import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"
import { NoticeForm } from "./NoticeForm"

/**
 * AddNoticeDialog component for adding new judicial notices
 */
export const AddNoticeDialog = ({ 
  isOpen, 
  onOpenChange, 
  formData, 
  onInputChange, 
  onFileChange, 
  onRemoveFile, 
  onAdd 
}) => {
  const { t } = useTranslations()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('judicialNotices.addNotice')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('judicialNotices.addNotice')}</DialogTitle>
        </DialogHeader>
        
        <NoticeForm
          formData={formData}
          onInputChange={onInputChange}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
          idPrefix="add-"
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('judicialNotices.cancel')}
          </Button>
          <Button onClick={onAdd}>
            {t('judicialNotices.add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
