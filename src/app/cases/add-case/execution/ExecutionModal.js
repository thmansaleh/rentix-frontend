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
import { CalendarIcon, Upload, File as FileIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

function ExecutionModal({ 
  isOpen, 
  onClose, 
  mode = "add", // "add" or "edit"
  formData, 
  onInputChange, 
  onSubmit, 
  onFileChange, 
  removeFile,
  executionStatuses = []
}) {
  const { t } = useTranslations()

  const isEditMode = mode === "edit"
  const dialogTitle = isEditMode ? t('executions.editExecution') : t('executions.addExecution')
  const submitButtonText = isEditMode ? t('executions.update') : t('executions.add')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Execution Date */}
          <div className="space-y-2">
            <Label>{t('executions.date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: ar }) : t('executions.selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => onInputChange('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Execution Type */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-type`}>{t('executions.type')}</Label>
            <Input
              id={`${mode}-type`}
              placeholder={t('executions.typePlaceholder')}
              value={formData.type}
              onChange={(e) => onInputChange('type', e.target.value)}
            />
          </div>

          {/* Execution Status */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-status`}>{t('executions.status')}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('executions.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                {executionStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Execution Amount */}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-amount`}>{t('executions.amount')}</Label>
            <Input
              id={`${mode}-amount`}
              type="number"
              placeholder={t('executions.amountPlaceholder')}
              value={formData.amount}
              onChange={(e) => onInputChange('amount', e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>{t('executions.attachedFiles')}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  onChange={onFileChange}
                  multiple
                  className="flex-1"
                  accept="*/*"
                />
                <Button type="button" size="sm" variant="outline" onClick={() => document.querySelector(`input[type="file"]`).click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('executions.upload')}
                </Button>
              </div>
              
              {/* Display selected files */}
              {formData.attachedFiles && formData.attachedFiles.length > 0 && (
                <div className="space-y-2 max-h-24 overflow-y-auto">
                  {formData.attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <FileIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">
                          {file.name || file.fileName || 'Unknown file'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={!formData.date || !formData.type || !formData.status || !formData.amount}
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ExecutionModal