'use client'

import useSWR from 'swr'
import { casePetitions } from "../services/api/CasePetitions"
import CasePetitionsItem from "./CasePetitionsItem"
import { useTranslations } from '@/hooks/useTranslations'

function CasePetitions() {
    const { t } = useTranslations()
    const { data, error, isLoading } = useSWR('case-petitions', casePetitions)

    if (isLoading) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-amber-200 dark:bg-amber-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
                    {t('home.newCasePetitions')}
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
                <div className='text-lg font-bold rounded-2xl bg-amber-200 dark:bg-amber-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
                    {t('home.newCasePetitions')}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-center text-red-500 dark:text-red-400">{t('home.errorLoadingData')}</div>
                </div>
            </div>
        )
    }

    const petitions = data?.success ? data.data : []

    return <div>
        <div className='text-lg font-bold rounded-2xl bg-amber-200 dark:bg-amber-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
            {t('home.newCasePetitions')}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4">
            {petitions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noNewCasePetitions')}</div>
            ) : (
                petitions.map((petition) => (
                    <CasePetitionsItem
                        key={petition.id}
                        petition={petition}
                    />
                ))
            )}
        </div>
    </div>
}

export default CasePetitions