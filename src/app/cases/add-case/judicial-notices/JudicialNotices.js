"use client"

import { useTranslations } from "@/hooks/useTranslations"
import { useFormikContext } from '../FormikContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddNoticeDialog } from "./components/AddNoticeDialog"
import { EditNoticeDialog } from "./components/EditNoticeDialog"
import { NoticesTable } from "./components/NoticesTable"
import { useNoticeForm } from "./hooks/useNoticeForm"

function JudicialNotices() {
  const { values, setFieldValue } = useFormikContext()
  const { JudicialNotices: notices } = values
  const { t } = useTranslations()
  
  const {
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
  } = useNoticeForm(notices, setFieldValue)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('judicialNotices.title')}</CardTitle>
            
            <AddNoticeDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              formData={formData}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onRemoveFile={removeFile}
              onAdd={handleAddNotice}
            />

            <EditNoticeDialog
              isOpen={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              formData={formData}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onRemoveFile={removeFile}
              onUpdate={handleUpdateNotice}
            />
          </div>
        </CardHeader>
        <CardContent>
          <NoticesTable
            notices={notices}
            onEdit={handleEditNotice}
            onDelete={handleDeleteNotice}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default JudicialNotices
