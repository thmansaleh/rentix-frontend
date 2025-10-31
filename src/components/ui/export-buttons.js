"use client"

import React from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

/**
 * Generic Export Buttons Component
 * Provides Excel and PDF export functionality for any tabular data
 * @param {Array} data - The data array to export
 * @param {Object} columnConfig - Configuration for columns in both languages
 * @param {string} language - Current language (ar/en)
 * @param {string} exportName - Base name for exported files
 * @param {string} sheetName - Name for Excel sheet
 * @param {boolean} showPDF - Whether to show PDF export button
 */
const ExportButtons = ({ 
  data = [], 
  columnConfig = {}, 
  language = 'ar', 
  exportName = 'export', 
  sheetName = 'Data',
  showPDF = false
}) => {
  const isRTL = language === 'ar'

  // Helper function to format date for export
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Helper function to format boolean values
  const formatBoolean = (value) => {
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return language === 'ar' ? 'نعم' : 'Yes'
    } else if (value === false || value === 'false' || value === 0 || value === '0') {
      return language === 'ar' ? 'لا' : 'No'
    }
    return value
  }

  // Helper function to get nested value from object
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current && current[key], obj)
  }

  // Helper function to prepare export data
  const prepareExportData = (forPDF = false) => {
    return data.map((item) => {
      const exportItem = {}
      
      Object.entries(columnConfig).forEach(([key, config]) => {
        let columnName
        let value
        
        // Determine column name based on language or force English for PDF
        if (forPDF || language === 'en') {
          columnName = config.en || config.label || key
        } else {
          columnName = config.ar || config.label || key
        }
        
        // Get value using dataKey or default to key
        const dataKey = config.dataKey || key
        value = getNestedValue(item, dataKey) ?? ''

        // Apply formatting based on type
        if (config.type === 'date' && value) {
          value = formatDate(value)
        } else if (config.type === 'boolean') {
          value = formatBoolean(value)
        } else if (config.type === 'array' && Array.isArray(value)) {
          value = value.join(', ')
        } else if (config.type === 'status') {
          // Handle status with custom mapping
          if (config.statusMap && config.statusMap[value]) {
            value = forPDF || language === 'en' ? config.statusMap[value].en : config.statusMap[value].ar
          }
        } else if (config.formatter && typeof config.formatter === 'function') {
          // Use custom formatter
          value = config.formatter(value, item, forPDF ? 'en' : language)
        }

        // Convert to string and handle null/undefined
        exportItem[columnName] = value?.toString() || ''
      })
      
      return exportItem
    })
  }

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = prepareExportData()
      
      if (exportData.length === 0) {
        alert(language === 'ar' ? 'لا توجد بيانات للتصدير' : 'No data to export')
        return
      }
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)
      
      // Set column widths for better readability
      const colCount = Object.keys(exportData[0] || {}).length
      const colWidths = Array(colCount).fill({ wch: 20 })
      ws['!cols'] = colWidths

      // Create workbook
      const wb = XLSX.utils.book_new()
      const finalSheetName = language === 'ar' && sheetName !== 'Data' ? sheetName : (language === 'ar' ? 'البيانات' : sheetName)
      XLSX.utils.book_append_sheet(wb, ws, finalSheetName)

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${exportName}_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)
    } catch (error) {

      alert(language === 'ar' ? 'حدث خطأ أثناء التصدير' : 'Error during export')
    }
  }

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      if (!showPDF) return
      
      // Import jsPDF and autoTable
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Title (always in English for PDF to avoid font issues)
      const title = `${exportName.charAt(0).toUpperCase() + exportName.slice(1)} Report`
      doc.setFontSize(16)
      doc.text(title, doc.internal.pageSize.width / 2, 15, { align: 'center' })

      // Prepare table data for PDF (English only)
      const exportData = prepareExportData(true)
      
      if (exportData.length === 0) {
        alert(language === 'ar' ? 'لا توجد بيانات للتصدير' : 'No data to export')
        return
      }
      
      // Table headers
      const headers = Object.keys(exportData[0] || {})
      
      // Table rows
      const rows = exportData.map(item => Object.values(item))

      // Add table using autoTable function directly
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          halign: 'left',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 25, right: 10, bottom: 10, left: 10 },
      })

      // Footer with date
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(
          `Export Date: ${timestamp}`,
          10,
          doc.internal.pageSize.height - 10
        )
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        )
      }

      // Generate filename
      const fileTimestamp = new Date().toISOString().split('T')[0]
      const filename = `${exportName}_${fileTimestamp}.pdf`

      // Save PDF
      doc.save(filename)
    } catch (error) {

      alert(language === 'ar' ? 'حدث خطأ أثناء التصدير إلى PDF' : 'Error during PDF export')
    }
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex items-center gap-2 text-sm font-medium text-muted-foreground ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Download className="h-4 w-4" />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className={`gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <FileSpreadsheet className="h-4 w-4 text-green-600" />
        <span>{language === 'ar' ? 'Excel' : 'Excel'}</span>
      </Button>

      {showPDF && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          className={`gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <FileText className="h-4 w-4 text-red-600" />
          <span>{language === 'ar' ? 'PDF' : 'PDF'}</span>
        </Button>
      )}
    </div>
  )
}

export default ExportButtons