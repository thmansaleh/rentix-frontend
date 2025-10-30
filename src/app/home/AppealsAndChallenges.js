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
            <div>
                <div className='text-lg font-bold rounded-2xl bg-purple-200 dark:bg-purple-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
                    {t('home.appealAndCassationSessions')}
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
                <div className='text-lg font-bold rounded-2xl bg-purple-200 dark:bg-purple-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
                    {t('home.appealAndCassationSessions')}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-center text-red-500 dark:text-red-400">{t('home.errorLoadingData')}</div>
                </div>
            </div>
        )
    }

    const sessions = data?.success ? data.data : []

    return <div>
        <div className='text-lg font-bold rounded-2xl bg-purple-200 dark:bg-purple-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
            {t('home.appealAndCassationSessions')}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4">
            {sessions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noAppealOrCassationSessions')}</div>
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
