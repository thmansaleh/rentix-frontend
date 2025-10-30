"use client"

import React, { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  getAppNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '@/app/services/api/appNotifications'
import useSWR from 'swr'
import NotificationHeader from './NotificationHeader'
import NotificationItem from './NotificationItem'
import NotificationEmpty from './NotificationEmpty'
import { REFRESH_INTERVALS, FETCH_LIMITS } from './constants'

function NotificationMenu() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  // Fetch notifications
  const { data: notificationsData, error, mutate } = useSWR(
    ['app-notifications', filter],
    () => getAppNotifications({
      limit: FETCH_LIMITS.DEFAULT,
      is_read: filter === 'all' ? undefined : filter === 'unread' ? false : true
    }),
    {
      refreshInterval: REFRESH_INTERVALS.NOTIFICATIONS,
      revalidateOnFocus: true
    }
  )

  // Fetch unread count
  const { data: unreadData, mutate: mutateUnreadCount } = useSWR(
    'unread-count',
    getUnreadCount,
    {
      refreshInterval: REFRESH_INTERVALS.UNREAD_COUNT,
      revalidateOnFocus: true
    }
  )

  const notifications = notificationsData?.data?.notifications || []
  const unreadCount = unreadData?.data?.unread_count || 0

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId)
      mutate()
      mutateUnreadCount()
    } catch (error) {
      // Handle error
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      mutate()
      mutateUnreadCount()
    } catch (error) {
      // Handle error
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId)
      mutate()
      mutateUnreadCount()
    } catch (error) {
      // Handle error
    }
  }

  return (
    <DropdownMenu dir={isArabic ? 'rtl' : 'ltr'} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2"
          aria-label={isArabic ? 'التنبيهات' : 'Notifications'}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-5 animate-bounce"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full animate-ping opacity-75" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align={isArabic ? "start" : "end"} 
        className="w-80 md:w-96 p-0"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <NotificationHeader
              isArabic={isArabic}
              unreadCount={unreadCount}
              filter={filter}
              onFilterChange={setFilter}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </CardHeader>

          <CardContent dir={isArabic ? 'rtl' : 'ltr'} className="p-0">
            <ScrollArea dir={isArabic ? 'rtl' : 'ltr'} className="h-96">
              {notifications.length === 0 ? (
                <NotificationEmpty isArabic={isArabic} />
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isArabic={isArabic}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationMenu