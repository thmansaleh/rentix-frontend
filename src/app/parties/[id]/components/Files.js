'use client'
import React from 'react'
import useSWR from 'swr'
import { getDocumentsByPartyId, deletePartyDocument } from '@/app/services/api/partiesDocuments'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslations } from '@/hooks/useTranslations'
import { FileText, Download, Trash2, File, Calendar } from 'lucide-react'
import { toast } from 'react-toastify'

function Files({ partyId }) {
  const { t } = useTranslations()
  
  const { data, error, isLoading, mutate } = useSWR(
    partyId ? [`/parties-documents/party/${partyId}`] : null,
    () => getDocumentsByPartyId(partyId),
    {
      revalidateOnFocus: false,
    }
  )

  const handleDelete = async (documentId) => {
    if (!confirm(t('common.confirmDelete') || 'هل أنت متأكد من حذف هذا الملف؟')) {
      return
    }

    try {
      await deletePartyDocument(documentId)
      toast.success(t('common.deleteSuccess') || 'تم الحذف بنجاح')
      mutate()
    } catch (error) {
      console.error('Error deleting document:', error)
      toast.error(t('common.deleteError') || 'حدث خطأ في الحذف')
    }
  }

  const handleDownload = (fileUrl, fileName) => {
    window.open(fileUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'جاري التحميل...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive">{t('common.error') || 'حدث خطأ في تحميل البيانات'}</p>
        </div>
      </div>
    )
  }

  const documents = data?.data || []

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄'
    if (fileType?.includes('image')) return '🖼️'
    if (fileType?.includes('word')) return '📝'
    return '📎'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('partyTabs.files') || 'الملفات'} ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('files.noFiles') || 'لا توجد ملفات'}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold">{t('files.fileName') || 'اسم الملف'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('files.fileType') || 'نوع الملف'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('files.description') || 'الوصف'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('files.uploadDate') || 'تاريخ الرفع'}</TableHead>
                  <TableHead className="text-center font-semibold">{t('common.actions') || 'الإجراءات'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{getFileTypeIcon(doc.file_type)}</span>
                        <span>{doc.file_name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.file_type || '-'}</Badge>
                    </TableCell>
                    <TableCell>{doc.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(doc.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc.file_url, doc.file_name)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Files
