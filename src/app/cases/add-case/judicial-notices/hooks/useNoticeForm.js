import { useState } from "react"

/**
 * Custom hook for managing notice form state and operations
 */
export const useNoticeForm = (notices, setFieldValue) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNoticeIndex, setEditingNoticeIndex] = useState(null)
  const [formData, setFormData] = useState({
    certificationDate: null,
    noticePeriod: "",
    noticeCompleted: false,
    lawsuitFiled: false,
    files: []
  })

  const resetFormData = () => {
    setFormData({
      certificationDate: null,
      noticePeriod: "",
      noticeCompleted: false,
      lawsuitFiled: false,
      files: []
    })
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
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }))
    }
    // Clear the input so the same file can be selected again
    if (e.target) {
      e.target.value = ''
    }
  }

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleAddNotice = () => {
    if (formData.certificationDate) {
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
      
      resetFormData()
      setIsDialogOpen(false)
    }
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

  const handleUpdateNotice = () => {
    if (formData.certificationDate && editingNoticeIndex !== null) {
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
      
      resetFormData()
      setEditingNoticeIndex(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteNotice = (noticeIndex) => {
    const currentNotices = [...(notices || [])]
    currentNotices.splice(noticeIndex, 1)
    setFieldValue('JudicialNotices', currentNotices)
  }

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleAddNotice,
    handleEditNotice,
    handleUpdateNotice,
    handleDeleteNotice
  }
}
