"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "يناير", newCustomers: 45, returningCustomers: 120 },
  { month: "فبراير", newCustomers: 52, returningCustomers: 135 },
  { month: "مارس", newCustomers: 48, returningCustomers: 140 },
  { month: "أبريل", newCustomers: 61, returningCustomers: 158 },
  { month: "مايو", newCustomers: 55, returningCustomers: 165 },
  { month: "يونيو", newCustomers: 67, returningCustomers: 180 },
  { month: "يوليو", newCustomers: 72, returningCustomers: 195 },
  { month: "أغسطس", newCustomers: 69, returningCustomers: 200 },
  { month: "سبتمبر", newCustomers: 74, returningCustomers: 215 },
  { month: "أكتوبر", newCustomers: 71, returningCustomers: 225 },
  { month: "نوفمبر", newCustomers: 78, returningCustomers: 240 },
  { month: "ديسمبر", newCustomers: 82, returningCustomers: 255 }
]

const chartConfig = {
  newCustomers: {
    label: "عملاء جدد",
    color: "hsl(var(--chart-1))",
  },
  returningCustomers: {
    label: "عملاء عائدون",
    color: "hsl(var(--chart-2))",
  },
}

export default function CustomerChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          />
          <ChartTooltip
            content={
              <ChartTooltipContent 
                formatter={(value, name) => [
                  value,
                  chartConfig[name]?.label || name,
                ]}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="newCustomers"
            stroke="var(--color-newCustomers)"
            strokeWidth={3}
            dot={{ fill: "var(--color-newCustomers)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="returningCustomers"
            stroke="var(--color-returningCustomers)"
            strokeWidth={3}
            dot={{ fill: "var(--color-returningCustomers)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
