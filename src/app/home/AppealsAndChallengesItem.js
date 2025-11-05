import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, FileText, User, Clock, Calendar, AlertTriangle, File, Scale } from 'lucide-react'
import Actions from './Actions'
import { useTranslations } from '@/hooks/useTranslations'

function AppealsAndChallengesItem({ session }) {
  // data =       {
  //           "id": 81,
  //           "case_id": 150,
  //           "session_date": "2025-10-28 01:00:00",
  //           "ruling": "test2",
  //           "case_number": "980",
  //           "file_number": "20251027074715",
  //           "topic": "رأي عام طبعا",
  //           "objection_days": null,
  //           "appeal_days": 30,
  //           "cassation_days": null,
  //           "legal_period_name": "التجارية والمدنية والعمالية اقل من 500,000 درهم",
  //           "objection_end_date": null,
  //           "appeal_end_date": "2025-11-27 01:00:00",
  //           "cassation_end_date": null,
  //           "has_objection": false,
  //           "has_appeal": true,
  //           "has_cassation": false,
  //           "clientParties": [
  //               "تامر"
  //           ]
  //       },
  const { t } = useTranslations()
  const tSessions = useTranslations('sessions')
 
  // Helper functions to format dates
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    })
  }

  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null
    const now = new Date()
    const deadline = new Date(endDate)
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
    return {
      days: daysRemaining,
      isOverdue: daysRemaining < 0,
      isUrgent: daysRemaining <= 7 && daysRemaining > 0
    }
  }

  // Get deadline badge styles
  const getDeadlineBadgeStyle = (daysInfo) => {
    if (!daysInfo) return { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-400' }
    if (daysInfo.isOverdue) return { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-400' }
    if (daysInfo.isUrgent) return { bg: 'bg-orange-100', text: 'text-orange-800', ring: 'ring-orange-400' }
    return { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-400' }
  }

  // Format ruling text
  const displayRuling = session?.ruling || t('home.ruling')
  const displayTopic = session?.topic || t('home.notSpecified')
  const displayClientParties = session?.clientParties || []
  const displayFileNumber = session?.file_number
  const displayCaseNumber = session?.case_number

  // Calculate deadline info for each type
  const objectionInfo = session?.has_objection ? calculateDaysRemaining(session.objection_end_date) : null
  const appealInfo = session?.has_appeal ? calculateDaysRemaining(session.appeal_end_date) : null
  const cassationInfo = session?.has_cassation ? calculateDaysRemaining(session.cassation_end_date) : null

  // Find the most urgent deadline
  const getMostUrgent = () => {
    const deadlines = [
      { name: t('home.objection'), info: objectionInfo, date: session?.objection_end_date, days: session?.objection_days },
      { name: t('home.appeal'), info: appealInfo, date: session?.appeal_end_date, days: session?.appeal_days },
      { name: t('home.cassation'), info: cassationInfo, date: session?.cassation_end_date, days: session?.cassation_days }
    ].filter(d => d.info !== null)

    if (deadlines.length === 0) return null

    // Sort by days remaining (most urgent first)
    deadlines.sort((a, b) => a.info.days - b.info.days)
    return deadlines[0]
  }

  const mostUrgent = getMostUrgent()

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-600 dark:bg-gray-900 dark:border-gray-700">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-2.5">
          {/* Ruling Date */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('home.rulingDate')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatDate(session?.session_date)}
            </span>
          </div>

          {/* File Number */}
          {displayFileNumber && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <File className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('home.fileNumber')}:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 break-all">{displayFileNumber}</span>
            </div>
          )}

          {/* Case Number */}
          {displayCaseNumber && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('home.caseNumber')}:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 break-all">{displayCaseNumber}</span>
            </div>
          )}

          {/* Client Parties */}
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1 min-w-0 flex-1">
              <span className="whitespace-nowrap">{t('home.clientNames')}:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 break-words">
                {displayClientParties.length > 0 ? displayClientParties.join('، ') : t('home.notSpecified')}
              </span>
            </div>
          </div>

          {/* Ruling */}
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
            <Scale className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1 min-w-0 flex-1">
              <span className="whitespace-nowrap">{t('home.ruling')}:</span>
              <span className="font-medium text-purple-900 dark:text-purple-300 break-words">{displayRuling}</span>
            </div>
          </div>

          {/* Legal Periods Section - Compact Design */}
          {(session?.has_objection || session?.has_appeal || session?.has_cassation) && (
            <div className="mt-2 sm:mt-3">
              <div className="space-y-2">
                {/* Objection (تظلم) */}
                {session?.has_objection && (
                  <div className="flex items-start justify-between p-2 sm:p-2.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-1 bg-blue-500 rounded flex-shrink-0">
                        <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-xs font-semibold text-blue-900 dark:text-blue-100 break-words">{t('home.lastDateFor')} {t('home.objection')}</div>
                        <div className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300">{formatDate(session.objection_end_date)}</div>
                      </div>
                    </div>
                    {objectionInfo && (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="relative">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg relative z-10 ${
                            objectionInfo.isOverdue 
                              ? 'bg-red-500 animate-pulse' 
                              : objectionInfo.isUrgent 
                                ? 'bg-orange-500 animate-bounce' 
                                : 'bg-green-500'
                          }`}>
                            {Math.abs(objectionInfo.days)}
                          </div>
                          {objectionInfo.isOverdue && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
                              <div className="absolute inset-[-2px] rounded-full bg-red-300 animate-pulse opacity-50" style={{animationDelay: '0.5s'}}></div>
                            </>
                          )}
                          {objectionInfo.isUrgent && !objectionInfo.isOverdue && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></div>
                              <div className="absolute inset-[-2px] rounded-full bg-orange-300 animate-pulse opacity-50" style={{animationDelay: '0.3s'}}></div>
                            </>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium whitespace-nowrap text-center ${
                          objectionInfo.isOverdue 
                            ? 'text-red-600 dark:text-red-400' 
                            : objectionInfo.isUrgent 
                              ? 'text-orange-600 dark:text-orange-400' 
                              : 'text-green-600 dark:text-green-400'
                        }`}>
                          {objectionInfo.isOverdue ? t('home.overdue') : t('home.remaining')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Appeal (استئناف) */}
                {session?.has_appeal && (
                  <div className="flex items-start justify-between p-2 sm:p-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-1 bg-purple-500 rounded flex-shrink-0">
                        <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-xs font-semibold text-purple-900 dark:text-purple-100 break-words">{t('home.lastDateFor')} {t('home.appeal')}</div>
                        <div className="text-[10px] sm:text-xs text-purple-700 dark:text-purple-300">{formatDate(session.appeal_end_date)}</div>
                      </div>
                    </div>
                    {appealInfo && (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="relative">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg relative z-10 ${
                            appealInfo.isOverdue 
                              ? 'bg-red-500 animate-pulse' 
                              : appealInfo.isUrgent 
                                ? 'bg-orange-500 animate-bounce' 
                                : 'bg-green-500'
                          }`}>
                            {Math.abs(appealInfo.days)}
                          </div>
                          {appealInfo.isOverdue && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
                              <div className="absolute inset-[-2px] rounded-full bg-red-300 animate-pulse opacity-50" style={{animationDelay: '0.5s'}}></div>
                            </>
                          )}
                          {appealInfo.isUrgent && !appealInfo.isOverdue && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></div>
                              <div className="absolute inset-[-2px] rounded-full bg-orange-300 animate-pulse opacity-50" style={{animationDelay: '0.3s'}}></div>
                            </>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium whitespace-nowrap text-center ${
                          appealInfo.isOverdue 
                            ? 'text-red-600 dark:text-red-400' 
                            : appealInfo.isUrgent 
                              ? 'text-orange-600 dark:text-orange-400' 
                              : 'text-green-600 dark:text-green-400'
                        }`}>
                          {appealInfo.isOverdue ? t('home.overdue') : t('home.remaining')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cassation (طعن) */}
                {session?.has_cassation && (
                  <div className="flex items-start justify-between p-2 sm:p-2.5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="p-1 bg-red-500 rounded flex-shrink-0">
                        <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] sm:text-xs font-semibold text-red-900 dark:text-red-100 break-words">{t('home.lastDateFor')} {t('home.cassation')}</div>
                        <div className="text-[10px] sm:text-xs text-red-700 dark:text-red-300">{formatDate(session.cassation_end_date)}</div>
                      </div>
                    </div>
                    {cassationInfo && (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="relative">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg relative z-10 ${
                            cassationInfo.isOverdue 
                              ? 'bg-red-500 animate-pulse' 
                              : cassationInfo.isUrgent 
                                ? 'bg-orange-500 animate-bounce' 
                                : 'bg-green-500'
                          }`}>
                            {Math.abs(cassationInfo.days)}
                          </div>
                          {cassationInfo.isOverdue && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
                              <div className="absolute inset-[-2px] rounded-full bg-red-300 animate-pulse opacity-50" style={{animationDelay: '0.5s'}}></div>
                            </>
                          )}
                          {cassationInfo.isUrgent && !cassationInfo.isOverdue && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></div>
                              <div className="absolute inset-[-2px] rounded-full bg-orange-300 animate-pulse opacity-50" style={{animationDelay: '0.3s'}}></div>
                            </>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium whitespace-nowrap text-center ${
                          cassationInfo.isOverdue 
                            ? 'text-red-600 dark:text-red-400' 
                            : cassationInfo.isUrgent 
                              ? 'text-orange-600 dark:text-orange-400' 
                              : 'text-green-600 dark:text-green-400'
                        }`}>
                          {cassationInfo.isOverdue ? t('home.overdue') : t('home.remaining')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No legal periods */}
          {!session?.has_objection && !session?.has_appeal && !session?.has_cassation && (
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                {t('home.noLegalPeriods')}
              </div>
            </div>
          )}

          <Actions theme="purple" caseId={session?.case_id} />   
        </div>
      </CardContent>
    </Card>
  )
}

export default AppealsAndChallengesItem
