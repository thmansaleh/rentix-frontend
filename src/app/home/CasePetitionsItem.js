import { Calendar1, CaseLower, Clock, File, FileSpreadsheet, Folder, Info } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CasePetitionsItem({ petition }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد'
    return new Date(dateString).toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get decision status text
  const getDecisionStatus = (decision) => {
    switch (decision) {
      case 0: return 'مرفوض'
      case 1: return 'مقبول'
    //   case -1: return 'مرفوض'
    //   default: return 'غير محدد'
    }
  }

  // Get decision status color
  const getDecisionColor = (decision) => {
    switch (decision) {
      case 0: return 'text-yellow-600 bg-yellow-100'
      case 1: return 'text-green-600 bg-green-100'
    //   case -1: return 'text-red-600 bg-red-100'
    //   default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 flex items-center">
            <span className="ml-2">📋</span>
            القضية رقم: {petition.case_number}
          </h3>
          <p className="text-gray-600 text-sm flex items-center">
            <Folder className="w-4 h-4 text-yellow-600 ml-2" />
            رقم الملف: {petition.file_number}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDecisionColor(petition.decision)}`}>
          {getDecisionStatus(petition.decision)}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <File className="w-4 h-4 text-gray-600 ml-2" />
          <span className="font-medium text-gray-700 ml-2">موضوع القضية:</span>
          <span className="text-gray-600">{petition.case_topic}</span>
        </div>

        <div className="flex items-center gap-x-2">
          <FileSpreadsheet className="w-4 h-4 text-blue-600 ml-2" />
          <span className="font-medium text-gray-700 ml-2"> العريضة:</span>
          <span className="text-gray-600">{petition.type}</span>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-x-2">
            <Calendar1 className="w-4 h-4 text-purple-600 ml-2" />
            <div>
              <span className="block font-medium text-gray-700 text-xs">تاريخ التقديم</span>
              <span className="text-gray-600">{formatDate(petition.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            {/* <span className="ml-2">⏰</span> */}
            <Clock className="w-4 h-4 text-blue-600 ml-2" />
            <div>
              <span className="block font-medium text-gray-700 text-xs">اخر موعد لاتاخذ اجراء</span>
              <span className="text-gray-600">{formatDate(petition.appeal_date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Clock className="w-4 h-4 animate-pulse text-red-600 ml-2" />
            <div className="flex items-center gap-2">
              <div>
                <span className="block font-medium text-gray-700 text-xs">عدد الايام المتبقية</span>
                <span className="text-gray-600 flex items-center gap-2">
                  {(() => {
                    const daysRemaining = Math.ceil((new Date(petition.appeal_date) - new Date()) / (1000 * 60 * 60 * 24));
                    const isOverdue = daysRemaining <= 0;
                    const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
                    
                    return (
                      <>
                        {isOverdue ? '⚠️ متأخر ' : ' '}
                        <div className="relative inline-flex items-center justify-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white relative z-10 ${
                            isOverdue ? 'bg-red-500' : isUrgent ? 'bg-orange-500' : 'bg-green-500'
                          }`}>
                            {Math.abs(daysRemaining)}
                          </div>
                          {/* Glowing/flashing rings */}
                          <div className={`absolute inset-0 rounded-full animate-ping ${
                            isOverdue ? 'bg-red-400' : isUrgent ? 'bg-orange-400' : 'bg-green-400'
                          } opacity-75`}></div>
                          <div className={`absolute inset-[-2px] rounded-full animate-pulse ${
                            isOverdue ? 'bg-red-300' : isUrgent ? 'bg-orange-300' : 'bg-green-300'
                          } opacity-50`} style={{animationDelay: '0.5s'}}></div>
                        </div>
                        {Math.abs(daysRemaining) === 1 ? ' يوم' : ' يوم'}
                      </>
                    );
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href={`/cases/${petition.case_id}/edit`}>
      <Info className="w-5 h-5 cursor-pointer text-blue-700" />
    </Link>
    </div>
  )
}

export default CasePetitionsItem