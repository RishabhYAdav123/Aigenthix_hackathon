"use client"

import * as React from "react"
import { Handle, Position } from "@xyflow/react"
import { Boxes, Cpu, Wrench, Database, LogIn, LogOut, Zap, Sparkles, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type FlowNodeKind = "input" | "agent" | "llm" | "tool" | "retrieval" | "cache" | "optimizer" | "output"
export type FlowNodeStatus = "idle" | "running" | "done" | "error"

export type FlowNodeData = {
  label: string
  kind: FlowNodeKind
  detail?: string
  metric?: string
  status?: FlowNodeStatus
}

const kindMeta: Record<FlowNodeKind, { icon: LucideIcon; color: string }> = {
  input: { icon: LogIn, color: "var(--chart-2)" },
  agent: { icon: Boxes, color: "var(--chart-1)" },
  llm: { icon: Cpu, color: "var(--chart-1)" },
  tool: { icon: Wrench, color: "var(--chart-4)" },
  retrieval: { icon: Database, color: "var(--chart-3)" },
  cache: { icon: Zap, color: "var(--chart-4)" },
  optimizer: { icon: Sparkles, color: "var(--primary)" },
  output: { icon: LogOut, color: "var(--chart-3)" },
}

export function FlowNode({ data }: { data: FlowNodeData }) {
  const meta = kindMeta[data.kind]
  const Icon = meta.icon
  const status = data.status ?? "idle"

  return (
    <div
      className={cn(
        "relative w-[200px] rounded-xl border bg-card/90 px-3 py-2.5 backdrop-blur transition-all",
        status === "running" && "border-primary",
        status === "done" && "border-success/50",
        status === "error" && "border-destructive/60",
        status === "idle" && "border-border",
      )}
      style={
        status === "running"
          ? { boxShadow: `0 0 0 1px var(--primary), 0 0 24px -4px color-mix(in oklch, var(--primary) 70%, transparent)` }
          : undefined
      }
    >
      <Handle type="target" position={Position.Left} className="!size-2 !border-2 !border-card !bg-muted-foreground" />
      <div className="flex items-center gap-2.5">
        <span
          className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", status === "running" && "animate-pulse")}
          style={{ backgroundColor: `color-mix(in oklch, ${meta.color} 16%, transparent)`, color: meta.color }}
        >
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium leading-tight">{data.label}</span>
          {data.detail && <span className="truncate text-[11px] text-muted-foreground">{data.detail}</span>}
        </div>
      </div>
      {data.metric && (
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {status === "running" ? "running" : status === "done" ? "complete" : status === "error" ? "failed" : "metric"}
          </span>
          <span className="font-mono text-[11px] tabular-nums" style={{ color: status === "running" ? "var(--primary)" : undefined }}>
            {data.metric}
          </span>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!size-2 !border-2 !border-card !bg-muted-foreground" />
    </div>
  )
}
