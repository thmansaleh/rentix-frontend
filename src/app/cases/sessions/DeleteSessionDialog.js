"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, CircleX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslations } from "@/hooks/useTranslations";

export default function DeleteSessionDialog({ 
  isOpen, 
  onClose, 
  session, 
  onConfirm,
  isDeleting = false 
}) {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const isRtl = language === "ar";

  const handleConfirm = () => {
    if (session) {
      onConfirm(session.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-xl font-semibold">
              {t('sessions.deleteSession')}
            </DialogTitle>
            <DialogDescription className="text-base">
              {t('sessions.confirmDeleteSession')}
            </DialogDescription>
          </div>
        </DialogHeader>

        {session && (
          <div className="py-4 border-t border-b bg-gray-50 rounded-md">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  {t('common.caseNumber')}:
                </span>
                <span className="font-semibold">{session.case_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  {t('sessions.topic')}:
                </span>
                <span className="font-semibold">{session.case_topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  {t('sessions.sessionDate')}:
                </span>
                <span className="font-semibold">
                  {new Date(session.session_date).toLocaleDateString(
                    isRtl ? "ar-AE" : "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex items-center mx-3 gap-2"
          >
            <CircleX className="w-4 h-4" />
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? t('sessions.deleting') : t('sessions.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}