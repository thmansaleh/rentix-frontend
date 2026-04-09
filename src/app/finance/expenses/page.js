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
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination } from "@/components/Pagination";
import {
  Plus,
  Receipt,
  Loader2,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  Check,
} from "lucide-react";
import { AddExpenseModal } from "./AddExpenseModal";
import { EditExpenseModal } from "./EditExpenseModal";
import { ViewExpenseModal } from "./ViewExpenseModal";
import { DeleteExpenseModal } from "./DeleteExpenseModal";
import { getExpenses, getExpenseCategories } from "../../services/api/expenses";
import useSWR from "swr";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

const ITEMS_PER_PAGE = 50;

export default function ExpensesPage() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Pagination & Filters (pending = UI state, applied = sent to API)
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Applied filters (only updated when user clicks Apply)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: null,
    endDate: null,
    categoryId: "",
    paymentMethod: "",
  });

  const applyFilters = () => {
    setAppliedFilters({
      startDate: startDate ? startDate.toISOString().split("T")[0] : null,
      endDate: endDate ? endDate.toISOString().split("T")[0] : null,
      categoryId: categoryFilter,
      paymentMethod: paymentMethodFilter,
    });
    setCurrentPage(1);
  };

  // Build SWR key with applied filters
  const buildSwrKey = useCallback(() => {
    const params = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      startDate: appliedFilters.startDate || undefined,
      endDate: appliedFilters.endDate || undefined,
      categoryId: appliedFilters.categoryId || undefined,
      paymentMethod: appliedFilters.paymentMethod || undefined,
    };
    return ["expenses", JSON.stringify(params)];
  }, [
    currentPage,
    appliedFilters,
  ]);

  // Fetch expenses
  const {
    data: expensesResponse,
    error,
    isLoading,
    mutate,
  } = useSWR(buildSwrKey(), ([, paramsStr]) => {
    const params = JSON.parse(paramsStr);
    return getExpenses(params);
  }, { revalidateOnFocus: false });

  const expenses = expensesResponse?.data || [];
  const pagination = expensesResponse?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    totalAmount: 0,
  };

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useSWR("expense-categories", getExpenseCategories, {
    revalidateOnFocus: false,
  });

  const categories = categoriesData?.data || [];

  // Handlers
  const handleView = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setIsViewModalOpen(true);
  };

  const handleEdit = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setCategoryFilter("");
    setPaymentMethodFilter("");
    setAppliedFilters({
      startDate: null,
      endDate: null,
      categoryId: "",
      paymentMethod: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    appliedFilters.startDate ||
    appliedFilters.endDate ||
    appliedFilters.categoryId ||
    appliedFilters.paymentMethod;

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
    const labels = {
      cash: t("expenses.cash"),
      bank_transfer: t("expenses.bankTransfer"),
      credit_card: t("expenses.creditCard"),
      cheque: t("expenses.cheque"),
    };
    return labels[method] || method;
  };

  const getPaymentBadgeVariant = (method) => {
    const variants = {
      cash: "default",
      bank_transfer: "secondary",
      credit_card: "outline",
      cheque: "outline",
    };
    return variants[method] || "default";
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("expenses.title")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("expenses.subtitle")}
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
            {t("expenses.filters")}
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("expenses.addExpense")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Date From */}
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
              placeholder={t("expenses.startDate")}
              maxDate={endDate || undefined}
            />

            {/* Date To */}
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
              placeholder={t("expenses.endDate")}
              minDate={startDate || undefined}
            />

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onValueChange={(val) => setCategoryFilter(val === "all" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("expenses.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("expenses.allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.category_id}
                    value={String(cat.category_id)}
                  >
                    {isArabic ? cat.name_ar : cat.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select
              value={paymentMethodFilter}
              onValueChange={(val) => setPaymentMethodFilter(val === "all" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("expenses.allPaymentMethods")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("expenses.allPaymentMethods")}
                </SelectItem>
                <SelectItem value="cash">{t("expenses.cash")}</SelectItem>
                <SelectItem value="bank_transfer">
                  {t("expenses.bankTransfer")}
                </SelectItem>
                <SelectItem value="credit_card">
                  {t("expenses.creditCard")}
                </SelectItem>
                <SelectItem value="cheque">{t("expenses.cheque")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Apply & Clear Filters */}
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
                onClick={applyFilters}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {t("expenses.applyFilters")}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  {t("expenses.clearFilters")}
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
            <p className="text-red-500">{t("expenses.loadError")}</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("expenses.noExpenses")}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("expenses.addFirstExpense")}
              </Button>
            )}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                {t("expenses.clearFilters")}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("expenses.date")}</TableHead>
                  <TableHead>{t("expenses.category")}</TableHead>
                  <TableHead>{t("expenses.description")}</TableHead>
                  <TableHead>{t("expenses.amount")}</TableHead>
                  <TableHead>{t("expenses.paymentMethod")}</TableHead>
                  <TableHead>{t("expenses.branch")}</TableHead>
                  <TableHead>{t("expenses.recipient")}</TableHead>
                  <TableHead className="text-right">
                    {t("expenses.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.expense_id}>
                    <TableCell>{formatDate(expense.expense_date)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {isArabic
                          ? expense.category_name_ar
                          : expense.category_name_en}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.description || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(expense.amount)} AED
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getPaymentBadgeVariant(
                          expense.payment_method
                        )}
                      >
                        {getPaymentMethodLabel(expense.payment_method)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isArabic
                        ? expense.branch_name_ar
                        : expense.branch_name_en}
                    </TableCell>
                    <TableCell>{expense.recipient || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleView(expense.expense_id)}
                          title={t("expenses.viewExpense")}
                        >
                          <Eye className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(expense.expense_id)}
                          title={t("expenses.editExpense")}
                        >
                          <Edit className="w-4 h-4 text-amber-600 hover:text-amber-700" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(expense)}
                          title={t("expenses.deleteExpenseTitle")}
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
        {expenses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {t("expenses.showing")}{" "}
                {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                {t("expenses.of")} {pagination.total} {t("expenses.records")}
              </span>
              <span className="font-semibold">
                {t("expenses.totalAmount")}:{" "}
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
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => mutate()}
      />

      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpenseId(null);
        }}
        onSuccess={() => mutate()}
        expenseId={selectedExpenseId}
      />

      <ViewExpenseModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExpenseId(null);
        }}
        expenseId={selectedExpenseId}
      />

      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExpense(null);
        }}
        onSuccess={() => mutate()}
        expense={selectedExpense}
      />
    </div>
  );
}