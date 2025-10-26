"use client";

import { useState, useEffect } from "react";
import { mutate } from "swr";
import { deleteWalletDeposit } from "@/app/services/api/walletDeposits";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, X, AlertTriangle } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "react-toastify";

export function DeleteWalletDepositModal({ isOpen, onClose, onSuccess, deposit }) {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDelete = async () => {
    if (!deposit?.id) return;

    try {
      setLoading(true);
      
      const response = await deleteWalletDeposit(deposit.id);
      
      if (response.success) {
        toast.success(t('walletDeposits.depositDeletedSuccessfully'));
        
        // Mutate SWR cache to refresh data
        mutate('/wallets');
        mutate('/wallet-deposits');
        
        onClose();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || t('walletDeposits.failedToDeleteDeposit'));
      }
    } catch (error) {

      toast.error(t('walletDeposits.errorDeletingDeposit'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!isOpen || !deposit) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-600">{t('walletDeposits.deleteDeposit')}</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            {t('walletDeposits.confirmDeleteMessage')}
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('walletDeposits.depositId')}:</span>
              <span className="text-sm font-medium">#{deposit.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('walletDeposits.amount')}:</span>
              <span className="text-sm font-bold text-red-600">
                {parseFloat(deposit.amount || 0).toLocaleString()} AED
              </span>
            </div>
            {deposit.case_number && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('walletDeposits.caseNumber')}:</span>
                <span className="text-sm font-medium">{deposit.case_number}</span>
              </div>
            )}
            {deposit.file_number && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('walletDeposits.fileNumber')}:</span>
                <span className="text-sm font-medium">{deposit.file_number}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('walletDeposits.paymentMethod')}:</span>
              <span className="text-sm font-medium">{deposit.method}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>{t('common.warning')}:</strong> {t('walletDeposits.deleteWarning')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('common.deleting')}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.delete')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
