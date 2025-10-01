'use client';

import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useTranslations } from '../../../../../hooks/useTranslations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import { Button } from '../../../../../components/ui/button';

const DeleteCaseDegreeModal = ({ isOpen, onClose, degreeData, onConfirm, isLoading }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const isRTL = language === 'ar';

  const handleDelete = () => {
    onConfirm && onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {language === 'ar' 
              ? 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف درجة التقاضي نهائياً.'
              : 'This action cannot be undone. The case degree will be permanently deleted.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className={`py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="bg-muted p-4 rounded-lg border-l-4 border-destructive">
            <h4 className="font-medium mb-2">
              {language === 'ar' ? 'تفاصيل درجة التقاضي:' : 'Case Degree Details:'}
            </h4>
            {degreeData && (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">
                    {language === 'ar' ? 'رقم القضية:' : 'Case Number:'}
                  </span>{' '}
                  {degreeData.case_number}
                </p>
                <p>
                  <span className="font-medium">
                    {language === 'ar' ? 'الدرجة:' : 'Degree:'}
                  </span>{' '}
                  {language === 'ar' 
                    ? degreeData.degree === 'appeal' 
                      ? 'استئناف' 
                      : degreeData.degree === 'first_instance' 
                        ? 'ابتدائية' 
                        : degreeData.degree === 'cassation'
                          ? 'الطعن'
                          : degreeData.degree
                    : degreeData.degree
                  }
                </p>
                <p>
                  <span className="font-medium">
                    {language === 'ar' ? 'السنة:' : 'Year:'}
                  </span>{' '}
                  {degreeData.year}
                </p>
              </div>
            )}
          </div>
          
          <p className={`mt-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' 
              ? 'هل أنت متأكد من أنك تريد حذف درجة التقاضي هذه؟'
              : 'Are you sure you want to delete this case degree?'
            }
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className={`${isRTL ? 'ml-auto' : 'mr-auto'}`}
          >
            <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isLoading 
              ? (language === 'ar' ? 'جاري الحذف...' : 'Deleting...') 
              : (language === 'ar' ? 'حذف' : 'Delete')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCaseDegreeModal;