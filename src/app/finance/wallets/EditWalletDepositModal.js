"use client";

import { useState, useEffect } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { updateWalletDeposit, getWalletDepositById } from "@/app/services/api/walletDeposits";
import { getAllBankAccounts } from "@/app/services/api/bankAccounts";
import { getPartyCases } from "@/app/services/api/parties";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X, Edit, FileText } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "react-toastify";

export function EditWalletDepositModal({ isOpen, onClose, onSuccess, depositId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({
    wallet_id: "",
    client_id: "",
    case_id: "",
    bank_account_id: "",
    amount: "",
    method: "cash",
    cheque_number: "",
    reference_no: "",
    note: ""
  });

  // Fetch deposit details
  const { data: depositData, isLoading: depositLoading } = useSWR(
    isOpen && depositId ? `/wallet-deposits/${depositId}` : null,
    () => getWalletDepositById(depositId)
  );

  // Fetch bank accounts
  const { data: bankAccountsData } = useSWR(
    isOpen ? '/bank-accounts' : null,
    getAllBankAccounts
  );

  // Fetch client cases
  const { data: clientCasesData, isLoading: casesLoading } = useSWR(
    isOpen && formData.client_id ? `/parties/${formData.client_id}/cases` : null,
    () => getPartyCases(formData.client_id)
  );

  // Load deposit data into form
  useEffect(() => {
    if (depositData?.data) {
      const deposit = depositData.data;
      setFormData({
        wallet_id: deposit.wallet_id || "",
        client_id: deposit.client_id || "",
        case_id: deposit.case_id?.toString() || "",
        bank_account_id: deposit.bank_account_id?.toString() || "",
        amount: deposit.amount || "",
        method: deposit.method || "cash",
        cheque_number: deposit.cheque_number || "",
        reference_no: deposit.reference_no || "",
        note: deposit.note || ""
      });

      // Set selected case if exists
      if (deposit.case_id) {
        setSelectedCase({
          id: deposit.case_id,
          case_number: deposit.case_number,
          file_number: deposit.file_number,
          topic: deposit.case_topic,
          fees: deposit.case_fees
        });
      }
    }
  }, [depositData]);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If case is selected, update selected case details
    if (field === 'case_id' && value) {
      const caseData = clientCasesData?.data?.find(c => c.id === parseInt(value));
      setSelectedCase(caseData || null);
    } else if (field === 'case_id' && !value) {
      setSelectedCase(null);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        toast.error(t('walletDeposits.validAmountRequired'));
        return;
      }

      if (!formData.case_id) {
        toast.error(t('walletDeposits.caseRequired'));
        return;
      }

      if (formData.method === 'cheque' && !formData.cheque_number) {
        toast.error(t('walletDeposits.chequeNumberRequired'));
        return;
      }

      if (!formData.bank_account_id) {
        toast.error(t('walletDeposits.bankAccountRequired'));
        return;
      }

      const depositData = {
        case_id: formData.case_id || null,
        bank_account_id: formData.bank_account_id || null,
        amount: formData.amount,
        method: formData.method,
        cheque_number: formData.cheque_number || null,
        reference_no: formData.reference_no || null,
        note: formData.note || null
      };

      const response = await updateWalletDeposit(depositId, depositData);
      
      if (response.success) {
        toast.success(t('walletDeposits.depositUpdatedSuccessfully'));
        
        // Mutate SWR cache to refresh data
        mutate('/wallets');
        mutate('/wallet-deposits');
        
        onClose();
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || t('walletDeposits.failedToUpdateDeposit'));
      }
    } catch (error) {
      console.error("Error updating wallet deposit:", error);
      toast.error(t('walletDeposits.errorUpdatingDeposit'));
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "cash", label: t('walletDeposits.cash') },
    { value: "bank_transfer", label: t('walletDeposits.bankTransfer') },
    { value: "card", label: t('walletDeposits.card') },
    { value: "cheque", label: t('walletDeposits.cheque') },
    { value: "other", label: t('walletDeposits.other') },
  ];

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">{t('walletDeposits.editDeposit')}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {depositLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2">{t('common.loading')}</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Case Selection */}
              <div className="space-y-2">
                <Label>{t('walletDeposits.selectCase')} *</Label>
                <Select 
                  dir={isRTL ? "rtl" : "ltr"}
                  value={formData.case_id} 
                  onValueChange={(value) => handleInputChange("case_id", value)}
                  disabled={loading || casesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('walletDeposits.selectCasePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {clientCasesData?.data?.map((caseItem) => (
                      <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                        {caseItem.case_number} - {caseItem.file_number} - {caseItem.topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Case Fees Display */}
              {selectedCase && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm text-blue-900">
                      {t('walletDeposits.caseFees')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">{t('walletDeposits.caseNumber')}:</span>
                      <span className="ml-2 font-medium">{selectedCase.case_number}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('walletDeposits.fileNumber')}:</span>
                      <span className="ml-2 font-medium">{selectedCase.file_number}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">{t('walletDeposits.totalFees')}:</span>
                      <span className="ml-2 font-bold text-lg text-blue-700">
                        {parseFloat(selectedCase.fees || 0).toLocaleString()} AED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label>{t('walletDeposits.amount')} *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t('walletDeposits.enterAmount')}
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label>{t('walletDeposits.paymentMethod')} *</Label>
                <Select 
                  dir={isRTL ? "rtl" : "ltr"}
                  value={formData.method} 
                  onValueChange={(value) => handleInputChange("method", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('walletDeposits.selectPaymentMethod')} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Account */}
              <div className="space-y-2">
                <Label>{t('walletDeposits.bankAccount')} *</Label>
                <Select 
                  dir={isRTL ? "rtl" : "ltr"}
                  value={formData.bank_account_id} 
                  onValueChange={(value) => handleInputChange("bank_account_id", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('walletDeposits.selectBankAccount')} />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccountsData?.data?.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.account_name} - {account.bank_name} ({account.account_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cheque Number */}
              {formData.method === 'cheque' && (
                <div className="space-y-2">
                  <Label>{t('walletDeposits.chequeNumber')} *</Label>
                  <Input
                    type="text"
                    placeholder={t('walletDeposits.enterChequeNumber')}
                    value={formData.cheque_number}
                    onChange={(e) => handleInputChange("cheque_number", e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              {/* Reference Number */}
              <div className="space-y-2">
                <Label>{t('walletDeposits.referenceNumber')}</Label>
                <Input
                  type="text"
                  placeholder={t('walletDeposits.enterReferenceNumber')}
                  value={formData.reference_no}
                  onChange={(e) => handleInputChange("reference_no", e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label>{t('walletDeposits.note')}</Label>
                <Textarea
                  placeholder={t('walletDeposits.enterNote')}
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </div>
          )}
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
            onClick={handleSave}
            disabled={loading || depositLoading}
          >
            {loading ? (
              <>
                <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('common.update')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
