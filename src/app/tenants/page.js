"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2, Loader2, Eye, Edit, Trash2, Search, Plus,
  MoreHorizontal, Crown, Receipt, CreditCard,
  LayoutGrid, CheckCircle2, AlertTriangle, XCircle, Clock,
  BarChart3,
} from "lucide-react";
import { getTenants } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import { ViewTenantModal } from "./ViewTenantModal";
import { EditTenantModal } from "./EditTenantModal";
import { DeleteTenantModal } from "./DeleteTenantModal";
import { CreateTenantModal } from "./CreateTenantModal";

const STATUS_FILTERS = [
  { key: "all",       labelKey: "tenants.filterAll",       icon: LayoutGrid,     color: "text-gray-600",    activeBg: "bg-gray-900 dark:bg-gray-100",   activeText: "text-white dark:text-gray-900", pillBg: "bg-gray-100 dark:bg-gray-800" },
  { key: "active",    labelKey: "tenants.filterActive",    icon: CheckCircle2,   color: "text-emerald-600", activeBg: "bg-emerald-600",                  activeText: "text-white",                    pillBg: "bg-emerald-50 dark:bg-emerald-900/30" },
  { key: "trial",     labelKey: "tenants.filterTrial",     icon: Clock,          color: "text-blue-600",    activeBg: "bg-blue-600",                     activeText: "text-white",                    pillBg: "bg-blue-50 dark:bg-blue-900/30" },
  { key: "suspended", labelKey: "tenants.filterSuspended", icon: AlertTriangle,  color: "text-orange-600",  activeBg: "bg-orange-500",                   activeText: "text-white",                    pillBg: "bg-orange-50 dark:bg-orange-900/30" },
];

const STATUS_STYLES = {
  active:    { badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800", dot: "bg-emerald-500" },
  trial:     { badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800", dot: "bg-blue-500" },
  suspended: { badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800", dot: "bg-orange-500" },
};

function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.active;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", style.badge)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", style.dot)} />
      {label}
    </span>
  );
}

function SubBadge({ status }) {
  const styles = {
    trial:     "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    active:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    past_due:  "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    expired:   "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold uppercase", styles[status] || styles.expired)}>
      {status}
    </span>
  );
}

export default function TenantsPage() {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [viewTenantId, setViewTenantId] = useState(null);
  const [editTenantId, setEditTenantId] = useState(null);
  const [deleteTenant, setDeleteTenant] = useState(null);

  const swrKey = ["tenants", search, activeFilter];
  const { data: tenantsData, error, isLoading, mutate } = useSWR(
    swrKey,
    () => getTenants({ search, status: activeFilter !== "all" ? activeFilter : undefined }),
    { revalidateOnFocus: false }
  );

  const tenants = tenantsData?.data || [];
  const pagination = tenantsData?.pagination || {};

  const counts = useMemo(() => ({
    all:       tenants.length,
    active:    tenants.filter(t => t.status === "active").length,
    trial:     tenants.filter(t => t.status === "trial").length,
    suspended: tenants.filter(t => t.status === "suspended").length,
  }), [tenants]);

  const getStatusLabel = (status) => ({
    active:    t("tenants.statusActive"),
    trial:     t("tenants.statusTrial"),
    suspended: t("tenants.statusSuspended"),
  })[status] || status;

  return (
    <div className="container mx-auto py-6 px-4 space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {t("tenants.title")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("tenants.description")}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("tenants.createTenant")}
        </Button>
      </div>

      {/* ── Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("tenants.searchPlaceholder")}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* ── Filter Pills ── */}
      {!isLoading && !error && (
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? `${f.activeBg} ${f.activeText} border-transparent shadow-sm`
                    : `bg-background border-border ${f.color} hover:border-current hover:bg-muted/50`
                )}
              >
                <Icon className="w-3 h-3" />
                {t(f.labelKey)}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums",
                  isActive ? "bg-white/20 text-inherit" : `${f.pillBg} ${f.color}`
                )}>
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Table Card ── */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm text-red-500">{t("tenants.failedToLoad")}</p>
            </div>
          )}

          {!isLoading && !error && tenants.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Building2 className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t("tenants.noTenantsFound")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("tenants.noTenantsFoundDesc")}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && tenants.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">#</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.code")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.companyName")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.email")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.phone")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.status")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.plan")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("tenants.subscriptionStatus")}</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">{t("tenants.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant, idx) => (
                      <TableRow key={tenant.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="text-sm tabular-nums text-muted-foreground">{tenant.id}</TableCell>
                        <TableCell>
                          <span className="font-mono text-sm font-semibold tracking-wider text-primary">
                            {tenant.code}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{tenant.company_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{tenant.email || "—"}</TableCell>
                        <TableCell className="text-sm tabular-nums">{tenant.phone || "—"}</TableCell>
                        <TableCell>
                          <StatusBadge status={tenant.status} label={getStatusLabel(tenant.status)} />
                        </TableCell>
                        <TableCell>
                          {tenant.plan_name_en ? (
                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                              {tenant.plan_name_en}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {tenant.subscription_status ? (
                            <SubBadge status={tenant.subscription_status} />
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setViewTenantId(tenant.id)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {t("tenants.viewDetails")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditTenantId(tenant.id)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {t("tenants.editTenant")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setViewTenantId(tenant.id)}>
                                  <Crown className="w-4 h-4 mr-2" />
                                  {t("tenants.managePlan")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewTenantId(tenant.id)}>
                                  <Receipt className="w-4 h-4 mr-2" />
                                  {t("tenants.viewInvoices")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewTenantId(tenant.id)}>
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  {t("tenants.viewPayments")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewTenantId(tenant.id)}>
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  {t("tenants.viewStats")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteTenant(tenant)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t("tenants.deleteTenant")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border/60 bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t("tenants.showing")} <span className="font-semibold text-foreground">{tenants.length}</span> / <span className="font-semibold text-foreground">{pagination.total || tenants.length}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{t("tenants.statusActive")}: <b className="text-foreground">{counts.active}</b></span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{t("tenants.statusTrial")}: <b className="text-foreground">{counts.trial}</b></span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{t("tenants.statusSuspended")}: <b className="text-foreground">{counts.suspended}</b></span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Modals ── */}
      <CreateTenantModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={() => {
          mutate();
          setShowCreate(false);
        }}
      />
      <ViewTenantModal
        isOpen={!!viewTenantId}
        onClose={() => setViewTenantId(null)}
        tenantId={viewTenantId}
      />
      <EditTenantModal
        isOpen={!!editTenantId}
        onClose={() => setEditTenantId(null)}
        tenantId={editTenantId}
        onSuccess={(updated) => {
          mutate();
          setEditTenantId(null);
        }}
      />
      <DeleteTenantModal
        isOpen={!!deleteTenant}
        onClose={() => setDeleteTenant(null)}
        tenant={deleteTenant}
        onSuccess={(id) => {
          mutate();
          setDeleteTenant(null);
        }}
      />
    </div>
  );
}