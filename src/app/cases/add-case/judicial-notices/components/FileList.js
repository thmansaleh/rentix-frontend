import { Button } from "@/components/ui/button"
import { CircleX } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"
import { getFileIcon, formatFileSize } from "../utils/fileHelpers"

/**
 * FileList component for displaying uploaded files
 */
export const FileList = ({ files, onRemoveFile }) => {
  const { t } = useTranslations()

  if (!files || files.length === 0) {
    return null
  }

  return (
    <div className="space-y-2 max-h-32 overflow-y-auto">
      <div className="text-sm font-medium text-gray-700">
        {t('judicialNotices.selectedFiles')} ({files.length})
      </div>
      {files.map((file, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="text-blue-600 flex-shrink-0">
              {getFileIcon(file.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-blue-800 truncate">
                {file.name}
              </div>
              <div className="text-xs text-blue-600">
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFile(index)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
          >
            <CircleX className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
