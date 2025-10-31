"use client"

import React from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

/**
 * ExportButtons Component
 * Provides Excel and PDF export functionality for cases data
 * @param {Array} data - The cases data to export
 * @param {Function} t - Translation function
 * @param {string} language - Current language (ar/en)
 */
const ExportButtons = ({ data = [], t, language = 'ar' }) => {
  const isRTL = language === 'ar'

  // Helper function to get localized text
  const getLocalizedText = (arText, enText) => {
    if (language === 'ar') {
      return arText || enText || ''
    } else {
      return enText || arText || ''
    }
  }

  // Helper function to format date for export
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US')
  }

  // Helper function to prepare export data
  const prepareExportData = () => {
    return data.map((case_) => ({
      [t('caseForm.caseNumber') || 'رقم القضية']: case_.case_number || '',
      [t('casesTable.fileNumber') || 'رقم الملف']: case_.is_secret ? '***' : (case_.file_number || ''),
      [t('casesTable.topic') || 'الموضوع']: case_.is_secret ? '***' : (case_.topic || ''),
      [t('casesTable.court') || 'المحكمة']: case_.is_secret ? '***' : getLocalizedText(case_.court_ar, case_.court_en),
      [t('casesTable.caseType') || 'نوع القضية']: case_.is_secret ? '***' : getLocalizedText(case_.case_type_ar, case_.case_type_en),
      [t('casesTable.classification') || 'التصنيف']: case_.is_secret ? '***' : getLocalizedText(case_.case_classification_ar, case_.case_classification_en),
      [t('caseForm.startDate') || 'تاريخ البدء']: case_.is_secret ? '***' : formatDate(case_.start_date),
      [t('casesTable.clientParties') || 'الموكلون']: case_.is_secret ? '***' : (case_.clientParties?.join(', ') || '-'),
      [t('casesTable.opponentParties') || 'الخصوم']: case_.is_secret ? '***' : (case_.opponentParties?.join(', ') || '-'),
      [t('casesTable.status') || 'الحالة']: case_.status || '',
      [t('casesTable.sessionCount') || 'عدد الجلسات']: case_.session_count || 0,
      [t('casesTable.lastSessionDate') || 'تاريخ آخر جلسة']: formatDate(case_.last_session_date) || '-',
      [t('casesTable.isSecret') || 'سرية']: case_.is_secret ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No'),
      [t('casesTable.isCompleted') || 'مكتملة']: case_.is_completed ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No'),
    }))
  }

  // Helper function to prepare export data for PDF (always English to avoid font issues)
  const prepareExportDataForPDF = () => {
    return data.map((case_) => ({
      'Case Number': case_.case_number || '',
      'File Number': case_.is_secret ? '***' : (case_.file_number || ''),
      'Topic': case_.is_secret ? '***' : (case_.topic || ''),
      'Court': case_.is_secret ? '***' : (case_.court_en || case_.court_ar || ''),
      'Case Type': case_.is_secret ? '***' : (case_.case_type_en || case_.case_type_ar || ''),
      'Classification': case_.is_secret ? '***' : (case_.case_classification_en || case_.case_classification_ar || ''),
      'Start Date': case_.is_secret ? '***' : formatDate(case_.start_date),
      'Client Parties': case_.is_secret ? '***' : (case_.clientParties?.join(', ') || '-'),
      'Opponent Parties': case_.is_secret ? '***' : (case_.opponentParties?.join(', ') || '-'),
      'Status': case_.status || '',
      'Session Count': case_.session_count || 0,
      'Last Session Date': formatDate(case_.last_session_date) || '-',
      'Is Secret': case_.is_secret ? 'Yes' : 'No',
      'Is Completed': case_.is_completed ? 'Yes' : 'No',
    }))
  }

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const exportData = prepareExportData()
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 15 }, // Case Number
        { wch: 15 }, // File Number
        { wch: 30 }, // Topic
        { wch: 20 }, // Court
        { wch: 20 }, // Case Type
        { wch: 20 }, // Classification
        { wch: 15 }, // Start Date
        { wch: 25 }, // Client Parties
        { wch: 25 }, // Opponent Parties
        { wch: 15 }, // Status
        { wch: 15 }, // Session Count
        { wch: 15 }, // Last Session Date
        { wch: 10 }, // Is Secret
        { wch: 10 }, // Is Completed
      ]
      ws['!cols'] = colWidths

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, language === 'ar' ? 'القضايا' : 'Cases')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = language === 'ar' 
        ? `القضايا_${timestamp}.xlsx`
        : `cases_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)
    } catch (error) {

      alert(language === 'ar' ? 'حدث خطأ أثناء التصدير' : 'Error during export')
    }
  }

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      // Import jsPDF and autoTable
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Title (always in English for PDF to avoid font issues)
      const title = 'Cases Report'
      doc.setFontSize(16)
      doc.text(title, doc.internal.pageSize.width / 2, 15, { align: 'center' })

      // Prepare table data for PDF (English only)
      const exportData = prepareExportDataForPDF()
      
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
          fontSize: 8,
          cellPadding: 2,
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
      const filename = `cases_${fileTimestamp}.pdf`

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
        {/* <span>{language === 'ar' ? 'تصدير الملفات:' : 'Export Files:'}</span> */}
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

      {/* <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className={`gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <FileText className="h-4 w-4 text-red-600" />
        <span>{language === 'ar' ? 'PDF' : 'PDF'}</span>
      </Button> */}
    </div>
  )
}

export default ExportButtons
