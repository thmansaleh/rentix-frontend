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
  request = null, // If provided, we're editing
  activeTab = 'leaves' // Current active tab to determine request type context
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
  
  // More flexible HR detection
  const isHR = employeeDepartment?.toLowerCase().includes('hr') || 
              employeeDepartment?.toLowerCase().includes('human') ||
              employeeDepartment?.includes('الموارد البشرية') ||
              employeeDepartment?.includes('موارد بشرية') ||
              employeeRole?.toLowerCase() === 'hr'
  

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: '',
    type: '',
    from_date: null,
    to_date: null,
    manager_approval: 'pending',
    hr_approval: 'pending'
  })

  // Fetch employees
  const { data: employeesData } = useSWR('employees-list', getEmployees)
  const employees = employeesData?.data || []

  // Request types from constants
  const allRequestTypes = getRequestTypes(isArabic)
  
  // Filter request types based on active tab
  const requestTypes = allRequestTypes.filter(type => 
    activeTab === 'leaves' ? type.isLeave === true : type.isLeave === false
  )

  // Check if selected type is a leave type (for form validation)
  const isLeaveType = allRequestTypes.find(rt => rt.value === formData.type)?.isLeave || false

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && request) {
      setFormData({
        employee_id: request.employee_id,
        type: request.type,
        from_date: request.from_date ? new Date(request.from_date) : null,
        to_date: request.to_date ? new Date(request.to_date) : null,
        manager_approval: request.manager_approval || 'pending',
        hr_approval: request.hr_approval || 'pending'
      })
    } else {
      setFormData({
        employee_id: '',
        type: '',
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
        from_date: null,
        to_date: null,
        manager_approval: 'pending',
        hr_approval: 'pending'
      })
    }
  }, [isOpen])

  // Get today's date for min date restriction
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // If changing from_date and to_date is before the new from_date, clear to_date
      if (field === 'from_date' && prev.to_date && value > prev.to_date) {
        newData.to_date = null
      }
      
      return newData
    })
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
        from_date: isLeaveType && formData.from_date ? format(formData.from_date, 'yyyy-MM-dd') : null,
        to_date: isLeaveType && formData.to_date ? format(formData.to_date, 'yyyy-MM-dd') : null
      }

      let response
      if (isEditMode) {
        // Update basic request data
        response = await updateEmployeeRequest(request.id, submitData)
        
        // Update manager approval ONLY if admin and it's a leave request (leaves tab)
        if (isAdmin && activeTab === 'leaves' && formData.manager_approval !== request.manager_approval) {
          await updateManagerApproval(request.id, formData.manager_approval)
        }
        
        // Update HR approval if status changed (for both tabs)
        if (formData.hr_approval !== request.hr_approval) {
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
                minDate={today}
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
                minDate={formData.from_date || today}
              />
            </div>
          )}

          {/* Manager Approval - ONLY for Admin/Manager in Edit Mode and ONLY for Leave Requests Tab */}
          {isEditMode && isAdmin && activeTab === 'leaves' && (
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

          {/* HR Approval - For HR Department in Edit Mode for ALL request types */}
          {isEditMode && (
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
