
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
import { CheckCircleIcon, XCircleIcon, Pen, Trash2, Plus, File } from "lucide-react"
import AddSessionModal from "./AddSessionModal"
import EditSessionModal from "./EditSessionModal"

// Helper function to format date and time
const formatDateTime = (date, t) => {
  if (!date) return t('sessions.notSpecified')
  
  // Handle both Date objects and date strings from database
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return t('sessions.notSpecified')
  
  const dateString = format(dateObj, "PPP", { locale: ar })
  const timeString = format(dateObj, "HH:mm")
  
  // Check if time is set (not 00:00)
  if (timeString !== "00:00") {
    return `${dateString} - ${timeString}`
  }
  return dateString
}


function Sessions() {
  const { values, setFieldValue } = useFormikContext()
  const { sessions = [] } = values
  const { t } = useTranslations()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  const [editingSessionIndex, setEditingSessionIndex] = useState(null)

  const handleAddSession = (newSession) => {
    const updatedSessions = [...sessions, newSession]
    setFieldValue('sessions', updatedSessions)
  }

  const handleEditSession = (sessionIndex) => {
    const session = sessions[sessionIndex]
    setEditingSession(session)
    setEditingSessionIndex(sessionIndex)
    setIsEditDialogOpen(true)
  }

  const handleUpdateSession = (updatedSession) => {
    if (editingSessionIndex !== null) {
      const updatedSessions = [...sessions]
      updatedSessions[editingSessionIndex] = updatedSession
      setFieldValue('sessions', updatedSessions)
      setEditingSession(null)
      setEditingSessionIndex(null)
    }
  }

  const handleDeleteSession = (sessionIndex) => {
    const updatedSessions = sessions.filter((_, index) => index !== sessionIndex)
    setFieldValue('sessions', updatedSessions)
  }



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('sessions.title')}</CardTitle>
            <Button  type="button" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('sessions.addSession')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('sessions.noSessions')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t('sessions.date')}</TableHead>
                    <TableHead className="text-center">{t('sessions.link')}</TableHead>
                    <TableHead className="text-center">??????</TableHead>
                    <TableHead className="text-center">{t('sessions.expertSession')}</TableHead>
                    <TableHead className="text-center">{t('sessions.attachedFiles')}</TableHead>
                    <TableHead className="text-center">{t('sessions.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session, index) => (
                    <TableRow key={session.id || index}>
                      <TableCell className="text-center">
                        {formatDateTime(session.date, t)}
                      </TableCell>
                      <TableCell className="text-center">
                        <a 
                          href={session.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {session.link}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        {session.decision || <span className="text-gray-400 text-sm">?? ???? ????</span>}
                      </TableCell>
                      <TableCell className="flex justify-center">
                        {session.isExpertSession ? (
                          <span className="text-green-600"><CheckCircleIcon/></span>
                        ) : (
                          <span className="text-gray-400"><XCircleIcon/></span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {session.files && session.files.length > 0 ? (
                          <div className="flex justify-center">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              <File className="w-3 h-3 mr-1" />
                              {session.files.length} {session.files.length === 1 ? t('sessions.file') : t('sessions.files')}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">{t('sessions.noFiles')}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2 space-x-reverse">
                          <Button type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSession(index)}
                          >
                            <Pen className="h-4 w-4" />
                          </Button>
                          <Button type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(index)}
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

      {/* Add Session Modal */}
      <AddSessionModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddSession}
        t={t}
      />

      {/* Edit Session Modal */}
      <EditSessionModal
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdateSession}
        session={editingSession}
        t={t}
      />
    </div>
  )
}

export default Sessions