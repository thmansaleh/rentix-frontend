
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pen, Trash2 } from "lucide-react"
import { useFormikContext } from '../FormikContext';
import AddPetitionModal from './AddPetitionModal';
import EditPetitionModal from './EditPetitionModal';

function Petition() {
  const { t } = useTranslations()
  
  // Use Formik context to access form state
  const { values, setFieldValue } = useFormikContext();
  const petitions = values.petition || [];
  
  // Local state for modal management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPetition, setEditingPetition] = useState(null)


  const handleAddPetition = (formData) => {
    const newPetition = {
      id: Date.now(),
      ...formData,
      // Keep only the files array
      files: formData.files || []
    }
    
    
    // Update Formik state
    const updatedPetitions = [...petitions, newPetition];
    setFieldValue('petition', updatedPetitions);
    
  }

  const handleEditPetition = (petition) => {
    setEditingPetition(petition)
    setIsEditModalOpen(true)
  }

  const handleUpdatePetition = (formData) => {
    if (editingPetition) {
      
      // Create updated petition with files only
      const updatedPetitionData = {
        ...formData,
        files: formData.files || []
      }
      
      // Update petition in Formik state
      const updatedPetitions = petitions.map(petition => 
        petition.id === editingPetition.id 
          ? { ...petition, ...updatedPetitionData }
          : petition
      )
      setFieldValue('petition', updatedPetitions);
      
      setEditingPetition(null)
      
    }
  }

  const handleDeletePetition = (petitionId) => {
    
    // Remove petition from Formik state
    const updatedPetitions = petitions.filter(petition => petition.id !== petitionId);
    setFieldValue('petition', updatedPetitions);
    
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('petitions.title')}</CardTitle>
            <Button
            type="button"
             onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('petitions.addPetition')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {petitions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('petitions.noPetitions')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('petitions.submissionDate')}</TableHead>
                  <TableHead className="text-center">{t('petitions.orderType')}</TableHead>
                  <TableHead className="text-center">{t('petitions.judgeDecision')}</TableHead>
                  <TableHead className="text-center">{t('petitions.appealDate')}</TableHead>
                  <TableHead className="text-center">{t('petitions.attachedFiles')}</TableHead>
                  <TableHead className="text-center">{t('petitions.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {petitions.map((petition) => (
                  <TableRow key={petition.id}>
                    <TableCell className="text-center">
                      {petition.submissionDate ? format(petition.submissionDate, "PPP", { locale: ar }) : t('petitions.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">{petition.orderType}</TableCell>
                    <TableCell className="text-center">
                      {petition.judgeDecision === true ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {t('petitions.approved') || 'موافق'}
                        </Badge>
                      ) : petition.judgeDecision === false ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          {t('petitions.rejected') || 'مرفوض'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {t('petitions.notSpecified')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {petition.appealDate ? format(petition.appealDate, "PPP", { locale: ar }) : t('petitions.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      {petition.files && petition.files.length > 0 ? (
                        <Badge variant="outline">
                          {petition.files.length} {t('files.filesCount')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          0 {t('files.filesCount')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPetition(petition)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePetition(petition.id)}
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

      {/* Add Petition Modal */}
      <AddPetitionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPetition}
        title={t('petitions.addPetition')}
      />

      {/* Edit Petition Modal */}
      <EditPetitionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingPetition(null)
        }}
        onSubmit={handleUpdatePetition}
        initialData={editingPetition}
        title={t('petitions.editPetition')}
      />
    </div>
  )
}

export default Petition