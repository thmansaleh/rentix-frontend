"use client"

import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, File as FileIcon, Minus, User, User2 } from "lucide-react"
import { cn } from "@/lib/utils"

function TaskModal({ 
  isOpen, 
  onOpenChange, 
  mode = "add", // "add" or "edit"
  formData, 
  onInputChange, 
  onSubmit, 
  employees = [], 
  loadingEmployees, 
  employeesError,
  priorityOptions = [],
  // Formik setFieldValue for direct file handling
  setFieldValue
}) {
  const { t } = useTranslations()

  // Handle file changes - use setFieldValue if available, otherwise fallback to onInputChange
  const handleFileChange = (files) => {
    const currentFiles = formData.attachedFiles || []
    const newFiles = [...currentFiles, ...files]
    
    if (setFieldValue && typeof setFieldValue === 'function') {
      setFieldValue('attachedFiles', newFiles)
    } else if (onInputChange) {
      onInputChange('attachedFiles', newFiles)
    }
  }

  // Handle file removal
  const handleFileRemove = (index) => {
    const updatedFiles = (formData.attachedFiles || []).filter((_, i) => i !== index)
    
    if (setFieldValue && typeof setFieldValue === 'function') {
      setFieldValue('attachedFiles', updatedFiles)
    } else if (onInputChange) {
      onInputChange('attachedFiles', updatedFiles)
    }
  }

  const isEditMode = mode === "edit"
  const dialogTitle = isEditMode ? t('tasks.editTask') : t('tasks.addTask')
  const submitButtonText = isEditMode ? t('tasks.update') : t('tasks.add')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className='text-center mr-3'>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-title`}>{t('tasks.taskTitle')}</Label>
            <Input
              id={`${mode}-title`}
              type="text"
              placeholder={t('tasks.taskTitlePlaceholder')}
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-description`}>{t('tasks.taskDescription')}</Label>
            <Input
              id={`${mode}-description`}
              type="text"
              placeholder={t('tasks.taskDescriptionPlaceholder')}
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4">
           <div className="space-y-2">
            <Label htmlFor={`${mode}-priority`}>{t('tasks.priority')}</Label>
            <Select value={formData.priority} onValueChange={(value) => onInputChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('tasks.selectPriority')} />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", priority.color)}>
                      {priority.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
         
          
          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-assignedTo`}>{t('tasks.assignedTo')}</Label>
            <Select value={formData.assignedTo} onValueChange={(value) => onInputChange("assignedTo", value)}>
              <SelectTrigger>
                <SelectValue placeholder={
                  loadingEmployees 
                    ? t('tasks.loadingEmployees') 
                    : t('tasks.selectEmployee')
                } />
              </SelectTrigger>
              <SelectContent>
                {loadingEmployees ? (
                  <SelectItem value="loading" disabled>
                    {t('tasks.loadingEmployees')}
                  </SelectItem>
                ) : employeesError ? (
                  <SelectItem value="error" disabled>
                    {t('tasks.errorLoadingEmployees')}
                  </SelectItem>
                ) : employees.length === 0 ? (
                  <SelectItem value="no-employees" disabled>
                    {t('tasks.noEmployees')}
                  </SelectItem>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <User2 className="w-4 h-4" />
                        <span>{employee.name}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-dueDate`}>{t('tasks.dueDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    format(
                      typeof formData.dueDate === 'string' 
                        ? new Date(formData.dueDate) 
                        : formData.dueDate, 
                      "PPP", 
                      { locale: ar }
                    )
                  ) : (
                    <span>{t('tasks.selectDueDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.dueDate 
                      ? typeof formData.dueDate === 'string' 
                        ? new Date(formData.dueDate) 
                        : formData.dueDate
                      : undefined
                  }
                  onSelect={(date) => {
                    // Format date as YYYY-MM-DD for database compatibility
                    const formattedDate = date ? format(date, "yyyy-MM-dd") : null;
                    onInputChange("dueDate", formattedDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Priority */}
         
          
          {/* File Upload Section */}
          <div className="space-y-3">
            <Label htmlFor={`${mode}FileUpload`} className="text-sm font-medium">
              {t('tasks.attachFiles')}
            </Label>
            
            {/* Enhanced File Upload Area with Drag & Drop */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
                "border-gray-300 hover:border-gray-400"
              )}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const files = Array.from(e.dataTransfer.files)
                handleFileChange(files)
              }}
              onClick={() => document.getElementById(`${mode}FileUpload`).click()}
            >
              <Plus className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                {t('files.dragAndDrop')}
              </p>
              <p className="text-xs text-gray-500">
                {t('tasks.supportedFormats')}
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              id={`${mode}FileUpload`}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files)
                handleFileChange(files)
                // Reset input value to allow selecting the same file again
                e.target.value = ''
              }}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />

            {/* Display Selected Files */}
            {formData.attachedFiles && formData.attachedFiles.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700">
                  {t('tasks.selectedFiles')} ({formData.attachedFiles.length})
                </div>
                {formData.attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <FileIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-blue-800 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-blue-600 flex-shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                    type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(index)}
                      className="h-6 w-6 p-0 text-blue-600 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button  type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('tasks.cancel')}
            </Button>
            <Button type="button" onClick={onSubmit}>
              {submitButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskModal