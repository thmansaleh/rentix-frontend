"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getDashboardStats } from "@/app/services/api/dashboard";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  FileCheck,
  Receipt,
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,
  Car,
  CarFront,
  Wrench,
  CircleCheck,
  CircleDollarSign,
  CircleX,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BadgeDollarSign,
} from "lucide-react";

function Home() {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = useCallback(
    (amount) => {
      return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-AE", {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 2,
      }).format(amount || 0);
    },
    [language]
  );

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getDashboardStats();
        if (cancelled) return;
        if (result.success) {
          setStats(result.data);
        } else {
          setError(result.message || t("dashboard.errorLoading"));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching dashboard stats:", err);
          setError(t("dashboard.errorLoading"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center text-destructive">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              {t("dashboard.retry")}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = [
    {
      title: t("dashboard.sections.clientsContracts"),
      cards: [
        {
          label: t("dashboard.totalClients"),
          value: stats?.clients?.total || 0,
          icon: Users,
          color: "text-blue-600",
          bg: "bg-blue-50 dark:bg-blue-950",
        },
        {
          label: t("dashboard.totalContracts"),
          value: stats?.contracts?.total || 0,
          icon: FileText,
          color: "text-indigo-600",
          bg: "bg-indigo-50 dark:bg-indigo-950",
        },
        {
          label: t("dashboard.activeContracts"),
          value: stats?.contracts?.active || 0,
          icon: FileCheck,
          color: "text-green-600",
          bg: "bg-green-50 dark:bg-green-950",
        },
        {
          label: t("dashboard.contractsThisMonth"),
          value: stats?.contracts?.thisMonth || 0,
          icon: CalendarDays,
          color: "text-purple-600",
          bg: "bg-purple-50 dark:bg-purple-950",
        },
      ],
    },
    {
      title: t("dashboard.sections.invoices"),
      cards: [
        {
          label: t("dashboard.totalInvoices"),
          value: stats?.invoices?.total || 0,
          icon: Receipt,
          color: "text-orange-600",
          bg: "bg-orange-50 dark:bg-orange-950",
        },
        {
          label: t("dashboard.paidInvoices"),
          value: stats?.invoices?.paid || 0,
          icon: CircleCheck,
          color: "text-green-600",
          bg: "bg-green-50 dark:bg-green-950",
        },
        {
          label: t("dashboard.unpaidInvoices"),
          value: stats?.invoices?.unpaid || 0,
          icon: CircleX,
          color: "text-red-600",
          bg: "bg-red-50 dark:bg-red-950",
        },
        {
          label: t("dashboard.invoicesPaidAmount"),
          value: formatCurrency(stats?.invoices?.paidAmount),
          icon: CircleDollarSign,
          color: "text-emerald-600",
          bg: "bg-emerald-50 dark:bg-emerald-950",
          isCurrency: true,
        },
      ],
    },
    {
      title: t("dashboard.sections.payments"),
      cards: [
        {
          label: t("dashboard.totalPaymentsAmount"),
          value: formatCurrency(stats?.payments?.totalAmount),
          icon: BadgeDollarSign,
          color: "text-green-600",
          bg: "bg-green-50 dark:bg-green-950",
          isCurrency: true,
        },
        {
          label: t("dashboard.totalCash"),
          value: formatCurrency(stats?.payments?.totalCash),
          icon: Banknote,
          color: "text-teal-600",
          bg: "bg-teal-50 dark:bg-teal-950",
          isCurrency: true,
        },
        {
          label: t("dashboard.totalCredit"),
          value: formatCurrency(stats?.payments?.totalCredit),
          icon: CreditCard,
          color: "text-violet-600",
          bg: "bg-violet-50 dark:bg-violet-950",
          isCurrency: true,
        },
        {
          label: t("dashboard.incomeToday"),
          value: formatCurrency(stats?.income?.today),
          icon: ArrowUpRight,
          color: "text-lime-600",
          bg: "bg-lime-50 dark:bg-lime-950",
          isCurrency: true,
        },
      ],
    },
    {
      title: t("dashboard.sections.income"),
      cards: [
        {
          label: t("dashboard.incomeThisMonth"),
          value: formatCurrency(stats?.income?.thisMonth),
          icon: TrendingUp,
          color: "text-cyan-600",
          bg: "bg-cyan-50 dark:bg-cyan-950",
          isCurrency: true,
        },
        {
          label: t("dashboard.expensesThisMonth"),
          value: formatCurrency(stats?.expenses?.thisMonth),
          icon: ArrowDownRight,
          color: "text-red-600",
          bg: "bg-red-50 dark:bg-red-950",
          isCurrency: true,
        },
        {
          label: t("dashboard.expensesToday"),
          value: formatCurrency(stats?.expenses?.today),
          icon: Clock,
          color: "text-orange-600",
          bg: "bg-orange-50 dark:bg-orange-950",
          isCurrency: true,
        },
        {
          label: t("dashboard.totalExpenses"),
          value: formatCurrency(stats?.expenses?.total),
          icon: DollarSign,
          color: "text-rose-600",
          bg: "bg-rose-50 dark:bg-rose-950",
          isCurrency: true,
        },
      ],
    },
    {
      title: t("dashboard.sections.cars"),
      cards: [
        {
          label: t("dashboard.totalCars"),
          value: stats?.cars?.total || 0,
          icon: Car,
          color: "text-slate-600",
          bg: "bg-slate-50 dark:bg-slate-950",
        },
        {
          label: t("dashboard.rentedCars"),
          value: stats?.cars?.rented || 0,
          icon: CarFront,
          color: "text-blue-600",
          bg: "bg-blue-50 dark:bg-blue-950",
        },
        {
          label: t("dashboard.availableCars"),
          value: stats?.cars?.available || 0,
          icon: CircleCheck,
          color: "text-green-600",
          bg: "bg-green-50 dark:bg-green-950",
        },
        {
          label: t("dashboard.maintenanceCars"),
          value: stats?.cars?.maintenance || 0,
          icon: Wrench,
          color: "text-amber-600",
          bg: "bg-amber-50 dark:bg-amber-950",
        },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.cards.map((card, cIdx) => {
              const Icon = card.icon;
              return (
                <Card
                  key={cIdx}
                  className="hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {card.label}
                        </p>
                        <p className="text-2xl font-bold tracking-tight">
                          {card.isCurrency ? card.value : card.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-xl ${card.bg}`}
                      >
                        <Icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contracts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("dashboard.recentContracts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentContracts?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {contract.contract_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contract.customer_name} •{" "}
                        {contract.brand} {contract.car_model}
                      </p>
                    </div>
                    <div className="text-end space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          contract.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : contract.status === "completed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : contract.status === "cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {t(`dashboard.status.${contract.status}`)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(contract.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("dashboard.noRecentContracts")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("dashboard.recentPayments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentPayments?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {payment.invoice_number || `#${payment.id}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`dashboard.paymentMethod.${payment.payment_method}`)}
                      </p>
                    </div>
                    <div className="text-end space-y-1">
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.payment_date).toLocaleDateString(
                          language === "ar" ? "ar-AE" : "en-AE"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("dashboard.noRecentPayments")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;