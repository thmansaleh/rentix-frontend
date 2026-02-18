"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { DollarSign, BarChart3, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { getInvoiceStatistics } from "@/app/services/api/invoices"
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
  total_invoices: 0,
  total_amount: 0,
  average_amount: 0,
  total_paid: 0,
  total_unpaid: 0,
  paid_count: 0,
  paid_amount: 0,
  unpaid_count: 0,
  unpaid_amount: 0,
  partial_count: 0,
  partial_amount: 0,
}

const PERIOD_MAP = {
  "7d": "last_7_days",
  "30d": "last_30_days",
  "90d": "last_3_months",
}

export default function InvoiceStatistics() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState([])
  const [summary, setSummary] = React.useState(DEFAULT_SUMMARY)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const chartConfig = {
    amount: {
      label: t("invoices.amount"),
      color: "#3b82f6",
    },
  }

  React.useEffect(() => {
    let cancelled = false

    const fetchStatistics = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await getInvoiceStatistics({
          period: PERIOD_MAP[timeRange] || "last_30_days",
        })

        if (cancelled) return

        if (result.success) {
          setChartData(result.data.chart_data || [])
          setSummary({ ...DEFAULT_SUMMARY, ...result.data.summary })
        } else {
          setError(result.message || t("invoices.noDataAvailable"))
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching invoice statistics:", err)
          setError(t("invoices.noDataAvailable"))
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
        title: t("invoices.totalAmount"),
        value: formatCurrency(summary.total_amount),
        subtitle: `${summary.total_invoices || 0} ${t("invoices.invoices")}`,
        icon: DollarSign,
        color: "text-blue-600",
      },
      {
        title: t("invoices.paidInvoices"),
        value: formatCurrency(summary.paid_amount),
        subtitle: `${summary.paid_count || 0} ${t("invoices.invoices")}`,
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        title: t("invoices.unpaidInvoices"),
        value: formatCurrency(summary.unpaid_amount),
        subtitle: `${summary.unpaid_count || 0} ${t("invoices.invoices")}`,
        icon: Clock,
        color: "text-red-600",
      },
      {
        title: t("invoices.partialInvoices"),
        value: formatCurrency(summary.partial_amount),
        subtitle: `${summary.partial_count || 0} ${t("invoices.invoices")}`,
        icon: AlertTriangle,
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
            <CardTitle>{t("invoices.statistics")}</CardTitle>
            <CardDescription>
              {loading
                ? t("invoices.loadingData")
                : error
                  ? error
                  : t("invoices.showingInvoices")}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label={t("invoices.selectTimePeriod")}
            >
              <SelectValue placeholder={t("invoices.last30Days")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                {t("invoices.last7Days")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("invoices.last30Days")}
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                {t("invoices.last3Months")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("invoices.loadingData")}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-sm text-muted-foreground">{t("invoices.noDataAvailable")}</p>
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
                      formatter={(value) => [formatCurrency(value), t("invoices.amount")]}
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
