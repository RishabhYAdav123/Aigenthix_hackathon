"use client"

import * as React from "react"
import { Users, UserCheck, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ActiveUsersChart } from "@/components/charts/observability-charts"
import {
  RequestsPerUserChart,
  RetentionChart,
  SegmentationPie,
} from "@/components/charts/analytics-charts"
import { ActivityHeatmap } from "@/components/shared/heatmap"
import { topUsers } from "@/lib/mock-data"
import { useCountUp } from "@/lib/use-realtime"
import { cn } from "@/lib/utils"

const stats = [
  { icon: Users, label: "Total Users", value: 18420, display: (n: number) => Intl.NumberFormat("en", { notation: "compact" }).format(n), delta: 8.1, up: true },
  { icon: UserCheck, label: "Active (24h)", value: 4210, display: (n: number) => Intl.NumberFormat("en", { notation: "compact" }).format(n), delta: 12.4, up: true },
  { icon: Activity, label: "Avg Requests / User", value: 286, display: (n: number) => Math.round(n).toString(), delta: 4.2, up: true },
  { icon: DollarSign, label: "Avg Cost / User", value: 18.4, display: (n: number) => `$${n.toFixed(2)}`, delta: -2.1, up: false },
]

const legend = [
  { label: "All users", color: "var(--chart-2)" },
  { label: "Power users", color: "var(--chart-1)" },
]

export default function UsersPage() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="User Analytics"
        description="Requests per user, active users, retention and cost segmentation."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title="Active Users" description="Concurrent users over time">
          <ActiveUsersChart />
        </Panel>
        <Panel title="Usage Segmentation" description="Requests by workload type">
          <SegmentationPie />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Requests Per User" description="Top consumers by request volume">
          <RequestsPerUserChart />
        </Panel>
        <Panel
          title="Retention"
          description="Weekly cohort retention"
          action={
            <div className="flex items-center gap-3">
              {legend.map((l) => (
                <span key={l.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          }
        >
          <RetentionChart />
        </Panel>
      </div>

      <Panel title="User Activity" description="Requests by day of week and hour (UTC)">
        <ActivityHeatmap />
      </Panel>

      <Panel title="Top Users" description="Highest volume accounts and spend" contentClassName="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topUsers.map((u) => (
              <TableRow key={u.user}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/15 text-[10px] font-medium text-primary">
                        {u.user.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.user}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.org}</TableCell>
                <TableCell className="text-right tabular-nums">{u.requests.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums">{(u.tokens / 1_000_000).toFixed(1)}M</TableCell>
                <TableCell className="text-right tabular-nums">${u.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                      u.trend >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {u.trend >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {Math.abs(u.trend)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  display,
  delta,
  up,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  display: (n: number) => string
  delta: number
  up: boolean
}) {
  const animated = useCountUp(value, 1100)
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:glow-ring">
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Icon className="size-4" />
        </span>
        <Badge variant="secondary" className={cn("gap-0.5", up ? "text-success" : "text-destructive")}>
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(delta)}%
        </Badge>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{display(animated)}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
