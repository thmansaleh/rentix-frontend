'use client'
import React from 'react'
import useSWR from 'swr'
import { getClientDealsByClientId, deleteClientDeal } from '@/app/services/api/clientsDeals'
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
import { Handshake, Trash2, Calendar, DollarSign, FileText } from 'lucide-react'
import { toast } from 'react-toastify'

function Deals({ partyId }) {
  const { t } = useTranslations()
  
  const { data, error, isLoading, mutate } = useSWR(
    partyId ? [`/clients-deals/client/${partyId}`] : null,
    () => getClientDealsByClientId(partyId),
    {
      revalidateOnFocus: false,
    }
  )

  const handleDelete = async (dealId) => {
    if (!confirm(t('common.confirmDelete') || 'هل أنت متأكد من حذف هذه الصفقة؟')) {
      return
    }

    try {
      await deleteClientDeal(dealId)
      toast.success(t('common.deleteSuccess') || 'تم الحذف بنجاح')
      mutate()
    } catch (error) {
      console.error('Error deleting deal:', error)
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

  const deals = data?.data || []

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { label: t('deals.active') || 'نشط', color: 'bg-green-100 text-green-800' },
      'pending': { label: t('deals.pending') || 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      'completed': { label: t('deals.completed') || 'مكتمل', color: 'bg-blue-100 text-blue-800' },
      'cancelled': { label: t('deals.cancelled') || 'ملغي', color: 'bg-red-100 text-red-800' },
    }
    const statusInfo = statusMap[status] || statusMap['pending']
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
  }

  const getTypeBadge = (type) => {
    const typeMap = {
      'consultation': { label: t('deals.consultation') || 'استشارة', color: 'bg-purple-100 text-purple-800' },
      'contract': { label: t('deals.contract') || 'عقد', color: 'bg-indigo-100 text-indigo-800' },
      'litigation': { label: t('deals.litigation') || 'ترافع', color: 'bg-cyan-100 text-cyan-800' },
      'retainer': { label: t('deals.retainer') || 'أتعاب محجوزة', color: 'bg-pink-100 text-pink-800' },
      'other': { label: t('deals.other') || 'أخرى', color: 'bg-gray-100 text-gray-800' },
    }
    const typeInfo = typeMap[type] || typeMap['other']
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="h-5 w-5" />
          {t('partyTabs.deals') || 'الصفقات'} ({deals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('deals.noDeals') || 'لا توجد صفقات'}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold">{t('deals.type') || 'النوع'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('deals.amount') || 'المبلغ'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('deals.status') || 'الحالة'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('deals.startDate') || 'تاريخ البداية'}</TableHead>
                  <TableHead className="text-right font-semibold">{t('deals.endDate') || 'تاريخ النهاية'}</TableHead>
                  <TableHead className="text-center font-semibold">{t('common.actions') || 'الإجراءات'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>{getTypeBadge(deal.type)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(deal.amount)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(deal.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(deal.start_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(deal.end_date)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(deal.id)}
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

export default Deals
