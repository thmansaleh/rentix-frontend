"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { name: "مؤجرة", value: 65, fill: "hsl(var(--chart-1))" },
  { name: "متاحة", value: 25, fill: "hsl(var(--chart-2))" },
  { name: "صيانة", value: 7, fill: "hsl(var(--chart-3))" },
  { name: "غير متاحة", value: 3, fill: "hsl(var(--chart-4))" }
]

const chartConfig = {
  rented: {
    label: "مؤجرة",
    color: "hsl(var(--chart-1))",
  },
  available: {
    label: "متاحة",
    color: "hsl(var(--chart-2))",
  },
  maintenance: {
    label: "صيانة",
    color: "hsl(var(--chart-3))",
  },
  unavailable: {
    label: "غير متاحة",
    color: "hsl(var(--chart-4))",
  },
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function FleetUtilizationChart() {
  return (
    <ChartContainer config={chartConfig} >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent 
                formatter={(value, name) => [
                  `${value}%`,
                  name,
                ]}
              />
            }
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "12px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
