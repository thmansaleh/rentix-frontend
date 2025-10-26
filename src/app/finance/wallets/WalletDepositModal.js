"use client";

import { useState, useEffect, useCallback } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { createWalletDeposit } from "@/app/services/api/walletDeposits";
import { getAllBankAccounts } from "@/app/services/api/bankAccounts";
import { getPartyCases } from "@/app/services/api/parties";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Loader2, Save, DollarSign, FileText } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "react-toastify";

export function WalletDepositModal({ isOpen, onClose, onSuccess, walletId, clientId }) {
  const { t } = useTranslations();
  const { isRTL, language } = useLanguage();
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

  // Fetch bank accounts
  const { data: bankAccountsData } = useSWR(
    isOpen ? '/bank-accounts' : null,
    getAllBankAccounts
  );

  // Fetch client cases
  const { data: clientCasesData, isLoading: casesLoading } = useSWR(
    isOpen && clientId ? `/parties/${clientId}/cases` : null,
    () => getPartyCases(clientId)
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        wallet_id: walletId || "",
        client_id: clientId || "",
        case_id: "",
        bank_account_id: "",
        amount: "",
        method: "cash",
        cheque_number: "",
        reference_no: "",
        note: ""
      });
      setSelectedCase(null);
    }
  }, [isOpen, walletId, clientId]);

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

  const resetForm = () => {
    setFormData({
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
    setSelectedCase(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.wallet_id || !formData.client_id) {
        toast.error(t('walletDeposits.walletAndClientRequired'));
        return;
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        toast.error(t('walletDeposits.validAmountRequired'));
        return;
      }

      // Validate case is required
      if (!formData.case_id) {
        toast.error(t('walletDeposits.caseRequired'));
        return;
      }

      // Validate cheque number if method is cheque
      if (formData.method === 'cheque' && !formData.cheque_number) {
        toast.error(t('walletDeposits.chequeNumberRequired'));
        return;
      }

      // Validate bank account is required
      if (!formData.bank_account_id) {
        toast.error(t('walletDeposits.bankAccountRequired'));
        return;
      }

      const depositData = {
        ...formData,
        case_id: formData.case_id || null,
        bank_account_id: formData.bank_account_id || null,
        cheque_number: formData.cheque_number || null,
        reference_no: formData.reference_no || null,
        note: formData.note || null
      };

      const response = await createWalletDeposit(depositData);
      
      if (response.success) {
        toast.success(t('walletDeposits.depositCreatedSuccessfully'));
        
        // Mutate SWR cache to refresh data
        mutate('/wallets');
        mutate('/wallet-deposits');
        
        resetForm();
        onClose();
        
        if (onSuccess) {
          onSuccess({
            ...depositData,
            id: response.insertId
          });
        }
      } else {
        toast.error(response.message || t('walletDeposits.failedToCreateDeposit'));
      }
    } catch (error) {

      toast.error(t('walletDeposits.errorCreatingDeposit'));
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
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('walletDeposits.addDeposit')}
          </DialogTitle>
          <DialogDescription>
            {t('walletDeposits.addDepositDescription')}
          </DialogDescription>
        </DialogHeader>

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

          {/* Bank Account - always shown */}
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

          {/* Cheque Number - shown only for cheque */}
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

        <DialogFooter className="flex justify-end space-x-2 space-x-reverse">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('common.save')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
