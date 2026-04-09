"use client";

import React, { useRef } from "react";
import { FileText, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Pagination } from "@/components/Pagination";

import { useInvoices } from "./hooks/useInvoices";

import InvoicesPageHeader from "./components/InvoicesPageHeader";
import InvoicesSummaryCards from "./components/InvoicesSummaryCards";
import InvoicesFilterBar from "./components/InvoicesFilterBar";
import InvoicesTable from "./components/InvoicesTable";

export default function InvoicesPage() {
  const t = useTranslations("invoices");
  const { isRTL, language } = useLanguage();

  const {
    invoices,
    loading,
    branches,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    branchFilter,
    setBranchFilter,
    handleSearch,
    currentPage,
    totalPages,
    handlePageChange,
    refreshData,
  } = useInvoices(t);

  const tableRef = useRef(null);
  const handleAddNew = () => tableRef.current?.openAddNew();

  return (
    <div className="space-y-6 p-4 md:p-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <InvoicesPageHeader t={t} onAddNew={handleAddNew} />

      {/* Summary cards */}
      <InvoicesSummaryCards stats={stats} language={language} t={t} />

      {/* Filters */}
      <InvoicesFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        branchFilter={branchFilter}
        onBranchFilterChange={setBranchFilter}
        branches={branches}
        onSearch={handleSearch}
        language={language}
        isRTL={isRTL}
        t={t}
      />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ms-2 text-muted-foreground">{t("loading")}</span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-lg">
                {t("noInvoicesFound")}
              </p>
              <Button onClick={handleAddNew} variant="outline" className="mt-4">
                <Plus className="me-2 h-4 w-4" />
                {t("addFirstInvoice")}
              </Button>
            </div>
          ) : (
            <InvoicesTable
              ref={tableRef}
              invoices={invoices}
              language={language}
              isRTL={isRTL}
              onDataChange={refreshData}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

    </div>
  );
}
