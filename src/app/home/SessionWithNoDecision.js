'use client'

import SessionWithNoDecisionItem from "./SessionWithNoDecisionItem"
import useSWR from 'swr'
import { getSessionsNoDecision } from '../services/api/sessions'
import { useTranslations } from '@/hooks/useTranslations'

function SessionWithNoDecision() {
    const { t } = useTranslations()
    const { data, error, isLoading } = useSWR('sessions-no-decision', getSessionsNoDecision)

    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500 shadow-sm'>
                    <div className='flex-1'>
                        <h3 className='text-sm sm:text-base font-semibold text-orange-900 dark:text-orange-100'>
                            {t('home.delayedDecisions')}
                        </h3>
                    </div>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-center text-gray-500 dark:text-gray-400">{t('home.loading')}</div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col h-full">
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500 shadow-sm'>
                    <div className='flex-1'>
                        <h3 className='text-sm sm:text-base font-semibold text-orange-900 dark:text-orange-100'>
                            {t('home.delayedDecisions')}
                        </h3>
                    </div>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-red-500 dark:text-red-400">{t('home.errorLoadingData')}</div>
                    </div>
                </div>
            </div>
        )
    }

    const sessions = data?.success ? data.data : []

    return <div className="flex flex-col h-full">
        <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex-1'>
                <h3 className='text-sm sm:text-base font-semibold text-orange-900 dark:text-orange-100'>
                    {t('home.delayedDecisions')}
                </h3>
            </div>
            {sessions.length > 0 && (
                <span className='relative inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium bg-orange-500 text-white rounded-full'>
                    <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75"></span>
                    <span className="relative">{sessions.length}</span>
                </span>
            )}
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-y-auto max-h-[600px]">
            {sessions.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px] text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noDelayedDecisions')}</div>
            ) : (
                sessions.map((session) => (
                    <SessionWithNoDecisionItem 
                        key={session.id}
                        session={session}
                    />
                ))
            )}
        </div>
    </div>
}

export default SessionWithNoDecision