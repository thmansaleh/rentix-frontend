
"use client"

import { useState, useCallback } from "react"
import { useFormikContext } from "formik"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
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
import { Plus, CalendarIcon, CheckCircleIcon, XCircleIcon, Pen, Trash2, Plus, File, Minus, FileText, Image, FileSpreadsheet } from "lucide-react"
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

// Helper function to format date and time
const formatDateTime = (date, t) => {
  if (!date) return t('sessions.notSpecified')
  
  // Handle both Date objects and date strings from database
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return t('sessions.notSpecified')
  
  const dateString = format(dateObj, "PPP", { locale: ar })
  const timeString = format(dateObj, "HH:mm")
  
  // Check if time is set (not 00:00)
  if (timeString !== "00:00") {
    return `${dateString} - ${timeString}`
  }
  return dateString
}

// Helper function to get time string from date
const getTimeFromDate = (date) => {
  if (!date) return ""
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return ""
  return format(dateObj, "HH:mm")
}

// Helper function to set time on date
const setTimeOnDate = (date, timeString) => {
  if (!timeString) return date
  
  const dateObj = date ? (typeof date === 'string' ? new Date(date) : new Date(date)) : new Date()
  const [hours, minutes] = timeString.split(':').map(Number)
  dateObj.setHours(hours, minutes, 0, 0)
  return dateObj
}

function Sessions() {
  const { values, setFieldValue } = useFormikContext()
  const { sessions = [] } = values
  const { t } = useTranslations()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSessionIndex, setEditingSessionIndex] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState({
    date: null,
    link: "",
    isExpertSession: false,
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

  const handleDrop = useCallback(async (e) => {
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

  const handleAddSession = async () => {
    if (formData.date && formData.link) {
      // Format date for MySQL (YYYY-MM-DD HH:mm:ss)
      const formattedDate = format(formData.date, 'yyyy-MM-dd HH:mm:ss')
      
      const newSession = {
        id: Date.now(),
        date: formattedDate,
        link: formData.link,
        isExpertSession: formData.isExpertSession,
        files: formData.files
      }
      
      const updatedSessions = [...sessions, newSession]
      setFieldValue('sessions', updatedSessions)
      
      setFormData({
        date: null,
        link: "",
        isExpertSession: false,
        files: []
      })
      setIsDialogOpen(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field === "time") {
      // Handle time change by updating the date with the new time
      setFormData(prev => ({
        ...prev,
        date: setTimeOnDate(prev.date || new Date(), value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleFileChange = async (e) => {
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

  const handleEditSession = (sessionIndex) => {
    const session = sessions[sessionIndex]
    setEditingSessionIndex(sessionIndex)
    
    setFormData({
      date: session.date ? new Date(session.date) : null,
      link: session.link,
      isExpertSession: session.isExpertSession,
      files: session.files || []
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSession = async () => {
    if (formData.date && formData.link && editingSessionIndex !== null) {
      // Format date for MySQL (YYYY-MM-DD HH:mm:ss)
      const formattedDate = format(formData.date, 'yyyy-MM-dd HH:mm:ss')
      
      const updatedSession = {
        ...sessions[editingSessionIndex],
        date: formattedDate,
        link: formData.link,
        isExpertSession: formData.isExpertSession,
        files: formData.files
      }
      
      const updatedSessions = [...sessions]
      updatedSessions[editingSessionIndex] = updatedSession
      setFieldValue('sessions', updatedSessions)
      
      setFormData({
        date: null,
        link: "",
        isExpertSession: false,
        files: []
      })
      setEditingSessionIndex(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteSession = (sessionIndex) => {
    const updatedSessions = sessions.filter((_, index) => index !== sessionIndex)
    setFieldValue('sessions', updatedSessions)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('sessions.title')}</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('sessions.addSession')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('sessions.addSession')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t('sessions.date')}</Label>
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
                          {formData.date ? (
                            format(formData.date, "PPP", { locale: ar })
                          ) : (
                            <span>{t('sessions.selectDate')}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange("date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={getTimeFromDate(formData.date)}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link">{t('sessions.link')}</Label>
                    <Input
                      id="link"
                      type="url"
                      placeholder={t('sessions.linkPlaceholder')}
                      value={formData.link}
                      onChange={(e) => handleInputChange("link", e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isExpertSession"
                      checked={formData.isExpertSession}
                      onCheckedChange={(checked) => handleInputChange("isExpertSession", checked)}
                    />
                    <Label htmlFor="isExpertSession">{t('sessions.expertSession')}</Label>
                  </div>
                  
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <Label htmlFor="sessionsFileUpload" className="text-sm font-medium">
                      {t('sessions.attachFiles')}
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
                        id="sessionsFileUpload"
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
                              {isDragOver ? t('sessions.dropFiles') : t('sessions.clickToAddFiles')}
                            </span>
                            <br />
                            <span className="text-xs">{t('sessions.supportedFormats')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Display Selected Files */}
                    {formData.files.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="text-sm font-medium text-gray-700">
                          {t('sessions.selectedFiles')} ({formData.files.length})
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
                      {t('sessions.cancel')}
                    </Button>
                    <Button onClick={handleAddSession}>
                      {t('sessions.add')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('sessions.editSession')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-date">{t('sessions.date')}</Label>
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
                          {formData.date ? (
                            format(formData.date, "PPP", { locale: ar })
                          ) : (
                            <span>{t('sessions.selectDate')}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange("date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-time">Time</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={getTimeFromDate(formData.date)}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-link">{t('sessions.link')}</Label>
                    <Input
                      id="edit-link"
                      type="url"
                      placeholder={t('sessions.linkPlaceholder')}
                      value={formData.link}
                      onChange={(e) => handleInputChange("link", e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isExpertSession"
                      checked={formData.isExpertSession}
                      onCheckedChange={(checked) => handleInputChange("isExpertSession", checked)}
                    />
                    <Label htmlFor="edit-isExpertSession">{t('sessions.expertSession')}</Label>
                  </div>
                  
                  {/* File Upload Section - Edit Dialog */}
                  <div className="space-y-3">
                    <Label htmlFor="editSessionsFileUpload" className="text-sm font-medium">
                      {t('sessions.attachFiles')}
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
                        id="editSessionsFileUpload"
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
                              {isDragOver ? t('sessions.dropFiles') : t('sessions.clickToAddFiles')}
                            </span>
                            <br />
                            <span className="text-xs">{t('sessions.supportedFormats')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Display Selected Files */}
                    {formData.files.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="text-sm font-medium text-gray-700">
                          {t('sessions.selectedFiles')} ({formData.files.length})
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
                      {t('sessions.cancel')}
                    </Button>
                    <Button onClick={handleUpdateSession}>
                      {t('sessions.update')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('sessions.noSessions')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('sessions.date')}</TableHead>
                  <TableHead className="text-center">{t('sessions.link')}</TableHead>
                  <TableHead className="text-center">{t('sessions.expertSession')}</TableHead>
                  <TableHead className="text-center">{t('sessions.attachedFiles')}</TableHead>
                  <TableHead className="text-center">{t('sessions.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session, index) => (
                  <TableRow key={session.id || index}>
                    <TableCell className="text-center">
                      {formatDateTime(session.date, t)}
                    </TableCell>
                    <TableCell className="text-center">
                      <a 
                        href={session.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {session.link}
                      </a>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      {session.isExpertSession ? (
                        <span className="text-green-600"><CheckCircleIcon/></span>
                      ) : (
                        <span className="text-gray-400"><XCircleIcon/></span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {session.files && session.files.length > 0 ? (
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <File className="w-3 h-3 mr-1" />
                            {session.files.length} {session.files.length === 1 ? t('sessions.file') : t('sessions.files')}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">{t('sessions.noFiles')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSession(index)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSession(index)}
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

export default Sessions