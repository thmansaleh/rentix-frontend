"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { DollarSign, Banknote, CreditCard, Building2, Globe, Wallet } from "lucide-react"
import { getPaymentStatistics } from "@/app/services/api/invoices"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_SUMMARY = {
  total_payments: 0,
  total_amount: 0,
  average_amount: 0,
  cash_amount: 0,
  cash_count: 0,
  card_amount: 0,
  card_count: 0,
  bank_transfer_amount: 0,
  bank_transfer_count: 0,
  online_amount: 0,
  online_count: 0,
  wallet_amount: 0,
  wallet_count: 0,
}

const PERIOD_MAP = {
  "7d": "last_7_days",
  "30d": "last_30_days",
  "90d": "last_3_months",
}

export default function PaymentStatistics() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState([])
  const [summary, setSummary] = React.useState(DEFAULT_SUMMARY)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const chartConfig = {
    amount: {
      label: t("paymentStatistics.amount"),
      color: "#22c55e",
    },
  }

  React.useEffect(() => {
    let cancelled = false

    const fetchStatistics = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await getPaymentStatistics({
          period: PERIOD_MAP[timeRange] || "last_30_days",
        })

        if (cancelled) return

        if (result.success) {
          setChartData(result.data.chart_data || [])
          setSummary({ ...DEFAULT_SUMMARY, ...result.data.summary })
        } else {
          setError(result.message || t("paymentStatistics.noDataAvailable"))
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching payment statistics:", err)
          setError(t("paymentStatistics.noDataAvailable"))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStatistics()
    return () => { cancelled = true }
  }, [timeRange])

  const formatCurrency = React.useCallback(
    (amount) => {
      const locale = language === "ar" ? "ar-AE" : "en-US"
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount || 0)
    },
    [language]
  )

  const summaryCards = React.useMemo(
    () => [
      {
        title: t("paymentStatistics.totalPayments"),
        value: formatCurrency(summary.total_amount),
        subtitle: `${summary.total_payments || 0} ${t("paymentStatistics.payments")}`,
        icon: DollarSign,
        color: "text-blue-600",
      },
      {
        title: t("paymentStatistics.cashPayments"),
        value: formatCurrency(summary.cash_amount),
        subtitle: `${summary.cash_count || 0} ${t("paymentStatistics.payments")}`,
        icon: Banknote,
        color: "text-green-600",
      },
      {
        title: t("paymentStatistics.cardPayments"),
        value: formatCurrency(summary.card_amount),
        subtitle: `${summary.card_count || 0} ${t("paymentStatistics.payments")}`,
        icon: CreditCard,
        color: "text-purple-600",
      },
      {
        title: t("paymentStatistics.bankTransfer"),
        value: formatCurrency(summary.bank_transfer_amount),
        subtitle: `${summary.bank_transfer_count || 0} ${t("paymentStatistics.payments")}`,
        icon: Building2,
        color: "text-orange-600",
      },
    ],
    [summary, t, formatCurrency]
  )

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Card */}
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{t("paymentStatistics.title")}</CardTitle>
            <CardDescription>
              {loading
                ? t("paymentStatistics.loadingData")
                : error
                  ? error
                  : t("paymentStatistics.description")}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label={t("paymentStatistics.selectTimePeriod")}
            >
              <SelectValue placeholder={t("paymentStatistics.last30Days")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                {t("paymentStatistics.last7Days")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("paymentStatistics.last30Days")}
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                {t("paymentStatistics.last3Months")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("paymentStatistics.loadingData")}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-sm text-muted-foreground">{t("paymentStatistics.noDataAvailable")}</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const locale = language === "ar" ? "ar-AE" : "en-US"
                    return new Date(value).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const locale = language === "ar" ? "ar-AE" : "en-US"
                        return new Date(value).toLocaleDateString(locale, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                      formatter={(value) => [formatCurrency(value), t("paymentStatistics.amount")]}
                      indicator="line"
                    />
                  }
                />
                <Line
                  dataKey="amount"
                  type="monotone"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-amount)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
