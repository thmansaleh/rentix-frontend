'use client'

import SessionWithNoDecisionItem from "./SessionWithNoDecisionItem"
import useSWR from 'swr'
import { getSessionsNoDecision } from '../services/api/sessions'

function SessionWithNoDecision() {
    const { data, error, isLoading } = useSWR('sessions-no-decision', getSessionsNoDecision)

    if (isLoading) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-orange-200 p-3 text-center mb-4 shadow-sm'>
                    ⚠️ القرارات المتاخرة
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
                <div className='text-lg font-bold rounded-2xl bg-orange-200 p-3 text-center mb-4 shadow-sm'>
                    ⚠️ القرارات المتاخرة
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center text-red-500">خطأ في تحميل البيانات</div>
                </div>
            </div>
        )
    }

    const sessions = data?.success ? data.data : []

    return <div>
        <div className='text-lg font-bold rounded-2xl bg-orange-200 p-3 text-center mb-4 shadow-sm'>
            ⚠️ القرارات المتاخرة
        </div>
        <div className="bg-gray-50 rounded-lg space-y-3 p-4">
            {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">لا توجد قرارات متاخرة</div>
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