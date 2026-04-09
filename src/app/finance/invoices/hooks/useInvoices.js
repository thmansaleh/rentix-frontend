"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getAllInvoices } from "@/app/services/api/invoices";
import { getBranches } from "@/app/services/api/branches";
import { getTenantSettings } from "@/app/services/api/tenantSettings";
import { ITEMS_PER_PAGE } from "../constants";

const DEFAULT_FILTERS = { search: "", status: "all", branch_id: "all" };

export function useInvoices(translations) {
  // --- Data ---
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [tenantSettings, setTenantSettings] = useState(null);

  // --- Filter state (local, not yet sent) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  // --- Active filters (last sent to API) ---
  const [activeFilters, setActiveFilters] = useState({ ...DEFAULT_FILTERS });

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // --- Stats ---
  const [stats, setStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    paidCount: 0,
    unpaidCount: 0,
  });

  // --- Dialog visibility ---
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState(null);

  // ===== Side-effect: load branches =====
  useEffect(() => {
    (async () => {
      try {
        const res = await getBranches();
        if (res.success) setBranches(res.data || []);
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    })();
  }, []);

  // ===== Side-effect: load company settings =====
  useEffect(() => {
    (async () => {
      try {
        const res = await getTenantSettings();
        if (res.success) setTenantSettings(res.data);
      } catch (err) {
        console.error("Error fetching company settings:", err);
      }
    })();
  }, []);

  // ===== Fetch invoices =====
  const fetchInvoices = useCallback(
    async (page = 1, filters = activeFilters) => {
      try {
        setLoading(true);
        const params = { page, limit: ITEMS_PER_PAGE };
        if (filters.search) params.search = filters.search;
        if (filters.status && filters.status !== "all") params.status = filters.status;
        if (filters.branch_id && filters.branch_id !== "all") params.branch_id = filters.branch_id;

        const res = await getAllInvoices(params);
        if (res.success) {
          setInvoices(res.data || []);
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages || 1);
            setTotalCount(res.pagination.total || 0);
            setCurrentPage(res.pagination.page || 1);
          }
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error(translations("deleteError"));
      } finally {
        setLoading(false);
      }
    },
    [activeFilters, translations]
  );

  // ===== Fetch stats =====
  const fetchStats = useCallback(async () => {
    try {
      const res = await getAllInvoices({ limit: 100000 });
      if (res.success) {
        const all = res.data || [];
        setStats({
          totalAmount: all.reduce((s, i) => s + parseFloat(i.total_amount || 0), 0),
          paidAmount: all.reduce((s, i) => s + parseFloat(i.paid_amount || 0), 0),
          paidCount: all.filter((i) => i.status === "paid").length,
          unpaidCount: all.filter((i) => i.status === "unpaid").length,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // ===== Initial load =====
  useEffect(() => {
    fetchInvoices(1, DEFAULT_FILTERS);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Filter actions =====
  const handleSearch = () => {
    const newFilters = {
      search: searchTerm,
      status: statusFilter,
      branch_id: branchFilter,
    };
    setActiveFilters(newFilters);
    setCurrentPage(1);
    fetchInvoices(1, newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchInvoices(page, activeFilters);
  };

  const refreshData = () => {
    fetchInvoices(currentPage, activeFilters);
    fetchStats();
  };

  return {
    // Data
    invoices,
    loading,
    branches,
    stats,

    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    branchFilter,
    setBranchFilter,

    // Pagination
    currentPage,
    totalPages,
    totalCount,

    // Actions
    handleSearch,
    handlePageChange,
    refreshData,
  };
}
