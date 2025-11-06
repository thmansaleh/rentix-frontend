"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { deleteDeposit } from "@/app/services/api/clientsDeposits";
import { CustomModal } from "@/components/ui/custom-modal";

export default function DeleteDepositModal({ isOpen, onClose, deposit, onSuccess }) {
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);

    try {
      const response = await deleteDeposit(deposit.id);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || t("clientFinance.errorDeletingDeposit"));
      }
    } catch (err) {
      console.error("Error deleting deposit:", err);
      setError(t("clientFinance.errorDeletingDeposit"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("clientFinance.deleteDeposit")}
    >
      <div className="space-y-4">
        <p>{t("clientFinance.confirmDeleteDeposit")}</p>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("deleting") : t("delete")}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
