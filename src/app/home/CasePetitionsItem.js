import { Calendar1, Clock, File, FileSpreadsheet, FileText, Info } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from '@/hooks/useTranslations'

function CasePetitionsItem({ petition }) {
  const { t } = useTranslations()
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return t('home.notSpecified')
    return new Date(dateString).toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get decision status color
  const getDecisionColor = (decision) => {
    switch (decision) {
      case 0: return 'text-yellow-600 bg-yellow-100'
      case 1: return 'text-green-600 bg-green-100'
    //   case -1: return 'text-red-600 bg-red-100'
    //   default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Get decision status text
  const getDecisionStatus = (decision) => {
    switch (decision) {
      case 0: return t('home.rejected')
      case 1: return t('home.accepted')
    }
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-amber-300 dark:hover:border-amber-600 dark:bg-gray-900 dark:border-gray-700">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-2.5">
          {/* File Number */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <span className="whitespace-nowrap">{t('home.fileNumber')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 break-all">{petition.file_number}</span>
          </div>

          {/* Case Topic */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <File className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('home.caseTopic')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{petition.case_topic}</span>
          </div>

          {/* Petition Type */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="whitespace-nowrap">{t('home.petition')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{petition.type}</span>
          </div>

          {/* Date Details Section */}
          <div className="space-y-2 sm:space-y-2.5 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
            {/* Submission Date */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Calendar1 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
              <div className="min-w-0 flex-1">
                <span className="block font-medium text-gray-700 dark:text-gray-300 text-xs">{t('home.submissionDate')}</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs">{formatDate(petition.date)}</span>
              </div>
            </div>

            {/* Last Date */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="min-w-0 flex-1">
                <span className="block font-medium text-gray-700 dark:text-gray-300 text-xs">
                  {petition.decision === 1 ? t('petitions.lastDateToRegisterCase') : t('petitions.lastDateToAppeal')}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-xs">{formatDate(petition.appeal_date)}</span>
              </div>
            </div>

            {/* Days Remaining */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse text-red-600 dark:text-red-400 flex-shrink-0" />
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <span className="block font-medium text-gray-700 dark:text-gray-300 text-xs">{t('home.daysRemaining')}</span>
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-xs">
                    {(() => {
                      const daysRemaining = Math.ceil((new Date(petition.appeal_date) - new Date()) / (1000 * 60 * 60 * 24));
                      const isOverdue = daysRemaining <= 0;
                      const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
                      
                      return (
                        <>
                          {isOverdue && <span className="text-xs">⚠️ {t('home.overdue')}</span>}
                          <div className="relative inline-flex items-center justify-center flex-shrink-0">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10 ${
                              isOverdue ? 'bg-red-500' : isUrgent ? 'bg-orange-500' : 'bg-green-500'
                            }`}>
                              {Math.abs(daysRemaining)}
                            </div>
                            {/* Glowing/flashing rings */}
                            <div className={`absolute inset-0 rounded-full animate-ping ${
                              isOverdue ? 'bg-red-400' : isUrgent ? 'bg-orange-400' : 'bg-green-400'
                            } opacity-75`}></div>
                            <div className={`absolute inset-[-2px] rounded-full animate-pulse ${
                              isOverdue ? 'bg-red-300' : isUrgent ? 'bg-orange-300' : 'bg-green-300'
                            } opacity-50`} style={{animationDelay: '0.5s'}}></div>
                          </div>
                          <span className="whitespace-nowrap">{Math.abs(daysRemaining) === 1 ? t('home.day') : t('home.days')}</span>
                        </>
                      );
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        
          {/* Action Button */}
          <div className="pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getDecisionColor(petition.decision)}`}>
              {getDecisionStatus(petition.decision)}
            </div>
            <Link 
              href={`/cases/${petition.case_id}/edit`}
              className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            >
              <Info className="w-4 h-4" />
              <span>{t('home.viewDetails')}</span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CasePetitionsItem