"use client"

import React from 'react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye, X, User, Calendar, DollarSign, Tag, FileText, Clock } from 'lucide-react'
import { getClientDealById } from '@/app/services/api/clientsDeals'

const ViewDealModal = ({ 
  isOpen, 
  onClose, 
  dealId 
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  // Fetch deal data
  const { data: dealData, error: dealError, isLoading: dealLoading } = useSWR(
    dealId && isOpen ? `deal-view-${dealId}` : null,
    () => getClientDealById(dealId),
    {
      revalidateOnFocus: false,
    }
  )

  const deal = dealData?.success ? dealData.data : null

  // Status options for display
  const getStatusDisplay = (status) => {
    const statusMap = {
      draft: { 
        variant: 'secondary', 
        text: isArabic ? 'مسودة' : 'Draft',
        color: 'bg-gray-100 text-gray-800'
      },
      completed: { 
        variant: 'default', 
        text: isArabic ? 'مكتمل' : 'Completed',
        color: 'bg-green-100 text-green-800'
      },
      active: { 
        variant: 'default', 
        text: isArabic ? 'نشط' : 'Active',
        color: 'bg-blue-100 text-blue-800'
      },
      pending: { 
        variant: 'secondary', 
        text: isArabic ? 'في الانتظار' : 'Pending',
        color: 'bg-yellow-100 text-yellow-800'
      },
      cancelled: { 
        variant: 'destructive', 
        text: isArabic ? 'ملغى' : 'Cancelled',
        color: 'bg-red-100 text-red-800'
      }
    }
    return statusMap[status] || { variant: 'secondary', text: status, color: 'bg-gray-100 text-gray-800' }
  }

  // Type display
  const getTypeDisplay = (type) => {
    const typeMap = {
      normal: isArabic ? 'عادية' : 'Normal',
      yearly: isArabic ? 'سنوية' : 'Yearly'
    }
    return typeMap[type] || type
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return format(date, 'dd MMMM yyyy', { 
      locale: isArabic ? ar : undefined 
    })
  }

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return format(date, 'dd MMMM yyyy - HH:mm', { 
      locale: isArabic ? ar : undefined 
    })
  }

  // Error state
  if (dealError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {isArabic ? 'خطأ' : 'Error'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {isArabic ? 'حدث خطأ أثناء تحميل بيانات الصفقة' : 'Error loading deal data'}
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {isArabic ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {isArabic ? 'عرض الصفقة' : 'View Deal'}
              {deal && <span className="text-muted-foreground">#{deal.id}</span>}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {dealLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {isArabic ? 'جاري تحميل البيانات...' : 'Loading data...'}
              </p>
            </div>
          </div>
        ) : deal ? (
          <div className="space-y-6 py-4">
            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge 
                variant={getStatusDisplay(deal.status).variant}
                className="text-sm px-4 py-2"
              >
                {getStatusDisplay(deal.status).text}
              </Badge>
            </div>

            {/* Main Information Cards */}
            <div className="grid gap-4">
              {/* Client Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {isArabic ? 'معلومات العميل' : 'Client Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isArabic ? 'اسم العميل:' : 'Client Name:'}
                    </span>
                    <span className="font-medium">
                      {deal.client_name || `Client ID: ${deal.client_id}` || '-'}
                    </span>
                  </div>
                  {deal.client_phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {isArabic ? 'رقم الهاتف:' : 'Phone Number:'}
                      </span>
                      <span className="font-medium">{deal.client_phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Deal Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {isArabic ? 'تفاصيل الصفقة' : 'Deal Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isArabic ? 'رقم الصفقة:' : 'Deal ID:'}
                    </span>
                    <span className="font-medium">#{deal.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {isArabic ? 'نوع الصفقة:' : 'Deal Type:'}
                    </span>
                    <span className="font-medium">{getTypeDisplay(deal.type)}</span>
                  </div>

                  {deal.amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {isArabic ? 'المبلغ:' : 'Amount:'}
                      </span>
                      <span className="font-medium text-lg">
                        {deal.amount} {deal.currency || 'AED'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Date Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {isArabic ? 'التواريخ' : 'Dates'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deal.start_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {isArabic ? 'تاريخ البداية:' : 'Start Date:'}
                      </span>
                      <span className="font-medium">{formatDate(deal.start_date)}</span>
                    </div>
                  )}
                  
                  {deal.end_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {isArabic ? 'تاريخ النهاية:' : 'End Date:'}
                      </span>
                      <span className="font-medium">{formatDate(deal.end_date)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {isArabic ? 'تاريخ الإنشاء:' : 'Created Date:'}
                    </span>
                    <span className="font-medium text-sm">
                      {formatDateTime(deal.created_at)}
                    </span>
                  </div>

                  {deal.updated_at && deal.updated_at !== deal.created_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {isArabic ? 'آخر تحديث:' : 'Last Updated:'}
                      </span>
                      <span className="font-medium text-sm">
                        {formatDateTime(deal.updated_at)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Information */}
              {(deal.created_by_name || deal.notes) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {isArabic ? 'معلومات إضافية' : 'Additional Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {deal.created_by_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {isArabic ? 'تم الإنشاء بواسطة:' : 'Created By:'}
                        </span>
                        <span className="font-medium">{deal.created_by_name}</span>
                      </div>
                    )}
                    
                    {deal.notes && (
                      <div>
                        <span className="text-muted-foreground block mb-2">
                          {isArabic ? 'ملاحظات:' : 'Notes:'}
                        </span>
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-sm">{deal.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isArabic ? 'لا توجد بيانات للعرض' : 'No data to display'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDealModal