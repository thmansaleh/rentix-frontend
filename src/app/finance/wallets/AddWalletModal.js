"use client";

import { useState, useEffect, useCallback } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { createWallet, updateWallet } from "@/app/services/api/wallets";
import { getAllParties, searchParties } from "@/app/services/api/parties";
import {
  CustomModal,
  CustomModalBody,
  CustomModalFooter,
} from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { Loader2, Save, X, Wallet } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "react-toastify";

export function AddWalletModal({ isOpen, onClose, onSuccess, wallet = null, isEdit = false }) {
  const { t } = useTranslations();
  const { isRTL, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    client_id: "",
    currency: "AED",
    status: "active"
  });

  // Reset form when modal opens/closes or wallet changes
  useEffect(() => {
    if (isOpen) {
      if (isEdit && wallet) {
        setFormData({
          client_id: wallet.client_id || "",
          currency: wallet.currency || "AED",
          status: wallet.status || "active"
        });
        // Set initial search results with current client for edit mode
        if (wallet.client_name) {
          setSearchResults([{
            id: wallet.client_id,
            name: wallet.client_name,
            phone: wallet.client_phone || ''
          }]);
        }
      } else {
        setFormData({
          client_id: "",
          currency: "AED",
          status: "active"
        });
        setSearchResults([]);
      }
    }
  }, [isOpen, isEdit, wallet]);

  // Handle client search
  const handleClientSearch = useCallback(async (query) => {
    try {
      const response = await searchParties(query);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {

      setSearchResults([]);
    }
  }, []);

  // Format options for combobox
  const clientOptions = searchResults.map(client => ({
    value: client.id,
    label: `${client.name}${client.phone ? ` - ${client.phone}` : ''}`,
    phone: client.phone,
    name: client.name
  }));

  // Fetch clients/parties (for edit mode to show current client)
  const { data: partiesData } = useSWR(
    isOpen && isEdit && wallet ? `/parties/${wallet.client_id}` : null,
    () => getAllParties()
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      currency: "AED",
      status: "active"
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.client_id) {
        toast.error(t('wallets.selectClient'));
        return;
      }

      let response;
      if (isEdit && wallet) {
        response = await updateWallet(wallet.id, formData);
      } else {
        response = await createWallet(formData);
      }
      
      if (response.success) {
        toast.success(
          isEdit 
            ? t('wallets.walletUpdatedSuccessfully')
            : t('wallets.walletCreatedSuccessfully')
        );
        
        // Mutate SWR cache to refresh data
        mutate('/wallets');
        
        resetForm();
        onClose();
        
        if (onSuccess) {
          onSuccess({
            ...formData,
            id: response.insertId
          });
        }
      } else {
        toast.error(response.message || "Failed to create wallet");
      }
    } catch (error) {

      toast.error("An error occurred while creating the wallet");
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = [
    { value: "AED", label: "AED - UAE Dirham" },
    // { value: "USD", label: "USD - US Dollar" },
    // { value: "EUR", label: "EUR - Euro" },
    // { value: "SAR", label: "SAR - Saudi Riyal" },
  ];

  const statusOptions = [
    { value: "active", label: t('wallets.active') },
    { value: "suspended", label: t('wallets.suspended') },
    { value: "closed", label: t('wallets.closed') },
  ];

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? t('wallets.editWallet') : t('wallets.addNewWallet')}
      size="sm"
    >
      <CustomModalBody>
        <div className="text-sm text-muted-foreground mb-2">
          {isEdit ? t('wallets.pageDescription') : t('wallets.createFirstWallet')}
        </div>

        <div className="space-y-4">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label>{t('wallets.selectClient')} *</Label>
            <SearchableCombobox
              value={formData.client_id}
              onValueChange={(value) => handleInputChange("client_id", value)}
              onSearch={handleClientSearch}
              options={clientOptions}
              placeholder={t('wallets.searchClient')}
              searchPlaceholder={t('wallets.searchPlaceholder')}
              emptyMessage={t('wallets.noResults')}
              disabled={isEdit || loading}
            />
            {isEdit && (
              <p className="text-xs text-muted-foreground">
                {t('wallets.clientId')}: {wallet?.client_id}
              </p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>{t('wallets.currency')}</Label>
            <Select 
              dir={isRTL ? "rtl" : "ltr"}
              value={formData.currency} 
              onValueChange={(value) => handleInputChange("currency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('wallets.selectCurrency')} />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t('wallets.status')}</Label>
            <Select 
              dir={isRTL ? "rtl" : "ltr"}
              value={formData.status} 
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('wallets.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <CustomModalFooter className="flex justify-end space-x-2 space-x-reverse">
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
                {isEdit ? t('common.update') : t('common.save')}
              </>
            )}
          </Button>
        </CustomModalFooter>
      </CustomModalBody>
    </CustomModal>
  );
}