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
            <div className="flex flex-col h-full">
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-l-4 border-amber-500 shadow-sm'>
                    <div className='flex-1'>
                        <h3 className='text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-100'>
                            {t('home.newCasePetitions')}
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
                <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-l-4 border-amber-500 shadow-sm'>
                    <div className='flex-1'>
                        <h3 className='text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-100'>
                            {t('home.newCasePetitions')}
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

    const petitions = data?.success ? data.data : []

    return <div className="flex flex-col h-full">
        <div className='flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex-1'>
                <h3 className='text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-100'>
                    {t('home.newCasePetitions')}
                </h3>
            </div>
            {petitions.length > 0 && (
                <span className='relative inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium bg-amber-500 text-white rounded-full'>
                    <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75"></span>
                    <span className="relative">{petitions.length}</span>
                </span>
            )}
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-y-auto max-h-[600px]">
            {petitions.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px] text-center text-gray-500 dark:text-gray-400 py-4">{t('home.noNewCasePetitions')}</div>
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