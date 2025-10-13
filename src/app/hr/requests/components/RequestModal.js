"use client"

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import useSWR from 'swr'
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createEmployeeRequest, updateEmployeeRequest, updateManagerApproval, updateHrApproval } from '@/app/services/api/employeeRequests'
import { getEmployees } from '@/app/services/api/employees'
import { getRequestTypes } from '../constants/requestTypes'

const RequestModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  request = null // If provided, we're editing
}) => {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const isEditMode = !!request

  // Get user role from Redux
  const employeeRole = useSelector((state) => state.auth.roleEn)
  const employeeDepartment = useSelector((state) => 
    language === 'ar' ? state.auth.departmentAr : state.auth.departmentEn
  )

  // Check if user is admin/manager or HR
  const isAdmin = employeeRole?.toLowerCase() === 'admin' || employeeRole?.toLowerCase() === 'manager'
  const hrDept = language === 'ar' ? 'الموارد البشرية' : 'Human Resources'
  const isHR = employeeDepartment === hrDept

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: '',
    type: '',
    date: null,
    from_date: null,
    to_date: null,
    manager_approval: 'pending',
    hr_approval: 'pending'
  })

  // Fetch employees
  const { data: employeesData } = useSWR('employees-list', getEmployees)
  const employees = employeesData?.data || []

  // Request types from constants
  const requestTypes = getRequestTypes(isArabic)

  // Check if selected type is a leave type
  const isLeaveType = requestTypes.find(rt => rt.value === formData.type)?.isLeave || false

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && request) {
      setFormData({
        employee_id: request.employee_id,
        type: request.type,
        date: request.date ? new Date(request.date) : null,
        from_date: request.from_date ? new Date(request.from_date) : null,
        to_date: request.to_date ? new Date(request.to_date) : null,
        manager_approval: request.manager_approval || 'pending',
        hr_approval: request.hr_approval || 'pending'
      })
    } else {
      setFormData({
        employee_id: '',
        type: '',
        date: null,
        from_date: null,
        to_date: null,
        manager_approval: 'pending',
        hr_approval: 'pending'
      })
    }
  }, [request, isEditMode])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        employee_id: '',
        type: '',
        date: null,
        from_date: null,
        to_date: null,
        manager_approval: 'pending',
        hr_approval: 'pending'
      })
    }
  }, [isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.employee_id) {
      toast.error(isArabic ? 'يرجى اختيار الموظف' : 'Please select employee')
      return false
    }
    if (!formData.type) {
      toast.error(isArabic ? 'يرجى اختيار نوع الطلب' : 'Please select request type')
      return false
    }
    if (!formData.date) {
      toast.error(isArabic ? 'يرجى اختيار تاريخ الطلب' : 'Please select request date')
      return false
    }
    
    // Validate dates for leave requests
    if (isLeaveType) {
      if (!formData.from_date) {
        toast.error(isArabic ? 'يرجى اختيار تاريخ البداية' : 'Please select from date')
        return false
      }
      if (!formData.to_date) {
        toast.error(isArabic ? 'يرجى اختيار تاريخ النهاية' : 'Please select to date')
        return false
      }
      if (formData.from_date > formData.to_date) {
        toast.error(isArabic ? 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية' : 'From date must be before to date')
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const submitData = {
        employee_id: formData.employee_id,
        type: formData.type,
        date: format(formData.date, 'yyyy-MM-dd'),
        from_date: isLeaveType && formData.from_date ? format(formData.from_date, 'yyyy-MM-dd') : null,
        to_date: isLeaveType && formData.to_date ? format(formData.to_date, 'yyyy-MM-dd') : null
      }

      let response
      if (isEditMode) {
        // Update basic request data
        response = await updateEmployeeRequest(request.id, submitData)
        
        // Update manager approval if admin and status changed
        if (isAdmin && formData.manager_approval !== request.manager_approval) {
          await updateManagerApproval(request.id, formData.manager_approval)
        }
        
        // Update HR approval if HR and status changed
        if (isHR && formData.hr_approval !== request.hr_approval) {
          await updateHrApproval(request.id, formData.hr_approval)
        }
      } else {
        response = await createEmployeeRequest(submitData)
      }

      if (response.success) {
        toast.success(
          isArabic 
            ? (isEditMode ? 'تم تحديث الطلب بنجاح' : 'تم إضافة الطلب بنجاح')
            : (isEditMode ? 'Request updated successfully' : 'Request added successfully')
        )
        onSuccess?.()
        onClose()
      } else {
        toast.error(response.message || (isArabic ? 'حدث خطأ' : 'An error occurred'))
      }
    } catch (error) {
      console.error('Error saving request:', error)
      toast.error(
        error.response?.data?.message || 
        (isArabic ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving request')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isArabic 
              ? (isEditMode ? 'تعديل طلب' : 'إضافة طلب جديد')
              : (isEditMode ? 'Edit Request' : 'Add New Request')
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee_id">
              {isArabic ? 'الموظف' : 'Employee'} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.employee_id?.toString()} 
              onValueChange={(value) => handleInputChange('employee_id', parseInt(value))}
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'اختر الموظف' : 'Select employee'} />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Request Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              {isArabic ? 'نوع الطلب' : 'Request Type'} <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isArabic ? 'اختر نوع الطلب' : 'Select request type'} />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Request Date */}
          <div className="space-y-2">
            <Label htmlFor="date">
              {isArabic ? 'تاريخ الطلب' : 'Request Date'} <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={formData.date}
              onDateChange={(date) => handleInputChange('date', date)}
              placeholder={isArabic ? 'اختر تاريخ الطلب' : 'Select request date'}
            />
          </div>

          {/* From Date - Only for leave types */}
          {isLeaveType && (
            <div className="space-y-2">
              <Label htmlFor="from_date">
                {isArabic ? 'من تاريخ' : 'From Date'} <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                date={formData.from_date}
                onDateChange={(date) => handleInputChange('from_date', date)}
                placeholder={isArabic ? 'اختر تاريخ البداية' : 'Select from date'}
              />
            </div>
          )}

          {/* To Date - Only for leave types */}
          {isLeaveType && (
            <div className="space-y-2">
              <Label htmlFor="to_date">
                {isArabic ? 'إلى تاريخ' : 'To Date'} <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                date={formData.to_date}
                onDateChange={(date) => handleInputChange('to_date', date)}
                placeholder={isArabic ? 'اختر تاريخ النهاية' : 'Select to date'}
              />
            </div>
          )}

          {/* Manager Approval - Only for Admin/Manager in Edit Mode */}
          {isEditMode && isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="manager_approval">
                {isArabic ? 'موافقة المدير' : 'Manager Approval'}
              </Label>
              <Select 
                value={formData.manager_approval} 
                onValueChange={(value) => handleInputChange('manager_approval', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    {isArabic ? 'قيد الانتظار' : 'Pending'}
                  </SelectItem>
                  <SelectItem value="approved">
                    {isArabic ? 'موافق' : 'Approved'}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {isArabic ? 'مرفوض' : 'Rejected'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* HR Approval - Only for HR Department in Edit Mode */}
          {isEditMode && isHR && (
            <div className="space-y-2">
              <Label htmlFor="hr_approval">
                {isArabic ? 'موافقة الموارد البشرية' : 'HR Approval'}
              </Label>
              <Select 
                value={formData.hr_approval} 
                onValueChange={(value) => handleInputChange('hr_approval', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    {isArabic ? 'قيد الانتظار' : 'Pending'}
                  </SelectItem>
                  <SelectItem value="approved">
                    {isArabic ? 'موافق' : 'Approved'}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {isArabic ? 'مرفوض' : 'Rejected'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isArabic ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              isArabic ? 'حفظ' : 'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RequestModal
