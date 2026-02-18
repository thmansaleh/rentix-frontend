"use client";

import { useState } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { deleteAccident } from "../services/api/accidents";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from 'date-fns';

export function DeleteAccidentModal({ isOpen, onClose, accident, onSuccess }) {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!accident) return;

    try {
      setIsDeleting(true);
      await deleteAccident(accident.id);
      toast.success(isRTL ? 'تم حذف الحادث بنجاح' : 'Accident deleted successfully');
      onSuccess();
    } catch (error) {
      console.error('Error deleting accident:', error);
      const errorMessage = error.response?.data?.message || error.message || 
        (isRTL ? 'فشل في حذف الحادث' : 'Failed to delete accident');
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    try {
      return format(new Date(datetime), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return datetime;
    }
  };

  return (
    <CustomModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>{isRTL ? 'حذف الحادث' : 'Delete Accident'}</span>
        </div>
      }
      size="md"
    >
      <CustomModalBody>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                {isRTL 
                  ? 'هل أنت متأكد من حذف هذا الحادث؟' 
                  : 'Are you sure you want to delete this accident?'}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {isRTL 
                  ? 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع البيانات والملفات المرتبطة بهذا الحادث.' 
                  : 'This action cannot be undone. All data and files associated with this accident will be deleted.'}
              </p>
            </div>
          </div>

          {accident && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">{isRTL ? 'التاريخ' : 'Date'}:</span>
                  <p className="font-medium">{formatDateTime(accident.accident_datetime)}</p>
                </div>
                <div>
                  <span className="text-gray-500">{isRTL ? 'السيارة' : 'Car'}:</span>
                  <p className="font-medium">{accident.car_plate_number || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">{isRTL ? 'العميل' : 'Customer'}:</span>
                  <p className="font-medium">{accident.customer_name || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">{isRTL ? 'رقم العقد' : 'Contract'}:</span>
                  <p className="font-medium">{accident.contract_number || '-'}</p>
                </div>
              </div>
              {accident.location && (
                <div className="pt-2 border-t">
                  <span className="text-gray-500 text-sm">{isRTL ? 'الموقع' : 'Location'}:</span>
                  <p className="font-medium text-sm">{accident.location}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CustomModalBody>

      <CustomModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          {isRTL ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isRTL ? 'جاري الحذف...' : 'Deleting...'}
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              {isRTL ? 'حذف' : 'Delete'}
            </>
          )}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
