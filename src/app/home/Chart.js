"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useState } from "react"

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

export const description = "An interactive area chart"

const chartData = [
  { date: "2025-04-01", contractCount: 5, clientCount: 2 },
  { date: "2025-04-02", contractCount: 10, clientCount: 4 },
  { date: "2025-04-03", contractCount: 15, clientCount: 6 },
  { date: "2025-04-04", contractCount: 20, clientCount: 8 },
  { date: "2025-04-05", contractCount: 25, clientCount: 10 },
  { date: "2025-04-06", contractCount: 30, clientCount: 12 },
  { date: "2025-04-07", contractCount: 35, clientCount: 14 },
  { date: "2025-04-08", contractCount: 40, clientCount: 15 },
  { date: "2025-04-09", contractCount: 38, clientCount: 13 },
  { date: "2025-04-10", contractCount: 36, clientCount: 12 },
  { date: "2025-04-11", contractCount: 34, clientCount: 11 },
  { date: "2025-04-12", contractCount: 32, clientCount: 10 },
  { date: "2025-04-13", contractCount: 30, clientCount: 9 },
  { date: "2025-04-14", contractCount: 28, clientCount: 8 },
  { date: "2025-04-15", contractCount: 26, clientCount: 7 },
  { date: "2025-04-16", contractCount: 24, clientCount: 6 },
  { date: "2025-04-17", contractCount: 22, clientCount: 5 },
  { date: "2025-04-18", contractCount: 20, clientCount: 4 },
  { date: "2025-04-19", contractCount: 18, clientCount: 3 },
  { date: "2025-04-20", contractCount: 16, clientCount: 2 },
  { date: "2025-04-21", contractCount: 14, clientCount: 1 },
  { date: "2025-04-22", contractCount: 12, clientCount: 3 },
  { date: "2025-04-23", contractCount: 10, clientCount: 5 },
  { date: "2025-04-24", contractCount: 8, clientCount: 7 },
  { date: "2025-04-25", contractCount: 6, clientCount: 9 },
  { date: "2025-04-26", contractCount: 4, clientCount: 11 },
  { date: "2025-04-27", contractCount: 2, clientCount: 13 },
  { date: "2025-04-28", contractCount: 1, clientCount: 15 },
  { date: "2025-04-29", contractCount: 3, clientCount: 14 },
  { date: "2025-04-30", contractCount: 5, clientCount: 13 },
  { date: "2025-05-01", contractCount: 7, clientCount: 12 },
  { date: "2025-05-02", contractCount: 9, clientCount: 11 },
  { date: "2025-05-03", contractCount: 11, clientCount: 10 },
  { date: "2025-05-04", contractCount: 13, clientCount: 9 },
  { date: "2025-05-05", contractCount: 15, clientCount: 8 },
  { date: "2025-05-06", contractCount: 17, clientCount: 7 },
  { date: "2025-05-07", contractCount: 19, clientCount: 6 },
  { date: "2025-05-08", contractCount: 21, clientCount: 5 },
  { date: "2025-05-09", contractCount: 23, clientCount: 4 },
  { date: "2025-05-10", contractCount: 25, clientCount: 3 },
  { date: "2025-05-11", contractCount: 27, clientCount: 2 },
  { date: "2025-05-12", contractCount: 29, clientCount: 1 },
  { date: "2025-05-13", contractCount: 31, clientCount: 3 },
  { date: "2025-05-14", contractCount: 33, clientCount: 5 },
  { date: "2025-05-15", contractCount: 35, clientCount: 7 },
  { date: "2025-05-16", contractCount: 37, clientCount: 9 },
  { date: "2025-05-17", contractCount: 39, clientCount: 11 },
  { date: "2025-05-18", contractCount: 40, clientCount: 13 },
  { date: "2025-05-19", contractCount: 38, clientCount: 15 },
  { date: "2025-05-20", contractCount: 36, clientCount: 14 },
  { date: "2025-05-21", contractCount: 34, clientCount: 13 },
  { date: "2025-05-22", contractCount: 32, clientCount: 12 },
  { date: "2025-05-23", contractCount: 30, clientCount: 11 },
  { date: "2025-05-24", contractCount: 28, clientCount: 10 },
  { date: "2025-05-25", contractCount: 26, clientCount: 9 },
  { date: "2025-05-26", contractCount: 24, clientCount: 8 },
  { date: "2025-05-27", contractCount: 22, clientCount: 7 },
  { date: "2025-05-28", contractCount: 20, clientCount: 6 },
  { date: "2025-05-29", contractCount: 18, clientCount: 5 },
  { date: "2025-05-30", contractCount: 16, clientCount: 4 },
  { date: "2025-05-31", contractCount: 14, clientCount: 3 },
  { date: "2025-06-01", contractCount: 12, clientCount: 2 },
  { date: "2025-06-02", contractCount: 10, clientCount: 1 },
  { date: "2025-06-03", contractCount: 8, clientCount: 3 },
  { date: "2025-06-04", contractCount: 6, clientCount: 5 },
  { date: "2025-06-05", contractCount: 4, clientCount: 7 },
  { date: "2025-06-06", contractCount: 2, clientCount: 9 },
  { date: "2025-06-07", contractCount: 1, clientCount: 11 },
  { date: "2025-06-08", contractCount: 3, clientCount: 13 },
  { date: "2025-06-09", contractCount: 5, clientCount: 15 },
  { date: "2025-06-10", contractCount: 7, clientCount: 14 },
  { date: "2025-06-11", contractCount: 9, clientCount: 13 },
  { date: "2025-06-12", contractCount: 11, clientCount: 12 },
  { date: "2025-06-13", contractCount: 13, clientCount: 11 },
  { date: "2025-06-14", contractCount: 15, clientCount: 10 },
  { date: "2025-06-15", contractCount: 17, clientCount: 9 },
  { date: "2025-06-16", contractCount: 19, clientCount: 8 },
  { date: "2025-06-17", contractCount: 21, clientCount: 7 },
  { date: "2025-06-18", contractCount: 23, clientCount: 6 },
  { date: "2025-06-19", contractCount: 25, clientCount: 5 },
  { date: "2025-06-20", contractCount: 27, clientCount: 4 },
  { date: "2025-06-21", contractCount: 29, clientCount: 3 },
  { date: "2025-06-22", contractCount: 31, clientCount: 2 },
  { date: "2025-06-23", contractCount: 33, clientCount: 1 },
  { date: "2025-06-24", contractCount: 35, clientCount: 3 },
  { date: "2025-06-25", contractCount: 37, clientCount: 5 },
  { date: "2025-06-26", contractCount: 39, clientCount: 7 },
  { date: "2025-06-27", contractCount: 40, clientCount: 9 },
  { date: "2025-06-28", contractCount: 38, clientCount: 11 },
  { date: "2025-06-29", contractCount: 36, clientCount: 13 },
  { date: "2025-06-30", contractCount: 34, clientCount: 15 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  contractCount: {
    label: "عدد العقود",
    color: "var(--chart-1)",
  },
  clientCount: {
    label: " المدخول",
    color: "var(--chart-2)",
  },
} 

export function Chart() {
  const [timeRange, setTimeRange] = useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>مخطط بياني تفاعلي</CardTitle>
          <CardDescription>
            عرض عدد العقود و اجمالي المدخول لآخر ٣ أشهر
          </CardDescription>
        </div>
        <Select dir="rtl" value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="اختر فترة"
          >
            <SelectValue placeholder="آخر ٣ أشهر" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              آخر ٣ أشهر
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              آخر ٣٠ يوم
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              آخر ٧ أيام
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillContractCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-contractCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-contractCount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillClientCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clientCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clientCount)"
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
                return date.toLocaleDateString("ar-AE", {
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
                    return new Date(value).toLocaleDateString("AR-AE", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"

                />
              }
            />
            <Area
              dataKey="clientCount"
              type="natural"
              fill="url(#fillClientCount)"
              stroke="var(--color-clientCount)"
              stackId="a"
            />
            <Area
              dataKey="contractCount"
              type="natural"
              fill="url(#fillContractCount)"
              stroke="var(--color-contractCount)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}