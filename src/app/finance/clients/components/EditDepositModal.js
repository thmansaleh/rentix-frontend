"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/hooks/useTranslations";
import { updateDeposit } from "@/app/services/api/clientsDeposits";
import { CustomModal } from "@/components/ui/custom-modal";

export default function EditDepositModal({ isOpen, onClose, deposit, clientName, onSuccess }) {
  const { t } = useTranslations();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [checkNumber, setCheckNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [checkDate, setCheckDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (deposit) {
      setAmount(deposit.amount?.toString() || "");
      setDescription(deposit.description || "");
      setPaymentType(deposit.type || "cash");
      setCheckNumber(deposit.check_number || "");
      setBankName(deposit.bank_name || "");
      setCheckDate(deposit.check_date || "");
    }
  }, [deposit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError(t("clientFinance.amountRequired"));
      return;
    }

    // Validate check fields if payment type is check
    if (paymentType === "check") {
      if (!checkNumber.trim()) {
        setError(t("clientFinance.checkNumberRequired"));
        return;
      }
      if (!checkDate) {
        setError(t("clientFinance.checkDateRequired"));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const depositData = {
        amount: parseFloat(amount),
        description: description.trim() || null,
        type: paymentType
      };

      // Add check-related fields only if payment type is check
      if (paymentType === "check") {
        depositData.check_number = checkNumber.trim();
        depositData.bank_name = bankName.trim() || null;
        depositData.check_date = checkDate;
      } else {
        // Clear check fields if not check type
        depositData.check_number = null;
        depositData.bank_name = null;
        depositData.check_date = null;
      }

      const response = await updateDeposit(deposit.id, depositData);

      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        setError(response.message || t("clientFinance.errorEditingDeposit"));
      }
    } catch (err) {
      console.error("Error updating deposit:", err);
      setError(t("clientFinance.errorEditingDeposit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("clientFinance.editDeposit")}
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
          <Label htmlFor="paymentType">
            {t("clientFinance.paymentType")} <span className="text-red-500">*</span>
          </Label>
          <select
            id="paymentType"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="cash">{t("clientFinance.cash")}</option>
            <option value="card">{t("clientFinance.card")}</option>
            <option value="check">{t("clientFinance.check")}</option>
          </select>
        </div>

        {paymentType === "check" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="checkNumber">
                {t("clientFinance.checkNumber")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="checkNumber"
                type="text"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                placeholder={t("clientFinance.checkNumber")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">{t("clientFinance.bankName")}</Label>
              <Input
                id="bankName"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder={t("clientFinance.bankName")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkDate">
                {t("clientFinance.checkDate")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="checkDate"
                type="date"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}

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
