'use client'

import LastWeekSessionsItem from "./LastWeekSessionsItem"
import useSWR from 'swr'
import { getSessionsThisWeek } from '../services/api/sessions'
import { useTranslations } from '@/hooks/useTranslations'

function LastWeekSessions() {
    const { t } = useTranslations()
    const { data, error, isLoading } = useSWR('sessions-this-week', getSessionsThisWeek)

    if (isLoading) {
        return (
            <div>
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-blue-500'>
                    <div className='flex-1'>
                        <h3 className='text-base font-semibold text-blue-900 dark:text-blue-100'>
                            {t('home.weekSessions')}
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
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-blue-500'>
                    <div className='flex-1'>
                        <h3 className='text-base font-semibold text-blue-900 dark:text-blue-100'>
                            {t('home.weekSessions')}
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
        <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-blue-500'>
            <div className='flex-1'>
                <h3 className='text-base font-semibold text-blue-900 dark:text-blue-100'>
                    {t('home.weekSessions')}
                </h3>
            </div>
            {sessions.length > 0 && (
                <span className='relative inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full'>
                    <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></span>
                    <span className="relative">{sessions.length}</span>
                </span>
            )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4">
            {sessions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noSessionsThisWeek')}</div>
            ) : (
                sessions.map((session) => (
                    <LastWeekSessionsItem 
                        key={session.id}
                        session={session}
                    />
                ))
            )}
        </div>
    </div>
}

export default LastWeekSessions