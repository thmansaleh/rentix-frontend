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
            <div>
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500'>
                    <div className='flex-1'>
                        <h3 className='text-base font-semibold text-orange-900 dark:text-orange-100'>
                            {t('home.delayedDecisions')}
                        </h3>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-center text-gray-500 dark:text-gray-400">{t('home.loading')}</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500'>
                    <div className='flex-1'>
                        <h3 className='text-base font-semibold text-orange-900 dark:text-orange-100'>
                            {t('home.delayedDecisions')}
                        </h3>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-center text-red-500 dark:text-red-400">{t('home.errorLoadingData')}</div>
                </div>
            </div>
        )
    }

    const sessions = data?.success ? data.data : []

    return <div>
        <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500'>
            <div className='flex-1'>
                <h3 className='text-base font-semibold text-orange-900 dark:text-orange-100'>
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
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4">
            {sessions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noDelayedDecisions')}</div>
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