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
            <span className="ml-2">📁</span>
            رقم الملف: {petition.file_number}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDecisionColor(petition.decision)}`}>
          {getDecisionStatus(petition.decision)}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className="ml-2">📄</span>
          <span className="font-medium text-gray-700 ml-2">موضوع القضية:</span>
          <span className="text-gray-600">{petition.case_topic}</span>
        </div>

        <div className="flex items-center">
          <span className="ml-2">⚖️</span>
          <span className="font-medium text-gray-700 ml-2"> الامر:</span>
          <span className="text-gray-600">{petition.type}</span>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <span className="ml-2">📅</span>
            <div>
              <span className="block font-medium text-gray-700 text-xs">تاريخ التقديم</span>
              <span className="text-gray-600">{formatDate(petition.date)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="ml-2">⏰</span>
            <div>
              <span className="block font-medium text-gray-700 text-xs">اخر موعد لاتاخذ اجراء</span>
              <span className="text-gray-600">{formatDate(petition.appeal_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CasePetitionsItem