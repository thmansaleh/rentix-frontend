import { Calendar1, CaseLower, Clock, File, FileSpreadsheet, Folder, Info } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
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

  // Get decision status text
  const getDecisionStatus = (decision) => {
    switch (decision) {
      case 0: return t('home.rejected')
      case 1: return t('home.accepted')
    }
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-600">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          {/* <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 flex items-center flex-wrap gap-1">
            <span className="ml-2">📋</span>
            <span className="whitespace-nowrap">{t('home.caseNumber')}:</span>
            <span className="break-all">{petition.case_number}</span>
          </h3> */}
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex items-center flex-wrap gap-1">
            <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 dark:text-yellow-400 ml-2 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('home.fileNumber')}:</span>
            <span className="break-all">{petition.file_number}</span>
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${getDecisionColor(petition.decision)}`}>
          {getDecisionStatus(petition.decision)}
        </div>
      </div>

      <div className="space-y-2 text-xs sm:text-sm">
        <div className="flex items-center flex-wrap gap-1">
          <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0" />
          <span className="font-medium text-gray-700 dark:text-gray-300 ml-2">{t('home.caseTopic')}:</span>
          <span className="text-gray-600 dark:text-gray-400 truncate">{petition.case_topic}</span>
        </div>

        <div className="flex items-center gap-x-2 flex-wrap gap-1">
          <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0" />
          <span className="font-medium text-gray-700 dark:text-gray-300 ml-2">{t('home.petition')}:</span>
          <span className="text-gray-600 dark:text-gray-400 truncate">{petition.type}</span>
        </div>

        <div className="space-y-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-x-2">
            <Calendar1 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 ml-2 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block font-medium text-gray-700 dark:text-gray-300 text-xs">{t('home.submissionDate')}</span>
              <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{formatDate(petition.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            {/* <span className="ml-2">⏰</span> */}
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block font-medium text-gray-700 dark:text-gray-300 text-xs">{t('home.lastActionDate')}</span>
              <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{formatDate(petition.appeal_date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse text-red-600 dark:text-red-400 ml-2 flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <span className="block font-medium text-gray-700 dark:text-gray-300 text-xs">{t('home.daysRemaining')}</span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-xs sm:text-sm">
                  {(() => {
                    const daysRemaining = Math.ceil((new Date(petition.appeal_date) - new Date()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysRemaining <= 0;
                    const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
                    
                    return (
                      <>
                        {isOverdue ? <span className="text-xs">⚠️ {t('home.overdue')}</span> : null}
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
      </div>
      
      {/* Action Button */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <Link 
          href={`/cases/${petition.case_id}/edit`}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
        >
          <Info className="w-4 h-4" />
          <span>عرض التفاصيل</span>
        </Link>
      </div>
    </div>
  )
}

export default CasePetitionsItem