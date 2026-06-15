"use client"

import * as React from "react"
import {
  Sparkles,
  TrendingDown,
  Cpu,
  Zap,
  ArrowRight,
  Check,
  Lightbulb,
  Gauge,
  DollarSign,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectionChart } from "@/components/charts/analytics-charts"
import { promptOpts, providerHealth, type PromptOpt } from "@/lib/analytics-data"
import { useCountUp } from "@/lib/use-realtime"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Recommendation = {
  id: string
  title: string
  detail: string
  impact: "High" | "Medium" | "Low"
  saving: string
  icon: React.ComponentType<{ className?: string }>
}

const recommendations: Recommendation[] = [
  {
    id: "rec1",
    title: "Route simple chats to gpt-5-mini",
    detail: "62% of traffic is low-complexity. Downshifting from the flagship model preserves quality at a fraction of the token cost.",
    impact: "High",
    saving: "$3,240/mo",
    icon: Cpu,
  },
  {
    id: "rec2",
    title: "Enable semantic caching",
    detail: "31% of prompts are near-duplicates within a 5-minute window. A semantic cache eliminates redundant inference calls.",
    impact: "High",
    saving: "$2,180/mo",
    icon: Zap,
  },
  {
    id: "rec3",
    title: "Compress RAG context windows",
    detail: "Average retrieval injects 8.2k tokens; reranking + dedup trims this to 5.1k with no measurable accuracy drop.",
    impact: "Medium",
    saving: "$1,460/mo",
    icon: Gauge,
  },
  {
    id: "rec4",
    title: "Batch embedding jobs",
    detail: "Embedding calls are dispatched per-request. Batching into the async endpoint unlocks a 50% unit-cost reduction.",
    impact: "Low",
    saving: "$420/mo",
    icon: Lightbulb,
  },
]

const impactStyles: Record<Recommendation["impact"], string> = {
  High: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-muted text-muted-foreground",
}

export default function OptimizerPage() {
  const [applied, setApplied] = React.useState<Set<string>>(new Set())
  const totalSaving = useCountUp(7300, 1200)
  const reduction = useCountUp(42, 1100)

  const toggleApply = (rec: Recommendation) => {
    setApplied((prev) => {
      const next = new Set(prev)
      if (next.has(rec.id)) {
        next.delete(rec.id)
        toast("Recommendation reverted", { description: rec.title })
      } else {
        next.add(rec.id)
        toast.success("Optimization applied", { description: `${rec.title} · saving ${rec.saving}` })
      }
      return next
    })
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader title="AI Optimizer" description="AI-driven cost reduction, prompt tuning and model routing recommendations.">
        <Button
          size="sm"
          onClick={() => toast.success("Running optimization scan…", { description: "Analyzing 24h of traffic across all providers." })}
        >
          <Sparkles className="size-4" data-icon="inline-start" />
          Run scan
        </Button>
      </PageHeader>

      {/* Hero summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card p-5 glow-ring lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" /> Projected savings
              </span>
              <p className="text-4xl font-semibold tabular-nums">
                ${Math.round(totalSaving).toLocaleString()}
                <span className="ml-1 text-base font-normal text-muted-foreground">/ mo</span>
              </p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Applying all {recommendations.length} recommendations reduces monthly inference spend by{" "}
                <span className="font-medium text-foreground">{Math.round(reduction)}%</span> while holding quality above 90.
              </p>
            </div>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <TrendingDown className="size-6" />
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="bg-success/15 text-success">{applied.size} applied</Badge>
            <Badge variant="outline">{recommendations.length - applied.size} pending</Badge>
          </div>
        </div>

        <Panel title="12-month projection" description="Current vs optimized spend">
          <ProjectionChart height={200} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recommendations */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">Recommendations</h2>
          {recommendations.map((rec) => {
            const isApplied = applied.has(rec.id)
            const Icon = rec.icon
            return (
              <div
                key={rec.id}
                className={cn(
                  "group flex items-start gap-4 rounded-xl border bg-card p-4 transition-all",
                  isApplied ? "border-success/40" : "border-border hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isApplied ? "bg-success/15 text-success" : "bg-primary/12 text-primary",
                  )}
                >
                  {isApplied ? <Check className="size-5" /> : <Icon className="size-5" />}
                </span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{rec.title}</h3>
                    <Badge className={impactStyles[rec.impact]}>{rec.impact} impact</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{rec.detail}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-success tabular-nums">
                      <DollarSign className="size-3.5" />
                      {rec.saving}
                    </span>
                    <Button
                      variant={isApplied ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleApply(rec)}
                    >
                      {isApplied ? "Revert" : "Apply"}
                      {!isApplied && <ArrowRight className="size-4" data-icon="inline-end" />}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sidebar: prompt optimizations + model routing */}
        <div className="flex flex-col gap-4">
          <Panel title="Prompt token reduction" description="Before vs after optimization" contentClassName="flex flex-col gap-3.5">
            {promptOpts.map((p) => (
              <PromptRow key={p.id} opt={p} />
            ))}
          </Panel>

          <Panel title="Model routing" description="Recommended provider mix" contentClassName="flex flex-col gap-3">
            {providerHealth.map((prov) => (
              <div key={prov.name} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{prov.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{prov.model}</span>
                </div>
                <span className="text-sm font-medium tabular-nums text-muted-foreground">{prov.latency}ms</span>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
              Optimizer suggests routing 62% of traffic to <span className="font-medium text-foreground">gpt-5-mini</span> and reserving the flagship for high-complexity spans.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function PromptRow({ opt }: { opt: PromptOpt }) {
  const pct = Math.round((opt.after / opt.before) * 100)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span>{opt.label}</span>
        <Badge className="bg-success/15 text-success">-{opt.saving}</Badge>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-destructive/25">
        <div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between font-mono text-[11px] text-muted-foreground tabular-nums">
        <span>{opt.before.toLocaleString()} tok</span>
        <span>{opt.after.toLocaleString()} tok</span>
      </div>
    </div>
  )
}
