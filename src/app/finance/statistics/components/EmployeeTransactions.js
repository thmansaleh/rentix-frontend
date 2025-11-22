"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { TrendingUp, TrendingDown, ArrowUpDown, Activity } from "lucide-react"
import { getEmployeeCashTransactionStatistics } from "@/app/services/api/employeeCashTransactions"
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
  ChartLegend,
  ChartLegendContent,
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


export default function EmployeeTransactions() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState([])
  const [summary, setSummary] = React.useState({
    total_credit: 0,
    total_debit: 0,
    net_amount: 0,
    total_transactions: 0
  })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const chartConfig = {
    credit: {
      label: t('employeeTransactions.credit'),
      color: "#22c55e",
    },
    debit: {
      label: t('employeeTransactions.debit'),
      color: "#ef4444",
    },
  }

  const fetchStatistics = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Map timeRange to API period
      const periodMap = {
        "7d": "last_month",
        "30d": "last_month", 
        "90d": "last_3_months"
      }
      
      const params = {
        period: periodMap[timeRange] || "last_month",
        type: "both",
        group_by: "day"
      }
      
      const result = await getEmployeeCashTransactionStatistics(params)
      
      if (result.success) {
        setChartData(result.data.chart_data || [])
        setSummary(result.data.summary || {
          total_credit: 0,
          total_debit: 0,
          net_amount: 0,
          total_transactions: 0
        })
      } else {
        setError(result.message || t('common.errorLoading'))
      }
    } catch (err) {
      console.error("Error fetching statistics:", err)
      setError(t('common.errorLoading'))
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
            <CardTitle className="text-sm font-medium">{t('employeeTransactions.totalCredits')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.total_credit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_credit_count || 0} {t('employeeTransactions.transaction')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('employeeTransactions.totalDebits')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.total_debit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.total_debit_count || 0} {t('employeeTransactions.transaction')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('employeeTransactions.netBalance')}</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.net_amount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(summary.net_amount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('employeeTransactions.netDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('employeeTransactions.totalTransactions')}</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summary.total_transactions || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('employeeTransactions.completeTransactions')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Card */}
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>{t('employeeTransactions.statistics')}</CardTitle>
            <CardDescription>
              {loading ? t('common.loading') : 
               error ? error :
               t('employeeTransactions.showingTransactions')}
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange} disabled={loading}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label={t('employeeTransactions.selectTimePeriod')}
            >
              <SelectValue placeholder={t('employeeTransactions.last30Days')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                {t('employeeTransactions.last7Days')}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t('employeeTransactions.last30Days')}
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                {t('employeeTransactions.last3Months')}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {loading ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">{t('employeeTransactions.loadingData')}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="text-center text-red-600">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px]">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">{t('employeeTransactions.noDataAvailable')}</p>
              </div>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillCredit" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-credit)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-credit)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillDebit" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-debit)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-debit)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
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
                      formatter={(value, name) => {
                        return [formatCurrency(value), name === "credit" ? t('employeeTransactions.credit') : t('employeeTransactions.debit')]
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="credit"
                  type="natural"
                  fill="url(#fillCredit)"
                  stroke="var(--color-credit)"
                  stackId="a"
                />
                <Area
                  dataKey="debit"
                  type="natural"
                  fill="url(#fillDebit)"
                  stroke="var(--color-debit)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
