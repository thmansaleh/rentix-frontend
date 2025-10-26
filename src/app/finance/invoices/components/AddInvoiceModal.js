"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomModal, CustomModalBody, CustomModalFooter } from "@/components/ui/custom-modal";
import { toast } from "react-toastify";
import { createInvoice } from "@/app/services/api/invoices";
import { getEmployees } from "@/app/services/api/employees";
import { getAllBankAccounts } from "@/app/services/api/bankAccounts";
import { getAllParties } from "@/app/services/api/parties";
import useSWR from "swr";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function AddInvoiceModal({ isOpen, onClose, onSuccess, defaultClientId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [formData, setFormData] = useState({
    invoice_number: "",
    client_id: "",
    referred_by_employee_id: "",
    bank_account_id: "",
    status: "draft",
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

  // Fetch clients (parties)
  const { data: clientsData } = useSWR(
    isOpen ? "/parties" : null,
    getAllParties
  );

  const clients = clientsData?.data || [];

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInvoiceDate(new Date());
      setFormData({
        invoice_number: "",
        client_id: "",
        referred_by_employee_id: "",
        bank_account_id: "",
        status: "draft",
      });
      setItems([{ description: "", amount: "" }]);
    } else if (defaultClientId) {
      // Set the default client when modal opens
      setFormData((prev) => ({ ...prev, client_id: defaultClientId.toString() }));
    }
  }, [isOpen, defaultClientId]);

  // Calculate total from items with VAT
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.amount) || 0);
  }, 0);
  
  const vatRate = 5.00; // 5% VAT
  const vatAmount = (subtotal * vatRate) / 100;
  const totalAmount = subtotal + vatAmount;

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

    if (totalAmount <= 0) {
      toast.error("المبلغ الإجمالي يجب أن يكون أكبر من صفر");
      return;
    }

    // Filter valid items
    const validItems = items.filter(item => item.description && item.amount);

    setIsSubmitting(true);
    try {
      const payload = {
        invoice_date: format(invoiceDate, "yyyy-MM-dd"),
        invoice_number: formData.invoice_number || undefined,
        amount: totalAmount.toFixed(2),
        client_id: formData.client_id || null,
        referred_by_employee_id: formData.referred_by_employee_id || null,
        bank_account_id: formData.bank_account_id,
        status: formData.status,
        items: validItems,
      };

      const response = await createInvoice(payload);

      if (response.success) {
        toast.success("تم إضافة الفاتورة بنجاح");
        onSuccess();
        onClose();
      } else {
        toast.error(response.error || "فشل في إضافة الفاتورة");
      }
    } catch (error) {

      toast.error(error.response?.data?.error || "فشل في إضافة الفاتورة");
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
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="إضافة فاتورة جديدة"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <CustomModalBody>
          <div className="space-y-6">
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

            {/* Invoice Number (Optional - auto-generated if empty) */}
            <div className="space-y-2">
              <Label htmlFor="invoice_number">رقم الفاتورة (اختياري - يُنشأ تلقائياً)</Label>
              <Input
                id="invoice_number"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleInputChange}
                placeholder="INV-2025-00001"
                disabled={isSubmitting}
              />
            </div>

            {/* Client Selection */}
            {!defaultClientId && (
              <div className="space-y-2">
                <Label htmlFor="client_id">العميل (اختياري)</Label>
                <Select
                  value={formData.client_id || undefined}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- اختر العميل --" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {defaultClientId && (
              <div className="space-y-2">
                <Label>العميل</Label>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {clients.find(c => c.id === defaultClientId)?.name || 'العميل الحالي'}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    تم تحديد العميل تلقائياً
                  </p>
                </div>
              </div>
            )}

            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="referred_by_employee_id">الموظف المحول (اختياري)</Label>
              <Select
                value={formData.referred_by_employee_id || undefined}
                onValueChange={(value) => setFormData(prev => ({ ...prev, referred_by_employee_id: value }))}
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
                      {account.bank_name} - {account.account_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">حالة الفاتورة *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="issued">صادرة</SelectItem>
                  <SelectItem value="paid">مدفوعة</SelectItem>
                  <SelectItem value="cancelled">ملغاة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>بنود الفاتورة *</Label>
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

            {/* Total Amount with VAT breakdown */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>المجموع الفرعي:</span>
                <span className="font-medium">
                  {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>ضريبة القيمة المضافة ({vatRate}%):</span>
                <span className="font-medium">
                  {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">الإجمالي:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CustomModalBody>

        <CustomModalFooter>
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
              "حفظ الفاتورة"
            )}
          </Button>
        </CustomModalFooter>
      </form>
    </CustomModal>
  );
}
