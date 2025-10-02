"use client"

import React, { useState, useCallback } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, File as FileIcon, User2, Loader2, FolderUp,  CircleX } from "lucide-react"
import { cn } from "@/lib/utils"
import { getEmployees } from "@/app/services/api/employees"
import { createTask } from "@/app/services/api/tasks"
import { toast } from 'react-toastify'

function AddTaskModal({ 
  isOpen, 
  onOpenChange, 
  caseId,
  onTaskCreated // Optional callback to refresh parent data
}) {
  const { t } = useTranslations()
  
  // Internal state management
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    assignedTo: "",
    dueDate: null,
    priority: "",
    attachedFiles: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch employees data
  const { data: employeesResponse, error: employeesError, isLoading: loadingEmployees } = useSWR(
    'employees', 
    getEmployees,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000 // 5 minutes
    }
  )
  
  const employees = employeesResponse?.data || []
  
  // Static options for priorities and task types
  const priorityOptions = [
    { value: "high", label: "عالية", color: "bg-red-100 text-red-800" },
    { value: "normal", label: "عادية", color: "bg-blue-100 text-blue-800" },
    { value: "low", label: "منخفضة", color: "bg-green-100 text-green-800" }
  ]

  const taskTypeOptions = [
    { value: "administrative", label: "مهمة ادارية" },
    { value: "legal", label: "قانونية" },
    { value: "session", label: "جلسة" },
    { value: "consultative", label: "استشارية" }
  ]
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle file changes
  const handleFileChange = (files) => {
    const currentFiles = formData.attachedFiles || []
    const newFiles = [...currentFiles, ...files]
    setFormData(prev => ({
      ...prev,
      attachedFiles: newFiles
    }))
  }

  // Handle file removal
  const handleFileRemove = (index) => {
    const updatedFiles = (formData.attachedFiles || []).filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      attachedFiles: updatedFiles
    }))
  }
  
  // Convert file to base64
  const fileToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }, [])

  // Handle file selection with base64 conversion
  const handleFileSelect = useCallback(async (selectedFiles) => {
    const filesArray = Array.from(selectedFiles);
    const processedFiles = []
    
    for (const file of filesArray) {
      try {
        const base64 = await fileToBase64(file);
        
        const newFile = {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          // Store file data for submission
          file: base64,
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          fileSize: file.size,
          id: Date.now() + Math.random()
        };

        processedFiles.push(newFile)
      } catch (error) {
        console.error("Error converting file to base64:", error);
        toast.error(`Error processing file: ${file.name}`)
      }
    }
    
    if (processedFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachedFiles: [...prev.attachedFiles, ...processedFiles]
      }))
    }
  }, [fileToBase64]);
  
  // Form validation
  const validateForm = () => {
    if (!formData.title?.trim()) return false
    if (!formData.description?.trim()) return false
    if (!formData.assignedTo) return false
    if (!formData.priority) return false
    if (!formData.dueDate) return false
    return true
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t('tasks.pleaseFillAllRequiredFields') || 'يرجى ملء جميع الحقول المطلوبة')
      return
    }

    if (!caseId) {
      toast.error('Case ID is required')
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading(t('tasks.creatingTask') || 'جاري إنشاء المهمة...')
    
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        taskType: formData.taskType,
        assigned_to: formData.assignedTo,
        due_date: formData.dueDate,
        priority: formData.priority,
        case_id: caseId,
        files: formData.attachedFiles
      }
      
      await createTask(taskData)
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success(t('tasks.taskCreatedSuccessfully') || 'تم إنشاء المهمة بنجاح')
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        taskType: "",
        assignedTo: "",
        dueDate: null,
        priority: "",
        attachedFiles: []
      })
      
      // Close modal
      onOpenChange(false)
      
      // Call callback to refresh parent data
      if (onTaskCreated && typeof onTaskCreated === 'function') {
        onTaskCreated()
      }
      
      console.log("✅ TASKS - Task added successfully");
    } catch (error) {
      console.error("Error creating task:", error)
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast)
      const errorMessage = error?.response?.data?.message || error?.message || t('tasks.errorCreatingTask') || 'حدث خطأ أثناء إنشاء المهمة'
      toast.error(errorMessage)
    } finally {
      // Reset loading state
      setIsSubmitting(false)
    }
  }
  
  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        taskType: "",
        assignedTo: "",
        dueDate: null,
        priority: "",
        attachedFiles: []
      })
    }
  }, [isOpen])

  const dialogTitle = t('tasks.addTask') || 'إضافة مهمة'
  const submitButtonText = t('tasks.add') || 'إضافة'

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className='text-center mr-3'>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="add-title">{t('tasks.taskTitle')}</Label>
            <Input
              id="add-title"
              type="text"
              placeholder={t('tasks.taskTitlePlaceholder')}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="add-description">{t('tasks.taskDescription')}</Label>
            <Input
              id="add-description"
              type="text"
              placeholder={t('tasks.taskDescriptionPlaceholder')}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center">
          {/* Task Type */}
          {taskTypeOptions && taskTypeOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="add-taskType">{t('tasks.taskType')}</Label>
              <Select value={formData.taskType} onValueChange={(value) => handleInputChange("taskType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('tasks.selectTaskType')} />
                </SelectTrigger>
                <SelectContent>
                  {taskTypeOptions.map((taskType) => (
                    <SelectItem key={taskType.value} value={taskType.value}>
                      {taskType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="add-priority">{t('tasks.priority')}</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
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
            <Label htmlFor="add-assignedTo">{t('tasks.assignedTo')}</Label>
            <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange("assignedTo", value)}>
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
            <Label htmlFor="add-dueDate">{t('tasks.dueDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
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
                    handleInputChange("dueDate", formattedDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Priority */}
         
          
          {/* File Upload Section */}
          <div className="space-y-3">
            <Label htmlFor="addFileUpload" className="text-sm font-medium">
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
                handleFileSelect(files)
              }}
              onClick={() => document.getElementById('addFileUpload').click()}
            >
              <FolderUp className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                {t('files.dragAndDrop')}
              </p>
              <p className="text-xs text-gray-500">
                {t('tasks.supportedFormats')}
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              id="addFileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files)
                handleFileSelect(files)
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
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(index)}
                      className="h-6 w-6 p-0 text-blue-600 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                    >
                      <CircleX className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('tasks.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? (t('tasks.creating') || 'جاري الإنشاء...') : submitButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddTaskModal