import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, FileText, User, Clock, Calendar } from 'lucide-react'
import Actions from './Actions'

function SessionWithNoDecisionItem({ 
  session,
  title, 
  date, 
  caseNumber, 
  clientName,
  time
}) {
  // Handle both direct props (for backward compatibility) and session object
  const sessionData = session || {
    title,
    date,
    caseNumber,
    clientName,
    time
  }

  const getDegreeBadge = (degree) => {
    if (!degree || degree === "0") {
      return null
    }
    
    const degreeConfig = {
      appeal: { label: 'استئناف', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
      first_instance: { label: 'ابتدائية', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
      cassation: { label: 'نقض', color: 'bg-red-100 text-red-800 hover:bg-red-200' }
    }
    
    return degreeConfig[degree] || { label: degree, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' }
  }

  // Helper functions to format API data
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ar-AE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Extract data from API response or use props
  const displayDate = session ? formatDate(session.session_date) : sessionData.date
  const displayTime = session ? formatTime(session.session_date) : sessionData.time
  const displayCaseNumber = session ? session.case_number : sessionData.caseNumber
  const displayClientName = session ? (session.clientParties?.[0] || 'غير محدد') : sessionData.clientName
  const displayDegree = session ? session.degree : sessionData.degree
  const displayFileNumber = session ? session.file_number : sessionData.fileNumber

  const degreeInfo = getDegreeBadge(displayDegree)

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02] dark:bg-gray-900 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-center mb-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg ">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-200 dark:bg-orange-700 rounded-full">
              <Hash className="w-5 h-5 text-orange-700 dark:text-orange-200" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 text-center">
              رقم الملف : {displayFileNumber || 'غير محدد'}
            </h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>تاريخ الجلسة: {displayDate}</span>
            {displayTime && <span className="text-orange-600 dark:text-orange-400 font-medium">• {displayTime}</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>رقم القضية: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{displayCaseNumber}</span>
            {degreeInfo && (
              <Badge className={`ml-2 ${degreeInfo.color}`}>
                {degreeInfo.label}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>العميل: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{displayClientName}</span>
          </div>
          
          
          <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
            <span className="font-semibold">  {session.is_judgment_deferred ? "مدد الحكم": session.is_judgment_reserved ? "حجز الحكم" : "لايوجد قرار بعد"}</span>
          </div>
          
          <Actions theme="orange" sessionId={session?.id} />
        </div>
      </CardContent>
    </Card>
  )
}

export default SessionWithNoDecisionItem