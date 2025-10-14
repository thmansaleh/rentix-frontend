"use client"

import React, { useState, useEffect } from 'react'
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslations } from "@/hooks/useTranslations"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Car,
  Clock,
  CreditCard,
  User,
  AlertTriangle,
  Mail,
  CheckCircle,
  LogOut,
  DollarSign,
  Calendar,
  Heart,
  UserCheck,
  Plus
} from 'lucide-react'
import { toast } from 'react-toastify'
import { getForms, downloadForm } from '@/app/services/api/forms'

// Icon mapping for different form types
const getFormIcon = (documentFor) => {
  const iconMap = {
    'early leave': <Clock className="w-6 h-6" />,
    'car acknowledgement letter': <Car className="w-6 h-6" />,
    'annual leave encashment': <CreditCard className="w-6 h-6" />,
    'employee information': <User className="w-6 h-6" />,
    'emergency leave': <AlertTriangle className="w-6 h-6" />,
    'email acknowledgement': <Mail className="w-6 h-6" />,
    'acknowledgement letter': <CheckCircle className="w-6 h-6" />,
    'end of service acknowledgement': <LogOut className="w-6 h-6" />,
    'loan': <DollarSign className="w-6 h-6" />,
    'leave application': <Calendar className="w-6 h-6" />,
    'sickness self certificate': <Heart className="w-6 h-6" />,
    'short absent': <Clock className="w-6 h-6" />,
    'salary advance': <CreditCard className="w-6 h-6" />,
    'new starter': <UserCheck className="w-6 h-6" />
  }
  
  return iconMap[documentFor] || <FileText className="w-6 h-6" />
}

// Color mapping for different form types
const getFormColor = (documentFor) => {
  const colorMap = {
    'early leave': 'bg-orange-100 border-orange-200 text-orange-800',
    'car acknowledgement letter': 'bg-blue-100 border-blue-200 text-blue-800',
    'annual leave encashment': 'bg-green-100 border-green-200 text-green-800',
    'employee information': 'bg-purple-100 border-purple-200 text-purple-800',
    'emergency leave': 'bg-red-100 border-red-200 text-red-800',
    'email acknowledgement': 'bg-cyan-100 border-cyan-200 text-cyan-800',
    'acknowledgement letter': 'bg-teal-100 border-teal-200 text-teal-800',
    'end of service acknowledgement': 'bg-gray-100 border-gray-200 text-gray-800',
    'loan': 'bg-yellow-100 border-yellow-200 text-yellow-800',
    'leave application': 'bg-indigo-100 border-indigo-200 text-indigo-800',
    'sickness self certificate': 'bg-pink-100 border-pink-200 text-pink-800',
    'short absent': 'bg-orange-100 border-orange-200 text-orange-800',
    'salary advance': 'bg-emerald-100 border-emerald-200 text-emerald-800',
    'new starter': 'bg-violet-100 border-violet-200 text-violet-800'
  }
  
  return colorMap[documentFor] || 'bg-gray-100 border-gray-200 text-gray-800'
}

export default function FormsPage() {
  const { language } = useLanguage()
  const { t } = useTranslations()
  const isArabic = language === 'ar'

  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  // Fetch forms data
  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await getForms()
      if (response.success) {
        setForms(response.data)
      } else {
        toast.error(response.message || t('common.errorLoading'))
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
      toast.error(t('common.errorLoading'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  // Handle form download
  const handleDownload = async (form) => {
    try {
      await downloadForm(form.id)
      toast.success(isArabic ? 'تم تحميل النموذج بنجاح' : 'Form downloaded successfully')
    } catch (error) {
      console.error('Error downloading form:', error)
      toast.error(isArabic ? 'خطأ في تحميل النموذج' : 'Error downloading form')
    }
  }

  // Filter forms based on search and type
  const filteredForms = forms.filter(form => {
    const matchesSearch = !searchTerm || 
      form.document_for.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t(`forms.types.${form.document_for.replace(/ /g, '_')}`).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedType || form.document_for === selectedType
    
    return matchesSearch && matchesType
  })

  // Group forms by type for better organization
  const groupedForms = filteredForms.reduce((acc, form) => {
    if (!acc[form.document_for]) {
      acc[form.document_for] = []
    }
    acc[form.document_for].push(form)
    return acc
  }, {})

  // Get unique form types for filter
  const uniqueTypes = [...new Set(forms.map(form => form.document_for))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className={`${isArabic ? 'mr-3' : 'ml-3'}`}>{t('common.loading')}</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isArabic ? 'النماذج والوثائق' : 'Forms & Documents'}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {isArabic ? 'تصفح وتحميل النماذج المطلوبة للموارد البشرية' : 'Browse and download required HR forms'}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredForms.length} {isArabic ? 'نموذج' : 'forms'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
              <Input
                placeholder={isArabic ? 'البحث في النماذج...' : 'Search forms...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isArabic ? 'pr-10' : 'pl-10'}`}
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full ${isArabic ? 'pr-10' : 'pl-10'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">{isArabic ? 'جميع الأنواع' : 'All Types'}</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>
                    {t(`forms.types.${type.replace(/ /g, '_')}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <Card>
        <CardContent className="pt-6">
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isArabic ? 'لا توجد نماذج' : 'No forms found'}
              </h3>
              <p className="text-gray-600">
                {isArabic ? 'لم يتم العثور على نماذج تطابق البحث' : 'No forms match your search criteria'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(groupedForms).map(([documentFor, formsList]) => (
                formsList.map((form) => (
                  <Card 
                    key={form.id} 
                    className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer ${getFormColor(documentFor)}`}
                    onClick={() => handleDownload(form)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon */}
                        <div className="p-3 rounded-full bg-white/50">
                          {getFormIcon(documentFor)}
                        </div>
                        
                        {/* Title */}
                        <div>
                          <h3 className="font-semibold text-sm mb-1">
                            {t(`forms.types.${documentFor.replace(/ /g, '_')}`)}
                          </h3>
                          <p className="text-xs opacity-75">
                            {isArabic ? 'انقر للتحميل' : 'Click to download'}
                          </p>
                        </div>
                        
                        {/* Download Button */}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full bg-white/20 hover:bg-white/30 text-current border-current/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(form)
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {isArabic ? 'تحميل' : 'Download'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}