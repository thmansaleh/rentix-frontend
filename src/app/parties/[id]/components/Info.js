'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import { getPartyById } from '@/app/services/api/parties'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslations } from '@/hooks/useTranslations'
import { User, Phone, Mail, MapPin, Calendar, FileText, Building, Globe, Crown, Edit } from 'lucide-react'
import EditPartyModal from '@/app/parties/EditPartyModal'
import { is } from 'date-fns/locale'

function Info({ partyId }) {
  const { t } = useTranslations()
  
  const { data, error, isLoading, mutate } = useSWR(
    partyId ? [`/parties/${partyId}`] : null,
    () => getPartyById(partyId),
    {
      revalidateOnFocus: false,
    }
  )

  const handlePartyUpdated = () => {
    // Refresh the party data after update
    mutate()
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

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium truncate">{value || '-'}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              {t('partyTabs.basicInfo') || 'المعلومات الأساسية'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <EditPartyModal partyId={partyId} onPartyUpdated={handlePartyUpdated}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  {t('common.edit') || 'تعديل'}
                </Button>
              </EditPartyModal>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {party.is_vip === 1 && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                VIP
              </Badge>
            )}
            {getPartyTypeBadge(party.party_type)}
            {getCategoryBadge(party.category)}
            <Badge className={party.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {party.status === 'active' ? (t('common.active') || 'نشط') : (t('common.inactive') || 'غير نشط')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-base font-semibold">{party.name || '-'}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <InfoItem 
              icon={Phone} 
              label={t('parties.phone') || 'الهاتف'} 
              value={party.phone} 
            />
            <InfoItem 
              icon={Mail} 
              label={t('parties.email') || 'البريد الإلكتروني'} 
              value={party.email} 
            />
            <InfoItem 
              icon={Globe} 
              label={t('parties.nationality') || 'الجنسية'} 
              value={party.nationality} 
            />
            <InfoItem 
              icon={FileText} 
              label={t('parties.eId') || 'رقم الهوية'} 
              value={party.e_id} 
            />
            <InfoItem 
              icon={FileText} 
              label={t('parties.passport') || 'رقم الجواز'} 
              value={party.passport} 
            />
            <InfoItem 
              icon={Building} 
              label={t('parties.branch') || 'الفرع'} 
              value={ party.branch_name_ar} 
            />
            <InfoItem 
              icon={User} 
              label={t('parties.username') || 'اسم المستخدم'} 
              value={party.username} 
            />
            <InfoItem 
              icon={FileText} 
              label={t('parties.password') || 'كلمة المرور'} 
              value={party.password} 
            />
            <InfoItem 
              icon={Building} 
              label={t('parties.consultationType') || 'نوع الاستشارة'} 
              value={party.consultation_type} 
            />
            <InfoItem 
              icon={FileText} 
              label={t('parties.source') || 'المصدر'} 
              value={party.source} 
            />
            <InfoItem 
              icon={MapPin} 
              label={t('parties.address') || 'العنوان'} 
              value={party.address} 
            />
            <InfoItem 
              icon={User} 
              label={t('common.createdBy') || 'أنشئ بواسطة'} 
              value={party.created_by_name} 
            />
            <InfoItem 
              icon={Calendar} 
              label={t('common.createdAt') || 'تاريخ الإنشاء'} 
              value={formatDate(party.created_at)} 
            />
            <InfoItem 
              icon={Calendar} 
              label={t('common.updatedAt') || 'تاريخ التحديث'} 
              value={formatDate(party.updated_at)} 
            />
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}

export default Info
