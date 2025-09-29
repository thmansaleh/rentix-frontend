'use client'

import LastWeekSessionsItem from "./LastWeekSessionsItem"
import useSWR from 'swr'
import { casePetitions } from "../services/api/CasePetitions"
import CasePetitionsItem from "./CasePetitionsItem"

function CasePetitions() {
    const { data, error, isLoading } = useSWR('case-petitions', casePetitions)

    if (isLoading) {
        return (
            <div>
                <div className='text-lg font-bold rounded-2xl bg-amber-200 p-3 text-center mb-4 shadow-sm'>
                    📅 اجراءات قضايا جديدة
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
                <div className='text-lg font-bold rounded-2xl bg-amber-200 p-3 text-center mb-4 shadow-sm'>
                    📅 اجراءات قضايا جديدة
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center text-red-500">خطأ في تحميل البيانات</div>
                </div>
            </div>
        )
    }

    const petitions = data?.success ? data.data : []

    return <div>
        <div className='text-lg font-bold rounded-2xl bg-amber-200 p-3 text-center mb-4 shadow-sm'>
            📅 اجراءات قضايا جديدة
        </div>
        <div className="bg-gray-50 rounded-lg space-y-3 p-4">
            {petitions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">لا توجد اجراءات قضايا جديدة</div>
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