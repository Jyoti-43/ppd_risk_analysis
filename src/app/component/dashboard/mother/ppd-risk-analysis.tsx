"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

const chartData = [
  { month: "January", epds: 186, symptom: 80, hybrid: 120 },
  { month: "February", epds: 305, symptom: 200, hybrid: 100 },
  { month: "March", epds: 237, symptom: 120, hybrid: 140 },
  { month: "April", epds: 73, symptom: 190, hybrid: 125 },
  { month: "May", epds: 209, symptom: 130, hybrid: 190 },
  { month: "June", epds: 214, symptom: 140, hybrid: 220 },
]

const chartConfig = {
  epds: {
    label: "EPDS",
    color: "var(--chart-1)",
  },
  symptom: {
    label: "Symptom",
    color: "var(--chart-2)",
  },
  hybrid: {
    label: "Hybrid",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function PPD_Risk_Analysis() {
  return (
    <Card className=" max-h-140">
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-100">
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="epds"
              type="monotone"
              stroke="var(--color-epds)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="symptom"
              type="monotone"
              stroke="var(--color-symptom)"
              strokeWidth={2}
              dot={false}
            />
             <Line
              dataKey="hybrid"
              type="monotone"
              stroke="var(--color-hybrid)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

         