"use client"

import { useState } from "react"
import { useFormikContext } from '../FormikContext'
import { useTranslations } from "@/hooks/useTranslations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, File, Minus, Download } from "lucide-react"
import { cn } from "@/lib/utils"

function CourtFiles() {
  const { values, setFieldValue } = useFormikContext()
  const courtFiles = values.courtFiles || []
  const { t } = useTranslations()
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (files) => {
    const fileList = Array.from(files)
    
    
    // Add files directly to Formik without any processing
    const updatedFiles = [...courtFiles, ...fileList]
    setFieldValue('courtFiles', updatedFiles)
    
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files)
      // Clear the input value to allow selecting the same file again
      e.target.value = ''
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleRemoveFile = (index) => {
    const updatedFiles = courtFiles.filter((_, i) => i !== index)
    setFieldValue('courtFiles', updatedFiles)
  }

  const handleDownloadFile = (index) => {
    const file = courtFiles[index]
    
    if (file && file.name) {
      try {
        // Create URL directly from the File object
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {

      }
    }
  }

  const getFileIcon = (file) => {
    return <File className="w-5 h-5 text-blue-600" />
  }

  const formatFileSize = (file) => {
    try {
      const sizeInBytes = file.size || 0
      
      if (sizeInBytes < 1024) return `${sizeInBytes.toFixed(0)} B`
      if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
    } catch {
      return 'Unknown size'
    }
  }

  const getFileType = (file) => {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown'
      return extension.toUpperCase()
    } catch {
      return 'UNKNOWN'
    }
  }

  const formatUploadDate = () => {
    try {
      return new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Unknown date'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="w-5 h-5" />
          {t('court.files')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div className="space-y-2">
          <Label htmlFor="courtFileUpload" className="text-sm font-medium">
            {t('court.attachFiles')}
          </Label>
          
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('courtFileUpload')?.click()}
          >
            <input
              id="courtFileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.rtf"
            />
            <div className="flex flex-col items-center gap-2">
              <Plus className="w-8 h-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">{t('court.clickToUpload')}</span>
                <span className="mx-2">{t('common.or')}</span>
                <span>{t('court.dragAndDrop')}</span>
              </div>
              <p className="text-xs text-gray-500">
                {t('court.supportedFormats')}
              </p>
            </div>
          </div>
        </div>

        {/* Display Uploaded Files */}
        {courtFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                {t('court.uploadedFiles')} ({courtFiles.length})
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFieldValue('courtFiles', [])}
                className="text-red-600 hover:text-red-700"
              >
                {t('court.clearAll')}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {courtFiles.map((file, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file?.name || 'Unknown file'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatFileSize(file)}</span>
                          <span>•</span>
                          <span>{formatUploadDate()}</span>
                          <span>•</span>
                          <span className="bg-gray-200 px-1 rounded">
                            {getFileType(file)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(index)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {courtFiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">{t('court.noFilesUploaded')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CourtFiles