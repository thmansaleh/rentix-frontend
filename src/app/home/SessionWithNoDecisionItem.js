import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hash, FileText, User, Clock, Calendar, Pen } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import EditSessionModal from '@/app/cases/sessions/EditSessionModal'

function SessionWithNoDecisionItem({ 
  session,
  title, 
  date, 
  caseNumber, 
  clientName,
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

  // Extract data from API response or use props
  const displayDate = session ? formatDate(session.session_date) : sessionData.date
  const displayTime = session ? formatTime(session.session_date) : sessionData.time
  const displayCaseNumber = session ? session.case_number : sessionData.caseNumber
  const displayClientName = session ? (session.clientParties?.[0] || t('home.notSpecified')) : sessionData.clientName
  const displayDegree = session ? session.degree : sessionData.degree
  const displayFileNumber = session ? session.file_number : sessionData.fileNumber

  const degreeInfo = getDegreeBadge(displayDegree)

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-orange-300 dark:hover:border-orange-600 dark:bg-gray-900 dark:border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
              <span className="whitespace-nowrap">{t('home.fileNumber')}: </span>
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{displayFileNumber || t('home.notSpecified')}</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('home.sessionDate')}: {displayDate}</span>
              {displayTime && <span className="text-orange-600 dark:text-orange-400 font-medium whitespace-nowrap">• {displayTime}</span>}
            </div>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <Hash className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('home.caseNumber')}: </span>
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{displayCaseNumber}</span>
              {degreeInfo && (
                <Badge className={`ml-2 text-xs ${degreeInfo.color}`}>
                  {degreeInfo.label}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('home.client')}: </span>
              <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{displayClientName}</span>
            </div>
            
            
            <div className="flex items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-orange-600 dark:text-orange-400 flex-col sm:flex-row pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold">  {session.is_judgment_deferred ? t('home.judgmentDeferred') : session.is_judgment_reserved ? t('home.judgmentReserved') : t('home.noDecisionYet')}</span>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-1.5 sm:p-2 hover:bg-orange-100 dark:hover:bg-orange-800 rounded-lg transition-colors self-end sm:self-auto flex-shrink-0"
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

export default SessionWithNoDecisionItem