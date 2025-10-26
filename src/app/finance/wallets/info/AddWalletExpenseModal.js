"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { createWalletExpense } from "@/app/services/api/walletExpenses";
import { getEmployees } from "@/app/services/api/employees";
import { getPartyCases } from "@/app/services/api/parties";
import { getAllBankAccounts } from "@/app/services/api/bankAccounts";
import useSWR from "swr";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function AddWalletExpenseModal({ isOpen, onClose, onSuccess, walletId, clientId, walletInfo }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    case_id: "",
    employee_relat_id: "",
    bank_account_id: "",
  });
  const [items, setItems] = useState([{ description: "", amount: "" }]);

  // Fetch employees
  const { data: employeesData } = useSWR(
    isOpen ? "/employees" : null,
    getEmployees
  );

  // Fetch bank accounts
  const { data: bankAccountsData } = useSWR(
    isOpen ? "/bank-accounts" : null,
    getAllBankAccounts
  );

  // Fetch party cases
  const { data: casesData } = useSWR(
    isOpen && clientId ? `/parties/${clientId}/cases` : null,
    () => getPartyCases(clientId)
  );

  const clientCases = casesData?.data || [];

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInvoiceDate(null);
      setFormData({
        amount: "",
        case_id: "",
        employee_relat_id: "",
        bank_account_id: "",
      });
      setItems([{ description: "", amount: "" }]);
    }
  }, [isOpen]);

  // Calculate total from items
  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    setFormData((prev) => ({ ...prev, amount: total.toFixed(2) }));
  }, [items]);

  // Calculate VAT (5%) and total with VAT
  const subtotal = parseFloat(formData.amount || 0);
  const vatAmount = subtotal * 0.05;
  const totalWithVat = subtotal + vatAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!invoiceDate) {
      toast.error("الرجاء إدخال تاريخ الفاتورة");
      return;
    }

    if (items.length === 0 || items.every(item => !item.description || !item.amount)) {
      toast.error("الرجاء إضافة بند واحد على الأقل");
      return;
    }

    if (!formData.bank_account_id) {
      toast.error("الرجاء اختيار الحساب البنكي");
      return;
    }

    // Check if wallet has enough balance
    if (totalWithVat > parseFloat(walletInfo?.balance || 0)) {
      toast.error(`رصيد المحفظة غير كافٍ. الرصيد المتاح: ${parseFloat(walletInfo?.balance || 0).toLocaleString()} ${walletInfo?.currency || 'AED'}`);
      return;
    }

    // Filter valid items
    const validItems = items.filter(item => item.description && item.amount);

    setIsSubmitting(true);
    try {
      const payload = {
        wallet_id: walletId,
        client_id: clientId,
        amount: totalWithVat.toFixed(2),
        case_id: formData.case_id || null,
        invoice_date: format(invoiceDate, "yyyy-MM-dd"),
        employee_relat_id: formData.employee_relat_id || null,
        bank_account_id: formData.bank_account_id,
        items: validItems,
      };

      await createWalletExpense(payload);

      toast.success("تم إضافة المصروف بنجاح");

      onSuccess();
    } catch (error) {

      toast.error(error.response?.data?.message || "فشل في إضافة المصروف");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">إضافة مصروف جديد</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Wallet Balance Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">الرصيد المتاح في المحفظة:</span>
              <span className="text-lg font-bold text-blue-900">
                {parseFloat(walletInfo?.balance || 0).toLocaleString()} {walletInfo?.currency || 'AED'}
              </span>
            </div>
          </div>

          {/* Invoice Date */}
          <div className="space-y-2">
            <Label htmlFor="invoice_date">تاريخ الفاتورة *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !invoiceDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceDate ? format(invoiceDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={setInvoiceDate}
                  disabled={isSubmitting}
                  initialFocus
                  locale={ar}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Case Selection */}
          <div className="space-y-2">
            <Label htmlFor="case_id">القضية *</Label>
            <Select
              value={formData.case_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, case_id: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- اختر القضية --" />
              </SelectTrigger>
              <SelectContent>
                {clientCases.map((caseItem) => (
                  <SelectItem key={caseItem.id} value={caseItem.id.toString()}>
                    {caseItem.case_number} - {caseItem.file_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee_relat_id">الموظف المرتبط *</Label>
            <Select
              value={formData.employee_relat_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, employee_relat_id: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- اختر الموظف --" />
              </SelectTrigger>
              <SelectContent>
                {employeesData?.data?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bank Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank_account_id">الحساب البنكي *</Label>
            <Select
              value={formData.bank_account_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, bank_account_id: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- اختر الحساب البنكي --" />
              </SelectTrigger>
              <SelectContent>
                {bankAccountsData?.data?.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.bank_name} - {account.account_number} ({parseFloat(account.current_balance).toLocaleString()} AED)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expense Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>بنود المصروف *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة بند
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="وصف البند"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="المبلغ"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">المجموع الفرعي:</span>
              <span className="text-xl font-bold">
                {subtotal.toLocaleString()} AED
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">ضريبة القيمة المضافة (5%):</span>
              <span className="font-semibold text-gray-700">
                {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
              </span>
            </div>
            <div className="pt-3 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">الإجمالي شامل الضريبة:</span>
                <span className="text-2xl font-bold text-red-600">
                  {totalWithVat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ المصروف"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
