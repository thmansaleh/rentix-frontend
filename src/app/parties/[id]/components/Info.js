'use client'
import React from 'react'
import useSWR from 'swr'
import { getPartyById } from '@/app/services/api/parties'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from '@/hooks/useTranslations'
import { User, Phone, Mail, MapPin, Calendar, FileText, Building, Globe } from 'lucide-react'

function Info({ partyId }) {
  const { t } = useTranslations()
  
  const { data, error, isLoading } = useSWR(
    partyId ? [`/parties/${partyId}`] : null,
    () => getPartyById(partyId),
    {
      revalidateOnFocus: false,
    }
  )

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

  const party = data

  if (!party) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">{t('common.noData') || 'لا توجد بيانات'}</p>
      </div>
    )
  }

  const getPartyTypeBadge = (type) => {
    const types = {
      'client': { label: t('parties.client') || 'موكل', color: 'bg-blue-100 text-blue-800' },
      'opponent': { label: t('parties.opponent') || 'خصم', color: 'bg-red-100 text-red-800' },
      'witness': { label: t('parties.witness') || 'شاهد', color: 'bg-yellow-100 text-yellow-800' },
      'other': { label: t('parties.other') || 'أخرى', color: 'bg-gray-100 text-gray-800' },
    }
    const typeInfo = types[type] || types['other']
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
  }

  const getCategoryBadge = (category) => {
    const categories = {
      'individual': { label: t('parties.individual') || 'فرد', color: 'bg-green-100 text-green-800' },
      'company': { label: t('parties.company') || 'شركة', color: 'bg-purple-100 text-purple-800' },
      'government': { label: t('parties.government') || 'جهة حكومية', color: 'bg-indigo-100 text-indigo-800' },
    }
    const categoryInfo = categories[category] || categories['individual']
    return <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('partyTabs.basicInfo') || 'المعلومات الأساسية'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('parties.partyName') || 'اسم الطرف'}
              </label>
              <p className="text-lg font-semibold">{party.name || '-'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('parties.partyType') || 'نوع الطرف'}
              </label>
              <div>{getPartyTypeBadge(party.party_type)}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('parties.category') || 'التصنيف'}
              </label>
              <div>{getCategoryBadge(party.category)}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('parties.status') || 'الحالة'}
              </label>
              <div>
                <Badge className={party.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {party.status === 'active' ? (t('common.active') || 'نشط') : (t('common.inactive') || 'غير نشط')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.phone') || 'الهاتف'}
                </label>
                <p className="font-medium">{party.phone || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.email') || 'البريد الإلكتروني'}
                </label>
                <p className="font-medium">{party.email || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.nationality') || 'الجنسية'}
                </label>
                <p className="font-medium">{party.nationality || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.eId') || 'رقم الهوية'}
                </label>
                <p className="font-medium">{party.e_id || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.passport') || 'رقم الجواز'}
                </label>
                <p className="font-medium">{party.passport || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.username') || 'اسم المستخدم'}
                </label>
                <p className="font-medium">{party.username || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.password') || 'كلمة المرور'}
                </label>
                <p className="font-medium">{party.password || '-'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('parties.consultationType') || 'نوع الاستشارة'}
              </label>
              <p className="font-medium">{party.consultation_type || '-'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('parties.source') || 'المصدر'}
              </label>
              <p className="font-medium">{party.source || '-'}</p>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="col-span-full">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('parties.address') || 'العنوان'}
                </label>
                <p className="font-medium">{party.address || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('common.createdBy') || 'أنشئ بواسطة'}
                </label>
                <p className="font-medium">{party.created_by_name || '-'}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('common.createdAt') || 'تاريخ الإنشاء'}
                </label>
                <p className="font-medium">{formatDate(party.created_at)}</p>
              </div>
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('common.updatedAt') || 'تاريخ التحديث'}
                </label>
                <p className="font-medium">{formatDate(party.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {party.documents && party.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('common.documents') || 'المستندات'} ({party.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {party.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.document_name || doc.file_name}</p>
                      {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                    </div>
                  </div>
                  {doc.document_url && (
                    <a href={doc.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {t('common.view') || 'عرض'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Info
