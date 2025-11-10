"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/useTranslations";
import { createEmployeeCashTransaction } from "@/app/services/api/employeeCashTransactions";
import { getEmployees } from "@/app/services/api/employees";
import { CustomModal } from "@/components/ui/custom-modal";

export default function AddExpenseModal({ isOpen, onClose, clientId, clientName, clientBalance, onSuccess }) {
  const { t } = useTranslations();
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const employeesResponse = await getEmployees();
        if (employeesResponse.success) {
          setEmployees(employeesResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!employeeId) {
      setError(t("employeeFinance.modal.employeeRequired"));
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError(t("clientFinance.amountRequired"));
      return;
    }

    const expenseAmount = parseFloat(amount);

    setIsSubmitting(true);
    try {
      const response = await createEmployeeCashTransaction({
        employee_id: parseInt(employeeId),
        client_id: clientId,
        amount: expenseAmount,
        type: "debit",
        description: description.trim() || null,
        attachments: []
      });

      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        // Show the specific error message from backend
        setError(response.message || t("clientFinance.errorAddingExpense"));
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      // Check if error response has a message
      const errorMessage = err.response?.data?.message || err.message || t("clientFinance.errorAddingExpense");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmployeeId("");
    setAmount("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("clientFinance.addExpense")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t("clientFinance.clientName")}</Label>
          <Input value={clientName} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employee">
            {t("clientFinance.employeeName")} <span className="text-red-500">*</span>
          </Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder={t("employeeFinance.modal.selectEmployee")} />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name} 
                  {/* ({t("clientFinance.balance")}: {employee.balance || 0}) */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label htmlFor="description">{t("clientFinance.description")}</Label>
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
