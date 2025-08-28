"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "1", bookings: 12, cancellations: 2 },
  { date: "2", bookings: 15, cancellations: 3 },
  { date: "3", bookings: 18, cancellations: 1 },
  { date: "4", bookings: 22, cancellations: 4 },
  { date: "5", bookings: 19, cancellations: 2 },
  { date: "6", bookings: 25, cancellations: 3 },
  { date: "7", bookings: 28, cancellations: 5 },
  { date: "8", bookings: 24, cancellations: 2 },
  { date: "9", bookings: 31, cancellations: 4 },
  { date: "10", bookings: 27, cancellations: 3 },
  { date: "11", bookings: 33, cancellations: 2 },
  { date: "12", bookings: 29, cancellations: 1 },
  { date: "13", bookings: 35, cancellations: 3 },
  { date: "14", bookings: 32, cancellations: 4 },
  { date: "15", bookings: 38, cancellations: 2 },
  { date: "16", bookings: 34, cancellations: 3 },
  { date: "17", bookings: 41, cancellations: 5 },
  { date: "18", bookings: 37, cancellations: 2 },
  { date: "19", bookings: 43, cancellations: 4 },
  { date: "20", bookings: 39, cancellations: 3 },
  { date: "21", bookings: 45, cancellations: 2 },
  { date: "22", bookings: 42, cancellations: 1 },
  { date: "23", bookings: 48, cancellations: 3 },
  { date: "24", bookings: 44, cancellations: 4 },
  { date: "25", bookings: 51, cancellations: 2 },
  { date: "26", bookings: 47, cancellations: 3 },
  { date: "27", bookings: 53, cancellations: 5 },
  { date: "28", bookings: 49, cancellations: 2 },
  { date: "29", bookings: 56, cancellations: 4 },
  { date: "30", bookings: 52, cancellations: 3 }
]

const chartConfig = {
  bookings: {
    label: "الحجوزات",
    color: "hsl(var(--chart-1))",
  },
  cancellations: {
    label: "الإلغاءات",
    color: "hsl(var(--chart-2))",
  },
}

export default function BookingsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
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
                labelFormatter={(label) => `اليوم ${label}`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="bookings"
            stackId="1"
            stroke="var(--color-bookings)"
            fill="var(--color-bookings)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="cancellations"
            stackId="1"
            stroke="var(--color-cancellations)"
            fill="var(--color-cancellations)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
