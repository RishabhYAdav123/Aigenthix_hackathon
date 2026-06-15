"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Boxes, Cpu, Wrench, Database, Hash, ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { traces, spanKindColor, type Trace, type Span } from "@/lib/mock-data"

const kindIcon = {
  agent: Boxes,
  llm: Cpu,
  tool: Wrench,
  retrieval: Database,
  embedding: Hash,
} as const

export default function TracingPage() {
  const [active, setActive] = React.useState<Trace>(traces[0])
  const [selectedSpan, setSelectedSpan] = React.useState<Span | null>(traces[0].spans[1])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tracing"
        description="Distributed traces across agents, tools, retrievals and model calls."
        badge="Span Explorer"
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Trace list */}
        <Panel title="Recent traces" className="h-fit">
          <div className="flex flex-col gap-1">
            {traces.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActive(t)
                  setSelectedSpan(t.spans[1])
                }}
                className={cn(
                  "flex flex-col gap-1 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                  active.id === t.id && "border-border bg-muted/70",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{t.name}</span>
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      t.status === "ok" ? "bg-success" : "bg-destructive",
                    )}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{t.id}</span>
                  <span className="tabular-nums">{t.total}ms</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {/* Waterfall + detail */}
        <div className="flex flex-col gap-4">
          <Panel
            title={active.name}
            description={`${active.id} · ${active.user} · ${active.tokens.toLocaleString()} tokens · $${active.cost.toFixed(4)}`}
            action={
              <Badge variant={active.status === "ok" ? "secondary" : "destructive"}>
                {active.status === "ok" ? "Healthy" : "Error"}
              </Badge>
            }
          >
            <div className="flex flex-col gap-1.5">
              {/* time axis */}
              <div className="mb-1 flex justify-between px-[200px] text-[10px] text-muted-foreground">
                <span>0ms</span>
                <span>{Math.round(active.total / 2)}ms</span>
                <span>{active.total}ms</span>
              </div>
              {active.spans.map((span, i) => {
                const Icon = kindIcon[span.kind]
                const leftPct = (span.start / active.total) * 100
                const widthPct = (span.duration / active.total) * 100
                return (
                  <motion.button
                    key={span.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedSpan(span)}
                    className={cn(
                      "group grid grid-cols-[200px_1fr] items-center gap-2 rounded-md py-1 pr-2 transition-colors hover:bg-muted/50",
                      selectedSpan?.id === span.id && "bg-muted/70",
                    )}
                  >
                    <div
                      className="flex items-center gap-1.5 overflow-hidden text-left"
                      style={{ paddingLeft: span.depth * 14 }}
                    >
                      <Icon className="size-3.5 shrink-0" style={{ color: spanKindColor[span.kind] }} />
                      <span className="truncate font-mono text-xs">{span.name}</span>
                    </div>
                    <div className="relative h-5">
                      <div
                        className="absolute top-1/2 h-4 -translate-y-1/2 rounded-[4px]"
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(widthPct, 1.5)}%`,
                          backgroundColor: span.status === "error" ? "var(--destructive)" : spanKindColor[span.kind],
                          opacity: span.status === "error" ? 0.9 : 0.75,
                        }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 text-[10px] tabular-nums text-muted-foreground"
                        style={{ left: `calc(${leftPct + Math.max(widthPct, 1.5)}% + 6px)` }}
                      >
                        {span.duration}ms
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </Panel>

          {selectedSpan && (
            <Panel title="Span detail" description={selectedSpan.name}>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Kind" value={selectedSpan.kind} />
                <DetailRow label="Status" value={selectedSpan.status === "ok" ? "OK" : "Error"} />
                <DetailRow label="Duration" value={`${selectedSpan.duration}ms`} />
                <DetailRow label="Start offset" value={`${selectedSpan.start}ms`} />
                {selectedSpan.model && <DetailRow label="Model" value={selectedSpan.model} />}
                {selectedSpan.tokens !== undefined && (
                  <DetailRow label="Tokens" value={selectedSpan.tokens.toLocaleString()} />
                )}
                {selectedSpan.cost !== undefined && (
                  <DetailRow label="Cost" value={`$${selectedSpan.cost.toFixed(4)}`} />
                )}
              </div>
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-1 text-foreground">
                  <ChevronRight className="size-3" /> attributes
                </div>
                <pre className="mt-2 whitespace-pre-wrap leading-relaxed">{`{
  "span.id": "${selectedSpan.id}",
  "service.name": "neuralyze-agent",
  "input.tokens": ${selectedSpan.tokens ?? 0},
  "retry.count": 0
}`}</pre>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium capitalize tabular-nums">{value}</span>
    </div>
  )
}
