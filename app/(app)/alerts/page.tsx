"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  BellRing,
  Check,
  DollarSign,
  Gauge,
  MessageCircle,
  ServerCrash,
  Sparkles,
  Mail,
  Webhook,
  Siren,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { alerts as seedAlerts, type Alert, type Severity } from "@/lib/mock-data"
import { alertRules, type AlertRule } from "@/lib/analytics-data"
import { toast } from "sonner"

const categoryIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  "Cost Spike": DollarSign,
  Latency: Gauge,
  "API Failures": ServerCrash,
  "Token Spike": BellRing,
  Optimization: Sparkles,
}

const channelIcon: Record<AlertRule["channel"], React.ComponentType<{ className?: string }>> = {
  Slack: MessageCircle,
  Email: Mail,
  Webhook: Webhook,
  PagerDuty: Siren,
}

const severityFilters: (Severity | "all")[] = ["all", "critical", "warning", "info"]

const integrations = [
  { name: "Slack", icon: MessageCircle, connected: true, detail: "#ai-alerts channel" },
  { name: "Email", icon: Mail, connected: true, detail: "ops@neuralyze.ai" },
  { name: "Webhook", icon: Webhook, connected: false, detail: "POST endpoint" },
  { name: "PagerDuty", icon: Siren, connected: true, detail: "On-call escalation" },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>(seedAlerts)
  const [filter, setFilter] = React.useState<Severity | "all">("all")

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter)
  const critical = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length

  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
    toast.success("Alert acknowledged")
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader title="Alerts" description="Failures, latency, cost spikes and optimization alerts.">
        {critical > 0 && (
          <Badge className="gap-1.5 bg-destructive/15 text-destructive">
            <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
            {critical} critical
          </Badge>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Alert timeline */}
        <Panel
          title="Alert timeline"
          description={`${filtered.length} alerts`}
          action={
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
              {severityFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          }
          contentClassName="flex flex-col"
        >
          <div className="relative flex flex-col gap-3 pl-6">
            <span className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px bg-border" />
            {filtered.map((a, i) => (
              <AlertItem key={a.id} alert={a} index={i} onAck={() => acknowledge(a.id)} />
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No alerts at this severity.</p>
            )}
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          {/* Integrations */}
          <Panel title="Notification channels" description="Where alerts are delivered" contentClassName="grid grid-cols-2 gap-2.5">
            {integrations.map((int) => (
              <div
                key={int.name}
                className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <int.icon className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      int.connected ? "bg-success" : "bg-muted-foreground/40",
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{int.name}</span>
                  <span className="text-xs text-muted-foreground">{int.detail}</span>
                </div>
              </div>
            ))}
          </Panel>

          {/* Alert rules */}
          <Panel title="Alert rules" description="Trigger conditions and routing" contentClassName="flex flex-col gap-1.5">
            {alertRules.map((rule) => (
              <AlertRuleRow key={rule.id} rule={rule} />
            ))}
            <Button variant="outline" size="sm" className="mt-1" onClick={() => toast("New alert rule", { description: "Define a condition and notification channel." })}>
              Add rule
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function AlertItem({ alert, index, onAck }: { alert: Alert; index: number; onAck: () => void }) {
  const Icon = categoryIcon[alert.category] ?? BellRing
  const dotColor =
    alert.severity === "critical" ? "var(--destructive)" : alert.severity === "warning" ? "var(--warning)" : "var(--primary)"
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative rounded-xl border bg-card p-3.5",
        alert.severity === "critical" && !alert.acknowledged ? "border-destructive/40" : "border-border",
      )}
    >
      <span
        className={cn(
          "absolute -left-[1.4rem] top-4 size-3.5 rounded-full ring-4 ring-background",
          alert.severity === "critical" && !alert.acknowledged && "animate-pulse",
        )}
        style={{ backgroundColor: dotColor }}
      />
      <div className="flex items-start gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklch, ${dotColor} 15%, transparent)`, color: dotColor }}
        >
          <Icon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{alert.title}</span>
            <StatusBadge status={alert.severity} />
            <span className="text-xs text-muted-foreground">· {alert.time}</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{alert.message}</p>
        </div>
        {alert.acknowledged ? (
          <Badge variant="secondary" className="shrink-0 gap-1 text-success">
            <Check className="size-3" /> Ack
          </Badge>
        ) : (
          <Button size="sm" variant="outline" className="shrink-0" onClick={onAck}>
            Acknowledge
          </Button>
        )}
      </div>
    </motion.div>
  )
}

function AlertRuleRow({ rule }: { rule: AlertRule }) {
  const [enabled, setEnabled] = React.useState(rule.enabled)
  const ChannelIcon = channelIcon[rule.channel]
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{rule.name}</span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">{rule.condition}</span>
      </div>
      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
        <ChannelIcon className="size-3" />
        {rule.channel}
      </span>
      <Switch
        checked={enabled}
        onCheckedChange={(v) => {
          setEnabled(v)
          toast(v ? "Rule enabled" : "Rule disabled", { description: rule.name })
        }}
      />
    </div>
  )
}
