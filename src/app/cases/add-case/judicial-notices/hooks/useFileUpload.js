import { useState, useCallback } from "react"

/**
 * Custom hook for handling file upload functionality including drag and drop
 */
export const useFileUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false)

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

  const handleDrop = useCallback((e, onFilesSelected) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files)
    }
  }, [])

  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}
