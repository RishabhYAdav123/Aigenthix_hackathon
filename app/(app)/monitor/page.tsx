"use client"

import * as React from "react"
import { Activity, AlertTriangle, DollarSign, Gauge, CheckCircle2, CircleDot, Server } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RpsLiveChart, MiniSpark } from "@/components/charts/analytics-charts"
import { ErrorChart, LatencyChart } from "@/components/charts/observability-charts"
import { monitors, services, type Monitor, type Service } from "@/lib/analytics-data"
import { incidents, type Incident } from "@/lib/mock-data"
import { useLiveValue } from "@/lib/use-realtime"
import { cn } from "@/lib/utils"

const kindIcon = {
  latency: Gauge,
  error: AlertTriangle,
  cost: DollarSign,
  token: Activity,
} as const

const statusColor: Record<Service["status"], string> = {
  operational: "var(--success)",
  degraded: "var(--warning)",
  down: "var(--destructive)",
}

export default function MonitorPage() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Monitor"
        description="Realtime system health, latency, error and cost monitoring."
      >
        <Badge className="gap-1.5 bg-success/15 text-success">
          <span className="size-1.5 rounded-full bg-success animate-pulse" />
          Live
        </Badge>
      </PageHeader>

      {/* Monitor threshold cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {monitors.map((m) => (
          <MonitorCard key={m.id} monitor={m} />
        ))}
      </div>

      {/* Live telemetry */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Requests Per Second"
          description="Live ingestion rate across all providers"
          action={<LiveRps />}
        >
          <RpsLiveChart height={240} />
        </Panel>
        <Panel title="Uptime" description="Rolling 30-day availability">
          <UptimeRing />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Latency Distribution" description="Request count by latency bucket">
          <LatencyChart height={240} />
        </Panel>
        <Panel
          title="Error Monitoring"
          description="4xx & 5xx over time"
          action={<Badge variant="secondary" className="text-destructive">0.8% err</Badge>}
        >
          <ErrorChart height={240} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Service Status" description="Provider and infrastructure health" contentClassName="flex flex-col gap-1.5">
          {services.map((s) => (
            <ServiceRow key={s.name} service={s} />
          ))}
        </Panel>
        <Panel title="Active Incidents" description="Firing and recently resolved" contentClassName="flex flex-col gap-2.5">
          {incidents.map((inc) => (
            <IncidentRow key={inc.id} incident={inc} />
          ))}
        </Panel>
      </div>
    </div>
  )
}

function MonitorCard({ monitor }: { monitor: Monitor }) {
  const Icon = kindIcon[monitor.kind]
  const live = useLiveValue(monitor.value, { volatility: 0.03, min: monitor.value * 0.7, max: monitor.value * 1.3 })
  const breached = monitor.kind === "error" || monitor.kind === "cost" || monitor.kind === "token"
    ? live > monitor.threshold
    : live > monitor.threshold
  const pct = Math.min(100, (live / monitor.threshold) * 100)
  const color = breached ? "var(--destructive)" : pct > 80 ? "var(--warning)" : "var(--success)"
  const fmt = (n: number) =>
    monitor.unit === "$" ? `$${Math.round(n)}` : monitor.unit === "%" ? `${n.toFixed(1)}%` : `${Math.round(n)}${monitor.unit}`

  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-card p-4 transition-all", breached ? "border-destructive/40" : "border-border")}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Icon className="size-4 text-muted-foreground" />
          {monitor.title}
        </span>
        {breached ? (
          <Badge className="gap-1 bg-destructive/15 text-destructive">
            <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
            Breach
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-success">OK</Badge>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color: breached ? "var(--destructive)" : undefined }}>
        {fmt(live)}
      </p>
      <p className="text-xs text-muted-foreground">{monitor.metric} · threshold {fmt(monitor.threshold)}</p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="mt-2 -mb-1 opacity-70">
        <MiniSpark data={monitor.series} color={color} height={28} />
      </div>
    </div>
  )
}

function LiveRps() {
  const rps = useLiveValue(1240, { volatility: 0.05, min: 600, max: 2000 })
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm tabular-nums">
      <CircleDot className="size-3.5 text-success animate-pulse" />
      {Math.round(rps).toLocaleString()} rps
    </span>
  )
}

function UptimeRing() {
  const uptime = 99.97
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-2">
      <div className="relative flex size-40 items-center justify-center">
        <svg viewBox="0 0 100 100" className="size-40 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--success)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - uptime / 100)}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-semibold tabular-nums">{uptime}%</span>
          <span className="text-xs text-muted-foreground">30-day uptime</span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <p className="text-sm font-semibold tabular-nums">12m</p>
          <p className="text-[10px] text-muted-foreground">Downtime</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <p className="text-sm font-semibold tabular-nums">2</p>
          <p className="text-[10px] text-muted-foreground">Incidents</p>
        </div>
      </div>
    </div>
  )
}

function ServiceRow({ service }: { service: Service }) {
  const color = statusColor[service.status]
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
        <Server className="size-4 text-muted-foreground" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{service.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {service.uptime}% uptime · {service.latency}ms
        </span>
      </div>
      <div className="hidden w-28 sm:block">
        <Progress value={service.uptime} className="h-1.5" />
      </div>
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
        style={{ backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`, color }}
      >
        <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
        {service.status}
      </span>
    </div>
  )
}

function IncidentRow({ incident }: { incident: Incident }) {
  const isFiring = incident.status === "firing"
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3",
        isFiring ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/20",
      )}
    >
      <span className="mt-0.5">
        {incident.status === "resolved" ? (
          <CheckCircle2 className="size-4 text-success" />
        ) : (
          <AlertTriangle className={cn("size-4", isFiring ? "text-destructive" : "text-warning")} />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium leading-tight">{incident.title}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {incident.metric}: {incident.value} (limit {incident.threshold})
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge
          variant="secondary"
          className={cn(
            "capitalize",
            isFiring && "bg-destructive/15 text-destructive",
            incident.status === "resolved" && "bg-success/15 text-success",
            incident.status === "pending" && "bg-warning/15 text-warning",
          )}
        >
          {incident.status}
        </Badge>
        <span className="text-[10px] text-muted-foreground">{incident.time}</span>
      </div>
    </div>
  )
}
