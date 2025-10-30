'use client';

import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { updateHrApproval } from '@/app/services/api/employeeRequests';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { formatDate, getStatusBadgeConfig } from './utils';
import ExportButtons from '@/components/ui/export-buttons';

function HRRequestsView({ requests, onUpdate }) {
  const { isRTL, language } = useLanguage();
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = getStatusBadgeConfig(status, language);
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
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
      await updateHrApproval(selectedRequest.id, approvalStatus);
      toast.success(language === 'ar' ? 'تم تحديث حالة الموافقة بنجاح' : 'Approval status updated successfully');
      
      // Refresh data
      if (onUpdate) onUpdate();
      
      setIsEditModalOpen(false);
      setSelectedRequest(null);
      setApprovalStatus('');
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ أثناء تحديث الحالة' : 'Error updating status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground py-8">
            {language === 'ar' ? 'لا توجد طلبات تحتاج للموافقة' : 'No requests pending approval'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Column configuration for export
  const exportColumnConfig = {
    employee_name: {
      en: 'Employee Name',
      ar: 'اسم الموظف',
      dataKey: 'employee_name'
    },
    type: {
      en: 'Request Type',
      ar: 'نوع الطلب',
      dataKey: 'type'
    },
    date: {
      en: 'Request Date',
      ar: 'التاريخ',
      dataKey: 'date',
      type: 'date'
    },
    from_date: {
      en: 'From Date',
      ar: 'من تاريخ',
      dataKey: 'from_date',
      type: 'date'
    },
    to_date: {
      en: 'To Date',
      ar: 'إلى تاريخ',
      dataKey: 'to_date',
      type: 'date'
    },
    manager_approval: {
      en: 'Manager Approval',
      ar: 'موافقة المدير',
      dataKey: 'manager_approval',
      formatter: (value, item, lang) => {
        if (value === 'approved') return lang === 'ar' ? 'موافق' : 'Approved';
        if (value === 'rejected') return lang === 'ar' ? 'مرفوض' : 'Rejected';
        if (value === 'pending') return lang === 'ar' ? 'قيد الانتظار' : 'Pending';
        return value || '-';
      }
    },
    hr_approval: {
      en: 'HR Approval',
      ar: 'موافقة الموارد البشرية',
      dataKey: 'hr_approval',
      formatter: (value, item, lang) => {
        if (value === 'approved') return lang === 'ar' ? 'موافق' : 'Approved';
        if (value === 'rejected') return lang === 'ar' ? 'مرفوض' : 'Rejected';
        if (value === 'pending') return lang === 'ar' ? 'قيد الانتظار' : 'Pending';
        return value || '-';
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>
                {language === 'ar' ? 'طلبات الموظفين - عرض الموارد البشرية' : 'Employee Requests - HR View'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'يمكنك الموافقة على الطلبات أو رفضها من جانب الموارد البشرية' 
                  : 'You can approve or reject requests from HR side'}
              </p>
            </div>
            <ExportButtons
              data={requests}
              columnConfig={exportColumnConfig}
              language={language}
              exportName={language === 'ar' ? 'طلبات_الموظفين_الموارد_البشرية' : 'employee_requests_hr'}
              sheetName={language === 'ar' ? 'الطلبات' : 'Requests'}
            />
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{formatDate(request.date, language)}</TableCell>
                  <TableCell>{getStatusBadge(request.manager_approval)}</TableCell>
                  <TableCell>{getStatusBadge(request.hr_approval)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(request)}
                      title={language === 'ar' ? 'تعديل موافقة الموارد البشرية' : 'Edit HR Approval'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit Approval Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'موافقة الموارد البشرية' : 'HR Approval'}
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
                  {language === 'ar' ? 'التاريخ:' : 'Date:'} {formatDate(selectedRequest.date, language)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'موافقة المدير:' : 'Manager Approval:'} {selectedRequest.manager_approval}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ar' ? 'حالة الموارد البشرية' : 'HR Status'}
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
                    <SelectItem value="pending">
                      {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
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

export default HRRequestsView;
