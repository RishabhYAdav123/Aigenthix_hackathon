"use client"

import * as React from "react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Kpi } from "@/lib/mock-data"
import { useCountUp } from "@/lib/use-realtime"

export function KpiCard({ kpi, index = 0 }: { kpi: Kpi; index?: number }) {
  const animated = useCountUp(kpi.value, 1000 + index * 120)
  const up = kpi.delta >= 0
  // "positive" flips the meaning (e.g. lower latency/cost is good)
  const good = kpi.positive ? !up : up
  const id = `spark-${kpi.id}`

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:glow-ring">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
            good
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive",
          )}
        >
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(kpi.delta)}%
        </span>
      </div>

      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {kpi.display(animated)}
      </p>

      <div className="mt-3 h-9 w-full opacity-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={kpi.spark} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="var(--primary)"
              strokeWidth={1.5}
              fill={`url(#${id})`}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
