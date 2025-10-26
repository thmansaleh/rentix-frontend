"use client"

import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Settings,
  User,
  FileText,
  Calendar,
  Clipboard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslations } from '@/hooks/useTranslations'
import { 
  getAppNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '@/app/services/api/appNotifications'
import useSWR from 'swr'

function NotificationMenu() {
  const { language } = useLanguage()
  const { t } = useTranslations()
  const isArabic = language === 'ar'
  
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('all') // all, unread, read

  // Fetch notifications
  const { data: notificationsData, error, mutate } = useSWR(
    ['app-notifications', filter],
    () => getAppNotifications({
      limit: 20,
      is_read: filter === 'all' ? undefined : filter === 'unread' ? false : true
    }),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true
    }
  )

  // Fetch unread count
  const { data: unreadData, mutate: mutateUnreadCount } = useSWR(
    'unread-count',
    getUnreadCount,
    {
      refreshInterval: 15000, // Refresh every 15 seconds
      revalidateOnFocus: true
    }
  )

  const notifications = notificationsData?.data?.notifications || []
  const unreadCount = unreadData?.data?.unread_count || 0

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getRelatedIcon = (relatedType) => {
    switch (relatedType) {
      case 'task':
        return <Clipboard className="h-3 w-3" />
      case 'client request':
        return <User className="h-3 w-3" />
      case 'employee':
        return <User className="h-3 w-3" />
      case 'event':
        return <Calendar className="h-3 w-3" />
      case 'memo':
        return <FileText className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId)
      mutate()
      mutateUnreadCount()
    } catch (error) {

    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      mutate()
      mutateUnreadCount()
    } catch (error) {

    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId)
      mutate()
      mutateUnreadCount()
    } catch (error) {

    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) {
      return isArabic ? 'الآن' : 'Now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return isArabic ? `منذ ${minutes} دقيقة` : `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return isArabic ? `منذ ${days} يوم` : `${days}d ago`
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
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-5"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {isArabic ? 'التنبيهات' : 'Notifications'}
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    {isArabic ? 'قراءة الكل' : 'Mark all read'}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-1 mt-2">
              {['all', 'unread', 'read'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className="text-xs"
                >
                  {isArabic ? 
                    (filterOption === 'all' ? 'الكل' : 
                     filterOption === 'unread' ? 'غير مقروءة' : 'مقروءة') :
                    (filterOption === 'all' ? 'All' : 
                     filterOption === 'unread' ? 'Unread' : 'Read')
                  }
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent dir={isArabic ? 'rtl' : 'ltr'} className="p-0">
            <ScrollArea dir={isArabic ? 'rtl' : 'ltr'} className="h-96">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {isArabic ? 'لا توجد تنبيهات' : 'No notifications'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 border-b border-gray-100 ${
                        !notification.is_read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-medium truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                  title={isArabic ? 'وضع علامة كمقروء' : 'Mark as read'}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                title={isArabic ? 'حذف' : 'Delete'}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(notification.created_at)}</span>
                              {notification.related_type !== 'none' && (
                                <div className="flex items-center gap-1">
                                  {getRelatedIcon(notification.related_type)}
                                  <span className="capitalize">{notification.related_type}</span>
                                </div>
                              )}
                            </div>
                            {notification.created_by_name && (
                              <span className="text-xs text-gray-400">
                                {isArabic ? 'بواسطة' : 'by'} {notification.created_by_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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