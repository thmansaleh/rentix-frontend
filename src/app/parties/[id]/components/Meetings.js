'use client'
import React from 'react'
import useSWR from 'swr'
import meetingsApi from '@/app/services/api/meetings'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslations } from '@/hooks/useTranslations'
import { Calendar, Trash2, Clock, Users, FileText } from 'lucide-react'
import { toast } from 'react-toastify'

function Meetings({ partyId }) {
  const { t } = useTranslations()
  
  const { data, error, isLoading, mutate } = useSWR(
    partyId ? [`/meetings/party/${partyId}`] : null,
    () => meetingsApi.getMeetingsByPartyId(partyId),
    {
      revalidateOnFocus: false,
    }
  )

  const handleDelete = async (meetingId) => {
    if (!confirm(t('common.confirmDelete') || 'هل أنت متأكد من حذف هذا الاجتماع؟')) {
      return
    }

    try {
      await meetingsApi.deleteMeeting(meetingId)
      toast.success(t('common.deleteSuccess') || 'تم الحذف بنجاح')
      mutate()
    } catch (error) {
      console.error('Error deleting meeting:', error)
      toast.error(t('common.deleteError') || 'حدث خطأ في الحذف')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading') || 'جاري التحميل...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive">{t('common.error') || 'حدث خطأ في تحميل البيانات'}</p>
        </div>
      </div>
    )
  }

  const meetings = data?.data || []

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return '-'
    return timeString.substring(0, 5) // Extract HH:MM
  }

  const getResultBadge = (result) => {
    const resultMap = {
      'successful': { label: t('meetings.successful') || 'ناجح', color: 'bg-green-100 text-green-800' },
      'failed': { label: t('meetings.failed') || 'فاشل', color: 'bg-red-100 text-red-800' },
      'pending': { label: t('meetings.pending') || 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { label: t('meetings.cancelled') || 'ملغي', color: 'bg-gray-100 text-gray-800' },
    }
    const resultInfo = resultMap[result] || resultMap['pending']
    return <Badge className={resultInfo.color}>{resultInfo.label}</Badge>
  }

  const getTypeBadge = (type) => {
    const typeMap = {
      'consultation': { label: t('meetings.consultation') || 'استشارة', color: 'bg-purple-100 text-purple-800' },
      'negotiation': { label: t('meetings.negotiation') || 'تفاوض', color: 'bg-blue-100 text-blue-800' },
      'follow_up': { label: t('meetings.followUp') || 'متابعة', color: 'bg-cyan-100 text-cyan-800' },
      'initial': { label: t('meetings.initial') || 'أولي', color: 'bg-indigo-100 text-indigo-800' },
      'other': { label: t('meetings.other') || 'أخرى', color: 'bg-gray-100 text-gray-800' },
    }
    const typeInfo = typeMap[type] || typeMap['other']
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('partyTabs.meetings') || 'الاجتماعات'} ({meetings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('meetings.noMeetings') || 'لا توجد اجتماعات'}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold">{t('meetings.type') || 'النوع'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('meetings.date') || 'التاريخ'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('meetings.time') || 'الوقت'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('meetings.lawyer') || 'المحامي'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('meetings.result') || 'النتيجة'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('meetings.notes') || 'الملاحظات'}</TableHead>
                  <TableHead className="text-center font-semibold">{t('common.actions') || 'الإجراءات'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{getTypeBadge(meeting.meeting_type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(meeting.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                      </div>
                    </TableCell>
                    <TableCell>{meeting.lawyer_name || '-'}</TableCell>
                    <TableCell>{getResultBadge(meeting.meet_result)}</TableCell>
                    <TableCell className="max-w-xs truncate">{meeting.note || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(meeting.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Meetings
