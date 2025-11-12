import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, FileText, User, Clock, Calendar, Pen } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import EditSessionModal from '@/app/cases/sessions/EditSessionModal'

function LastWeekSessionsItem({ 
  session,
  title, 
  date, 
  caseNumber, 
  clientName,
  status,
  time
}) {
  const { t } = useTranslations()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Handle both direct props (for backward compatibility) and session object
  const sessionData = session || {
    title,
    date,
    caseNumber,
    clientName,
    status,
    time
  }
  
  const getDegreeBadge = (degree) => {
    if (!degree || degree === "0") {
      return null
    }
    
    const degreeConfig = {
      appeal: { label: t('home.appeal'), color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
      first_instance: { label: t('home.firstInstance'), color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
      cassation: { label: t('home.cassation'), color: 'bg-red-100 text-red-800 hover:bg-red-200' }
    }
    
    return degreeConfig[degree] || { label: degree, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' }
  }

  // Helper functions to format API data
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ar-AE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getSessionStatus = (sessionDate, decision) => {
    const now = new Date()
    const sessionDateTime = new Date(sessionDate)
    
    if (decision) {
      return 'completed'
    } else if (sessionDateTime > now) {
      return 'upcoming'
    } else {
      return 'postponed'
    }
  }

  // Extract data from API response or use props
  const displayTitle = session ? (session.decision || t('home.noDecision')) : sessionData.title
  const displayDate = session ? formatDate(session.session_date) : sessionData.date
  const displayTime = session ? formatTime(session.session_date) : sessionData.time
  const displayCaseNumber = session ? session.case_number : sessionData.caseNumber
  const displayClientName = session ? (session.clientParties?.[0] || t('home.notSpecified')) : sessionData.clientName
  const displayDegree = session ? session.degree : sessionData.degree

  const degreeInfo = getDegreeBadge(displayDegree)

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 dark:bg-gray-900 dark:border-gray-700">
      <CardContent className="p-3 sm:p-4">
     
        <div className="space-y-2 sm:space-y-2.5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('home.sessionDate')}: {displayDate}</span>
            {displayTime && <span className="text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">• {displayTime}</span>}
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('home.caseNumber')}: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100 break-all">{displayCaseNumber}</span>
            {degreeInfo && (
              <Badge className={`ml-2 text-xs ${degreeInfo.color}`}>
                {degreeInfo.label}
              </Badge>
            )}
          </div>
          
          <div className="flex items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-col sm:flex-row">
            <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('home.client')}: </span>
              <span className="font-medium text-gray-900 dark:text-gray-100 break-words">{displayClientName}</span>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 sm:p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors text-blue-600 dark:text-blue-400 self-end sm:self-auto flex-shrink-0"
              title={t('home.editSession')}
            >
              <Pen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
    
    {session?.id && (
      <EditSessionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sessionId={session.id}
      />
    )}
    </>
  )
}

export default LastWeekSessionsItem