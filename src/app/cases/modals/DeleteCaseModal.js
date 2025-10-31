'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';
import { deleteCase } from '@/app/services/api/cases';
import { toast } from 'react-toastify';

/**
 * DeleteCaseModal Component
 * A reusable confirmation modal for deleting cases
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {object} caseData - The case object to delete (must have id, case_number, file_number)
 * @param {function} onSuccess - Callback called after successful deletion
 */
const DeleteCaseModal = ({ isOpen, onClose, caseData, onSuccess }) => {
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!caseData?.id) {
      toast.error(language === 'ar' ? 'معرف القضية مفقود' : 'Case ID is missing');
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await deleteCase(caseData.id);
      
      if (response.success !== false) {
        toast.success(
          language === 'ar' 
            ? 'تم حذف القضية بنجاح' 
            : 'Case deleted successfully'
        );
        
        onClose();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(
          response.message || 
          (language === 'ar' ? 'فشل حذف القضية' : 'Failed to delete case')
        );
      }
    } catch (error) {

      toast.error(
        error.response?.data?.message || 
        error.message || 
        (language === 'ar' ? 'حدث خطأ أثناء حذف القضية' : 'Error deleting case')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-100 bg-red-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-900">
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <p className="text-gray-700">
            {language === 'ar' 
              ? 'هل أنت متأكد من حذف هذه القضية؟ هذا الإجراء لا يمكن التراجع عنه.' 
              : 'Are you sure you want to delete this case? This action cannot be undone.'}
          </p>
          
          {caseData && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'رقم القضية:' : 'Case Number:'}
                </span>
                <span className="font-semibold text-gray-900">
                  {caseData.case_number}
                </span>
              </div>
              
              {caseData.file_number && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'رقم الملف:' : 'File Number:'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {caseData.file_number}
                  </span>
                </div>
              )}
              
              {caseData.topic && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'الموضوع:' : 'Topic:'}
                  </span>
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                    {caseData.topic}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-semibold mb-2">
              {language === 'ar' 
                ? '⚠️ تحذير: سيتم حذف جميع البيانات التالية:' 
                : '⚠️ Warning: The following data will be permanently deleted:'}
            </p>
            <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
              <li>{language === 'ar' ? 'جميع وثائق القضية' : 'All case documents'}</li>
              <li>{language === 'ar' ? 'وثائق الموظفين' : 'Employee documents'}</li>
              <li>{language === 'ar' ? 'وثائق المحكمة' : 'Court documents'}</li>
              <li>{language === 'ar' ? 'وثائق الأطراف' : 'Party documents'}</li>
              <li>{language === 'ar' ? 'الجلسات ووثائقها' : 'Sessions and their documents'}</li>
              <li>{language === 'ar' ? 'المهام ووثائقها' : 'Tasks and their documents'}</li>
              <li>{language === 'ar' ? 'المذكرات ووثائقها' : 'Memos and their documents'}</li>
              <li>{language === 'ar' ? 'العرائض ووثائقها' : 'Petitions and their documents'}</li>
              <li>{language === 'ar' ? 'التنفيذات ووثائقها' : 'Executions and their documents'}</li>
              <li>{language === 'ar' ? 'الأوامر القضائية ووثائقها' : 'Judicial orders and their documents'}</li>
            </ul>
            <p className="text-sm text-yellow-800 mt-3 font-semibold">
              {language === 'ar' 
                ? 'سيتم حذف جميع الملفات من التخزين السحابي ولا يمكن استرجاعها.' 
                : 'All files will be permanently deleted from cloud storage and cannot be recovered.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t bg-gray-50 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {language === 'ar' ? 'جاري الحذف...' : 'Deleting...'}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {language === 'ar' ? 'حذف القضية' : 'Delete Case'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCaseModal;
