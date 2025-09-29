'use client'

import { getSessionsWithDecisions } from "../services/api/sessions"
import SessionsWithDecisionItem from "./SessionsWithDecisionItem"
import useSWR from 'swr'
// import { getsessionsWithDecision } from '../services/api/sessions'

function SessionsWithDecision() {
    const { data, error, isLoading } = useSWR('sessions-with-decisions', getSessionsWithDecisions)

    if (isLoading) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-purple-200 p-3 text-center mb-4 shadow-sm'>
                    ⚖️ جلسات النقض والاستئناف
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center text-gray-500">جاري التحميل...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-purple-200 p-3 text-center mb-4 shadow-sm'>
                    ⚖️ جلسات النقض والاستئناف
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center text-red-500">خطأ في تحميل البيانات</div>
                </div>
            </div>
        )
    }

    const sessions = data?.success ? data.data : []

    return <div>
        <div className='text-lg font-bold rounded-2xl bg-purple-200 p-3 text-center mb-4 shadow-sm'>
            ⚖️ جلسات الاستئناف والطعن
        </div>
        <div className="bg-gray-50 rounded-lg space-y-3 p-4">
            {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">لا توجد جلسات استئناف أو طعن</div>
            ) : (
                sessions.map((session) => (
                    <SessionsWithDecisionItem 
                        key={session.id}
                        session={session}
                    />
                ))
            )}
        </div>
    </div>
}

export default SessionsWithDecision;