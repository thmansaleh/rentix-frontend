"use client"

import React from 'react'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

/**
 * SessionsExportButtons Component
 * Provides Excel and PDF export functionality for sessions data
 * @param {Array} data - The sessions data to export
 * @param {string} language - Current language (ar/en)
 */
const SessionsExportButtons = ({ data = [], language = 'ar' }) => {
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

  // Helper function to prepare export data
  const prepareExportData = () => {
    return data.map((session) => ({
      [language === 'ar' ? 'رقم القضية' : 'Case Number']: session.case_number || '',
      [language === 'ar' ? 'رقم الملف' : 'File Number']: session.file_number || '',
      [language === 'ar' ? 'الموضوع' : 'Topic']: session.case_topic || '',
      [language === 'ar' ? 'المحكمة' : 'Court']: language === 'ar' ? session.court_ar : session.court_en,
      [language === 'ar' ? 'العملاء' : 'Clients']: session.clientParties?.join(', ') || (language === 'ar' ? 'لا يوجد' : 'None'),
      [language === 'ar' ? 'الخصوم' : 'Opponents']: session.opponentParties?.join(', ') || (language === 'ar' ? 'لا يوجد' : 'None'),
      [language === 'ar' ? 'تاريخ الجلسة' : 'Session Date']: formatDate(session.session_date),
      [language === 'ar' ? 'القرار' : 'Decision']: session.decision || (language === 'ar' ? 'لم يتم اتخاذ قرار بعد' : 'No decision yet'),
      [language === 'ar' ? 'الرابط' : 'Link']: session.link || '',
      [language === 'ar' ? 'جلسة خبرة' : 'Expert Session']: session.is_expert_session ? (language === 'ar' ? 'نعم' : 'Yes') : (language === 'ar' ? 'لا' : 'No'),
    }))
  }

  // Helper function to prepare export data for PDF (always English to avoid font issues)
  const prepareExportDataForPDF = () => {
    return data.map((session) => ({
      'Case Number': session.case_number || '',
      'File Number': session.file_number || '',
      'Topic': session.case_topic || '',
      'Court': session.court_en || session.court_ar || '',
      'Clients': session.clientParties?.join(', ') || 'None',
      'Opponents': session.opponentParties?.join(', ') || 'None',
      'Session Date': formatDate(session.session_date),
      'Decision': session.decision || 'No decision yet',
      'Link': session.link || '',
      'Expert Session': session.is_expert_session ? 'Yes' : 'No',
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
        { wch: 25 }, // Clients
        { wch: 25 }, // Opponents
        { wch: 20 }, // Session Date
        { wch: 30 }, // Decision
        { wch: 30 }, // Link
        { wch: 15 }, // Expert Session
      ]
      ws['!cols'] = colWidths

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, language === 'ar' ? 'الجلسات' : 'Sessions')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = language === 'ar' 
        ? `الجلسات_${timestamp}.xlsx`
        : `sessions_${timestamp}.xlsx`

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
      const title = 'Sessions Report'
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
      const filename = `sessions_${fileTimestamp}.pdf`

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
        <span>{language === 'ar' ? 'تصدير الملفات:' : 'Export Files:'}</span>
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

export default SessionsExportButtons
