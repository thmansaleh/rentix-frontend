'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import useSWR from 'swr';
import { getEmployeeRequests, updateManagerApproval, updateHrApproval } from '@/app/services/api/employeeRequests';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function EmployeesRequests() {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  
  // Get employee role and department from Redux
  const employeeRole = useSelector((state) => state.auth.roleEn);
  const employeeDepartment = useSelector((state) => 
    language === 'ar' ? state.auth.departmentAr : state.auth.departmentEn
  );
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine if user is admin (role is admin)
  const isAdmin = employeeRole?.toLowerCase() === 'admin';
  
  // Fetch all employee requests
  const { data, error, isLoading, mutate } = useSWR(
    '/employee-requests',
    () => getEmployeeRequests(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  
  // Filter requests based on role
  const filterRequestsByRole = (requests) => {
    if (!requests) return [];
    
    if (isAdmin) {
      // Admin: show requests where manager_approval is not 'approved' or 'rejected'
      return requests.filter(req => req.manager_approval !== 'approved' && req.manager_approval !== 'rejected' );
    } else {
      // HR Department: show requests where hr_approval is pending
      const dept = language === 'ar' ? 'الموارد البشرية' : 'Human Resources';

    //   if (employeeDepartment === dept) {
    //     return requests
    //   }
           return requests

    }
  };

const requests = filterRequestsByRole(data?.data || []);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get manager approval status badge
  const getManagerStatusBadge = (approval) => {
    if (approval === 'approved') {
      return (
        <Badge className="bg-green-500">
          {language === 'ar' ? 'موافق' : 'Approved'}
        </Badge>
      );
    } else if (approval === 'rejected') {
      return (
        <Badge className="bg-red-500">
          {language === 'ar' ? 'مرفوض' : 'Rejected'}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-500">
          {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
        </Badge>
      );
    }
  };
  
  // Get HR approval status badge
  const getHRStatusBadge = (approval) => {
    if (approval === 'approved') {
      return (
        <Badge className="bg-green-500">
          {language === 'ar' ? 'موافق' : 'Approved'}
        </Badge>
      );
    } else if (approval === 'rejected') {
      return (
        <Badge className="bg-red-500">
          {language === 'ar' ? 'مرفوض' : 'Rejected'}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-500">
          {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
        </Badge>
      );
    }
  };
  
  // Handle edit click
  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setApprovalStatus('');
    setIsEditModalOpen(true);
  };
  
  // Handle approval update
  const handleApprovalUpdate = async () => {
    if (!selectedRequest || !approvalStatus) {
      toast.error(language === 'ar' ? 'الرجاء اختيار الحالة' : 'Please select a status');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use string values: 'approved' or 'rejected'
      const approvalValue = approvalStatus;
      
      if (isAdmin) {
        // Admin updates manager_approval
        await updateManagerApproval(selectedRequest.id, approvalValue);
        toast.success(language === 'ar' ? 'تم تحديث حالة الموافقة بنجاح' : 'Approval status updated successfully');
      } else {
        // HR updates hr_approval
        await updateHrApproval(selectedRequest.id, approvalValue);
        toast.success(language === 'ar' ? 'تم تحديث حالة الموافقة بنجاح' : 'Approval status updated successfully');
      }
      
      // Refresh data
      mutate();
      setIsEditModalOpen(false);
      setSelectedRequest(null);
      setApprovalStatus('');
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء تحديث الحالة' : 'Error updating status');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-center text-red-500">
            {language === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ar' ? 'طلبات الموظفين' : 'Employee Requests'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'ar' ? 'لا توجد طلبات' : 'No requests found'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'اسم الموظف' : 'Employee Name'}
                  </TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'نوع الطلب' : 'Request Type'}
                  </TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </TableHead>
                  {/* <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'من تاريخ' : 'From Date'}
                  </TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'إلى تاريخ' : 'To Date'}
                  </TableHead> */}
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'موافقة المدير' : 'Manager Approval'}
                  </TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'موافقة الموارد البشرية' : 'HR Approval'}
                  </TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.employee_name || '-'}</TableCell>
                    <TableCell>{request.type || '-'}</TableCell>
                    <TableCell>{formatDate(request.date)}</TableCell>
                    {/* <TableCell>{formatDate(request.from_date)}</TableCell>
                    <TableCell>{formatDate(request.to_date)}</TableCell> */}
                    <TableCell>{getManagerStatusBadge(request.manager_approval)}</TableCell>
                    <TableCell>{getHRStatusBadge(request.hr_approval)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(request)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Approval Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAdmin 
                ? (language === 'ar' ? 'موافقة المدير' : 'Manager Approval')
                : (language === 'ar' ? 'موافقة الموارد البشرية' : 'HR Approval')
              }
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'اختر حالة الموافقة للطلب'
                : 'Select approval status for the request'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الموظف:' : 'Employee:'} {selectedRequest.employee_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'النوع:' : 'Type:'} {selectedRequest.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'التاريخ:' : 'Date:'} {formatDate(selectedRequest.date)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <Select value={approvalStatus} onValueChange={setApprovalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر الحالة' : 'Select status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">
                      {language === 'ar' ? 'موافق' : 'Approved'}
                    </SelectItem>
                    <SelectItem value="rejected">
                      {language === 'ar' ? 'مرفوض' : 'Rejected'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedRequest(null);
                setApprovalStatus('');
              }}
              disabled={isSubmitting}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              onClick={handleApprovalUpdate}
              disabled={isSubmitting || !approvalStatus}
            >
              {isSubmitting 
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : (language === 'ar' ? 'حفظ' : 'Save')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeesRequests;