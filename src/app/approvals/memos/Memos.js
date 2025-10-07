'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Eye, FileText, CheckCircle } from 'lucide-react';
import useSWR from 'swr';
import { useActiveEmployeeMemos } from '@/hooks/useActiveEmployeeMemos';
import { updateEmployeeMemoStatus, getActiveMemos } from '@/app/services/api/memos';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'react-toastify';
import ApprovalModal from './ApprovalModal';
import EditMemoModal from '../../cases/[id]/edit/memos/EditMemoModal';
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

const Memos = () => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const router = useRouter();
  
  // Get employee role from Redux
  const employeeRole = useSelector((state) => state.auth.roleEn);
  console.log("Employee Role:", employeeRole);
  
  // Modal state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Conditionally fetch data based on role
  // If admin, fetch all active memos, otherwise fetch employee-specific memos
  const isAdmin = employeeRole?.toLowerCase() === 'admin';
  
  // Fetch all active memos for admin
  const { data: adminData, error: adminError, isLoading: adminLoading, mutate: adminMutate } = useSWR(
    isAdmin ? '/memos/active' : null,
    () => getActiveMemos(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  
  // Fetch active employee memos for non-admin users
  const { memos: employeeMemos, isLoading: employeeLoading, isError: employeeError, mutate: employeeMutate } = useActiveEmployeeMemos();
  
  // Use the appropriate data source based on role
  const rawMemos = isAdmin ? (adminData?.data || []) : employeeMemos;
  const isLoading = isAdmin ? adminLoading : employeeLoading;
  const isError = isAdmin ? adminError : employeeError;
  const mutate = isAdmin ? adminMutate : employeeMutate;

  // Filter memos based on role and status
  const filterMemosByRole = (memos, role) => {
    if (!role || !memos) return [];
    
    const normalizedRole = role.toLowerCase();
    
    return memos.filter((memo) => {
      // Legal Advisor: show memos where lawyer_status = "Rejected"
      if (normalizedRole === 'legal advisor') {
        return memo.lawyer_status === 'Rejected';
      }
      
      // Lawyer: show memos where admin_status = "Rejected"
      if (normalizedRole === 'lawyer') {
        return memo.admin_status === 'Rejected';
      }
      
      // Secretary: show memos where admin_status = "Approved"
      if (normalizedRole === 'secretary') {
        return memo.admin_status === 'Approved';
      }
      
      // Admin: show all memos (no filtering)
      if (normalizedRole === 'admin') {
        return memo.admin_status !== 'Approved';
      }
      
      // Default: don't show memo if role doesn't match
      return false;
    });
  };

  // Apply filtering
  const memos = filterMemosByRole(rawMemos, employeeRole);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US');
  };

 

  // Handle opening approval modal
  const handleOpenApprovalModal = (memo) => {
    setSelectedMemo(memo);
    setIsApprovalModalOpen(true);
  };

  // Handle closing approval modal
  const handleCloseApprovalModal = () => {
    setIsApprovalModalOpen(false);
    setSelectedMemo(null);
  };

  // Handle opening edit modal
  const handleOpenEditModal = (memo) => {
    setSelectedMemo(memo);
    setIsEditModalOpen(true);
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMemo(null);
  };

  // Handle memo updated
  const handleMemoUpdated = () => {
    // Refresh the memos list
    mutate();
  };

  // Handle approval confirmation
  const handleApprovalConfirm = async (isApproved) => {
    console.log(selectedMemo.id, employeeRole, isApproved);
    // return null
    if (!selectedMemo || !employeeRole) {
      toast.error(
        language === 'ar' 
          ? 'لم يتم العثور على معلومات الموظف' 
          : 'Employee information not found'
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateEmployeeMemoStatus(selectedMemo.id, employeeRole, isApproved);
      
      // Refresh the memos list
      await mutate();
      
      toast.success(
        language === 'ar' 
          ? 'تم تحديث حالة الموافقة بنجاح' 
          : 'Approval status updated successfully'
      );
      
      handleCloseApprovalModal();
    } catch (error) {
      console.error('Error updating approval:', error);
      toast.error(
        language === 'ar' 
          ? 'فشل في تحديث حالة الموافقة' 
          : 'Failed to update approval status'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    let color, text;
    
    switch (status) {
      case 'Submitted to Court':
        color = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        text = language === 'ar' ? 'مقدمة للمحكمة' : status;
        break;
      case 'Under Review':
        color = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        text = language === 'ar' ? 'قيد المراجعة' : status;
        break;
      case 'Approved':
        color = 'bg-green-100 text-green-800 hover:bg-green-100';
        text = language === 'ar' ? 'تمت الموافقة' : status;
        break;
      case 'Rejected':
        color = 'bg-red-100 text-red-800 hover:bg-red-100';
        text = language === 'ar' ? 'مرفوضة' : status;
        break;
      default:
        color = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        text = status;
    }
    
    return <Badge className={color}>{text}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'المذكرات التي قمت بانشائها او تحتاج موافقتك' : 'Memos Created by You or Requiring Your Approval'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">{t('common.loading') || (language === 'ar' ? 'جاري التحميل...' : 'Loading...')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'المذكرات التي قمت بانشائها او تحتاج موافقتك' : 'Memos Created by You or Requiring Your Approval'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">{t('common.errorLoading') || (language === 'ar' ? 'خطأ في تحميل البيانات' : 'Error loading data')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === 'ar' ? 'المذكرات التي قمت بانشائها او تحتاج موافقتك' : 'Memos Created by You or Requiring Your Approval'}
        </h1>
      </div>

      {/* Memos Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ar' ? 'المذكرات التي قمت بانشائها او تحتاج موافقتك' : 'Memos Created by You or Requiring Your Approval'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memos.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                {t('common.noData') || (language === 'ar' ? 'لا توجد بيانات' : 'No data available')}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? '#' : '#'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'العنوان' : 'Title'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'تاريخ التقديم' : 'Submission Date'}
                    </TableHead>
                    {/* <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </TableHead> */}
                
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'تم الإنشاء بواسطة' : 'Created By'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}
                    </TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memos.map((memo, index) => (
                    <TableRow key={memo.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {memo.title}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(memo.submission_date)}</TableCell>
                      {/* <TableCell>{getStatusBadge(memo.status)}</TableCell> */}
                      <TableCell>{memo.created_by_name || '-'}</TableCell>
                      <TableCell>{formatDate(memo.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(memo)}
                            title={language === 'ar' ? 'تعديل المذكرة' : 'Edit Memo'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenApprovalModal(memo)}
                            title={language === 'ar' ? 'تغيير الموافقة' : 'Change Approval'}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
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

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={handleCloseApprovalModal}
        onConfirm={handleApprovalConfirm}
        memoTitle={selectedMemo?.title || ''}
        isLoading={isSubmitting}
      />

      {/* Edit Memo Modal */}
      <EditMemoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        memoId={selectedMemo?.id}
        onSuccess={handleMemoUpdated}
        employeeRole={employeeRole}
      />
    </div>
  );
};

export default Memos;
