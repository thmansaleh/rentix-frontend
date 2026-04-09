"use client";

import { useState } from "react";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteCar } from "../services/api/cars";
import { useTranslations } from "@/hooks/useTranslations";

export function DeleteCarModal({ isOpen, onClose, onSuccess, car }) {
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!car) return;

    setIsDeleting(true);
    try {
      await deleteCar(car.id);
      toast.success(t('cars.messages.deleteSuccess'));
      onSuccess?.(car.id);
      onClose();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error(error.response?.data?.message || t('cars.messages.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (!car) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('cars.delete.title')}
      size="sm"
    >
      <CustomModalBody>
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t('cars.delete.confirmTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('cars.delete.confirmMessage')}
            </p>
          </div>

          <div className="w-full p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t('cars.delete.plateNumber')}</span>
              <span className="font-semibold">{car.plate_number}</span>
            </div>
            {car.brand && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t('cars.delete.brand')}</span>
                <span>{car.brand}</span>
              </div>
            )}
            {car.model && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t('cars.delete.model')}</span>
                <span>{car.model}</span>
              </div>
            )}
            {car.year && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">{t('cars.delete.year')}</span>
                <span>{car.year}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {t('cars.documents.allDocumentsDeleted')}
          </p>
        </div>
      </CustomModalBody>

      <CustomModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          {t('cars.buttons.cancel')}
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
              {t('cars.buttons.deleting')}
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('cars.buttons.delete')}
            </>
          )}
        </Button>
      </CustomModalFooter>
    </CustomModal>
  );
}
