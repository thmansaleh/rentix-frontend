"use client"

import React, { useState, useEffect } from 'react'
import { useLanguage } from "@/contexts/LanguageContext"
import { useTranslations } from "@/hooks/useTranslations"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Trash2,
  Mail,
  DollarSign
} from 'lucide-react'
import { toast } from 'react-toastify'
import { getPartiesForms, downloadPartiesForm, deletePartiesForm } from '@/app/services/api/partiesForms'
import AddFormModal from './AddFormModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function ClientFormsPage() {
  const { language } = useLanguage()
  const { t } = useTranslations()
  const isArabic = language === 'ar'

  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('welcome_message')

  // Fetch forms data
  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await getPartiesForms()
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
      await downloadPartiesForm(form.id)
      toast.success(t('clientForms.clickToDownload'))
    } catch (error) {
      console.error('Error downloading form:', error)
      toast.error(t('clientForms.errorDeleting'))
    }
  }

  // Handle delete click
  const handleDeleteClick = (form, e) => {
    e.stopPropagation()
    setFormToDelete(form)
    setDeleteDialogOpen(true)
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!formToDelete) return

    setIsDeleting(true)
    try {
      const response = await deletePartiesForm(formToDelete.id)
      
      if (response.success) {
        toast.success(t('clientForms.formDeleted'))
        setDeleteDialogOpen(false)
        setFormToDelete(null)
        // Refresh the forms list
        await fetchForms()
      } else {
        throw new Error(response.message || 'Failed to delete form')
      }
    } catch (error) {
      console.error('Error deleting form:', error)
      toast.error(t('clientForms.errorDeleting'))
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setFormToDelete(null)
  }

  // Filter forms by type
  const welcomeMessageForms = forms.filter(form => form.type === 'welcome_message')
  const priceQuoteForms = forms.filter(form => form.type === 'price_quote')

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(isArabic ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  // Render forms grid
  const renderFormsGrid = (formsList, icon, colorClass) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className={`${isArabic ? 'mr-3' : 'ml-3'}`}>{t('common.loading')}</span>
        </div>
      )
    }

    if (formsList.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {t('clientForms.noFormsFound')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isArabic ? 'لم يتم إضافة أي نماذج بعد' : 'No forms have been added yet'}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {formsList.map((form) => (
          <Card 
            key={form.id} 
            className={`hover:shadow-lg transition-shadow duration-200 relative ${colorClass}`}
          >
            {/* Delete Button - Top Right Corner */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-full z-10"
              onClick={(e) => handleDeleteClick(form, e)}
              title={t('clientForms.deleteForm')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <CardContent className="p-6 cursor-pointer" onClick={() => handleDownload(form)}>
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon */}
                <div className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50">
                  {icon}
                </div>
                
                {/* Title */}
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    {form.title}
                  </h3>
                  <p className="text-xs opacity-75 mb-2">
                    {t('clientForms.clickToDownload')}
                  </p>
                  <p className="text-xs opacity-60">
                    {formatDate(form.created_at)}
                  </p>
                  {form.created_by_name && (
                    <p className="text-xs opacity-60 mt-1">
                      {t('clientForms.createdBy')}: {form.created_by_name}
                    </p>
                  )}
                </div>
                
                {/* Download Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 text-current border-current/20"
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
        ))}
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
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('clientForms.title')}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('clientForms.browseAndDownload')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {forms.length} {isArabic ? 'نموذج' : 'forms'}
              </Badge>
              <AddFormModal onFormAdded={fetchForms} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Form Types */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir={isArabic ? 'rtl' : 'ltr'}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="welcome_message" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('navigation.welcomeMessages')}
                <Badge variant="secondary" className="ml-2">
                  {welcomeMessageForms.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="price_quote" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {t('navigation.priceQuotes')}
                <Badge variant="secondary" className="ml-2">
                  {priceQuoteForms.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="welcome_message">
              {renderFormsGrid(
                welcomeMessageForms, 
                <Mail className="w-6 h-6" />,
                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
              )}
            </TabsContent>

            <TabsContent value="price_quote">
              {renderFormsGrid(
                priceQuoteForms, 
                <DollarSign className="w-6 h-6" />,
                'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('clientForms.deleteForm')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic 
                ? `هل أنت متأكد من حذف نموذج "${formToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف الملف من التخزين السحابي.`
                : `Are you sure you want to delete "${formToDelete?.title}"? This action cannot be undone and will delete the file from cloud storage.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting 
                ? (isArabic ? 'جاري الحذف...' : 'Deleting...') 
                : (isArabic ? 'حذف' : 'Delete')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
