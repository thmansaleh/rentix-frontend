"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useTranslations } from "@/hooks/useTranslations"
import { useLanguage } from "@/contexts/LanguageContext"
import { getBankAccountStatistics } from "@/app/services/api/bankAccounts"

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

export default function BankAccountsTransactions() {
  const { t } = useTranslations()
  const { language } = useLanguage()
  const [activeChart, setActiveChart] = React.useState("deposits")
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    // Default to current month
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [chartData, setChartData] = React.useState([])
  const [summary, setSummary] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const chartConfig = {
    deposits: {
      label: t('bankTransactions.deposits'),
      color: "#22c55e",
    },
    withdrawals: {
      label: t('bankTransactions.withdrawals'),
      color: "#ef4444",
    },
  }

  const fetchStatistics = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getBankAccountStatistics({ month: selectedMonth })
      if (response.success) {
        setChartData(response.data.chart_data || [])
        setSummary(response.data.summary || null)
      } else {
        setError(response.error || 'Failed to fetch statistics')
      }
    } catch (err) {
      console.error('Error fetching bank account statistics:', err)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  React.useEffect(() => {
    fetchStatistics()
  }, [selectedMonth])

  const total = React.useMemo(
    () => ({
      deposits: summary?.total_deposits || 0,
      withdrawals: summary?.total_withdrawals || 0,
    }),
    [summary]
  )

  // Get available months (last 12 months)
  const availableMonths = React.useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months.push(monthStr)
    }
    return months
  }, [])

  const formatCurrency = (amount) => {
    const locale = language === 'ar' ? 'ar-AE' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMonth = (monthStr) => {
    const locale = language === 'ar' ? 'ar-AE' : 'en-US'
    const date = new Date(monthStr + '-01')
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{t('bankTransactions.title')}</CardTitle>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonth(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            {loading ? t('bankTransactions.loading') : t('bankTransactions.description')}
          </CardDescription>
        </div>
        <div className="flex">
          {["deposits", "withdrawals"].map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {loading ? "..." : formatCurrency(total[key])}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {error ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            {error}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
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
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) => {
                      const locale = language === 'ar' ? 'ar-AE' : 'en-US'
                      return new Date(value).toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    formatter={(value) => [formatCurrency(value)]}
                  />
                }
              />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={chartConfig[activeChart].color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
