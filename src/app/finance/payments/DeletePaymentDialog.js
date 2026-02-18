"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "@/hooks/useTranslations";

export default function DeletePaymentDialog({
  open,
  onOpenChange,
  payment,
  onConfirm,
  language,
}) {
  const t = useTranslations("contracts.payments");

  const fmtAmt = (val) =>
    parseFloat(val || 0).toLocaleString(
      language === "ar" ? "ar-AE" : "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir={language === "ar" ? "rtl" : "ltr"}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deletePayment")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("confirmDelete")}{" "}
            <strong>{fmtAmt(payment?.amount)}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === "ar" ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {language === "ar" ? "حذف" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
