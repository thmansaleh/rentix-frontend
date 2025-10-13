"use client"

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { getDeductions, deleteDeduction } from '@/app/services/api/deductions'
import DeductionModal from './DeductionModal'

function Deductions({ employeeId }) {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDeduction, setSelectedDeduction] = useState(null)

  // SWR fetcher function
  const fetcher = async (url) => {
    const response = await getDeductions(employeeId)
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
    }
  }

  // Use SWR for data fetching
  const { data: deductions, error, isLoading } = useSWR(
    employeeId ? `/api/deductions?employee_id=${employeeId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Show error toast if there's an error
  if (error) {
    toast.error(error.message || (isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading deductions'))
  }

  const handleAddDeduction = () => {
    setSelectedDeduction(null)
    setIsModalOpen(true)
  }

  const handleEditDeduction = (deduction) => {
    setSelectedDeduction(deduction)
    setIsModalOpen(true)
  }

  const handleDeleteDeduction = async (id) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الخصم؟' : 'Are you sure you want to delete this deduction?')) {
      return
    }

    try {
      const response = await deleteDeduction(id)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف الخصم بنجاح' : 'Deduction deleted successfully')
        // Mutate the SWR cache to refetch data
        mutate(`/api/deductions?employee_id=${employeeId}`)
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error deleting deduction:', error)
      toast.error(isArabic ? 'حدث خطأ أثناء حذف الخصم' : 'Error deleting deduction')
    }
  }

  const handleModalSuccess = () => {
    // Mutate the SWR cache to refetch data
    mutate(`/api/deductions?employee_id=${employeeId}`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isArabic ? 'الخصومات' : 'Deductions'}</CardTitle>
              <CardDescription>
                {isArabic ? 'إدارة خصومات الموظف' : 'Manage employee deductions'}
              </CardDescription>
            </div>
            <Button onClick={handleAddDeduction}>
              <Plus className="h-4 w-4 mr-2" />
              {isArabic ? 'إضافة خصم' : 'Add Deduction'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !deductions || deductions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isArabic ? 'لا توجد خصومات' : 'No deductions found'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? 'التاريخ' : 'Date'}</TableHead>
                    <TableHead>{isArabic ? 'اسم الموظف' : 'Employee Name'}</TableHead>
                    <TableHead>{isArabic ? 'الراتب الإجمالي' : 'Total Salary'}</TableHead>
                    <TableHead>{isArabic ? 'المبلغ المخصوم' : 'Amount'}</TableHead>
                    <TableHead>{isArabic ? 'السبب' : 'Reason'}</TableHead>
                    <TableHead>{isArabic ? 'تم الإنشاء بواسطة' : 'Created By'}</TableHead>
                    <TableHead className="text-right">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deductions.map((deduction) => (
                    <TableRow key={deduction.id}>
                      <TableCell>
                        {deduction.date ? format(new Date(deduction.date), 'yyyy-MM-dd') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {deduction.employee_name || '-'}
                      </TableCell>
                      <TableCell>
                        {deduction.total_salary ? formatCurrency(deduction.total_salary) : '-'}
                      </TableCell>
                      <TableCell className="text-red-600 font-semibold">
                        {formatCurrency(deduction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={deduction.reason}>
                          {deduction.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        {deduction.created_by_name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDeduction(deduction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDeduction(deduction.id)}
                          >
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
        </CardContent>
      </Card>

      {/* Deduction Modal */}
      <DeductionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        employeeId={employeeId}
        deduction={selectedDeduction}
      />
    </div>
  )
}

export default Deductions
