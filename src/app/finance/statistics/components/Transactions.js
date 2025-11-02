"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useTranslations } from '@/hooks/useTranslations'

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
import { getAllEmployeeCashTransactions } from "@/app/services/api/employeeCashTransactions"

export const description = "An interactive area chart" 

export default function Transactions() {
  const t = useTranslations('financeStatistics')
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const chartConfig = {
    income: {
      label: t('incomeCredit'),
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: t('expensesDebit'),
      color: "hsl(var(--chart-2))",
    },
  }

  React.useEffect(() => {
    fetchTransactions()
  }, [timeRange])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      
      // Calculate date range
      const today = new Date()
      const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const startDate = new Date(today)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      
      const formatDate = (date) => {
        return date.toISOString().split('T')[0]
      }

      console.log('Fetching transactions from:', formatDate(startDate), 'to:', formatDate(today))

      // Fetch all transactions without pagination (remove date filters for now)
      const response = await getAllEmployeeCashTransactions({
        limit: 10000 // Get all transactions
      })

      console.log('API Response:', response)
      console.log('Response data length:', response?.data?.length)

      if (response.success && response.data) {
        // Group transactions by date
        const groupedData = {}
        
        response.data.forEach(transaction => {
          // Handle date format: "2025-11-02 14:06:22" -> "2025-11-02"
          const date = transaction.created_at?.split(' ')[0]
          if (!date) return
          
          if (!groupedData[date]) {
            groupedData[date] = { date, income: 0, expenses: 0 }
          }
          
          const amount = parseFloat(transaction.amount) || 0
          if (transaction.type === 'credit') {
            groupedData[date].income += amount
          } else if (transaction.type === 'debit') {
            groupedData[date].expenses += amount
          }
        })

        // Convert to array and sort by date
        const chartArray = Object.values(groupedData).sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        )

        // Fill in missing dates with zero values
        const filledData = []
        let currentDate = new Date(startDate)
        const endDate = new Date(today)
        
        while (currentDate <= endDate) {
          const dateStr = formatDate(currentDate)
          const existing = chartArray.find(item => item.date === dateStr)
          
          if (existing) {
            filledData.push(existing)
          } else {
            filledData.push({ date: dateStr, income: 0, expenses: 0 })
          }
          
          currentDate.setDate(currentDate.getDate() + 1)
        }

        console.log('Final chart data:', filledData)
        setChartData(filledData)
      } else {
        console.log('No success or no data in response')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setChartData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{t('transactionsOverview')}</CardTitle>
          <CardDescription>
            {t('transactionsDescription')}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder={t('last3Months')} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              {t('last3Months')}
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              {t('last30Days')}
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              {t('last7Days')}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">{t('loadingTransactions')}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">{t('noTransactionsForPeriod')}</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-expenses)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-expenses)"
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
                  return date.toLocaleDateString("en-US", {
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
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    }}
                    formatter={(value) => {
                      return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(value)
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="income"
                type="natural"
                fill="url(#fillIncome)"
                stroke="var(--color-income)"
                stackId="a"
              />
              <Area
                dataKey="expenses"
                type="natural"
                fill="url(#fillExpenses)"
                stroke="var(--color-expenses)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
