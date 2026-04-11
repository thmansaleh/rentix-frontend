"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination } from "@/components/Pagination";
import {
  Banknote,
  Loader2,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  Check,
  Search,
  Printer,
} from "lucide-react";
import ViewPaymentModal from "./ViewPaymentModal";
import PaymentDialog from "./PaymentDialog";
import DeletePaymentDialog from "./DeletePaymentDialog";
import { printPaymentReceipt } from "./printPaymentReceipt";
import { getPayments } from "../../services/api/payments";
import useSWR from "swr";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

const ITEMS_PER_PAGE = 50;

const PAYMENT_METHODS = [
  { value: "cash", labelAr: "نقداً", labelEn: "Cash" },
  { value: "card", labelAr: "بطاقة", labelEn: "Card" },
  { value: "bank_transfer", labelAr: "تحويل بنكي", labelEn: "Bank Transfer" },
  { value: "cheque", labelAr: "شيك", labelEn: "Cheque" },
];

export default function PaymentsPage() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deleteConfirmPayment, setDeleteConfirmPayment] = useState(null);

  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Applied filters (sent to API only on Apply click)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: null,
    endDate: null,
    paymentMethod: "",
    search: "",
  });

  const applyFilters = () => {
    setAppliedFilters({
      startDate: startDate ? startDate.toISOString().split("T")[0] : null,
      endDate: endDate ? endDate.toISOString().split("T")[0] : null,
      paymentMethod: paymentMethodFilter,
      search: searchQuery,
    });
    setCurrentPage(1);
  };

  // SWR key
  const buildSwrKey = useCallback(() => {
    const params = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      startDate: appliedFilters.startDate || undefined,
      endDate: appliedFilters.endDate || undefined,
      paymentMethod: appliedFilters.paymentMethod || undefined,
      search: appliedFilters.search || undefined,
    };
    return ["payments", JSON.stringify(params)];
  }, [currentPage, appliedFilters]);

  // Fetch payments
  const {
    data: paymentsResponse,
    error,
    isLoading,
    mutate,
  } = useSWR(
    buildSwrKey(),
    ([, paramsStr]) => {
      const params = JSON.parse(paramsStr);
      return getPayments(params);
    },
    { revalidateOnFocus: false }
  );

  const payments = paymentsResponse?.data || [];
  const pagination = paymentsResponse?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    totalAmount: 0,
  };

  // Handlers
  const handleView = (payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (payment) => {
    setDeleteConfirmPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmPayment) return;
    try {
      const { deletePayment } = await import("../../services/api/payments");
      const res = await deletePayment(deleteConfirmPayment.id);
      if (res.success) {
        const { toast } = await import("react-toastify");
        toast.success(t("contracts.payments.deleteSuccess"));
        setIsDeleteModalOpen(false);
        setDeleteConfirmPayment(null);
        mutate();
      }
    } catch (err) {
      const { toast } = await import("react-toastify");
      toast.error(t("contracts.payments.deleteError"));
    }
  };

  const handlePaymentSaved = () => {
    setIsEditModalOpen(false);
    setEditingPayment(null);
    mutate();
  };

  const handlePrint = (payment) => {
    printPaymentReceipt(payment.id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setPaymentMethodFilter("");
    setSearchQuery("");
    setAppliedFilters({
      startDate: null,
      endDate: null,
      paymentMethod: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    appliedFilters.startDate ||
    appliedFilters.endDate ||
    appliedFilters.paymentMethod ||
    appliedFilters.search;

  // Format helpers
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(isArabic ? "ar-AE" : "en-US");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  const getPaymentMethodLabel = (method) => {
    const found = PAYMENT_METHODS.find((m) => m.value === method);
    if (found) return isArabic ? found.labelAr : found.labelEn;
    return method;
  };

  const getPaymentBadgeVariant = (method) => {
    const variants = {
      cash: "default",
      card: "secondary",
      bank_transfer: "outline",
      online: "secondary",
      wallet: "outline",
    };
    return variants[method] || "default";
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Banknote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("contracts.payments.title")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isArabic
                ? "عرض وإدارة جميع الدفعات"
                : "View and manage all payments"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {isArabic ? "الفلاتر" : "Filters"}
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? "بحث برقم المرجع أو الفاتورة..."
                    : "Search by reference or invoice..."
                }
                className="pl-9"
              />
            </div>

            {/* Date From */}
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
              placeholder={isArabic ? "من تاريخ" : "From Date"}
              maxDate={endDate || undefined}
            />

            {/* Date To */}
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
              placeholder={isArabic ? "إلى تاريخ" : "To Date"}
              minDate={startDate || undefined}
            />

            {/* Payment Method Filter */}
            <Select
              value={paymentMethodFilter}
              onValueChange={(val) =>
                setPaymentMethodFilter(val === "all" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isArabic ? "جميع طرق الدفع" : "All Payment Methods"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {isArabic ? "جميع طرق الدفع" : "All Payment Methods"}
                </SelectItem>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {isArabic ? m.labelAr : m.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Apply & Clear Filters */}
            <div className="flex items-center gap-2">
              <Button
                onClick={applyFilters}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isArabic ? "تطبيق" : "Apply"}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  {isArabic ? "مسح" : "Clear"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Table Card */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              {t("contracts.payments.errorLoading")}
            </p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("contracts.payments.noPaymentsFound")}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                {isArabic ? "مسح الفلاتر" : "Clear Filters"}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{t("contracts.payments.date")}</TableHead>
                  <TableHead>{t("contracts.payments.amount")}</TableHead>
                  <TableHead>{t("contracts.payments.method")}</TableHead>
                  <TableHead>{t("contracts.payments.reference")}</TableHead>
                  <TableHead>
                    {isArabic ? "رقم الفاتورة" : "Invoice #"}
                  </TableHead>
                  <TableHead>{isArabic ? "الفرع" : "Branch"}</TableHead>
                  <TableHead>
                    {isArabic ? "الحساب البنكي" : "Bank Account"}
                  </TableHead>
                  <TableHead>{t("contracts.payments.createdBy")}</TableHead>
                  <TableHead className="text-right">
                    {t("contracts.payments.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-muted-foreground">
                      {(pagination.page - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payment.amount)} AED
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getPaymentBadgeVariant(
                          payment.payment_method
                        )}
                      >
                        {getPaymentMethodLabel(payment.payment_method)}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.reference_number || "-"}</TableCell>
                    <TableCell>
                      {payment.invoice_number || payment.invoice_id || "-"}
                    </TableCell>
                    <TableCell>
                      {isArabic
                        ? payment.branch_name_ar
                        : payment.branch_name_en || "-"}
                    </TableCell>
                    <TableCell>
                      {payment.account_bank_name
                        ? `${payment.account_bank_name} - ${payment.account_name || ""}`
                        : "-"}
                    </TableCell>
                    <TableCell>{payment.created_by_name || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(payment)}
                          title={isArabic ? "عرض" : "View"}
                        >
                          <Eye className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePrint(payment)}
                          title={isArabic ? "طباعة إيصال" : "Print Receipt"}
                        >
                          <Printer className="w-4 h-4 text-green-600 hover:text-green-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(payment)}
                          title={t("contracts.payments.editPayment")}
                        >
                          <Edit className="w-4 h-4 text-amber-600 hover:text-amber-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(payment)}
                          title={t("contracts.payments.deletePayment")}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Stats Footer & Pagination */}
        {payments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {isArabic ? "عرض" : "Showing"}{" "}
                {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                {isArabic ? "من" : "of"} {pagination.total}{" "}
                {isArabic ? "سجل" : "records"}
              </span>
              <span className="font-semibold">
                {isArabic ? "الإجمالي" : "Total"}:{" "}
                {formatCurrency(pagination.totalAmount)} AED
              </span>
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </Card>

      {/* Modals */}
      <ViewPaymentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPayment(null);
        }}
        paymentId={selectedPayment?.id}
      />

      <PaymentDialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false);
            setEditingPayment(null);
          }
        }}
        invoiceId={editingPayment?.invoice_id}
        payment={editingPayment}
        onSaved={handlePaymentSaved}
        language={language}
        isRTL={isArabic}
      />

      <DeletePaymentDialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteModalOpen(false);
            setDeleteConfirmPayment(null);
          }
        }}
        payment={deleteConfirmPayment}
        onConfirm={handleDeleteConfirm}
        language={language}
      />
    </div>
  );
}