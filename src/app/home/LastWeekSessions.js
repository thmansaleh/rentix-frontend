'use client'

import LastWeekSessionsItem from "./LastWeekSessionsItem"
import useSWR from 'swr'
import { getSessionsThisWeek } from '../services/api/sessions'

function LastWeekSessions() {
    const { data, error, isLoading } = useSWR('sessions-this-week', getSessionsThisWeek)

    if (isLoading) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-amber-200 dark:bg-amber-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
                    📅 جلسات الأسبوع
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-center text-gray-500 dark:text-gray-400">جاري التحميل...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-amber-200 dark:bg-amber-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
                    📅 جلسات الأسبوع
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-center text-red-500 dark:text-red-400">خطأ في تحميل البيانات</div>
                </div>
            </div>
        )
    }

    const sessions = data?.success ? data.data : []

    return <div>
        <div className='text-lg font-bold rounded-2xl bg-amber-200 dark:bg-amber-700 p-3 text-center mb-4 shadow-sm dark:text-gray-100'>
            📅 جلسات الأسبوع
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 p-4">
            {sessions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">لا توجد جلسات هذا الأسبوع</div>
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