"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MessageSquare, Coins, Clock, User, Bot, Wrench, ChevronDown, Play } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { sessions, type Session, type Message } from "@/lib/mock-data"
import { toast } from "sonner"

const roleMeta = {
  user: { icon: User, color: "var(--chart-2)", label: "User" },
  assistant: { icon: Bot, color: "var(--chart-1)", label: "Assistant" },
  tool: { icon: Wrench, color: "var(--chart-4)", label: "Tool" },
} as const

const filters = ["all", "active", "completed", "error"] as const

export default function SessionsPage() {
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("all")
  const [openId, setOpenId] = React.useState<string | null>(sessions[0].id)

  const filtered = sessions.filter((s) => {
    const matchesQuery =
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.user.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === "all" || s.status === filter
    return matchesQuery && matchesFilter
  })

  const totals = sessions.reduce(
    (acc, s) => ({
      messages: acc.messages + s.messages,
      tokens: acc.tokens + s.tokens,
      cost: acc.cost + s.cost,
    }),
    { messages: 0, tokens: 0, cost: 0 },
  )

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Sessions"
        description="Conversation history, session replay and per-session analytics."
      />

      {/* Analytics summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard icon={MessageSquare} label="Total Sessions" value={sessions.length.toString()} hint="last 24h" />
        <SummaryCard icon={Bot} label="Messages" value={totals.messages.toLocaleString()} hint="across sessions" />
        <SummaryCard icon={Coins} label="Tokens" value={`${(totals.tokens / 1000).toFixed(1)}K`} hint="consumed" />
        <SummaryCard icon={Clock} label="Total Cost" value={`$${totals.cost.toFixed(2)}`} hint="billed" />
      </div>

      <Panel
        title="Conversation history"
        description={`${filtered.length} sessions`}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sessions…"
                className="h-8 w-44 pl-8 text-sm"
              />
            </div>
            <div className="hidden items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5 sm:flex">
              {filters.map((f) => (
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
          </div>
        }
        contentClassName="flex flex-col gap-2"
      >
        {filtered.map((s) => (
          <SessionRow key={s.id} session={s} open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? null : s.id)} />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No sessions match your filters.</p>
        )}
      </Panel>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

function SessionRow({ session, open, onToggle }: { session: Session; open: boolean; onToggle: () => void }) {
  return (
    <div className={cn("rounded-xl border bg-card transition-colors", open ? "border-primary/40" : "border-border hover:border-border")}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <MessageSquare className="size-4 text-primary" />
          {session.status === "active" && (
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-success ring-2 ring-card animate-pulse" />
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{session.title}</span>
            <StatusBadge status={session.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="font-mono">{session.id}</span>
            <span>@{session.user}</span>
            <span>{session.model}</span>
            <span>{session.startedAt}</span>
          </div>
        </div>
        <div className="hidden items-center gap-4 text-right sm:flex">
          <Metric label="msgs" value={session.messages.toString()} />
          <Metric label="tokens" value={`${(session.tokens / 1000).toFixed(1)}K`} />
          <Metric label="cost" value={`$${session.cost.toFixed(2)}`} />
          <Metric label="duration" value={session.duration} />
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
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
            <div className="border-t border-border px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Session replay</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast("Replaying session…", { description: `${session.id} · ${session.messages} messages` })}
                >
                  <Play className="size-3.5" data-icon="inline-start" />
                  Replay
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {session.thread.map((m, i) => (
                  <MessageBubble key={i} message={m} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium tabular-nums">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const meta = roleMeta[message.role]
  const Icon = meta.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex gap-3"
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in oklch, ${meta.color} 18%, transparent)`, color: meta.color }}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{meta.label}</span>
          <span className="text-[10px] text-muted-foreground">{message.time}</span>
        </div>
        <div
          className={cn(
            "rounded-lg border border-border px-3 py-2 text-sm leading-relaxed",
            message.role === "tool" ? "bg-muted/40 font-mono text-xs text-muted-foreground" : "bg-muted/30",
          )}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}
