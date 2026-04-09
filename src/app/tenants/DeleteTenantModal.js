"use client";

import { useState } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteTenant } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";

export function DeleteTenantModal({ isOpen, onClose, onSuccess, tenant }) {
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!tenant) return;
    setIsDeleting(true);
    try {
      await deleteTenant(tenant.id);
      toast.success(t("tenants.deleteSuccess"));
      onSuccess?.(tenant.id);
      onClose();
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast.error(error.response?.data?.message || t("tenants.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!tenant) return null;

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("tenants.deleteTenantTitle")} size="sm">
      <CustomModalBody>
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t("tenants.deleteConfirmTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("tenants.deleteConfirmMessage")}</p>
          </div>
          <div className="w-full p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("tenants.code")}</span>
              <span className="font-semibold font-mono">{tenant.code}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("tenants.companyName")}</span>
              <span>{tenant.company_name}</span>
            </div>
            {tenant.email && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t("tenants.email")}</span>
                <span>{tenant.email}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-red-500 font-medium">{t("tenants.deleteWarning")}</p>
        </div>
      </CustomModalBody>
      <CustomModalFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
          {t("tenants.cancel")}
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="min-w-[120px]">
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("tenants.deleting")}
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("tenants.delete")}
            </>
          )}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
