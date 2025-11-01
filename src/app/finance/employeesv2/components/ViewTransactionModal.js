'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getEmployeeCashTransactionById, updateEmployeeCashTransaction } from '@/app/services/api/employeeCashTransactions';
import { uploadFiles } from '../../../../../utils/fileUpload';
import api from '@/app/services/api/axiosInstance';

const ViewTransactionModal = ({ isOpen, onClose, transactionId, onDeleteAttachment }) => {
  const { isRTL } = useLanguage();
  const [deletingAttachment, setDeletingAttachment] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId || !isOpen) return;
      
      setLoading(true);
      try {
        const response = await getEmployeeCashTransactionById(transactionId);
        if (response.success) {
          setTransaction(response.data);
        } else {
          toast.error('حدث خطأ في تحميل بيانات العهدة');
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        toast.error('حدث خطأ في تحميل بيانات العهدة');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, isOpen]);

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ar-AE');
  };

  const extractKeyFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch (error) {
      return url;
    }
  };

  const handleDownload = async (url, name) => {
    try {
      // Extract the key from the URL
      const key = extractKeyFromUrl(url);
      
      // Get fresh presigned URL from backend
      const response = await api.post('/upload/presigned-url', { key });
      
      if (response.data.success && response.data.url) {
        // Use the fresh presigned URL
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('جاري تحميل الملف...');
      } else {
        throw new Error('Failed to get download URL');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('حدث خطأ في تحميل الملف');
    }
  };

  const handleDeleteAttachment = async (attachmentId, attachmentName) => {
    setDeletingAttachment(attachmentId);
    try {
      // Call the parent function to handle deletion
      await onDeleteAttachment(transactionId, attachmentId);
      toast.success('تم حذف المرفق بنجاح');
      // Refresh transaction data
      const response = await getEmployeeCashTransactionById(transactionId);
      if (response.success) {
        setTransaction(response.data);
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast.error('حدث خطأ في حذف المرفق');
    } finally {
      setDeletingAttachment(null);
    }
  };

  const handleAddFiles = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Upload files
      const uploadedResults = await uploadFiles(files, 'employee-cash-transactions');
      
      // Get current attachments
      const currentAttachments = attachments.map(att => ({
        attachment_url: att.attachment_url,
        attachment_name: att.attachment_name
      }));
      
      // Add new attachments
      const newAttachments = uploadedResults.map(file => ({
        attachment_url: file.document_url,
        attachment_name: file.document_name
      }));
      
      // Update transaction with all attachments
      const updatePayload = {
        employee_id: transaction.employee_id,
        amount: transaction.amount,
        type: 'credit',
        description: transaction.description,
        attachments: [...currentAttachments, ...newAttachments]
      };
      
      const response = await updateEmployeeCashTransaction(transactionId, updatePayload);
      
      if (response.success) {
        toast.success(`تم إضافة ${files.length} ملف بنجاح`);
        // Refresh transaction data
        const updatedTransaction = await getEmployeeCashTransactionById(transactionId);
        if (updatedTransaction.success) {
          setTransaction(updatedTransaction.data);
        }
      } else {
        toast.error('حدث خطأ في إضافة الملفات');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('حدث خطأ في إضافة الملفات');
    } finally {
      setUploading(false);
    }
  };

  // Parse attachments - only if transaction exists
  let attachments = [];
  if (transaction) {
    try {
      
      if (transaction.attachments !== null && transaction.attachments !== undefined) {
        if (typeof transaction.attachments === 'string') {
          // Try to parse JSON string
          try {
            const parsed = JSON.parse(transaction.attachments);
            attachments = Array.isArray(parsed) ? parsed.filter(att => att !== null) : [];
          } catch (parseError) {
            console.error('Failed to parse attachments JSON:', parseError);
            attachments = [];
          }
        } else if (Array.isArray(transaction.attachments)) {
          // Already an array - filter out null values
          attachments = transaction.attachments.filter(att => att !== null);
        } else if (typeof transaction.attachments === 'object') {
          // Single object, wrap in array
          attachments = [transaction.attachments];
        }
      }
      
      console.log('Final parsed attachments:', attachments);
      console.log('Attachments count:', attachments.length);
    } catch (e) {
      console.error('Error parsing attachments:', e);
      console.error('Transaction attachments value:', transaction.attachments);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            تفاصيل العهدة
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="mr-3">جاري التحميل...</span>
          </div>
        ) : transaction ? (
          <div className="space-y-4">
          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">اسم الموظف</Label>
              <p className="font-medium">{transaction.employee_name || '-'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">رقم الهاتف</Label>
              <p className="font-mono">{transaction.employee_phone || '-'}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <Label className="text-sm text-gray-500">المبلغ</Label>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-sm text-gray-500">الوصف</Label>
            <p className="text-gray-700 whitespace-pre-wrap">
              {transaction.description || 'لا يوجد وصف'}
            </p>
          </div>

          {/* Created By */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">أضيف بواسطة</Label>
              <p>{transaction.created_by_name || '-'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">تاريخ الإضافة</Label>
              <p className="text-sm">{formatDateTime(transaction.created_at)}</p>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                المرفقات ({attachments.length})
              </Label>
              
              {/* Add Files Button */}
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleAddFiles}
                  className="hidden"
                  id="add-files"
                  disabled={uploading}
                />
                <label htmlFor="add-files">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 ml-2" />
                      {uploading ? 'جاري الرفع...' : 'إضافة ملفات'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
            
            {attachments.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                لا توجد مرفقات
              </p>
            ) : (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attachment.attachment_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(attachment.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2 mr-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(attachment.attachment_url, attachment.attachment_name)}
                        className="hover:bg-blue-50"
                        title="تحميل"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-50"
                            disabled={deletingAttachment === attachment.id}
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد حذف المرفق</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف هذا المرفق؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAttachment(attachment.id, attachment.attachment_name)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            لا توجد بيانات
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewTransactionModal;
