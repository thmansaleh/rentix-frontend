"use client"

import React from 'react'
import { Bell } from 'lucide-react'

function NotificationEmpty({ isArabic }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">
        {isArabic ? 'لا توجد تنبيهات' : 'No notifications'}
      </p>
    </div>
  )
}

export default NotificationEmpty
