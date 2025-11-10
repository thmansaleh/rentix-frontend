"use client"

import React from 'react'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { CustomModal, CustomModalBody } from "@/components/ui/custom-modal"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, FileText, Users, Monitor, Link } from 'lucide-react'
import meetingsApi from '../services/api/meetings'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

const ViewMeetingDialog = ({ 
  isOpen, 
  onClose, 
  meetingId 
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const { data: meetingData, isLoading } = useSWR(
    meetingId && isOpen ? `meeting-${meetingId}` : null,
    () => meetingsApi.getMeetingById(meetingId)
  )

  const meeting = meetingData?.data

  const formatDate = (date) => {
    if (!date) return '-'
    return format(new Date(date), 'dd MMMM yyyy', { 
      locale: isArabic ? ar : undefined 
    })
  }

  const formatTime = (time) => {
    if (!time) return '-'
    return time
  }

  const getMeetingTypeLabel = (type) => {
    if (type === "online") {
      return isArabic ? 'عبر الإنترنت' : 'Online';
    } else if (type === "onsite") {
      return isArabic ? 'في الموقع' : 'On-site';
    }
    return "-";
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      "scheduled": { color: "bg-blue-100 text-blue-800", label: isArabic ? 'مجدول' : 'Scheduled' },
      "completed": { color: "bg-green-100 text-green-800", label: isArabic ? 'مكتمل' : 'Completed' },
      "cancelled": { color: "bg-red-100 text-red-800", label: isArabic ? 'ملغي' : 'Cancelled' },
      "rescheduled": { color: "bg-yellow-100 text-yellow-800", label: isArabic ? 'معاد جدولته' : 'Rescheduled' },
      "no_show": { color: "bg-gray-100 text-gray-800", label: isArabic ? 'لم يحضر' : 'No Show' }
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  }

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isArabic ? 'تفاصيل الاجتماع' : 'Meeting Details'}
      size="lg"
    >
      <CustomModalBody>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : meeting ? (
          <div dir={isArabic ? 'rtl' : 'ltr'} className="space-y-6">
            {/* Client Info */}
            <div>
              <h2 className="text-2xl font-bold">{meeting.client_name || (isArabic ? 'عميل' : 'Client')}</h2>
              {meeting.client_phone && (
                <p className="text-muted-foreground">{meeting.client_phone}</p>
              )}
            </div>

            <Separator />

            {/* Date, Time, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isArabic ? 'التاريخ' : 'Date'}
                  </p>
                  <p className="text-base">{formatDate(meeting.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isArabic ? 'الوقت' : 'Time'}
                  </p>
                  <p className="text-base">
                    {meeting.start_time && meeting.end_time
                      ? `${formatTime(meeting.start_time)} - ${formatTime(meeting.end_time)}`
                      : meeting.start_time || meeting.end_time || '-'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'الحالة' : 'Status'}
                  </p>
                  {getStatusBadge(meeting.meet_result)}
                </div>
              </div>
            </div>

            {/* Meeting Type and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meeting.meeting_type && (
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'نوع الاجتماع' : 'Meeting Type'}
                    </p>
                    <p className="text-base">{getMeetingTypeLabel(meeting.meeting_type)}</p>
                  </div>
                </div>
              )}

              {meeting.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'العنوان' : 'Address'}
                    </p>
                    <p className="text-base">{meeting.address}</p>
                  </div>
                </div>
              )}

              {meeting.link && meeting.meeting_type === "online" && (
                <div className="flex items-start gap-3">
                  <Link className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {isArabic ? 'رابط الاجتماع' : 'Meeting Link'}
                    </p>
                    <a 
                      href={meeting.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base text-blue-600 hover:text-blue-800 underline"
                    >
                      {meeting.link}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {meeting.note && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'الملاحظات' : 'Notes'}
                  </p>
                  <div 
                    className="text-base prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: meeting.note }}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Attendees */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  {isArabic ? 'الحضور' : 'Attendees'}
                </h3>
                <Badge variant="secondary">
                  {meeting.attendees?.length || 0}
                </Badge>
              </div>

              {meeting.attendees && meeting.attendees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {meeting.attendees.map((attendee) => (
                    <div
                      key={attendee.employee_id}
                      className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{attendee.employee_name}</p>
                        {(attendee.role_ar || attendee.role_en) && (
                          <p className="text-sm text-muted-foreground">
                            {isArabic ? attendee.role_ar : attendee.role_en}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  {isArabic ? 'لم يتم تحديد حضور' : 'No attendees selected'}
                </p>
              )}
            </div>

            {/* Created Info */}
            <Separator />
            <div className="text-xs text-muted-foreground">
              {isArabic ? 'تم الإنشاء في: ' : 'Created at: '}
              {meeting.created_at && formatDate(meeting.created_at)}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isArabic ? 'لم يتم العثور على الاجتماع' : 'Meeting not found'}
          </div>
        )}
      </CustomModalBody>
    </CustomModal>
  )
}

export default ViewMeetingDialog
