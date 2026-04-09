"use client";

import { useState } from "react";
import useSWR from "swr";
import { CustomModal, CustomModalBody, CustomModalHeader, CustomModalFooter, CustomModalTitle } from "@/components/ui/custom-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Loader2, Building2, Crown, Receipt, CreditCard, BarChart3,
  Calendar, Mail, Phone, Globe, Hash, Clock, CheckCircle2,
  AlertTriangle, Car, GitBranch, Users, FileText, Package,
  Pencil, Trash2, MoreHorizontal, ArrowUpCircle, ArrowDownCircle,
  RefreshCw, History, Zap, Shield, TrendingUp,
} from "lucide-react";
import { getTenantById, getTenantSubscription, getTenantInvoices, getTenantPayments, getTenantStats, deleteTenantInvoice, deleteTenantPayment, updateTenantAddon, deleteTenantAddon, getSubscriptionLogs } from "../services/api/tenants";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { ChangePlanModal } from "./ChangePlanModal";
import { AddInvoiceModal } from "./AddInvoiceModal";
import { EditInvoiceModal } from "./EditInvoiceModal";
import { AddPaymentModal } from "./AddPaymentModal";
import { EditPaymentModal } from "./EditPaymentModal";
import { AddAddonModal } from "./AddAddonModal";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

const SUB_STATUS_STYLES = {
  trial:     "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  active:    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  past_due:  "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  expired:   "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

const INV_STATUS_STYLES = {
  unpaid:  "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  void:    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

export function ViewTenantModal({ isOpen, onClose, tenantId }) {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("info");
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [deletingInvoice, setDeletingInvoice] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletingPaymentId, setDeletingPaymentId] = useState(null);
  const [addAddonOpen, setAddAddonOpen] = useState(false);
  const [cancellingAddonId, setCancellingAddonId] = useState(null);
  const [deletingAddonId, setDeletingAddonId] = useState(null);

  const { data: tenantRes, isLoading: loadingTenant } = useSWR(
    isOpen && tenantId ? ["tenant", tenantId] : null,
    () => getTenantById(tenantId),
    { revalidateOnFocus: false }
  );

  const { data: subRes, isLoading: loadingSub, mutate: mutateSub } = useSWR(
    isOpen && tenantId ? ["tenant-sub", tenantId] : null,
    () => getTenantSubscription(tenantId),
    { revalidateOnFocus: false }
  );

  const { data: invRes, isLoading: loadingInv, mutate: mutateInv } = useSWR(
    isOpen && tenantId ? ["tenant-inv", tenantId] : null,
    () => getTenantInvoices(tenantId),
    { revalidateOnFocus: false }
  );

  const { data: payRes, isLoading: loadingPay, mutate: mutatePay } = useSWR(
    isOpen && tenantId && activeTab === "payments" ? ["tenant-pay", tenantId] : null,
    () => getTenantPayments(tenantId),
    { revalidateOnFocus: false }
  );

  const { data: statsRes, isLoading: loadingStats } = useSWR(
    isOpen && tenantId && (activeTab === "stats" || activeTab === "subscription") ? ["tenant-stats", tenantId] : null,
    () => getTenantStats(tenantId),
    { revalidateOnFocus: false }
  );

  const { data: logsRes, isLoading: loadingLogs } = useSWR(
    isOpen && tenantId && activeTab === "subscription" ? ["tenant-sub-logs", tenantId] : null,
    () => getSubscriptionLogs(tenantId),
    { revalidateOnFocus: false }
  );

  const tenant = tenantRes?.data;
  const subscription = subRes?.data;
  const invoices = invRes?.data || [];
  const payments = payRes?.data || [];
  const stats = statsRes?.data;
  const subscriptionLogs = logsRes?.data || [];

  const loading = loadingTenant;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={loading ? t("tenants.loading") : (tenant?.company_name || t("tenants.tenantDetails"))}
      size="xl"
      
    >
      <CustomModalBody className="p-0 min-h-[80vh] max-h-[80vh]">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tenant ? (
        <Tabs dir={t("common.direction")} value={activeTab} onValueChange={setActiveTab} className="w-full min-h-44">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {t("tenants.tabInfo")}
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              {t("tenants.tabSubscription")}
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              {t("tenants.tabInvoices")}
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              {t("tenants.tabPayments")}
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              {t("tenants.tabStats")}
            </TabsTrigger>
          </TabsList>

          {/* ── Info Tab ── */}
          <TabsContent value="info" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={Hash} label={t("tenants.tenantId")} value={tenant.id} />
              <InfoRow icon={Globe} label={t("tenants.code")} value={tenant.code} />
              <InfoRow icon={Building2} label={t("tenants.companyName")} value={tenant.company_name} />
              <InfoRow icon={Mail} label={t("tenants.email")} value={tenant.email} />
              <InfoRow icon={Phone} label={t("tenants.phone")} value={tenant.phone} />
              <InfoRow icon={CheckCircle2} label={t("tenants.status")} value={tenant.status} />
              <InfoRow icon={Calendar} label={t("tenants.createdAt")} value={tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : "—"} />
              <InfoRow icon={Clock} label={t("tenants.updatedAt")} value={tenant.updated_at ? new Date(tenant.updated_at).toLocaleDateString() : "—"} />
              {tenant.company_name_en && (
                <InfoRow icon={Building2} label={t("tenants.companyNameEn")} value={tenant.company_name_en} />
              )}
              {tenant.company_name_ar && (
                <InfoRow icon={Building2} label={t("tenants.companyNameAr")} value={tenant.company_name_ar} />
              )}
              {tenant.trn_number && (
                <InfoRow icon={Hash} label={t("tenants.trnNumber")} value={tenant.trn_number} />
              )}
              {tenant.traffic_number && (
                <InfoRow icon={Hash} label={t("tenants.trafficNumber")} value={tenant.traffic_number} />
              )}
            </div>
          </TabsContent>

          {/* ── Subscription Tab ── */}
          <TabsContent value="subscription" className="mt-4 space-y-4">
            {loadingSub ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : subscription?.currentSubscription ? (
              <>
                {/* ── Active Plan Hero Card ── */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Crown className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">
                            {isRTL ? subscription.currentSubscription.plan_name_ar : subscription.currentSubscription.plan_name_en}
                          </h2>
                          <p className="text-sm text-muted-foreground capitalize">
                            {t(`tenants.${subscription.currentSubscription.billing_cycle}`)} {t("tenants.subscription")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border", SUB_STATUS_STYLES[subscription.currentSubscription.status])}>
                          {t(`tenants.status${subscription.currentSubscription.status.charAt(0).toUpperCase() + subscription.currentSubscription.status.slice(1).replace('_', '')}`)}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => setChangePlanOpen(true)}>
                          <ArrowUpCircle className="w-3.5 h-3.5 me-1.5" />
                          {t("tenants.changePlan")}
                        </Button>
                      </div>
                    </div>

                    {/* Pricing & Dates Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground mb-1">{t("tenants.price")}</p>
                        <p className="text-lg font-bold text-primary">
                          {subscription.currentSubscription.billing_cycle === "monthly"
                            ? subscription.currentSubscription.monthly_price
                            : subscription.currentSubscription.annual_price}
                          <span className="text-xs font-normal text-muted-foreground ms-1">
                            AED/{t(`tenants.${subscription.currentSubscription.billing_cycle === "monthly" ? "month" : "year"}`)}
                          </span>
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground mb-1">{t("tenants.billingCycle")}</p>
                        <p className="text-sm font-semibold capitalize">{t(`tenants.${subscription.currentSubscription.billing_cycle}`)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground mb-1">{t("tenants.startDate")}</p>
                        <p className="text-sm font-semibold">{new Date(subscription.currentSubscription.start_date).toLocaleDateString()}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border">
                        <p className="text-xs text-muted-foreground mb-1">{t("tenants.endDate")}</p>
                        <p className="text-sm font-semibold">{new Date(subscription.currentSubscription.end_date).toLocaleDateString()}</p>
                        {(() => {
                          const daysLeft = Math.ceil((new Date(subscription.currentSubscription.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                          if (daysLeft > 0 && daysLeft <= 30) {
                            return <p className="text-xs text-yellow-600 mt-0.5">{daysLeft} {t("tenants.daysRemaining")}</p>;
                          }
                          if (daysLeft <= 0) {
                            return <p className="text-xs text-red-600 mt-0.5">{t("tenants.expired")}</p>;
                          }
                          return <p className="text-xs text-muted-foreground mt-0.5">{daysLeft} {t("tenants.daysRemaining")}</p>;
                        })()}
                      </div>
                    </div>

                    {/* Plan Limits with Progress */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                      {[
                        { icon: Car, label: t("tenants.maxCars"), max: subscription.currentSubscription.max_cars, used: stats?.cars, color: "bg-blue-500" },
                        { icon: GitBranch, label: t("tenants.maxBranches"), max: subscription.currentSubscription.max_branches, used: stats?.branches, color: "bg-purple-500" },
                        { icon: Users, label: t("tenants.maxEmployees"), max: subscription.currentSubscription.max_employees, used: stats?.employees, color: "bg-emerald-500" },
                      ].map((item, i) => {
                        const pct = item.max ? Math.min(100, Math.round(((item.used || 0) / item.max) * 100)) : 0;
                        const isUnlimited = !item.max;
                        return (
                          <div key={i} className="p-3 rounded-lg bg-background border space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                              </div>
                              <span className="text-sm font-bold">
                                {isUnlimited ? "∞" : `${item.used ?? "—"}/${item.max}`}
                              </span>
                            </div>
                            {!isUnlimited && (
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all", pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : item.color)}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* ── Plan Features ── */}
                {subscription.features?.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        {t("tenants.planFeatures")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {subscription.features.map((f) => (
                          <div key={f.id} className={cn(
                            "flex items-center gap-2.5 text-sm p-2 rounded-lg",
                            f.is_included ? "bg-emerald-50/50 dark:bg-emerald-900/10" : "bg-muted/30"
                          )}>
                            {f.is_included ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span className={f.is_included ? "text-foreground" : "text-muted-foreground line-through"}>
                              {(isRTL ? f.label_ar : f.label_en) || f.feature_key}
                            </span>
                            {f.value_limit && (
                              <span className="text-xs text-muted-foreground ms-auto">({f.value_limit})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ── Addons ── */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        {t("tenants.addons")}
                      </h3>
                      <Button size="sm" variant="outline" onClick={() => setAddAddonOpen(true)}>
                        <Package className="w-3.5 h-3.5 me-1.5" />
                        {t("tenants.addAddon")}
                      </Button>
                    </div>
                    {subscription.addons?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">{t("tenants.addonName")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.addonType")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.quantity")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.totalUnits")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.status")}</TableHead>
                            <TableHead className="text-xs w-20"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscription.addons.map((a) => (
                            <TableRow key={a.id}>
                              <TableCell className="text-sm font-medium">
                                {isRTL ? a.addon_name_ar : a.addon_name_en}
                              </TableCell>
                              <TableCell className="text-sm capitalize">{a.resource_type}</TableCell>
                              <TableCell className="text-sm">{a.quantity}</TableCell>
                              <TableCell className="text-sm font-semibold">{a.total_units}</TableCell>
                              <TableCell>
                                <span className={cn("px-2 py-0.5 rounded text-xs font-medium",
                                  a.status === "active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                )}>
                                  {t(`tenants.status${a.status.charAt(0).toUpperCase() + a.status.slice(1)}`)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {a.status === "active" ? (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-7 h-7 text-yellow-600 hover:text-yellow-700"
                                      title={t("tenants.cancelAddon")}
                                      disabled={cancellingAddonId === a.id}
                                      onClick={async () => {
                                        setCancellingAddonId(a.id);
                                        try {
                                          await updateTenantAddon(tenantId, a.id, { status: "cancelled" });
                                          toast.success(t("tenants.addonCancelSuccess"));
                                          mutateSub();
                                        } catch {
                                          toast.error(t("tenants.addonCancelError"));
                                        } finally {
                                          setCancellingAddonId(null);
                                        }
                                      }}
                                    >
                                      {cancellingAddonId === a.id
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <AlertTriangle className="w-3.5 h-3.5" />}
                                    </Button>
                                  ) : (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="w-7 h-7 text-emerald-600 hover:text-emerald-700"
                                      title={t("tenants.reactivateAddon")}
                                      disabled={cancellingAddonId === a.id}
                                      onClick={async () => {
                                        setCancellingAddonId(a.id);
                                        try {
                                          await updateTenantAddon(tenantId, a.id, { status: "active" });
                                          toast.success(t("tenants.addonReactivateSuccess"));
                                          mutateSub();
                                        } catch {
                                          toast.error(t("tenants.addonCancelError"));
                                        } finally {
                                          setCancellingAddonId(null);
                                        }
                                      }}
                                    >
                                      {cancellingAddonId === a.id
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </Button>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-7 h-7 text-destructive hover:text-destructive"
                                    title={t("tenants.deleteAddon")}
                                    disabled={deletingAddonId === a.id}
                                    onClick={async () => {
                                      if (!confirm(t("tenants.addonDeleteConfirm"))) return;
                                      setDeletingAddonId(a.id);
                                      try {
                                        await deleteTenantAddon(tenantId, a.id);
                                        toast.success(t("tenants.addonDeleteSuccess"));
                                        mutateSub();
                                      } catch {
                                        toast.error(t("tenants.addonDeleteError"));
                                      } finally {
                                        setDeletingAddonId(null);
                                      }
                                    }}
                                  >
                                    {deletingAddonId === a.id
                                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      : <Trash2 className="w-3.5 h-3.5" />}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">{t("tenants.noAddons")}</p>
                    )}
                  </CardContent>
                </Card>

                {/* ── Activity Log ── */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" />
                      {t("tenants.activityLog")}
                    </h3>
                    {loadingLogs ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    ) : subscriptionLogs.length > 0 ? (
                      <div className="relative">
                        <div className="absolute top-0 bottom-0 start-[15px] w-px bg-border" />
                        <div className="space-y-0">
                          {subscriptionLogs.slice(0, 20).map((log) => {
                            const iconMap = {
                              subscription_created: { icon: Crown, color: "text-primary bg-primary/10" },
                              plan_changed: { icon: ArrowUpCircle, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" },
                              billing_cycle_changed: { icon: RefreshCw, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30" },
                              status_changed: { icon: TrendingUp, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/30" },
                              addon_added: { icon: Zap, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
                              addon_cancelled: { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30" },
                              addon_reactivated: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
                            };
                            const { icon: LogIcon, color } = iconMap[log.action] || { icon: Clock, color: "text-muted-foreground bg-muted" };
                            return (
                              <div key={log.id} className="relative flex items-start gap-3 py-2.5 ps-0">
                                <div className={cn("relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", color)}>
                                  <LogIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                  <p className="text-sm text-foreground">
                                    {isRTL ? log.details_ar : log.details_en}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {new Date(log.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">{t("tenants.noActivityLogs")}</p>
                    )}
                  </CardContent>
                </Card>

                {/* ── Subscription History ── */}
                {subscription.subscriptions?.length > 1 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {t("tenants.subscriptionHistory")}
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">{t("tenants.plan")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.billingCycle")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.period")}</TableHead>
                            <TableHead className="text-xs">{t("tenants.status")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscription.subscriptions.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell className="text-sm font-medium">
                                {isRTL ? s.plan_name_ar : s.plan_name_en}
                              </TableCell>
                              <TableCell className="text-sm capitalize">
                                {t(`tenants.${s.billing_cycle}`)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(s.start_date).toLocaleDateString()} – {new Date(s.end_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", SUB_STATUS_STYLES[s.status])}>
                                  {t(`tenants.status${s.status.charAt(0).toUpperCase() + s.status.slice(1).replace('_', '')}`)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-base font-semibold">{t("tenants.noSubscription")}</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">{t("tenants.noSubscriptionDesc")}</p>
                <Button size="sm" className="mt-4" onClick={() => setChangePlanOpen(true)}>
                  <Crown className="w-4 h-4 me-1.5" />
                  {t("tenants.assignPlan")}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ── Invoices Tab ── */}
          <TabsContent value="invoices" className="mt-4">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setAddInvoiceOpen(true)} disabled={!subscription?.subscriptions?.length}>
                <Receipt className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
                {t("tenants.addInvoice")}
              </Button>
            </div>
            {loadingInv ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : invoices.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs">{t("tenants.invoiceNumber")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.plan")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.amount")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.tax")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.total")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.issueDate")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.dueDate")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.status")}</TableHead>
                        <TableHead className="text-xs w-[80px]">{t("tenants.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="text-sm font-mono font-semibold">{inv.invoice_number}</TableCell>
                          <TableCell className="text-sm">{inv.plan_name_en}</TableCell>
                          <TableCell className="text-sm tabular-nums">{parseFloat(inv.amount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm tabular-nums">{parseFloat(inv.tax_amount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm tabular-nums font-semibold">{parseFloat(inv.total_amount).toFixed(2)}</TableCell>
                          <TableCell className="text-sm">{new Date(inv.issue_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">{new Date(inv.due_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", INV_STATUS_STYLES[inv.status])}>
                              {inv.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => setEditingInvoice(inv)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                disabled={deletingInvoiceId === inv.id}
                                onClick={async () => {
                                  if (!confirm(t("tenants.deleteInvoiceConfirm"))) return;
                                  setDeletingInvoiceId(inv.id);
                                  try {
                                    await deleteTenantInvoice(tenantId, inv.id);
                                    toast.success(t("tenants.invoiceDeleteSuccess"));
                                    mutateInv();
                                  } catch (err) {
                                    toast.error(err.response?.data?.message || t("tenants.invoiceDeleteError"));
                                  } finally {
                                    setDeletingInvoiceId(null);
                                  }
                                }}
                              >
                                {deletingInvoiceId === inv.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Trash2 className="w-3.5 h-3.5" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Receipt className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">{t("tenants.noInvoices")}</p>
              </div>
            )}
          </TabsContent>

          {/* ── Payments Tab ── */}
          <TabsContent value="payments" className="mt-4">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setAddPaymentOpen(true)}>
                <CreditCard className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
                {t("tenants.addPayment")}
              </Button>
            </div>
            {loadingPay ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : payments.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs">{t("tenants.invoiceNumber")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.amount")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.paymentMethod")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.referenceNumber")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.paymentDate")}</TableHead>
                        <TableHead className="text-xs">{t("tenants.notes")}</TableHead>
                        <TableHead className="text-xs w-[80px]">{t("tenants.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((pay) => (
                        <TableRow key={pay.id}>
                          <TableCell className="text-sm font-mono">{pay.invoice_number}</TableCell>
                          <TableCell className="text-sm tabular-nums font-semibold text-primary">{parseFloat(pay.amount).toFixed(2)}</TableCell>
                          <TableCell>
                            <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium capitalize">
                              {pay.payment_method?.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{pay.reference_number || "—"}</TableCell>
                          <TableCell className="text-sm">{new Date(pay.payment_date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{pay.notes || "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => setEditingPayment(pay)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                disabled={deletingPaymentId === pay.id}
                                onClick={async () => {
                                  if (!confirm(t("tenants.deletePaymentConfirm"))) return;
                                  setDeletingPaymentId(pay.id);
                                  try {
                                    await deleteTenantPayment(tenantId, pay.id);
                                    toast.success(t("tenants.paymentDeleteSuccess"));
                                    mutatePay();
                                  } catch (err) {
                                    toast.error(err.response?.data?.message || t("tenants.paymentDeleteError"));
                                  } finally {
                                    setDeletingPaymentId(null);
                                  }
                                }}
                              >
                                {deletingPaymentId === pay.id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Trash2 className="w-3.5 h-3.5" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">{t("tenants.noPayments")}</p>
              </div>
            )}
          </TabsContent>

          {/* ── Stats Tab ── */}
          <TabsContent value="stats" className="mt-4">
            {loadingStats ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Car} label={t("tenants.totalCars")} value={stats.cars} color="bg-blue-500" />
                <StatCard icon={GitBranch} label={t("tenants.totalBranches")} value={stats.branches} color="bg-purple-500" />
                <StatCard icon={Users} label={t("tenants.totalEmployees")} value={stats.employees} color="bg-emerald-500" />
                <StatCard icon={FileText} label={t("tenants.totalContracts")} value={stats.contracts} color="bg-orange-500" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">{t("tenants.noStats")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">{t("tenants.tenantNotFound")}</p>
          </div>
        )}
      </CustomModalBody>

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        isOpen={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
        tenantId={tenantId}
        invoice={editingInvoice}
        onSuccess={() => mutateInv()}
      />

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={addInvoiceOpen}
        onClose={() => setAddInvoiceOpen(false)}
        tenantId={tenantId}
        subscriptions={subscription?.subscriptions || []}
        onSuccess={() => mutateInv()}
      />

      {/* Change Plan Modal */}
      <ChangePlanModal
        isOpen={changePlanOpen}
        onClose={() => setChangePlanOpen(false)}
        tenantId={tenantId}
        currentSubscription={subscription?.currentSubscription || null}
        onSuccess={() => mutateSub()}
      />

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        tenantId={tenantId}
        invoices={invoices}
        onSuccess={() => mutatePay()}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        tenantId={tenantId}
        payment={editingPayment}
        onSuccess={() => mutatePay()}
      />

      {/* Add Addon Modal */}
      <AddAddonModal
        isOpen={addAddonOpen}
        onClose={() => setAddAddonOpen(false)}
        tenantId={tenantId}
        subscriptions={subscription?.subscriptions || []}
        onSuccess={() => mutateSub()}
      />
    </CustomModal>
  );
}
