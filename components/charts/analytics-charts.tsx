"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  requestsPerUser,
  retentionData,
  segmentationData,
  feedbackData,
  ratingDistribution,
  benchmarkData,
  projectionData,
  rpsSeries,
} from "@/lib/analytics-data"
import { useLiveSeries } from "@/lib/use-realtime"

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11 },
  stroke: "var(--muted-foreground)",
} as const

export function RequestsPerUserChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = { requests: { label: "Requests", color: "var(--chart-1)" } }
  const data = requestsPerUser()
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" {...axisProps} tickFormatter={(v) => `${v / 1000}k`} />
        <YAxis type="category" dataKey="user" {...axisProps} width={72} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="requests" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function RetentionChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = {
    all: { label: "All users", color: "var(--chart-2)" },
    power: { label: "Power users", color: "var(--chart-1)" },
  }
  const data = retentionData()
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <LineChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} width={36} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="all" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="power" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}

export function SegmentationPie({ height = 240 }: { height?: number }) {
  const data = segmentationData()
  const config: ChartConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: d.fill }]),
  )
  return (
    <ChartContainer config={config} className="mx-auto aspect-square" style={{ height }}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
          {data.map((e) => (
            <Cell key={e.name} fill={e.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export function RpsLiveChart({ height = 200 }: { height?: number }) {
  const config: ChartConfig = { rps: { label: "Requests/s", color: "var(--chart-1)" } }
  const data = useLiveSeries(rpsSeries(30), (prev) => ({
    t: `${Number(prev.t) + 1}`,
    rps: Math.max(400, Math.round(prev.rps + (Math.random() - 0.5) * 380)),
  }), 1500)
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-rps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="t" {...axisProps} tick={false} />
        <YAxis {...axisProps} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="rps" stroke="var(--chart-1)" strokeWidth={2} fill="url(#fill-rps)" isAnimationActive={false} />
      </AreaChart>
    </ChartContainer>
  )
}

export function FeedbackChart({ height = 240 }: { height?: number }) {
  const config: ChartConfig = {
    up: { label: "Thumbs up", color: "var(--chart-3)" },
    down: { label: "Thumbs down", color: "var(--chart-5)" },
  }
  const data = feedbackData()
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis {...axisProps} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="up" stackId="a" fill="var(--chart-3)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="down" stackId="a" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function RatingChart({ height = 240 }: { height?: number }) {
  const config: ChartConfig = { count: { label: "Responses", color: "var(--chart-1)" } }
  const data = ratingDistribution()
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="rating" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `${v / 1000}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function BenchmarkRadar({ height = 260 }: { height?: number }) {
  const config: ChartConfig = { value: { label: "Score", color: "var(--chart-1)" } }
  const data = benchmarkData()
  return (
    <ChartContainer config={config} className="mx-auto aspect-square" style={{ height }}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ChartContainer>
  )
}

export function ProjectionChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = {
    current: { label: "Projected (current)", color: "var(--chart-5)" },
    optimized: { label: "Projected (optimized)", color: "var(--chart-1)" },
  }
  const data = projectionData()
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-proj-opt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="current" stroke="var(--chart-5)" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
        <Area type="monotone" dataKey="optimized" stroke="var(--chart-1)" strokeWidth={2} fill="url(#fill-proj-opt)" />
      </AreaChart>
    </ChartContainer>
  )
}

/** Tiny sparkline used inside metric cards. */
export function MiniSpark({
  data,
  color = "var(--primary)",
  height = 36,
}: {
  data: { i: number; v: number }[]
  color?: string
  height?: number
}) {
  const id = React.useId().replace(/:/g, "")
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${id})`} isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
