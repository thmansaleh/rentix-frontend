"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { TrendingUp, DollarSign, FileText, BarChart3, CheckCircle, Clock, XCircle } from "lucide-react"
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
  ChartConfig,
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

export default function Invoices() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState([])
  const [summary, setSummary] = React.useState({
    total_invoices: 0,
    total_amount: 0,
    average_amount: 0,
    approved_count: 0,
    approved_amount: 0,
    pending_count: 0,
    pending_amount: 0,
    rejected_count: 0,
    rejected_amount: 0
  })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const chartConfig = {
    amount: {
      label: t('invoices.amount'),
      color: "#3b82f6",
    },
  }

  const fetchStatistics = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Map timeRange to API period
      const periodMap = {
        "7d": "last_7_days",
        "30d": "last_30_days", 
        "90d": "last_90_days"
      }
      
      const params = {
        period: periodMap[timeRange] || "last_30_days"
      }
      
      const result = await getInvoiceStatistics(params)
      
      if (result.success) {
        setChartData(result.data.chart_data || [])
        setSummary(result.data.summary || {
          total_invoices: 0,
          total_amount: 0,
          average_amount: 0,
          approved_count: 0,
          approved_amount: 0,
          pending_count: 0,
          pending_amount: 0,
          rejected_count: 0,
          rejected_amount: 0
        })
      } else {
        setError(result.message || 'Failed to load data')
      }
    } catch (err) {
      console.error("Error fetching invoice statistics:", err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  React.useEffect(() => {
    fetchStatistics()
  }, [timeRange])

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return []
    
    const days = parseInt(timeRange.replace('d', ''))
    return chartData.slice(-days)
  }, [chartData, timeRange])

  const formatCurrency = (amount) => {
    const locale = language === 'ar' ? 'ar-AE' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('invoices.totalAmount')}</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summary.total_amount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_invoices || 0} {t('invoices.invoices')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('invoices.approvedInvoices')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.approved_amount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.approved_count || 0} {t('invoices.invoices')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('invoices.pendingInvoices')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(summary.pending_amount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.pending_count || 0} {t('invoices.invoices')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('invoices.averageAmount')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(summary.average_amount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('invoices.perInvoice')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Card */}
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{t('invoices.statistics')}</CardTitle>
            <CardDescription>
              {loading ? t('common.loading') : 
               error ? error :
               t('invoices.showingInvoices')}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label={t('invoices.selectTimePeriod')}
            >
              <SelectValue placeholder={t('invoices.last30Days')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                {t('invoices.last7Days')}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t('invoices.last30Days')}
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                {t('invoices.last3Months')}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">{t('invoices.loadingData')}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center text-red-600">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">{t('invoices.noDataAvailable')}</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={filteredData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    const locale = language === 'ar' ? 'ar-AE' : 'en-US'
                    return date.toLocaleDateString(locale, {
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
                        const locale = language === 'ar' ? 'ar-AE' : 'en-US'
                        return new Date(value).toLocaleDateString(locale, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                      formatter={(value) => {
                        return [formatCurrency(value), t('invoices.amount')]
                      }}
                      indicator="line"
                    />
                  }
                />
                <Line
                  dataKey="amount"
                  type="monotone"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-amount)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
