"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, Eye, FileText } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from 'react-toastify'
import ExportButtons from '@/components/ui/export-buttons'
import AssetModal from './AssetModal'
import ViewAssetModal from './ViewAssetModal'
import { getAssets, getAssetById, deleteAsset } from '@/app/services/api/assets'

function AssetsPage() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [viewAsset, setViewAsset] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { data: assetsData, error, mutate, isLoading } = useSWR('assets', getAssets)
  const assets = assetsData?.data || []

  const assetsColumnConfig = {
    id: { ar: 'المعرف', en: 'ID', dataKey: 'id' },
    name: { ar: 'الاسم', en: 'Name', dataKey: 'name' },
    type: { ar: 'النوع', en: 'Type', dataKey: 'type' },
    issue_date: { ar: 'تاريخ الإصدار', en: 'Issue Date', dataKey: 'issue_date', type: 'date' },
    expiry_date: { ar: 'تاريخ الانتهاء', en: 'Expiry Date', dataKey: 'expiry_date', type: 'date' },
    note: { ar: 'الملاحظات', en: 'Notes', dataKey: 'note' },
    created_at: { ar: 'تاريخ الإنشاء', en: 'Created At', dataKey: 'created_at', type: 'date' }
  }

  const handleEditAsset = async (asset) => {
    try {
      const response = await getAssetById(asset.id)
      if (response.success) {
        setSelectedAsset(response.data)
        setIsEditModalOpen(true)
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch {
      toast.error(isArabic ? 'حدث خطأ أثناء جلب بيانات الأصل' : 'Error fetching asset details')
    }
  }

  const handleViewAsset = async (asset) => {
    try {
      const response = await getAssetById(asset.id)
      if (response.success) {
        setViewAsset(response.data)
        setIsViewModalOpen(true)
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch {
      toast.error(isArabic ? 'حدث خطأ أثناء جلب بيانات الأصل' : 'Error fetching asset details')
    }
  }

  const handleDeleteAsset = (assetId) => {
    setDeleteConfirm(assetId)
  }

  const confirmDeleteAsset = async () => {
    const assetId = deleteConfirm
    setDeleteConfirm(null)
    if (!assetId) return

    try {
      const response = await deleteAsset(assetId)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف الأصل بنجاح' : 'Asset deleted successfully')
        mutate()
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch {
      toast.error(isArabic ? 'حدث خطأ أثناء حذف الأصل' : 'Error deleting asset')
    }
  }

  const handleViewModalDocumentDeleted = () => {
    mutate()
    if (viewAsset) {
      getAssetById(viewAsset.id).then(response => {
        if (response.success) setViewAsset(response.data)
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data'}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isArabic ? 'الأصول' : 'Assets'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          {assets.length > 0 && (
            <ExportButtons
              data={assets}
              columnConfig={assetsColumnConfig}
              language={language}
              exportName="assets"
              sheetName={isArabic ? 'الأصول' : 'Assets'}
            />
          )}
          <Button className="ms-auto" onClick={() => { setSelectedAsset(null); setIsAddModalOpen(true) }}>
            <Plus className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {isArabic ? 'إضافة أصل' : 'Add Asset'}
          </Button>
        </div>

        {assets.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {isArabic ? 'لا توجد أصول' : 'No assets found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{isArabic ? 'الاسم' : 'Name'}</TableHead>
                  <TableHead>{isArabic ? 'النوع' : 'Type'}</TableHead>
                  <TableHead>{isArabic ? 'تاريخ الإصدار' : 'Issue Date'}</TableHead>
                  <TableHead>{isArabic ? 'تاريخ الانتهاء' : 'Expiry Date'}</TableHead>
                  <TableHead>{isArabic ? 'الملاحظات' : 'Notes'}</TableHead>
                  <TableHead>{isArabic ? 'المستندات' : 'Documents'}</TableHead>
                  <TableHead className="text-center">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset, index) => (
                  <TableRow key={asset.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{asset.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {asset.issue_date ? format(new Date(asset.issue_date), 'yyyy-MM-dd') : '-'}
                    </TableCell>
                    <TableCell>
                      {asset.expiry_date ? format(new Date(asset.expiry_date), 'yyyy-MM-dd') : '-'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm line-clamp-1">{asset.note || '-'}</span>
                    </TableCell>
                    <TableCell>
                      {asset.documents_count > 0 ? (
                        <div className="flex items-center gap-1 text-blue-600">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{asset.documents_count}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">{isArabic ? 'لا يوجد' : 'None'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewAsset(asset)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditAsset(asset)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAsset(asset.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AssetModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedAsset(null)
          }}
          onSuccess={() => mutate()}
          asset={selectedAsset}
        />

        <ViewAssetModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setViewAsset(null)
          }}
          asset={viewAsset}
          onDocumentDeleted={handleViewModalDocumentDeleted}
        />

        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{isArabic ? 'تأكيد حذف الأصل' : 'Confirm Asset Deletion'}</AlertDialogTitle>
              <AlertDialogDescription>
                {isArabic ? 'هل أنت متأكد من حذف هذا الأصل وجميع مستنداته؟' : 'Are you sure you want to delete this asset and all its documents?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{isArabic ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteAsset} className="bg-red-500 hover:bg-red-600">
                {isArabic ? 'حذف' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default AssetsPage
