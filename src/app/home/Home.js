"use client";

import React, { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { getDashboardStats } from "@/app/services/api/dashboard";
import { getFines, getSalikBalance } from "@/app/services/api/fines";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users, FileText, FileCheck, Receipt, CreditCard, Banknote,
  DollarSign, TrendingUp, Car, CarFront, Wrench, CircleCheck,
  CircleDollarSign, CircleX, CalendarDays, ArrowUpRight,
  ArrowDownRight, Clock, BadgeDollarSign, Landmark, Wallet,
  AlertCircle, RefreshCw, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, bg, accent }) {
  return (
    <div
      className="group relative flex flex-col gap-4 p-5 rounded-2xl bg-card border border-border/50
                 hover:shadow-xl hover:border-border hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-default"
    >
      {/* Ambient corner glow */}
      <div className={`absolute -top-5 -right-5 h-20 w-20 rounded-full ${bg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-300`} />

      {/* Icon */}
      <div className={`relative w-fit p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      {/* Value + label */}
      <div className="relative">
        <p className="text-2xl font-black text-foreground tabular-nums leading-none tracking-tight">
          {value}
        </p>
        <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide leading-snug line-clamp-2">
          {label}
        </p>
      </div>

      {/* Bottom sliding accent bar */}
      <div className={`absolute bottom-0 left-0 h-[2px] ${accent} w-0 group-hover:w-full transition-all duration-300 rounded-full`} />
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
function Section({ title, cards, index }) {
  const sectionStyles = [
    { accent: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",       dot: "bg-blue-500" },
    { accent: "bg-orange-500",  badge: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",   dot: "bg-orange-500" },
    { accent: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300", dot: "bg-emerald-500" },
    { accent: "bg-cyan-500",    badge: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",       dot: "bg-cyan-500" },
    { accent: "bg-slate-500",   badge: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",    dot: "bg-slate-500" },
  ];
  const style = sectionStyles[index % sectionStyles.length];

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-3 px-0.5">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${style.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {title}
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} accent={style.accent} />
        ))}
      </div>
    </div>
  );
}

/* ─── Bank Accounts Section ──────────────────────────────────────────────── */
function BankAccountsSection({ title, accounts, noDataLabel, formatCurrency, t }) {
  const total = accounts?.reduce((sum, a) => sum + Number(a.current_balance || 0), 0) ?? 0;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40">
          <Landmark className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {accounts?.length > 0 && (
          <span className="ms-auto text-sm font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            {accounts.length}
          </span>
        )}
      </div>

      {accounts?.length > 0 ? (
        <>
          {/* Account rows */}
          <div className="divide-y divide-border/40 flex-1">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                {/* Bank initials avatar */}
                <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-white uppercase leading-none">
                    {acc.bank_name?.slice(0, 2) || "BK"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{acc.bank_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{acc.account_name}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(acc.current_balance)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("dashboard.currentBalance")}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Total footer */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border/40">
            <p className="text-sm font-medium text-muted-foreground">{t("dashboard.totalBankBalances")}</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(total)}</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <div className="p-3 rounded-full bg-muted/50">
            <Landmark className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground">{noDataLabel}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Cash Section ───────────────────────────────────────────────────────── */
function CashSection({ title, cashAccount, noDataLabel, formatCurrency, t }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/40">
          <Wallet className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>

      {cashAccount ? (
        <div className="flex items-center gap-4 px-5 py-5 flex-1">
          {/* Big teal circle */}
          <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-md">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-0.5">{t("dashboard.cashBalance")}</p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 leading-tight tracking-tight">
              {formatCurrency(cashAccount.current_balance)}
            </p>
            {/* {cashAccount.account_name && (
              <p className="text-sm text-muted-foreground mt-1 truncate">{cashAccount.account_name}</p>
            )} */}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-2 flex-1">
          <div className="p-3 rounded-full bg-muted/50">
            <Wallet className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground">{noDataLabel}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Salik Balance Section ─────────────────────────────────────────────── */
function SalikBalanceSection({ isRTL, balance, isValid, loading, error, onRefresh }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
          <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {isRTL ? "رصيد سالك" : "Salik Balance"}
        </p>
        <Button
          onClick={onRefresh}
          disabled={loading}
         variant='outline'

          className="ms-auto p-1.5 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          title={isRTL ? "تحديث" : "Refresh"}
        >
          <RefreshCw className={`h-3.5 w-3.5  ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center flex-1 py-10">
          <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center flex-1 py-10 gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-xs text-muted-foreground">
            {isRTL ? "تعذّر جلب رصيد سالك" : "Failed to fetch Salik balance"}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex items-center gap-4 px-5 py-5 flex-1">
          <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-0.5">
              {isRTL ? "الرصيد الحالي" : "Current Balance"}
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 leading-tight tracking-tight">
              {balance ?? 0}
              <span className="text-sm font-medium text-muted-foreground ms-1">
                {isRTL ? "د.إ" : "AED"}
              </span>
            </p>
            <div className={`flex items-center gap-1.5 mt-1 text-sm font-medium ${isValid ? "text-emerald-600" : "text-destructive"}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isValid ? "bg-emerald-500" : "bg-red-500"}`} />
              {isRTL
                ? isValid ? "الحساب نشط" : "الحساب غير نشط"
                : isValid ? "Account Active" : "Account Inactive"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Fines Section ──────────────────────────────────────────────────────── */
function FinesSection({ isRTL, finesData, loading, error, onRefresh }) {
  const tickets = finesData?.results?.tickets || [];
  const totalFine = tickets.reduce((sum, t) => sum + (t.ticketTotalFine || 0), 0);
  const payableCount = tickets.filter((t) => t.isPayable === 2).length;
  const notPayableCount = tickets.filter((t) => t.isPayable === 1).length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/40">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {isRTL ? "المخالفات المرورية" : "Traffic Fines"}
        </p>
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant='outline'
          className="ms-auto p-1.5 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          title={isRTL ? "تحديث" : "Refresh"}
        >
          <RefreshCw className={`h-3.5 w-3.5  ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center flex-1 py-10">
          <Loader2 className="h-7 w-7 animate-spin text-red-500" />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center flex-1 py-10 gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-sm text-muted-foreground">
            {isRTL ? "تعذّر جلب بيانات المخالفات" : "Failed to fetch fines data"}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3 px-5 py-4 flex-1">
          <div className="flex items-center gap-4">
            <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-md">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-0.5">
                {isRTL ? "إجمالي مبلغ الغرامات" : "Total Fines Amount"}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 leading-tight tracking-tight">
                {totalFine.toLocaleString()}
                <span className="text-sm font-medium  ms-1">
                  {isRTL ? "د.إ" : "AED"}
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
            <div className="text-center">
              <p className="text-base font-bold ">{tickets.length}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? "إجمالي المخالفات" : "Total Tickets"}</p>
            </div>
            <div className="text-center border-x border-border/40">
              <p className="text-base font-bold text-emerald-600">{payableCount}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? "قابلة للدفع" : "Payable"}</p>
            </div>
            <div className="text-center flex-col items-center justify-center">
              <p className="text-base text-center font-bold text-red-600">{notPayableCount}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? "غير قابلة للدفع" : "Not Payable"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Home ───────────────────────────────────────────────────────────────── */
function Home() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SALIK_CACHE_KEY = "salik-balance-cache";
  const [salikData, setSalikData] = useState(null);
  const [salikLoading, setSalikLoading] = useState(true);
  const [salikError, setSalikError] = useState(false);

  const fetchSalikFromAPI = useCallback(async (updateCache = true) => {
    setSalikLoading(true);
    setSalikError(false);
    try {
      const result = await getSalikBalance();
      const data = result?.data ?? null;
      setSalikData(data);
      if (updateCache && data) {
        localStorage.setItem(SALIK_CACHE_KEY, JSON.stringify(data));
      }
    } catch {
      setSalikError(true);
    } finally {
      setSalikLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(SALIK_CACHE_KEY);
      if (cached) {
        setSalikData(JSON.parse(cached));
        setSalikLoading(false);
        return;
      }
    } catch {
      // corrupted cache — fall through to fetch
    }
    fetchSalikFromAPI(true);
  }, [fetchSalikFromAPI]);

  const mutateSalik = () => fetchSalikFromAPI(true);

  const { data: finesResult, error: finesErr, isLoading: finesLoading, mutate: mutateFines } = useSWR(
    "fines",
    getFines,
    { revalidateOnFocus: false }
  );
  const finesData = finesResult?.data ?? null;
  const finesError = !!finesErr;

  const formatCurrency = useCallback(
    (amount) =>
      new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-AE", {
        style: "currency", currency: "AED", minimumFractionDigits: 0,
        notation: "compact", compactDisplay: "short",
      }).format(amount || 0),
    [language]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getDashboardStats();
        if (cancelled) return;
        result.success ? setStats(result.data) : setError(result.message || t("dashboard.errorLoading"));
      } catch {
        if (!cancelled) setError(t("dashboard.errorLoading"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-5 w-32" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[1,2,3,4].map(j => <Skeleton key={j} className="h-14 rounded-xl" />)}
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="p-4">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          {t("dashboard.retry")}
        </button>
      </div>
    </div>
  );

  const sections = [
    {
      title: t("dashboard.sections.clientsContracts"),
      cards: [
        { label: t("dashboard.totalClients"), value: stats?.clients?.total || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
        { label: t("dashboard.totalContracts"), value: stats?.contracts?.total || 0, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
        { label: t("dashboard.activeContracts"), value: stats?.contracts?.active || 0, icon: FileCheck, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
        { label: t("dashboard.contractsThisMonth"), value: stats?.contracts?.thisMonth || 0, icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
      ],
    },
    {
      title: t("dashboard.sections.invoices"),
      cards: [
        { label: t("dashboard.totalInvoices"), value: stats?.invoices?.total || 0, icon: Receipt, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
        { label: t("dashboard.paidInvoices"), value: stats?.invoices?.paid || 0, icon: CircleCheck, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
        { label: t("dashboard.unpaidInvoices"), value: stats?.invoices?.unpaid || 0, icon: CircleX, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
        { label: t("dashboard.invoicesPaidAmount"), value: formatCurrency(stats?.invoices?.paidAmount), icon: CircleDollarSign, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
      ],
    },
    {
      title: t("dashboard.sections.payments"),
      cards: [
        { label: t("dashboard.totalPaymentsAmount"), value: formatCurrency(stats?.payments?.totalAmount), icon: BadgeDollarSign, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
        { label: t("dashboard.totalCash"), value: formatCurrency(stats?.payments?.totalCash), icon: Banknote, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950" },
        { label: t("dashboard.totalCredit"), value: formatCurrency(stats?.payments?.totalCredit), icon: CreditCard, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
        { label: t("dashboard.incomeToday"), value: formatCurrency(stats?.income?.today), icon: ArrowUpRight, color: "text-lime-600", bg: "bg-lime-50 dark:bg-lime-950" },
      ],
    },
    {
      title: t("dashboard.sections.income"),
      cards: [
        { label: t("dashboard.incomeThisMonth"), value: formatCurrency(stats?.income?.thisMonth), icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950" },
        { label: t("dashboard.expensesThisMonth"), value: formatCurrency(stats?.expenses?.thisMonth), icon: ArrowDownRight, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
        { label: t("dashboard.expensesToday"), value: formatCurrency(stats?.expenses?.today), icon: Clock, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
        { label: t("dashboard.totalExpenses"), value: formatCurrency(stats?.expenses?.total), icon: DollarSign, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950" },
      ],
    },
    {
      title: t("dashboard.sections.cars"),
      cards: [
        { label: t("dashboard.totalCars"), value: stats?.cars?.total || 0, icon: Car, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-950" },
        { label: t("dashboard.rentedCars"), value: stats?.cars?.rented || 0, icon: CarFront, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
        { label: t("dashboard.availableCars"), value: stats?.cars?.available || 0, icon: CircleCheck, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
        { label: t("dashboard.maintenanceCars"), value: stats?.cars?.maintenance || 0, icon: Wrench, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <h1 className="text-base font-semibold text-foreground">{t("dashboard.title")}</h1>
 {/* Accounts: Bank + Cash + Salik side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <BankAccountsSection
          title={t("dashboard.sections.bankAccounts")}
          accounts={stats?.bankAccounts}
          noDataLabel={t("dashboard.noBankAccounts")}
          formatCurrency={formatCurrency}
          t={t}
        />
        <CashSection
          title={t("dashboard.sections.cash")}
          cashAccount={stats?.cashAccount}
          noDataLabel={t("dashboard.noCashAccount")}
          formatCurrency={formatCurrency}
          t={t}
        />
        <SalikBalanceSection
          isRTL={language === "ar"}
          balance={salikData?.SalikCredit}
          isValid={salikData?.Valid}
          loading={salikLoading}
          error={salikError}
          onRefresh={mutateSalik}
        />
      <FinesSection
        isRTL={language === "ar"}
        finesData={finesData}
        loading={finesLoading}
        error={finesError}
        onRefresh={mutateFines}
      />
      </div>

   

  {/* Stat Sections */}
<div className="space-y-6">
  {sections.map((section, i) => (
    <Section key={i} index={i} {...section} />
  ))}
</div>

     

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Contracts */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
              <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-foreground">{t("dashboard.recentContracts")}</p>
            {stats?.recentContracts?.length > 0 && (
              <span className="ms-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                {stats.recentContracts.length}
              </span>
            )}
          </div>

          {stats?.recentContracts?.length > 0 ? (
            <div className="divide-y divide-border/30 flex-1">
              {stats.recentContracts.map((c) => {
                const statusStyle =
                  c.status === "active"    ? { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", dot: "bg-emerald-500" }
                  : c.status === "completed" ? { pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",         dot: "bg-blue-500" }
                  : c.status === "cancelled" ? { pill: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",             dot: "bg-red-500" }
                  :                            { pill: "bg-muted text-muted-foreground",                                            dot: "bg-border" };
                return (
                  <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                    {/* Avatar */}
                    <div className="shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{c.contract_number}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.customer_name} · {c.brand} {c.car_model}</p>
                    </div>
                    {/* Right side */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <p className="text-sm font-bold text-foreground">{formatCurrency(c.total_amount)}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.pill}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        {t(`dashboard.status.${c.status}`)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 flex-1">
              <div className="p-3 rounded-full bg-muted/50">
                <FileText className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">{t("dashboard.noRecentContracts")}</p>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
              <CircleDollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-foreground">{t("dashboard.recentPayments")}</p>
            {stats?.recentPayments?.length > 0 && (
              <span className="ms-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                {stats.recentPayments.length}
              </span>
            )}
          </div>

          {stats?.recentPayments?.length > 0 ? (
            <div className="divide-y divide-border/30 flex-1">
              {stats.recentPayments.map((p) => {
                const isCash = p.payment_method === "cash";
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                    {/* Avatar */}
                    <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-br ${isCash ? "from-teal-400 to-emerald-600" : "from-violet-500 to-purple-600"}`}>
                      {isCash
                        ? <Banknote className="h-4 w-4 text-white" />
                        : <CreditCard className="h-4 w-4 text-white" />}
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{p.invoice_number || `#${p.id}`}</p>
                      <p className="text-xs text-muted-foreground truncate">{t(`dashboard.paymentMethod.${p.payment_method}`)}</p>
                    </div>
                    {/* Right side */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(p.amount)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(p.payment_date).toLocaleDateString(language === "ar" ? "ar-AE" : "en-AE")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 flex-1">
              <div className="p-3 rounded-full bg-muted/50">
                <CircleDollarSign className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">{t("dashboard.noRecentPayments")}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;