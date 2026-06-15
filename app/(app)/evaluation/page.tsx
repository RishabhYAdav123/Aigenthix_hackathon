"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown, Star, ShieldAlert, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Badge } from "@/components/ui/badge"
import { GaugeChart } from "@/components/charts/observability-charts"
import { FeedbackChart, RatingChart, BenchmarkRadar } from "@/components/charts/analytics-charts"
import { evalTrend } from "@/lib/mock-data"
import { scorecards, type Scorecard } from "@/lib/analytics-data"
import { useCountUp } from "@/lib/use-realtime"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const trendConfig: ChartConfig = {
  quality: { label: "Quality", color: "var(--chart-1)" },
  helpfulness: { label: "Helpfulness", color: "var(--chart-3)" },
}

export default function EvaluationPage() {
  const trend = evalTrend(12)
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader title="Evaluation" description="Quality scores, user feedback, ratings and hallucination risk." />

      {/* Scorecards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {scorecards.map((s) => (
          <ScoreCard key={s.label} card={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Quality Score" description="Composite response quality" contentClassName="relative">
          <GaugeChart value={92} color="var(--chart-1)" height={200} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tabular-nums">92</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </Panel>
        <Panel title="Hallucination Risk" description="Lower is better" contentClassName="relative">
          <GaugeChart value={6} color="var(--chart-5)" height={200} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tabular-nums">6%</span>
            <Badge className="mt-1 bg-success/15 text-success">Low risk</Badge>
          </div>
        </Panel>
        <Panel title="Benchmark Analytics" description="Multi-dimensional scoring">
          <BenchmarkRadar height={220} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Evaluation Trends"
          description="Quality & helpfulness over time"
          action={
            <div className="flex items-center gap-3">
              {Object.entries(trendConfig).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: v.color }} />
                  {v.label}
                </span>
              ))}
            </div>
          }
        >
          <ChartContainer config={trendConfig} className="w-full" style={{ height: 240 }}>
            <LineChart data={trend} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={32} domain={[60, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="quality" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="helpfulness" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </Panel>

        <Panel
          title="User Feedback"
          description="Thumbs up vs down per week"
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-success"><ThumbsUp className="size-3.5" /> 87%</span>
              <span className="inline-flex items-center gap-1 text-destructive"><ThumbsDown className="size-3.5" /> 13%</span>
            </div>
          }
        >
          <FeedbackChart height={240} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Response Rating" description="Distribution of 1–5 star ratings">
          <RatingChart height={240} />
        </Panel>
        <Panel title="Accuracy Snapshot" description="Sampled evaluations" contentClassName="flex flex-col gap-3">
          <AccuracyRow label="Factual accuracy" value={94} icon={ShieldAlert} />
          <AccuracyRow label="Instruction following" value={91} icon={Star} />
          <AccuracyRow label="Tone & style" value={96} icon={ThumbsUp} />
          <AccuracyRow label="Citation quality" value={83} icon={Star} />
          <div className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
            Evaluated on a rolling sample of 1,240 responses using LLM-as-judge and human review.
          </div>
        </Panel>
      </div>
    </div>
  )
}

function ScoreCard({ card }: { card: Scorecard }) {
  const animated = useCountUp(card.score, 1100)
  const isRating = card.label === "User Rating"
  const isRisk = card.label === "Hallucination Risk"
  const good = isRisk ? card.delta < 0 : card.delta >= 0
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:glow-ring">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
            good ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
          )}
        >
          {card.delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(card.delta)}
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums" style={{ color: card.color }}>
        {isRating ? animated.toFixed(1) : `${Math.round(animated)}${isRisk ? "%" : ""}`}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${isRating ? (card.score / 5) * 100 : card.score}%`,
            backgroundColor: card.color,
          }}
        />
      </div>
    </div>
  )
}

function AccuracyRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium tabular-nums">{value}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  )
}
