"use client"

import { Sparkles, TrendingDown, Zap, ShieldCheck, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { Panel } from "@/components/dashboard/panel"
import { kpis } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrafficChart,
  TokenAreaChart,
  CostBarChart,
  LatencyChart,
  ModelPieChart,
  ErrorChart,
  ActiveUsersChart,
  SavingsChart,
} from "@/components/charts/observability-charts"

const insights = [
  {
    icon: TrendingDown,
    title: "Route classification to gemini-3-flash",
    detail: "Equal quality at 59% lower cost",
    saving: "$4,820/mo",
  },
  {
    icon: Zap,
    title: "Enable semantic cache on /faq",
    detail: "Deflect 34% of duplicate prompts",
    saving: "$3,120/mo",
  },
  {
    icon: ShieldCheck,
    title: "Compress RAG context window",
    detail: "8.2K → 5.1K tokens, no recall loss",
    saving: "$2,410/mo",
  },
]

const legend = [
  { label: "OpenAI", color: "var(--chart-1)" },
  { label: "Gemini", color: "var(--chart-2)" },
  { label: "Claude", color: "var(--chart-3)" },
]

function Legend() {
  return (
    <div className="flex items-center gap-3">
      {legend.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full" style={{ backgroundColor: l.color }} />
          {l.label}
        </span>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Dashboard"
        description="Realtime observability across every LLM request, token and dollar spent."
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.id} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Main charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Realtime Request Traffic"
          description="Requests per minute by provider"
          action={<Legend />}
        >
          <TrafficChart />
        </Panel>

        <Panel title="Model Usage" description="Share of total requests">
          <ModelPieChart />
          <div className="mt-2 flex justify-center">
            <Legend />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Token Usage"
          description="Input vs output tokens"
          action={<Badge variant="secondary">38.4M / 24h</Badge>}
        >
          <TokenAreaChart />
        </Panel>
        <Panel
          title="Cost Analytics"
          description="Daily spend by provider"
          action={<Badge variant="secondary">$4,820 / 24h</Badge>}
        >
          <CostBarChart />
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Latency Distribution" description="Request count by latency bucket">
          <LatencyChart height={220} />
        </Panel>
        <Panel
          title="Error Monitoring"
          description="4xx & 5xx over time"
          action={<Badge variant="secondary" className="text-destructive">0.8% err</Badge>}
        >
          <ErrorChart height={220} />
        </Panel>
        <Panel title="Active Users" description="Concurrent users over time">
          <ActiveUsersChart height={220} />
        </Panel>
      </div>

      {/* Optimization + savings */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Savings Trend"
          description="Baseline vs optimized weekly spend"
          action={<Badge className="bg-success/15 text-success">Saved $31.2k</Badge>}
        >
          <SavingsChart />
        </Panel>

        <Panel
          title={
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" />
              Optimization Insights
            </span>
          }
          description="AI-generated cost reductions"
          contentClassName="flex flex-col gap-2.5"
        >
          {insights.map((ins) => (
            <div
              key={ins.title}
              className="group flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-primary/40"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ins.icon className="size-4" />
              </span>
              <div className="flex min-w-0 flex-col">
                <p className="text-sm font-medium leading-tight">{ins.title}</p>
                <p className="text-xs text-muted-foreground">{ins.detail}</p>
              </div>
              <span className="ml-auto whitespace-nowrap text-sm font-semibold text-success">
                {ins.saving}
              </span>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-1 w-full" render={<a href="/optimizer" />}>
            View all optimizations
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </Panel>
      </div>
    </div>
  )
}
