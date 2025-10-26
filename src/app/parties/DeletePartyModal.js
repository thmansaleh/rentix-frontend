"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { deleteParty } from "@/app/services/api/parties";
import { toast } from "react-toastify";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";

const DeletePartyModal = ({ partyId, partyName, onPartyDeleted, children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isRTL, language } = useLanguage();
  const { t } = useTranslations();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteParty(partyId);
      
      if (response.success) {
        toast.success(
          language === 'ar' 
            ? "تم حذف الطرف بنجاح" 
            : "Party deleted successfully"
        );
        setOpen(false);
        if (onPartyDeleted) {
          onPartyDeleted();
        }
      } else {
        toast.error(
          language === 'ar' 
            ? "حدث خطأ أثناء حذف الطرف" 
            : "Error deleting party"
        );
      }
    } catch (error) {

      toast.error(
        language === 'ar' 
          ? "حدث خطأ أثناء حذف الطرف" 
          : "Error deleting party"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className={cn(isRTL && "text-right")} dir={isRTL ? 'rtl' : 'ltr'}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
          </AlertDialogTitle>
          <AlertDialogDescription className={cn(isRTL && "text-right")}>
            {language === 'ar' 
              ? `هل أنت متأكد من حذف الطرف "${partyName || partyId}"؟ هذا الإجراء لا يمكن التراجع عنه.`
              : `Are you sure you want to delete party "${partyName || partyId}"? This action cannot be undone.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(isRTL && "flex-row-reverse")}>
          <AlertDialogCancel disabled={loading}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
                {language === 'ar' ? 'جاري الحذف...' : 'Deleting...'}
              </>
            ) : (
              language === 'ar' ? 'حذف' : 'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePartyModal;
