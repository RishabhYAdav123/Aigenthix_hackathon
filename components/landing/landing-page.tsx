"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Activity,
  GitBranch,
  ShieldCheck,
  Gauge,
  Sparkles,
  Boxes,
  LineChart,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/shell/logo"
import { ThemeToggle } from "@/components/shell/theme-toggle"
import { Particles } from "@/components/shell/particles"

const features = [
  {
    icon: GitBranch,
    title: "Distributed Tracing",
    desc: "Follow every request across agents, tools, retrievals and model calls with waterfall spans.",
  },
  {
    icon: Gauge,
    title: "Cost Intelligence",
    desc: "Attribute spend down to the token, per user, per feature, per model — in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Eval & Guardrails",
    desc: "Catch hallucinations, regressions and policy violations before they reach production.",
  },
  {
    icon: Activity,
    title: "Live Monitoring",
    desc: "Sub-second telemetry on latency, throughput and error rates with smart anomaly alerts.",
  },
  {
    icon: Sparkles,
    title: "AI Optimizer",
    desc: "Autonomous recommendations that cut cost and latency while preserving quality.",
  },
  {
    icon: Boxes,
    title: "Workflow Graphs",
    desc: "Visualize complex multi-step agent pipelines and pinpoint bottlenecks instantly.",
  },
]

const stats = [
  { value: "2.4B+", label: "Spans traced / day" },
  { value: "38%", label: "Avg. cost reduction" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "<120ms", label: "Ingest latency p50" },
]

const logos = ["Vertex", "Northwind", "Quanta", "Helix AI", "Orbital", "Lumen"]

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Particles />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="size-8" />
          <span className="text-lg font-semibold tracking-tight">Neuralyze</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Platform
          </a>
          <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Performance
          </a>
          <a href="#cta" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button render={<Link href="/dashboard" />} variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button render={<Link href="/dashboard" />} className="glow-primary">
            Launch Console
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 pt-16 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="gap-2 rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <Zap className="size-3.5" />
            Now with autonomous AI cost optimization
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          Observability for the{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            age of AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Trace every prompt, optimize every token, and ship reliable LLM applications. Neuralyze gives engineering
          teams a real-time lens into the cost, quality and latency of production AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button render={<Link href="/dashboard" />} size="lg" className="glow-primary h-12 px-7 text-base">
            Open the live dashboard
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button render={<Link href="/tracing" />} size="lg" variant="outline" className="h-12 px-7 text-base">
            Explore tracing
          </Button>
        </motion.div>

        {/* Hero preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="glass-strong relative mt-16 w-full max-w-5xl overflow-hidden rounded-2xl border border-border/60 p-2 shadow-2xl"
        >
          <div className="rounded-xl border border-border/40 bg-card/60 p-1">
            <HeroPreview />
          </div>
          <div className="pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </section>

      {/* Logos */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by AI teams shipping at scale
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {logos.map((l) => (
            <span key={l} className="text-lg font-semibold tracking-tight text-muted-foreground/70">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex flex-col items-center gap-1 bg-card/80 px-6 py-10 text-center"
            >
              <span className="text-4xl font-semibold tracking-tight text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="rounded-full border-accent/30 bg-accent/5 text-accent">
            The platform
          </Badge>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Everything you need to run AI in production
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            One pane of glass for tracing, evaluation, monitoring and cost — purpose-built for LLM-native systems.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="glass group relative overflow-hidden rounded-2xl border border-border/60 p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl border border-border/60 px-8 py-16 text-center md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative">
            <LineChart className="mx-auto size-10 text-primary" />
            <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              See your AI like never before
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Spin up the console and explore a fully simulated production environment — live traces, cost flows and
              autonomous optimizations included.
            </p>
            <Button render={<Link href="/dashboard" />} size="lg" className="glow-primary mt-9 h-12 px-8 text-base">
              Launch the console
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Logo className="size-6" />
            <span className="font-semibold tracking-tight">Neuralyze</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Neuralyze, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function HeroPreview() {
  const bars = [42, 58, 49, 71, 63, 88, 76, 94, 81, 99, 90, 72, 84, 96]
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-3">
      <div className="rounded-lg border border-border/40 bg-background/40 p-4 sm:col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Token throughput</span>
          <Badge variant="outline" className="gap-1.5 border-accent/30 text-accent">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Live
          </Badge>
        </div>
        <div className="mt-4 flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.04 }}
              className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-border/40 bg-background/40 p-4">
          <span className="text-xs text-muted-foreground">Monthly spend</span>
          <p className="mt-1 text-2xl font-semibold tracking-tight">$48,210</p>
          <span className="text-xs text-accent">↓ 38% vs forecast</span>
        </div>
        <div className="rounded-lg border border-border/40 bg-background/40 p-4">
          <span className="text-xs text-muted-foreground">p95 latency</span>
          <p className="mt-1 text-2xl font-semibold tracking-tight">842ms</p>
          <span className="text-xs text-accent">↓ 12% this week</span>
        </div>
      </div>
    </div>
  )
}
