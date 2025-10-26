"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import meetingsApi from "../../services/api/meetings";

export function DeleteMeetingModal({ isOpen, onClose, meetingId, meetingTitle, onSuccess }) {
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!meetingId) return;

    setIsDeleting(true);
    try {
      await meetingsApi.deleteMeeting(meetingId);
      onSuccess?.();
      onClose();
    } catch (error) {

      // You can add toast notification here if you have a toast system
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t("meetings.delete.title")}
          </DialogTitle>
          <DialogDescription>
            {t("meetings.delete.description")}
            {meetingTitle && (
              <div className="mt-2 font-medium text-foreground">
                {meetingTitle}
              </div>
            )}
            <div className="mt-2 text-red-600 font-medium">
              {t("meetings.delete.warning")}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            {t("meetings.delete.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("meetings.delete.deleting")}
              </>
            ) : (
              t("meetings.delete.confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}