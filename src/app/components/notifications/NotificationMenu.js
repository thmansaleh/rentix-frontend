"use client"

import React, { useState } from 'react'
import { Bell, Droplets, Wrench, Shield, FileText } from 'lucide-react'
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
import { getOilChangeAlerts, getMaintenanceAlerts, getInsuranceAlerts, getRegistrationAlerts } from '@/app/services/api/cars'
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

  // Fetch oil change alerts
  const { data: oilAlertsData } = useSWR(
    'oil-change-alerts',
    () => getOilChangeAlerts(500),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true
    }
  )

  // Fetch maintenance date alerts
  const { data: maintenanceAlertsData } = useSWR(
    'maintenance-alerts',
    () => getMaintenanceAlerts(7),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true
    }
  )

  // Fetch insurance expiry alerts
  const { data: insuranceAlertsData } = useSWR(
    'insurance-alerts',
    () => getInsuranceAlerts(30),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true
    }
  )

  // Fetch registration expiry alerts
  const { data: registrationAlertsData } = useSWR(
    'registration-alerts',
    () => getRegistrationAlerts(30),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true
    }
  )

  const notifications = notificationsData?.data?.notifications || []
  const unreadCount = unreadData?.data?.unread_count || 0
  const oilAlerts = oilAlertsData?.data || []
  const maintenanceAlerts = maintenanceAlertsData?.data || []
  const insuranceAlerts = insuranceAlertsData?.data || []
  const registrationAlerts = registrationAlertsData?.data || []
  const totalAlertCount = unreadCount + oilAlerts.length + maintenanceAlerts.length + insuranceAlerts.length + registrationAlerts.length

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
          {totalAlertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 py-0 text-[10px] font-bold leading-none"
            >
              {totalAlertCount > 99 ? '99+' : totalAlertCount}
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
              {/* Oil Change Alerts */}
              {oilAlerts.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/30 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {isArabic ? 'تنبيهات تغيير الزيت' : 'Oil Change Alerts'}
                    </span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-amber-300 text-amber-600 dark:border-amber-600 dark:text-amber-400">
                      {oilAlerts.length}
                    </Badge>
                  </div>
                  {oilAlerts.map((car) => (
                    <div
                      key={`oil-${car.id}`}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 ${
                        car.oil_status === 'overdue'
                          ? 'bg-red-50 dark:bg-red-950/30 border-l-2 border-l-red-500'
                          : 'bg-amber-50/50 dark:bg-amber-950/20 border-l-2 border-l-amber-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Droplets className={`h-4 w-4 ${
                            car.oil_status === 'overdue' ? 'text-red-500' : 'text-amber-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium dark:text-gray-100">
                            {car.brand} {car.model} - {car.plate_number}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {car.oil_status === 'overdue' ? (
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                {isArabic
                                  ? `⚠️ متأخر بـ ${Math.abs(car.remaining_km).toLocaleString()} كم`
                                  : `⚠️ Overdue by ${Math.abs(car.remaining_km).toLocaleString()} KM`}
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400">
                                {isArabic
                                  ? `🔔 متبقي ${car.remaining_km.toLocaleString()} كم`
                                  : `🔔 ${car.remaining_km.toLocaleString()} KM remaining`}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {isArabic ? 'العداد:' : 'Mileage:'} {car.mileage?.toLocaleString()} {isArabic ? 'كم' : 'KM'}
                            {' | '}
                            {isArabic ? 'القادم:' : 'Next:'} {car.next_oil_change_km?.toLocaleString()} {isArabic ? 'كم' : 'KM'}
                            {car.oil_type && <>{' | '}{isArabic ? 'نوع الزيت:' : 'Oil:'} {car.oil_type}</>}
                            {car.garage_name && <>{' | '}{isArabic ? 'الورشة:' : 'Garage:'} {car.garage_name}</>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Maintenance Date Alerts */}
              {maintenanceAlerts.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                      {isArabic ? 'تنبيهات الصيانة' : 'Maintenance Alerts'}
                    </span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400">
                      {maintenanceAlerts.length}
                    </Badge>
                  </div>
                  {maintenanceAlerts.map((car) => (
                    <div
                      key={`maint-${car.id}`}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 ${
                        car.maintenance_status === 'overdue'
                          ? 'bg-red-50 dark:bg-red-950/30 border-l-2 border-l-red-500'
                          : 'bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-l-blue-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Wrench className={`h-4 w-4 ${
                            car.maintenance_status === 'overdue' ? 'text-red-500' : 'text-blue-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium dark:text-gray-100">
                            {car.brand} {car.model} - {car.plate_number}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {car.maintenance_status === 'overdue' ? (
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                {isArabic
                                  ? `⚠️ متأخر بـ ${Math.abs(car.remaining_days)} يوم`
                                  : `⚠️ Overdue by ${Math.abs(car.remaining_days)} day(s)`}
                              </span>
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400">
                                {isArabic
                                  ? `🔔 متبقي ${car.remaining_days} يوم`
                                  : `🔔 ${car.remaining_days} day(s) remaining`}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {isArabic ? 'تاريخ الصيانة القادمة:' : 'Next maintenance:'} {new Date(car.next_maintenance_date).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}
                            {car.maintenance_type && <>{' | '}{isArabic ? 'النوع:' : 'Type:'} {car.maintenance_type}</>}
                            {car.garage_name && <>{' | '}{isArabic ? 'الورشة:' : 'Garage:'} {car.garage_name}</>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Insurance Expiry Alerts */}
              {insuranceAlerts.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 bg-purple-50 dark:bg-purple-950/30 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                      {isArabic ? 'تنبيهات انتهاء التأمين' : 'Insurance Expiry Alerts'}
                    </span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-purple-300 text-purple-600 dark:border-purple-600 dark:text-purple-400">
                      {insuranceAlerts.length}
                    </Badge>
                  </div>
                  {insuranceAlerts.map((car) => (
                    <div
                      key={`ins-${car.id}`}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 ${
                        car.insurance_status === 'overdue'
                          ? 'bg-red-50 dark:bg-red-950/30 border-l-2 border-l-red-500'
                          : 'bg-purple-50/50 dark:bg-purple-950/20 border-l-2 border-l-purple-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Shield className={`h-4 w-4 ${
                            car.insurance_status === 'overdue' ? 'text-red-500' : 'text-purple-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium dark:text-gray-100">
                            {car.brand} {car.model} - {car.plate_number}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {car.insurance_status === 'overdue' ? (
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                {isArabic
                                  ? `⚠️ منتهي منذ ${Math.abs(car.remaining_days)} يوم`
                                  : `⚠️ Expired ${Math.abs(car.remaining_days)} day(s) ago`}
                              </span>
                            ) : (
                              <span className="text-purple-600 dark:text-purple-400">
                                {isArabic
                                  ? `🔔 متبقي ${car.remaining_days} يوم`
                                  : `🔔 ${car.remaining_days} day(s) remaining`}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {isArabic ? 'تاريخ انتهاء التأمين:' : 'Insurance expires:'} {new Date(car.insurance_end).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}
                            {car.insurance_company && (
                              <>{' | '}{isArabic ? 'الشركة:' : 'Company:'} {car.insurance_company}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Registration Expiry Alerts */}
              {registrationAlerts.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 bg-green-50 dark:bg-green-950/30 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                      {isArabic ? 'تنبيهات انتهاء الترخيص' : 'Registration Expiry Alerts'}
                    </span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-green-300 text-green-600 dark:border-green-600 dark:text-green-400">
                      {registrationAlerts.length}
                    </Badge>
                  </div>
                  {registrationAlerts.map((car) => (
                    <div
                      key={`reg-${car.id}`}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 ${
                        car.registration_status === 'overdue'
                          ? 'bg-red-50 dark:bg-red-950/30 border-l-2 border-l-red-500'
                          : 'bg-green-50/50 dark:bg-green-950/20 border-l-2 border-l-green-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <FileText className={`h-4 w-4 ${
                            car.registration_status === 'overdue' ? 'text-red-500' : 'text-green-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium dark:text-gray-100">
                            {car.brand} {car.model} - {car.plate_number}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {car.registration_status === 'overdue' ? (
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                {isArabic
                                  ? `⚠️ منتهي منذ ${Math.abs(car.remaining_days)} يوم`
                                  : `⚠️ Expired ${Math.abs(car.remaining_days)} day(s) ago`}
                              </span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400">
                                {isArabic
                                  ? `🔔 متبقي ${car.remaining_days} يوم`
                                  : `🔔 ${car.remaining_days} day(s) remaining`}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {isArabic ? 'تاريخ انتهاء الترخيص:' : 'Registration expires:'} {new Date(car.registration_end).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}
                            {car.registration_number && (
                              <>{' | '}{isArabic ? 'رقم الترخيص:' : 'Reg #:'} {car.registration_number}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Regular Notifications */}
              {notifications.length === 0 && oilAlerts.length === 0 && maintenanceAlerts.length === 0 && insuranceAlerts.length === 0 && registrationAlerts.length === 0 ? (
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