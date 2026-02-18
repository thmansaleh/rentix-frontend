"use client";

import { useState } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteCustomer } from "../services/api/customers";
import { toast } from "react-toastify";
import { useTranslations } from "@/hooks/useTranslations";

export function DeleteClientModal({ isOpen, onClose, onSuccess, customer }) {
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!customer) return;

    try {
      setIsDeleting(true);
      await deleteCustomer(customer.id);
      toast.success(t('clients.delete.success'));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error(error.response?.data?.message || t('clients.delete.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!customer) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('clients.delete.title')}
      size="md"
    >
      <CustomModalBody>
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('clients.delete.confirmTitle')}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('clients.delete.message')}{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {customer.full_name}
            </span>
            ?
          </p>
          
          <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 dark:text-red-400">
              <strong>{t('clients.delete.warning')}:</strong> {t('clients.delete.warningMessage')}
            </p>
          </div>

          <div className="text-left w-full space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">{t('clients.delete.willDelete')}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 ml-2">
              <li>{t('clients.delete.items.personalInfo')}</li>
              <li>{t('clients.delete.items.contactDetails')}</li>
              <li>{t('clients.delete.items.documents')}</li>
              <li>{t('clients.delete.items.files')}</li>
            </ul>
          </div>
        </div>
      </CustomModalBody>

      <CustomModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          {t('clients.delete.cancel')}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="min-w-[120px]"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('clients.delete.deleting')}
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('clients.delete.submit')}
            </>
          )}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
