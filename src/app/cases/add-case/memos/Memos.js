"use client"

import { useState } from "react"
import { useFormikContext } from "formik"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pen, Trash2, Plus, File } from "lucide-react"
import AddMemoModal from "./AddMemoModal"
import EditMemoModal from "./EditMemoModal"

// Helper function to format date
const formatDate = (date, t) => {
  if (!date) return t('memos.notSpecified')
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return t('memos.notSpecified')
  
  return format(dateObj, "PPP", { locale: ar })
}

// Helper function to get status badge variant and label
const getStatusBadge = (status, t) => {
  const statusMap = {
    "Draft": { variant: "secondary", label: t('memos.statusDraft'), color: "bg-gray-100 text-gray-800" },
    "Approved": { variant: "success", label: t('memos.statusApproved'), color: "bg-green-100 text-green-800" },
    "Pending Approval": { variant: "warning", label: t('memos.statusPendingApproval'), color: "bg-yellow-100 text-yellow-800" },
    "Submitted to Court": { variant: "info", label: t('memos.statusSubmittedToCourt'), color: "bg-blue-100 text-blue-800" },
    "Rejected": { variant: "destructive", label: t('memos.statusRejected'), color: "bg-red-100 text-red-800" }
  }
  
  return statusMap[status] || { variant: "secondary", label: status, color: "bg-gray-100 text-gray-800" }
}

function Memos({ caseId }) {
  const { values, setFieldValue } = useFormikContext()
  const { memos = [] } = values
  const { t } = useTranslations()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMemo, setEditingMemo] = useState(null)
  const [editingMemoIndex, setEditingMemoIndex] = useState(null)

  const handleAddMemo = (newMemo) => {
    const updatedMemos = [...memos, newMemo]
    setFieldValue('memos', updatedMemos)
  }

  const handleEditMemo = (memoIndex) => {
    const memo = memos[memoIndex]
    setEditingMemo(memo)
    setEditingMemoIndex(memoIndex)
    setIsEditDialogOpen(true)
  }

  const handleUpdateMemo = (updatedMemo) => {
    if (editingMemoIndex !== null) {
      const updatedMemos = [...memos]
      updatedMemos[editingMemoIndex] = updatedMemo
      setFieldValue('memos', updatedMemos)
      setEditingMemo(null)
      setEditingMemoIndex(null)
    }
  }

  const handleDeleteMemo = (memoIndex) => {
    if (window.confirm(t('memos.confirmDelete'))) {
      const updatedMemos = memos.filter((_, index) => index !== memoIndex)
      setFieldValue('memos', updatedMemos)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('memos.title')}</CardTitle>
            <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('memos.addMemo')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {memos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('memos.noMemos')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t('memos.memoTitle')}</TableHead>
                    <TableHead className="text-center">{t('memos.submissionDate')}</TableHead>
                    <TableHead className="text-center">{t('memos.status')}</TableHead>
                    <TableHead className="text-center">{t('memos.description')}</TableHead>
                    <TableHead className="text-center">{t('memos.adminNote')}</TableHead>
                    <TableHead className="text-center">{t('memos.attachments')}</TableHead>
                    <TableHead className="text-center">{t('memos.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memos.map((memo, index) => {
                    const statusInfo = getStatusBadge(memo.status, t)
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center font-medium">
                          {memo.title}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDate(memo.submission_date, t)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center max-w-xs">
                          {memo.description ? (
                            <div 
                              className="text-sm line-clamp-2" 
                              dangerouslySetInnerHTML={{ __html: memo.description }}
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">{t('memos.notSpecified')}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center max-w-xs">
                          {memo.admin_note ? (
                            <div 
                              className="text-sm line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: memo.admin_note }}
                            />
                          ) : (
                            <span className="text-gray-400 text-sm">{t('memos.notSpecified')}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {memo.files && memo.files.length > 0 ? (
                            <div className="flex justify-center">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                <File className="w-3 h-3 mr-1" />
                                {memo.files.length} {memo.files.length === 1 ? t('memos.file') : t('memos.files')}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">{t('memos.noFiles')}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2 space-x-reverse">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMemo(index)}
                            >
                              <Pen className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMemo(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Memo Modal */}
      <AddMemoModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddMemo}
      />

      {/* Edit Memo Modal */}
      <EditMemoModal
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingMemo(null)
          setEditingMemoIndex(null)
        }}
        onUpdate={handleUpdateMemo}
        memo={editingMemo}
      />
    </div>
  )
}

export default Memos