"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronRight, Sparkles, AlertTriangle, Pause, Play, Download } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JsonViewer } from "@/components/shared/json-viewer"
import { logs as seedLogs, type LogEntry } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const statusColor: Record<LogEntry["status"], string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--destructive)",
}

const levelFilters = ["all", "success", "warning", "error"] as const

export default function LogsPage() {
  const [logs, setLogs] = React.useState<LogEntry[]>(seedLogs)
  const [query, setQuery] = React.useState("")
  const [level, setLevel] = React.useState<(typeof levelFilters)[number]>("all")
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [streaming, setStreaming] = React.useState(true)
  const counter = React.useRef(seedLogs.length)

  // Realtime log streaming simulation
  React.useEffect(() => {
    if (!streaming) return
    const id = setInterval(() => {
      setLogs((prev) => {
        const template = seedLogs[Math.floor(Math.random() * seedLogs.length)]
        counter.current += 1
        const roll = Math.random()
        const status: LogEntry["status"] = roll > 0.9 ? "error" : roll > 0.78 ? "warning" : "success"
        const fresh: LogEntry = {
          ...template,
          id: `req_${(9300000 + counter.current).toString()}`,
          time: new Date().toLocaleTimeString(),
          status,
          latency: Math.round(180 + Math.random() * 1500),
          anomaly: status === "error" || Math.random() > 0.88,
        }
        return [fresh, ...prev].slice(0, 60)
      })
    }, 2200)
    return () => clearInterval(id)
  }, [streaming])

  const filtered = logs.filter((l) => {
    const matchesQuery =
      l.id.toLowerCase().includes(query.toLowerCase()) ||
      l.endpoint.toLowerCase().includes(query.toLowerCase()) ||
      l.model.toLowerCase().includes(query.toLowerCase()) ||
      l.prompt.toLowerCase().includes(query.toLowerCase())
    const matchesLevel = level === "all" || l.status === level
    return matchesQuery && matchesLevel
  })

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader title="Logs" description="Raw prompts, responses, errors, metadata and AI suggestions." showActions={false}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStreaming((s) => !s)}
          className={cn(streaming && "border-success/40 text-success")}
        >
          {streaming ? <Pause className="size-4" data-icon="inline-start" /> : <Play className="size-4" data-icon="inline-start" />}
          {streaming ? "Streaming" : "Paused"}
        </Button>
        <Button size="sm" onClick={() => toast.success("Export started", { description: "Logs will be exported as NDJSON." })}>
          <Download className="size-4" data-icon="inline-start" />
          Export
        </Button>
      </PageHeader>

      <Panel
        title="Event explorer"
        description={`${filtered.length} events`}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter logs…"
                className="h-8 w-48 pl-8 text-sm"
              />
            </div>
            <div className="hidden items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5 sm:flex">
              {levelFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setLevel(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    level === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        }
        contentClassName="p-0"
      >
        {/* header row */}
        <div className="hidden grid-cols-[110px_1fr_90px_90px_80px_24px] items-center gap-3 border-b border-border px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:grid">
          <span>Time</span>
          <span>Endpoint / Model</span>
          <span className="text-right">Latency</span>
          <span className="text-right">Tokens</span>
          <span className="text-right">Cost</span>
          <span />
        </div>
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {filtered.map((log) => (
              <LogRow key={log.id} log={log} open={openId === log.id} onToggle={() => setOpenId(openId === log.id ? null : log.id)} />
            ))}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  )
}

function LogRow({ log, open, onToggle }: { log: LogEntry; open: boolean; onToggle: () => void }) {
  const color = statusColor[log.status]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)" }}
      animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ duration: 0.6 }}
      className={cn("border-b border-border", open && "bg-muted/30")}
    >
      <button onClick={onToggle} className="grid w-full grid-cols-[16px_1fr_auto] items-center gap-3 px-4 py-2.5 text-left md:grid-cols-[110px_1fr_90px_90px_80px_24px]">
        <span className="hidden font-mono text-xs text-muted-foreground md:block">{log.time}</span>
        <span className="flex items-center gap-2 md:hidden">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="hidden size-1.5 shrink-0 rounded-full md:block" style={{ backgroundColor: color }} />
          <span className="truncate font-mono text-xs">{log.endpoint}</span>
          <Badge variant="secondary" className="hidden shrink-0 text-[10px] sm:inline-flex">{log.model}</Badge>
          {log.anomaly && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning">
              <AlertTriangle className="size-2.5" /> anomaly
            </span>
          )}
        </span>
        <span className="hidden text-right text-xs tabular-nums md:block" style={{ color: log.latency > 1000 ? "var(--warning)" : undefined }}>
          {log.latency}ms
        </span>
        <span className="hidden text-right text-xs tabular-nums text-muted-foreground md:block">{log.tokens.toLocaleString()}</span>
        <span className="hidden text-right text-xs tabular-nums text-muted-foreground md:block">${log.cost.toFixed(4)}</span>
        <ChevronRight className={cn("size-4 justify-self-end text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 px-4 pb-4 lg:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Field label="Raw prompt" value={log.prompt} />
                <Field label="Response" value={log.response} mutedBorder />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">Metadata</p>
                <JsonViewer
                  data={{
                    request_id: log.id,
                    provider: log.provider,
                    model: log.model,
                    endpoint: log.endpoint,
                    status: log.status,
                    latency_ms: log.latency,
                    tokens: log.tokens,
                    cost_usd: log.cost,
                    anomaly: !!log.anomaly,
                  }}
                />
                <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-primary">AI suggestion</span>
                    <p className="text-xs leading-relaxed text-muted-foreground">{log.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Field({ label, value, mutedBorder }: { label: string; value: string; mutedBorder?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className={cn("rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed", mutedBorder ? "border-border" : "border-border")}>
        {value}
      </p>
    </div>
  )
}
