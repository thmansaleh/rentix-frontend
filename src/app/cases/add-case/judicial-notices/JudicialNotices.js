"use client"

import { useState, useCallback } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
import { useFormikContext } from '../FormikContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Plus, CalendarIcon, Pen, Trash2, File, Minus, Check, FileText, Image, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to get file type icon
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || 'unknown'
  
  switch (extension) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="w-4 h-4" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return <Image className="w-4 h-4" />
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="w-4 h-4" />
    default:
      return <File className="w-4 h-4" />
  }
}

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function JudicialNotices() {
  const { values, setFieldValue } = useFormikContext()
  const { JudicialNotices: notices } = values
  const { t } = useTranslations()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNoticeIndex, setEditingNoticeIndex] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState({
    certificationDate: null,
    noticePeriod: "",
    noticeCompleted: false,
    lawsuitFiled: false,
    files: []
  })

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      // Store files directly without base64 conversion
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }))
    }
  }, [])

  const handleAddNotice = async () => {
    if (formData.certificationDate && formData.noticePeriod) {
      const newNotice = {
        id: Date.now(),
        certificationDate: formData.certificationDate.toISOString().split('T')[0],
        noticePeriod: formData.noticePeriod,
        noticeCompleted: formData.noticeCompleted,
        lawsuitFiled: formData.lawsuitFiled,
        files: formData.files
      }
      
      const currentNotices = [...(notices || [])]
      currentNotices.push(newNotice)
      setFieldValue('JudicialNotices', currentNotices)
      
      setFormData({
        certificationDate: null,
        noticePeriod: "",
        noticeCompleted: false,
        lawsuitFiled: false,
        files: []
      })
      setIsDialogOpen(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Store files directly without base64 conversion
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }))
    }
    // Clear the input so the same file can be selected again
    e.target.value = ''
  }

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleEditNotice = (noticeIndex) => {
    const notice = notices[noticeIndex]
    setEditingNoticeIndex(noticeIndex)
    
    setFormData({
      certificationDate: notice.certificationDate ? new Date(notice.certificationDate) : null,
      noticePeriod: notice.noticePeriod,
      noticeCompleted: notice.noticeCompleted,
      lawsuitFiled: notice.lawsuitFiled,
      files: notice.files || []
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateNotice = async () => {
    if (formData.certificationDate && formData.noticePeriod && editingNoticeIndex !== null) {
      const updatedNotice = {
        id: notices[editingNoticeIndex].id,
        certificationDate: formData.certificationDate.toISOString().split('T')[0],
        noticePeriod: formData.noticePeriod,
        noticeCompleted: formData.noticeCompleted,
        lawsuitFiled: formData.lawsuitFiled,
        files: formData.files
      }
      
      const currentNotices = [...(notices || [])]
      currentNotices[editingNoticeIndex] = updatedNotice
      setFieldValue('JudicialNotices', currentNotices)
      
      setFormData({
        certificationDate: null,
        noticePeriod: "",
        noticeCompleted: false,
        lawsuitFiled: false,
        files: []
      })
      setEditingNoticeIndex(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteNotice = (noticeIndex) => {
    const currentNotices = [...(notices || [])]
    currentNotices.splice(noticeIndex, 1)
    setFieldValue('JudicialNotices', currentNotices)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('judicialNotices.title')}</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <div className="space-y-4">
                  {/* Certification Date */}
                  <div className="space-y-2">
                    <Label htmlFor="certificationDate">{t('judicialNotices.certificationDate')}</Label>
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
                          onSelect={(date) => handleInputChange("certificationDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Notice Period */}
                  <div className="space-y-2">
                    <Label htmlFor="noticePeriod">{t('judicialNotices.noticePeriod')}</Label>
                    <Input
                      id="noticePeriod"
                      type="text"
                      placeholder={t('judicialNotices.noticePeriodPlaceholder')}
                      value={formData.noticePeriod}
                      onChange={(e) => handleInputChange("noticePeriod", e.target.value)}
                    />
                  </div>
                  
                  {/* Notice Completed Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noticeCompleted"
                      checked={formData.noticeCompleted}
                      onCheckedChange={(checked) => handleInputChange("noticeCompleted", checked)}
                    />
                    <Label htmlFor="noticeCompleted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('judicialNotices.noticeCompleted')}
                    </Label>
                  </div>

                  {/* Lawsuit Filed Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lawsuitFiled"
                      checked={formData.lawsuitFiled}
                      onCheckedChange={(checked) => handleInputChange("lawsuitFiled", checked)}
                    />
                    <Label htmlFor="lawsuitFiled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('judicialNotices.lawsuitFiled')}
                    </Label>
                  </div>
                  
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <Label htmlFor="judicialNoticesFileUpload" className="text-sm font-medium">
                      {t('judicialNotices.attachFiles')}
                    </Label>
                    
                    {/* File Upload Area */}
                    <div 
                      className={cn(
                        "relative transition-colors duration-200",
                        isDragOver && "ring-2 ring-blue-500"
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="judicialNoticesFileUpload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
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

                    {/* Display Selected Files */}
                    {formData.files.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="text-sm font-medium text-gray-700">
                          {t('judicialNotices.selectedFiles')} ({formData.files.length})
                        </div>
                        {formData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
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
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      {t('judicialNotices.cancel')}
                    </Button>
                    <Button onClick={handleAddNotice}>
                      {t('judicialNotices.add')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('judicialNotices.editNotice')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Certification Date - Edit */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-certificationDate">{t('judicialNotices.certificationDate')}</Label>
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
                          onSelect={(date) => handleInputChange("certificationDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Notice Period - Edit */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-noticePeriod">{t('judicialNotices.noticePeriod')}</Label>
                    <Input
                      id="edit-noticePeriod"
                      type="text"
                      placeholder={t('judicialNotices.noticePeriodPlaceholder')}
                      value={formData.noticePeriod}
                      onChange={(e) => handleInputChange("noticePeriod", e.target.value)}
                    />
                  </div>
                  
                  {/* Notice Completed Checkbox - Edit */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-noticeCompleted"
                      checked={formData.noticeCompleted}
                      onCheckedChange={(checked) => handleInputChange("noticeCompleted", checked)}
                    />
                    <Label htmlFor="edit-noticeCompleted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('judicialNotices.noticeCompleted')}
                    </Label>
                  </div>

                  {/* Lawsuit Filed Checkbox - Edit */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-lawsuitFiled"
                      checked={formData.lawsuitFiled}
                      onCheckedChange={(checked) => handleInputChange("lawsuitFiled", checked)}
                    />
                    <Label htmlFor="edit-lawsuitFiled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('judicialNotices.lawsuitFiled')}
                    </Label>
                  </div>
                  
                  {/* File Upload Section - Edit Dialog */}
                  <div className="space-y-3">
                    <Label htmlFor="editJudicialNoticesFileUpload" className="text-sm font-medium">
                      {t('judicialNotices.attachFiles')}
                    </Label>
                    
                    {/* File Upload Area */}
                    <div className="relative">
                      <input
                        id="editJudicialNoticesFileUpload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                      <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center space-y-2 text-gray-500">
                          <Plus className="w-6 h-6" />
                          <div className="text-sm text-center">
                            <span className="font-medium">{t('judicialNotices.clickToAddFiles')}</span>
                            <br />
                            <span className="text-xs">{t('judicialNotices.supportedFormats')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Display Selected Files */}
                    {formData.files.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="text-sm font-medium text-gray-700">
                          {t('judicialNotices.selectedFiles')} ({formData.files.length})
                        </div>
                        {formData.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
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
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      {t('judicialNotices.cancel')}
                    </Button>
                    <Button onClick={handleUpdateNotice}>
                      {t('judicialNotices.update')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('judicialNotices.noNotices')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('judicialNotices.certificationDate')}</TableHead>
                  <TableHead className="text-center">{t('judicialNotices.noticePeriod')}</TableHead>
                  <TableHead className="text-center">{t('judicialNotices.noticeCompleted')}</TableHead>
                  <TableHead className="text-center">{t('judicialNotices.lawsuitFiled')}</TableHead>
                  <TableHead className="text-center">{t('judicialNotices.attachedFiles')}</TableHead>
                  <TableHead className="text-center">{t('judicialNotices.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice, index) => (
                  <TableRow key={notice.id}>
                    <TableCell className="text-center">
                      {notice.certificationDate ? format(new Date(notice.certificationDate), "PPP", { locale: ar }) : t('judicialNotices.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      {notice.noticePeriod || t('judicialNotices.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {notice.noticeCompleted ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {notice.lawsuitFiled ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {notice.files && notice.files.length > 0 ? (
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <File className="w-3 h-3 mr-1" />
                            {notice.files.length} {notice.files.length === 1 ? t('judicialNotices.file') : t('judicialNotices.files')}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">{t('judicialNotices.noFiles')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNotice(index)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotice(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default JudicialNotices
