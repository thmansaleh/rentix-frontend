"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "يناير", revenue: 45000, target: 50000 },
  { month: "فبراير", revenue: 52000, target: 55000 },
  { month: "مارس", revenue: 48000, target: 50000 },
  { month: "أبريل", revenue: 61000, target: 60000 },
  { month: "مايو", revenue: 55000, target: 58000 },
  { month: "يونيو", revenue: 67000, target: 65000 },
  { month: "يوليو", revenue: 72000, target: 70000 },
  { month: "أغسطس", revenue: 69000, target: 72000 },
  { month: "سبتمبر", revenue: 74000, target: 75000 },
  { month: "أكتوبر", revenue: 71000, target: 73000 },
  { month: "نوفمبر", revenue: 78000, target: 80000 },
  { month: "ديسمبر", revenue: 82000, target: 85000 }
]

const chartConfig = {
  revenue: {
    label: "الإيرادات الفعلية",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "الهدف المطلوب",
    color: "hsl(var(--chart-2))",
  },
}

export default function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickLine={false}
            axisLine={false}
            className="text-xs"
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            className="text-xs"
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent 
                formatter={(value, name) => [
                  `${value.toLocaleString()}`,
                  chartConfig[name]?.label || name,
                ]}
              />
            }
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="target"
            fill="var(--color-target)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
