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
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
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
  trafficData,
  tokenUsageData,
  costData,
  latencyDistribution,
  modelUsage,
  errorData,
  activeUsersData,
  savingsData,
} from "@/lib/mock-data"
import { useLiveSeries } from "@/lib/use-realtime"

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11 },
  stroke: "var(--muted-foreground)",
} as const

const providerConfig: ChartConfig = {
  openai: { label: "OpenAI", color: "var(--chart-1)" },
  gemini: { label: "Gemini", color: "var(--chart-2)" },
  claude: { label: "Claude", color: "var(--chart-3)" },
}

export function TrafficChart({ height = 260 }: { height?: number }) {
  const data = useLiveSeries(trafficData(24), (prev) => {
    const jitter = (b: number) => Math.max(0, Math.round(b + (Math.random() - 0.5) * b * 0.25))
    const openai = jitter(prev.openai)
    const gemini = jitter(prev.gemini)
    const claude = jitter(prev.claude)
    return {
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      openai,
      gemini,
      claude,
      total: openai + gemini + claude,
    }
  })

  return (
    <ChartContainer config={providerConfig} className="w-full" style={{ height }}>
      <LineChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" {...axisProps} minTickGap={40} />
        <YAxis {...axisProps} width={36} tickFormatter={(v) => `${v / 1000}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {(["openai", "gemini", "claude"] as const).map((k) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={`var(--color-${k})`}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={600}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

export function TokenAreaChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = {
    input: { label: "Input tokens", color: "var(--chart-1)" },
    output: { label: "Output tokens", color: "var(--chart-3)" },
  }
  const data = tokenUsageData(24)
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-input" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="fill-output" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" {...axisProps} minTickGap={40} />
        <YAxis {...axisProps} width={40} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="input" stroke="var(--chart-1)" strokeWidth={2} fill="url(#fill-input)" stackId="1" />
        <Area type="monotone" dataKey="output" stroke="var(--chart-3)" strokeWidth={2} fill="url(#fill-output)" stackId="1" />
      </AreaChart>
    </ChartContainer>
  )
}

export function CostBarChart({ height = 260 }: { height?: number }) {
  const data = costData()
  return (
    <ChartContainer config={providerConfig} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={(v) => `$${v}`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="openai" stackId="a" fill="var(--chart-1)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="gemini" stackId="a" fill="var(--chart-2)" />
        <Bar dataKey="claude" stackId="a" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function LatencyChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = { count: { label: "Requests", color: "var(--chart-2)" } }
  const data = latencyDistribution()
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="bucket" {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={(v) => `${v / 1000}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function ModelPieChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = {
    OpenAI: { label: "OpenAI", color: "var(--chart-1)" },
    Gemini: { label: "Gemini", color: "var(--chart-2)" },
    Claude: { label: "Claude", color: "var(--chart-3)" },
  }
  const data = modelUsage()
  return (
    <ChartContainer config={config} className="mx-auto aspect-square" style={{ height }}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={92}
          paddingAngle={3}
          strokeWidth={2}
          stroke="var(--card)"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export function ErrorChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = {
    e4xx: { label: "4xx", color: "var(--chart-5)" },
    e5xx: { label: "5xx", color: "var(--destructive)" },
  }
  const data = errorData(24)
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-5xx" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" {...axisProps} minTickGap={40} />
        <YAxis {...axisProps} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="e4xx" stroke="var(--chart-5)" strokeWidth={1.5} fillOpacity={0.1} fill="var(--chart-5)" />
        <Area type="monotone" dataKey="e5xx" stroke="var(--destructive)" strokeWidth={2} fill="url(#fill-5xx)" />
      </AreaChart>
    </ChartContainer>
  )
}

export function ActiveUsersChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = { users: { label: "Active users", color: "var(--chart-4)" } }
  const data = activeUsersData(24)
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-users" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="time" {...axisProps} minTickGap={40} />
        <YAxis {...axisProps} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="users" stroke="var(--chart-4)" strokeWidth={2} fill="url(#fill-users)" />
      </AreaChart>
    </ChartContainer>
  )
}

export function SavingsChart({ height = 260 }: { height?: number }) {
  const config: ChartConfig = {
    baseline: { label: "Baseline", color: "var(--chart-5)" },
    optimized: { label: "Optimized", color: "var(--chart-1)" },
  }
  const data = savingsData(12)
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-opt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="week" {...axisProps} />
        <YAxis {...axisProps} width={44} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="baseline" stroke="var(--chart-5)" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
        <Area type="monotone" dataKey="optimized" stroke="var(--chart-1)" strokeWidth={2} fill="url(#fill-opt)" />
      </AreaChart>
    </ChartContainer>
  )
}

export function GaugeChart({
  value,
  label,
  height = 200,
  color = "var(--chart-1)",
}: {
  value: number
  label?: string
  height?: number
  color?: string
}) {
  const config: ChartConfig = { value: { label: label ?? "Score", color } }
  const data = [{ name: "value", value, fill: color }]
  return (
    <ChartContainer config={config} className="mx-auto aspect-square" style={{ height }}>
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={90 - (value / 100) * 360}
        innerRadius={70}
        outerRadius={100}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--muted)" }} />
      </RadialBarChart>
    </ChartContainer>
  )
}
