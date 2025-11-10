import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"
import { FileUploadArea } from "./FileUploadArea"
import { FileList } from "./FileList"
import { useFileUpload } from "../hooks/useFileUpload"

/**
 * NoticeForm component for creating/editing judicial notices
 */
export const NoticeForm = ({ 
  formData, 
  onInputChange, 
  onFileChange, 
  onRemoveFile,
  idPrefix = ""
}) => {
  const { t } = useTranslations()
  const { isDragOver, handleDragOver, handleDragLeave, handleDrop } = useFileUpload()

  const handleFilesSelected = (files) => {
    onFileChange({ target: { files } })
  }

  return (
    <div className="space-y-4">
      {/* Certification Date */}
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}certificationDate`}>
          {t('judicialNotices.certificationDate')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.certificationDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.certificationDate ? (
                format(formData.certificationDate, "PPP", { locale: ar })
              ) : (
                <span>{t('judicialNotices.selectCertificationDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.certificationDate}
              onSelect={(date) => onInputChange("certificationDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Notice Period */}
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}noticePeriod`}>
          {t('judicialNotices.noticePeriod')}
        </Label>
        <Input
          id={`${idPrefix}noticePeriod`}
          type="number"
          placeholder={t('judicialNotices.noticePeriodPlaceholder')}
          value={formData.noticePeriod}
          onChange={(e) => onInputChange("noticePeriod", e.target.value)}
        />
      </div>
      
      {/* Notice Completed Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${idPrefix}noticeCompleted`}
          checked={formData.noticeCompleted}
          onCheckedChange={(checked) => onInputChange("noticeCompleted", checked)}
        />
        <Label 
          htmlFor={`${idPrefix}noticeCompleted`} 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t('judicialNotices.noticeCompleted')}
        </Label>
      </div>

      {/* Lawsuit Filed Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${idPrefix}lawsuitFiled`}
          checked={formData.lawsuitFiled}
          onCheckedChange={(checked) => onInputChange("lawsuitFiled", checked)}
        />
        <Label 
          htmlFor={`${idPrefix}lawsuitFiled`} 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t('judicialNotices.lawsuitFiled')}
        </Label>
      </div>
      
      {/* File Upload Section */}
      <div className="space-y-3">
        <Label htmlFor={`${idPrefix}fileUpload`} className="text-sm font-medium">
          {t('judicialNotices.attachFiles')}
        </Label>
        
        <FileUploadArea
          onFileChange={onFileChange}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, handleFilesSelected)}
          inputId={`${idPrefix}fileUpload`}
        />

        <FileList 
          files={formData.files} 
          onRemoveFile={onRemoveFile}
        />
      </div>
    </div>
  )
}
