'use client'

import { getAppealsAndChallenges } from "../services/api/sessions"
import AppealsAndChallengesItem from "./AppealsAndChallengesItem"
import useSWR from 'swr'
import { useTranslations } from '@/hooks/useTranslations'

function AppealsAndChallenges() {
    const { t } = useTranslations()
    const { data, error, isLoading } = useSWR('appeals-challenges', getAppealsAndChallenges)

    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-l-4 border-purple-500 shadow-sm'>
                    <div className='flex-1'>
                        <h3 className='text-sm sm:text-base font-semibold text-purple-900 dark:text-purple-100'>
                            {t('home.appealAndCassationSessions')}
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
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-l-4 border-purple-500 shadow-sm'>
                    <div className='flex-1'>
                        <h3 className='text-sm sm:text-base font-semibold text-purple-900 dark:text-purple-100'>
                            {t('home.appealAndCassationSessions')}
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
        <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex-1'>
                <h3 className='text-sm sm:text-base font-semibold text-purple-900 dark:text-purple-100'>
                    {t('home.appealAndCassationSessions')}
                </h3>
            </div>
            {sessions.length > 0 && (
                <span className='relative inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium bg-purple-500 text-white rounded-full'>
                    <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75"></span>
                    <span className="relative">{sessions.length}</span>
                </span>
            )}
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-y-auto max-h-[600px]">
            {sessions.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px] text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noAppealOrCassationSessions')}</div>
            ) : (
                sessions.map((session) => (
                    <AppealsAndChallengesItem 
                        key={session.id}
                        session={session}
                    />
                ))
            )}
        </div>
    </div>
}

export default AppealsAndChallenges;
