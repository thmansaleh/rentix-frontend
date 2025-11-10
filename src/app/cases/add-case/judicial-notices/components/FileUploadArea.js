import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"

/**
 * FileUploadArea component for handling file uploads with drag and drop
 */
export const FileUploadArea = ({ 
  onFileChange, 
  isDragOver, 
  onDragOver, 
  onDragLeave, 
  onDrop,
  inputId = "fileUpload"
}) => {
  const { t } = useTranslations()

  return (
    <div 
      className={cn(
        "relative transition-colors duration-200",
        isDragOver && "ring-2 ring-blue-500"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        id={inputId}
        type="file"
        multiple
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
      <div className={cn(
        "flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
        isDragOver 
          ? "border-blue-500 bg-blue-50" 
          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
      )}>
        <div className="flex flex-col items-center space-y-2 text-gray-500">
          <Plus className="w-6 h-6" />
          <div className="text-sm text-center">
            <span className="font-medium">
              {isDragOver ? t('judicialNotices.dropFiles') : t('judicialNotices.clickToAddFiles')}
            </span>
            <br />
            <span className="text-xs">{t('judicialNotices.supportedFormats')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
