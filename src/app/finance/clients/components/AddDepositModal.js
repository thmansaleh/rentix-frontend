"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/hooks/useTranslations";
import { createDeposit } from "@/app/services/api/clientsDeposits";
import { CustomModal } from "@/components/ui/custom-modal";

export default function AddDepositModal({ isOpen, onClose, clientId, clientName, onSuccess }) {
  const { t } = useTranslations();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError(t("clientFinance.amountRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createDeposit({
        party_id: clientId,
        amount: parseFloat(amount),
        description: description.trim() || null
      });

      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        setError(response.message || t("clientFinance.errorAddingDeposit"));
      }
    } catch (err) {
      console.error("Error creating deposit:", err);
      setError(t("clientFinance.errorAddingDeposit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("clientFinance.addDeposit")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("clientFinance.clientName")}</Label>
          <Input value={clientName} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">
            {t("clientFinance.amount")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("clientFinance.amount")}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("clientFinance.descriptionOptional")}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("clientFinance.description")}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
