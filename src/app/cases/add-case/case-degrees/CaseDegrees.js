"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useTranslations } from "@/hooks/useTranslations"
import { useFormikContext } from '../FormikContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pen, Trash2 } from "lucide-react"
import AddCaseDegreeModal from './AddCaseDegreeModal'

function CaseDegrees() {
  const { t } = useTranslations()
  const { values, setFieldValue } = useFormikContext()
  const caseDegrees = values.caseDegrees || []
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingDegree, setEditingDegree] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)

  const getDegreeLabel = (degreeValue) => {
    const degreeTypes = {
      'appeal': t('initiationProceeding.degreeTypes.appeal'),
      'first_instance': t('initiationProceeding.degreeTypes.first_instance'),
      'cassation': t('initiationProceeding.degreeTypes.cassation')
    }
    
    return degreeTypes[degreeValue] || degreeValue || t('initiationProceeding.notSpecified')
  }

  const handleEditDegree = (degree, index) => {
    setEditingDegree(degree)
    setEditingIndex(index)
    setIsEditModalOpen(true)
  }

  const handleDeleteDegree = (index) => {
    const filteredDegrees = caseDegrees.filter((_, i) => i !== index)
    setFieldValue('caseDegrees', filteredDegrees)
  }

  const handleAddDegreeClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddModalOpen(true)
  }

  const handleEditClick = (e, degree, index) => {
    e.preventDefault()
    e.stopPropagation()
    handleEditDegree(degree, index)
  }

  const handleDeleteClick = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    handleDeleteDegree(index)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('initiationProceeding.title')}</CardTitle>
            <Button type="button" onClick={handleAddDegreeClick}>
              <Plus className="h-4 w-4 mr-2" />
              {t('initiationProceeding.addProceeding')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {caseDegrees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('initiationProceeding.noProceedings')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('initiationProceeding.degree')}</TableHead>
                  <TableHead className="text-center">{t('initiationProceeding.caseNumber')}</TableHead>
                  <TableHead className="text-center">{t('initiationProceeding.year')}</TableHead>
                  <TableHead className="text-center">{t('initiationProceeding.referralDate')}</TableHead>
                  <TableHead className="text-center">{t('caseDegrees.clientStatus')}</TableHead>
                  <TableHead className="text-center">{t('caseDegrees.opponentStatus')}</TableHead>
                  <TableHead className="text-center">{t('initiationProceeding.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseDegrees.map((degree, index) => (
                  <TableRow key={degree.id || index}>
                    <TableCell className="text-center">
                      {getDegreeLabel(degree.degree)}
                    </TableCell>
                    <TableCell className="text-center">
                      {degree.case_number || t('initiationProceeding.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      {degree.year || t('initiationProceeding.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      {degree.referral_date ? format(new Date(degree.referral_date), "PPP", { locale: ar }) : t('initiationProceeding.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      {degree.client_status || t('initiationProceeding.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      {degree.opponent_status || t('initiationProceeding.notSpecified')}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleEditClick(e, degree, index)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteClick(e, index)}
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

      {/* Add Case Degree Modal */}
      <AddCaseDegreeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Case Degree Modal */}
      <AddCaseDegreeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingDegree(null)
          setEditingIndex(null)
        }}
        editData={editingDegree}
        editIndex={editingIndex}
      />
    </div>
  )
}

export default CaseDegrees