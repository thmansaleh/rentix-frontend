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

/* ─── Section Card ───────────────────────────────────────────────────────── */
function SectionCard({ title, icon: Icon, iconBg, iconColor, gradientFrom, gradientTo, primaryLabel, primaryValue, primaryColor, stats }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 flex-1">
        <div className="flex items-center gap-4">
          <div className={`shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-0.5">{primaryLabel}</p>
            <p className={`text-2xl font-bold ${primaryColor} leading-tight tracking-tight`}>{primaryValue}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
          {stats.map((stat, i) => (
            <div key={i} className={`text-center ${i > 0 ? "border-l border-border/40" : ""}`}>
              <p className={`text-base font-bold ${stat.color || ""}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
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

/* ─── Cars Section ──────────────────────────────────────────────────────── */
function CarsSection({ isRTL, carsData, t }) {
  const total = carsData?.total || 0;
  const rented = carsData?.rented || 0;
  const available = carsData?.available || 0;
  const maintenance = carsData?.maintenance || 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60">
          <Car className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </div>
        <p className="text-sm font-semibold text-foreground">{t("dashboard.sections.cars")}</p>
        <span className="ms-auto text-sm font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          {total}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 flex-1">
        <div className="flex items-center gap-4">
          <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-md">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-0.5">{t("dashboard.totalCars")}</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 leading-tight tracking-tight">{total}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
          <div className="text-center">
            <p className="text-base font-bold text-blue-600">{rented}</p>
            <p className="text-sm text-muted-foreground">{t("dashboard.rentedCars")}</p>
          </div>
          <div className="text-center border-x border-border/40">
            <p className="text-base font-bold text-emerald-600">{available}</p>
            <p className="text-sm text-muted-foreground">{t("dashboard.availableCars")}</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-amber-600">{maintenance}</p>
            <p className="text-sm text-muted-foreground">{t("dashboard.maintenanceCars")}</p>
          </div>
        </div>
      </div>
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



  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <h1 className="text-base font-semibold text-foreground">{t("dashboard.title")}</h1>
 {/* Accounts: Bank + Cash + Salik side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
           <CarsSection
          isRTL={language === "ar"}
          carsData={stats?.cars}
          t={t}
        />
       <SectionCard
          title={t("dashboard.sections.clientsContracts")}
          icon={Users}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          iconColor="text-blue-600 dark:text-blue-400"
          gradientFrom="from-blue-500"
          gradientTo="to-indigo-600"
          primaryLabel={t("dashboard.totalClients")}
          primaryValue={stats?.clients?.total || 0}
          primaryColor="text-blue-700 dark:text-blue-300"
          stats={[
            { label: t("dashboard.totalContracts"), value: stats?.contracts?.total || 0 },
            { label: t("dashboard.activeContracts"), value: stats?.contracts?.active || 0, color: "text-emerald-600" },
            { label: t("dashboard.contractsThisMonth"), value: stats?.contracts?.thisMonth || 0, color: "text-purple-600" },
          ]}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       
          <BankAccountsSection
          title={t("dashboard.sections.bankAccounts")}
          accounts={stats?.bankAccounts}
          noDataLabel={t("dashboard.noBankAccounts")}
          formatCurrency={formatCurrency}
          t={t}
        />
        <SectionCard
          title={t("dashboard.sections.invoices")}
          icon={Receipt}
          iconBg="bg-orange-100 dark:bg-orange-900/40"
          iconColor="text-orange-600 dark:text-orange-400"
          gradientFrom="from-orange-400"
          gradientTo="to-amber-600"
          primaryLabel={t("dashboard.invoicesPaidAmount")}
          primaryValue={formatCurrency(stats?.invoices?.paidAmount)}
          primaryColor="text-orange-700 dark:text-orange-300"
          stats={[
            { label: t("dashboard.totalInvoices"), value: stats?.invoices?.total || 0 },
            { label: t("dashboard.paidInvoices"), value: stats?.invoices?.paid || 0, color: "text-emerald-600" },
            { label: t("dashboard.unpaidInvoices"), value: stats?.invoices?.unpaid || 0, color: "text-red-600" },
          ]}
        />
        <SectionCard
          title={t("dashboard.sections.payments")}
          icon={BadgeDollarSign}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
          gradientFrom="from-emerald-400"
          gradientTo="to-green-600"
          primaryLabel={t("dashboard.totalPaymentsAmount")}
          primaryValue={formatCurrency(stats?.payments?.totalAmount)}
          primaryColor="text-emerald-700 dark:text-emerald-300"
          stats={[
            { label: t("dashboard.totalCash"), value: formatCurrency(stats?.payments?.totalCash), color: "text-teal-600" },
            { label: t("dashboard.totalCredit"), value: formatCurrency(stats?.payments?.totalCredit), color: "text-violet-600" },
            { label: t("dashboard.incomeToday"), value: formatCurrency(stats?.income?.today), color: "text-lime-600" },
          ]}
        />
        <SectionCard
          title={t("dashboard.sections.income")}
          icon={TrendingUp}
          iconBg="bg-cyan-100 dark:bg-cyan-900/40"
          iconColor="text-cyan-600 dark:text-cyan-400"
          gradientFrom="from-cyan-400"
          gradientTo="to-blue-600"
          primaryLabel={t("dashboard.incomeThisMonth")}
          primaryValue={formatCurrency(stats?.income?.thisMonth)}
          primaryColor="text-cyan-700 dark:text-cyan-300"
          stats={[
            { label: t("dashboard.expensesThisMonth"), value: formatCurrency(stats?.expenses?.thisMonth), color: "text-red-600" },
            { label: t("dashboard.expensesToday"), value: formatCurrency(stats?.expenses?.today), color: "text-orange-600" },
            { label: t("dashboard.totalExpenses"), value: formatCurrency(stats?.expenses?.total), color: "text-rose-600" },
          ]}
        />
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