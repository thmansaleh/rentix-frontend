"use client"

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { getSickLeaves, deleteSickLeave } from '@/app/services/api/sickLeaves'
import SickLeaveModal from './SickLeaveModal'

function SickLeave({ employeeId }) {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSickLeave, setSelectedSickLeave] = useState(null)

  // SWR fetcher function
  const fetcher = async (url) => {
    const response = await getSickLeaves(employeeId)
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
    }
  }

  // Use SWR for data fetching
  const { data: sickLeaves, error, isLoading } = useSWR(
    employeeId ? `/api/sick-leaves?employee_id=${employeeId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Show error toast if there's an error
  if (error) {
    toast.error(error.message || (isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading sick leaves'))
  }

  const handleAddSickLeave = () => {
    setSelectedSickLeave(null)
    setIsModalOpen(true)
  }

  const handleEditSickLeave = (sickLeave) => {
    setSelectedSickLeave(sickLeave)
    setIsModalOpen(true)
  }

  const handleDeleteSickLeave = async (id) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذه الإجازة المرضية؟' : 'Are you sure you want to delete this sick leave?')) {
      return
    }

    try {
      const response = await deleteSickLeave(id)
      if (response.success) {
        toast.success(isArabic ? 'تم حذف الإجازة المرضية بنجاح' : 'Sick leave deleted successfully')
        // Mutate the SWR cache to refetch data
        mutate(`/api/sick-leaves?employee_id=${employeeId}`)
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ أثناء حذف الإجازة المرضية' : 'Error deleting sick leave')
    }
  }

  const handleModalSuccess = () => {
    // Mutate the SWR cache to refetch data
    mutate(`/api/sick-leaves?employee_id=${employeeId}`)
  }

  const getLeaveTypeBadge = (leaveType) => {
    if (leaveType === 'paid') {
      return (
        <Badge variant="default" className="bg-green-500">
          {isArabic ? 'مدفوعة' : 'Paid'}
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary">
          {isArabic ? 'غير مدفوعة' : 'Unpaid'}
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isArabic ? 'الإجازات المرضية' : 'Sick Leaves'}</CardTitle>
              <CardDescription>
                {isArabic ? 'إدارة الإجازات المرضية للموظف' : 'Manage employee sick leaves'}
              </CardDescription>
            </div>
            <Button onClick={handleAddSickLeave}>
              <Plus className="h-4 w-4 mr-2" />
              {isArabic ? 'إضافة إجازة مرضية' : 'Add Sick Leave'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !sickLeaves || sickLeaves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {isArabic ? 'لا توجد إجازات مرضية' : 'No sick leaves found'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? 'تاريخ الطلب' : 'Request Date'}</TableHead>
                    <TableHead>{isArabic ? 'اسم الموظف' : 'Employee Name'}</TableHead>
                    <TableHead>{isArabic ? 'من تاريخ' : 'From Date'}</TableHead>
                    <TableHead>{isArabic ? 'إلى تاريخ' : 'To Date'}</TableHead>
                    <TableHead>{isArabic ? 'عدد الأيام' : 'Total Days'}</TableHead>
                    <TableHead>{isArabic ? 'المتبقي' : 'Remaining'}</TableHead>
                    <TableHead>{isArabic ? 'نوع الإجازة' : 'Leave Type'}</TableHead>
                    <TableHead>{isArabic ? 'تم الإنشاء بواسطة' : 'Created By'}</TableHead>
                    <TableHead className="text-right">{isArabic ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sickLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        {leave.date ? format(new Date(leave.date), 'yyyy-MM-dd') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {leave.employee_name || '-'}
                      </TableCell>
                      <TableCell>
                        {leave.from_date ? format(new Date(leave.from_date), 'yyyy-MM-dd') : '-'}
                      </TableCell>
                      <TableCell>
                        {leave.to_date ? format(new Date(leave.to_date), 'yyyy-MM-dd') : '-'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {leave.total_days}
                      </TableCell>
                      <TableCell className="text-blue-600">
                        {leave.remaining_days}
                      </TableCell>
                      <TableCell>
                        {getLeaveTypeBadge(leave.leave_type)}
                      </TableCell>
                      <TableCell>
                        {leave.created_by_name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSickLeave(leave)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSickLeave(leave.id)}
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

      {/* Sick Leave Modal */}
      <SickLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        employeeId={employeeId}
        sickLeave={selectedSickLeave}
      />
    </div>
  )
}

export default SickLeave