// Deterministic-ish mock data generators for the Neuralyze observability platform.

export type Provider = "OpenAI" | "Gemini" | "Claude"

export const providers: { name: Provider; model: string; color: string }[] = [
  { name: "OpenAI", model: "gpt-5-mini", color: "var(--chart-1)" },
  { name: "Gemini", model: "gemini-3-flash", color: "var(--chart-2)" },
  { name: "Claude", model: "claude-opus-4.6", color: "var(--chart-3)" },
]

function rand(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function seededSeries(
  points: number,
  base: number,
  variance: number,
  seed = 1,
) {
  return Array.from({ length: points }, (_, i) => {
    const noise = (rand(seed + i) - 0.5) * variance
    const wave = Math.sin(i / 3) * variance * 0.4
    return Math.max(0, Math.round(base + noise + wave))
  })
}

export function timeLabels(points: number, stepMin = 5) {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => {
    const d = new Date(now - (points - 1 - i) * stepMin * 60_000)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  })
}

// ---- Traffic / requests over time ----
export function trafficData(points = 24) {
  const labels = timeLabels(points)
  const openai = seededSeries(points, 2400, 900, 3)
  const gemini = seededSeries(points, 1700, 700, 9)
  const claude = seededSeries(points, 1300, 600, 17)
  return labels.map((time, i) => ({
    time,
    openai: openai[i],
    gemini: gemini[i],
    claude: claude[i],
    total: openai[i] + gemini[i] + claude[i],
  }))
}

// ---- Token usage area ----
export function tokenUsageData(points = 24) {
  const labels = timeLabels(points)
  const input = seededSeries(points, 820000, 240000, 5)
  const output = seededSeries(points, 410000, 160000, 11)
  return labels.map((time, i) => ({
    time,
    input: input[i],
    output: output[i],
  }))
}

// ---- Cost analytics bar ----
export function costData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day, i) => ({
    day,
    openai: Math.round(420 + rand(i + 1) * 300),
    gemini: Math.round(260 + rand(i + 2) * 180),
    claude: Math.round(310 + rand(i + 3) * 220),
  }))
}

// ---- Latency distribution ----
export function latencyDistribution() {
  const buckets = ["0-200", "200-400", "400-600", "600-800", "800ms+"]
  const counts = [3200, 5400, 2800, 1200, 480]
  return buckets.map((bucket, i) => ({ bucket, count: counts[i] }))
}

// ---- Model usage pie ----
export function modelUsage() {
  return [
    { name: "OpenAI", value: 48, fill: "var(--chart-1)" },
    { name: "Gemini", value: 31, fill: "var(--chart-2)" },
    { name: "Claude", value: 21, fill: "var(--chart-3)" },
  ]
}

// ---- Error monitoring ----
export function errorData(points = 24) {
  const labels = timeLabels(points)
  const e4xx = seededSeries(points, 32, 40, 21)
  const e5xx = seededSeries(points, 8, 14, 29)
  return labels.map((time, i) => ({ time, e4xx: e4xx[i], e5xx: e5xx[i] }))
}

// ---- Active users ----
export function activeUsersData(points = 24) {
  const labels = timeLabels(points)
  const users = seededSeries(points, 1240, 380, 7)
  return labels.map((time, i) => ({ time, users: users[i] }))
}

// ---- Savings trend ----
export function savingsData(points = 12) {
  const labels = Array.from({ length: points }, (_, i) => `W${i + 1}`)
  const baseline = seededSeries(points, 9800, 600, 33)
  const optimized = baseline.map((b, i) => Math.round(b * (0.62 + rand(i) * 0.08)))
  return labels.map((week, i) => ({
    week,
    baseline: baseline[i],
    optimized: optimized[i],
    savings: baseline[i] - optimized[i],
  }))
}

export function sparkline(seed: number, points = 16, base = 50, variance = 30) {
  return seededSeries(points, base, variance, seed).map((v, i) => ({ i, v }))
}

// ---- KPI definitions ----
export type Kpi = {
  id: string
  label: string
  value: number
  display: (n: number) => string
  delta: number
  spark: { i: number; v: number }[]
  positive?: boolean
}

export const kpis: Kpi[] = [
  {
    id: "requests",
    label: "Total Requests",
    value: 1284930,
    display: (n) => Intl.NumberFormat("en", { notation: "compact" }).format(n),
    delta: 12.4,
    spark: sparkline(2, 16, 60, 40),
  },
  {
    id: "users",
    label: "Active Users",
    value: 18420,
    display: (n) => Intl.NumberFormat("en", { notation: "compact" }).format(n),
    delta: 8.1,
    spark: sparkline(5, 16, 50, 28),
  },
  {
    id: "latency",
    label: "Avg Latency",
    value: 412,
    display: (n) => `${Math.round(n)}ms`,
    delta: -6.3,
    positive: true,
    spark: sparkline(8, 16, 45, 22),
  },
  {
    id: "cost",
    label: "Spend (24h)",
    value: 4820,
    display: (n) => `$${Intl.NumberFormat("en").format(Math.round(n))}`,
    delta: -3.2,
    positive: true,
    spark: sparkline(11, 16, 55, 30),
  },
  {
    id: "tokens",
    label: "Token Usage",
    value: 38400000,
    display: (n) => Intl.NumberFormat("en", { notation: "compact" }).format(n),
    delta: 15.7,
    spark: sparkline(14, 16, 62, 36),
  },
  {
    id: "success",
    label: "Success Rate",
    value: 99.2,
    display: (n) => `${n.toFixed(1)}%`,
    delta: 0.4,
    spark: sparkline(17, 16, 70, 12),
  },
  {
    id: "optimizations",
    label: "Optimizations",
    value: 142,
    display: (n) => `${Math.round(n)}`,
    delta: 22.5,
    spark: sparkline(20, 16, 40, 30),
  },
  {
    id: "savings",
    label: "Est. Savings",
    value: 31200,
    display: (n) => `$${Intl.NumberFormat("en", { notation: "compact" }).format(n)}`,
    delta: 18.9,
    spark: sparkline(23, 16, 48, 26),
  },
]

// ---- Alerts ----
export type Severity = "critical" | "warning" | "info"
export type Alert = {
  id: string
  title: string
  category: string
  severity: Severity
  message: string
  time: string
  acknowledged: boolean
}

export const alerts: Alert[] = [
  {
    id: "alt-1029",
    title: "Cost spike on gpt-5-mini",
    category: "Cost Spike",
    severity: "critical",
    message: "Hourly spend exceeded $480 threshold (current $612). Driven by /summarize endpoint.",
    time: "2m ago",
    acknowledged: false,
  },
  {
    id: "alt-1028",
    title: "P95 latency above SLO",
    category: "Latency",
    severity: "critical",
    message: "claude-opus-4.6 P95 latency at 2,340ms over the last 5 minutes.",
    time: "9m ago",
    acknowledged: false,
  },
  {
    id: "alt-1027",
    title: "API failure rate elevated",
    category: "API Failures",
    severity: "warning",
    message: "5xx error rate at 2.1% on Gemini provider. Auto-retry engaged.",
    time: "21m ago",
    acknowledged: false,
  },
  {
    id: "alt-1026",
    title: "Token spike detected",
    category: "Token Spike",
    severity: "warning",
    message: "Prompt token volume +210% on RAG pipeline vs 7-day baseline.",
    time: "44m ago",
    acknowledged: true,
  },
  {
    id: "alt-1025",
    title: "Optimization opportunity",
    category: "Optimization",
    severity: "info",
    message: "Semantic cache could deflect 34% of repeated /faq prompts. Est. save $1,240/mo.",
    time: "1h ago",
    acknowledged: true,
  },
  {
    id: "alt-1024",
    title: "Model recommendation",
    category: "Optimization",
    severity: "info",
    message: "Route classification calls to gemini-3-flash for 41% lower cost at equal quality.",
    time: "2h ago",
    acknowledged: true,
  },
]

// ---- Logs ----
export type LogEntry = {
  id: string
  time: string
  provider: Provider
  model: string
  endpoint: string
  status: "success" | "error" | "warning"
  latency: number
  tokens: number
  cost: number
  prompt: string
  response: string
  anomaly?: boolean
  suggestion?: string
}

export const logs: LogEntry[] = Array.from({ length: 40 }, (_, i) => {
  const p = providers[i % 3]
  const statusRoll = rand(i + 50)
  const status: LogEntry["status"] =
    statusRoll > 0.92 ? "error" : statusRoll > 0.82 ? "warning" : "success"
  const endpoints = ["/v1/chat", "/v1/summarize", "/v1/rag", "/v1/classify", "/v1/embed"]
  return {
    id: `req_${(9284710 - i).toString()}`,
    time: new Date(Date.now() - i * 47_000).toLocaleTimeString(),
    provider: p.name,
    model: p.model,
    endpoint: endpoints[i % endpoints.length],
    status,
    latency: Math.round(180 + rand(i + 3) * 1400),
    tokens: Math.round(420 + rand(i + 7) * 3200),
    cost: Number((0.002 + rand(i + 9) * 0.06).toFixed(4)),
    prompt:
      "Summarize the quarterly revenue report and extract the top 3 risks mentioned by the CFO.",
    response:
      "Q3 revenue grew 18% YoY to $42.1M driven by enterprise expansion. Top risks: (1) FX exposure in EMEA, (2) elevated infra spend, (3) concentration in top 5 accounts.",
    anomaly: status === "error" || rand(i + 11) > 0.88,
    suggestion:
      status === "error"
        ? "Add exponential backoff and validate max_tokens; response was truncated."
        : "Cache this deterministic prompt — 71% similarity with 14 recent requests.",
  }
})

// ---- Sessions ----
export type Message = { role: "user" | "assistant" | "tool"; content: string; time: string }
export type Session = {
  id: string
  user: string
  title: string
  messages: number
  tokens: number
  cost: number
  duration: string
  status: "active" | "completed" | "error"
  model: Provider
  startedAt: string
  thread: Message[]
}

export const sessions: Session[] = Array.from({ length: 14 }, (_, i) => {
  const p = providers[i % 3]
  const names = [
    "alex.rivera", "j.chen", "maria.k", "devin.ops", "sara.lin",
    "omar.h", "priya.n", "lucas.b", "wei.zhang", "nora.f",
    "ibrahim.t", "elena.v", "kai.m", "tom.w",
  ]
  return {
    id: `sess_${(48210 - i).toString()}`,
    user: names[i],
    title: [
      "Contract clause extraction",
      "Customer support triage",
      "Code review assistant",
      "Financial report summary",
      "RAG knowledge lookup",
      "Marketing copy generation",
    ][i % 6],
    messages: Math.round(4 + rand(i) * 22),
    tokens: Math.round(2400 + rand(i + 2) * 18000),
    cost: Number((0.04 + rand(i + 4) * 1.8).toFixed(2)),
    duration: `${Math.round(1 + rand(i + 6) * 14)}m ${Math.round(rand(i + 8) * 59)}s`,
    status: rand(i + 10) > 0.85 ? "error" : rand(i + 10) > 0.6 ? "active" : "completed",
    model: p.name,
    startedAt: `${Math.round(1 + rand(i) * 58)}m ago`,
    thread: [
      { role: "user", content: "Extract all indemnification clauses from the attached MSA.", time: "10:24:01" },
      { role: "tool", content: "document.parse(file=msa_v4.pdf) → 32 pages, 14 sections", time: "10:24:02" },
      { role: "assistant", content: "Found 3 indemnification clauses in sections 8.1, 8.3 and 11.2. Section 8.1 caps liability at fees paid in the prior 12 months...", time: "10:24:05" },
      { role: "user", content: "Which one is most favorable to the vendor?", time: "10:24:40" },
      { role: "assistant", content: "Section 11.2 is most vendor-favorable — it excludes consequential damages and includes a mutual cap.", time: "10:24:43" },
    ],
  }
})

// ---- Top users ----
export type TopUser = {
  user: string
  org: string
  requests: number
  tokens: number
  cost: number
  trend: number
}

export const topUsers: TopUser[] = [
  { user: "alex.rivera", org: "Acme Corp", requests: 48210, tokens: 12_400_000, cost: 1284.4, trend: 12 },
  { user: "j.chen", org: "Northwind", requests: 39820, tokens: 9_800_000, cost: 982.1, trend: -4 },
  { user: "maria.k", org: "Globex", requests: 31290, tokens: 7_200_000, cost: 754.0, trend: 8 },
  { user: "devin.ops", org: "Initech", requests: 28110, tokens: 6_400_000, cost: 612.7, trend: 21 },
  { user: "sara.lin", org: "Hooli", requests: 24900, tokens: 5_100_000, cost: 489.3, trend: 3 },
  { user: "omar.h", org: "Soylent", requests: 19840, tokens: 4_300_000, cost: 401.8, trend: -2 },
]

// ---- Optimizer recommendations ----
export type Optimization = {
  id: string
  title: string
  category: "Model" | "Token" | "Cache" | "Prompt"
  confidence: number
  monthlySaving: number
  before: number
  after: number
  description: string
}

export const optimizations: Optimization[] = [
  {
    id: "opt-1",
    title: "Route classification to gemini-3-flash",
    category: "Model",
    confidence: 94,
    monthlySaving: 4820,
    before: 100,
    after: 41,
    description: "Classification calls show equal quality on gemini-3-flash at 59% lower cost per 1K tokens.",
  },
  {
    id: "opt-2",
    title: "Enable semantic cache on /faq",
    category: "Cache",
    confidence: 88,
    monthlySaving: 3120,
    before: 100,
    after: 34,
    description: "34% of /faq prompts are near-duplicates. A semantic cache deflects them with a 0.92 threshold.",
  },
  {
    id: "opt-3",
    title: "Compress RAG context window",
    category: "Token",
    confidence: 82,
    monthlySaving: 2410,
    before: 100,
    after: 63,
    description: "Average retrieved context is 8.2K tokens; reranking + dedup reduces to 5.1K with no recall loss.",
  },
  {
    id: "opt-4",
    title: "Trim system prompt boilerplate",
    category: "Prompt",
    confidence: 76,
    monthlySaving: 980,
    before: 100,
    after: 72,
    description: "System prompt contains 640 redundant tokens repeated across every call.",
  },
]

// ---- Evaluation ----
export function evalTrend(points = 12) {
  const labels = Array.from({ length: points }, (_, i) => `W${i + 1}`)
  const quality = seededSeries(points, 86, 8, 41).map((v) => Math.min(99, v))
  const helpfulness = seededSeries(points, 82, 9, 47).map((v) => Math.min(99, v))
  return labels.map((week, i) => ({ week, quality: quality[i], helpfulness: helpfulness[i] }))
}

// ---- Traces (waterfall spans) ----
export type Span = {
  id: string
  name: string
  kind: "agent" | "llm" | "tool" | "retrieval" | "embedding"
  start: number // ms offset from trace start
  duration: number // ms
  depth: number
  status: "ok" | "error"
  tokens?: number
  cost?: number
  model?: string
}

export type Trace = {
  id: string
  name: string
  user: string
  total: number // ms
  status: "ok" | "error"
  spans: Span[]
  tokens: number
  cost: number
  time: string
  model: Provider
}

function buildSpans(seed: number): Span[] {
  return [
    { id: "s1", name: "agent.run", kind: "agent", start: 0, duration: 1840, depth: 0, status: "ok" },
    { id: "s2", name: "plan.generate", kind: "llm", start: 40, duration: 380, depth: 1, status: "ok", tokens: 720, cost: 0.012, model: "gpt-5-mini" },
    { id: "s3", name: "vector.search", kind: "retrieval", start: 440, duration: 210, depth: 1, status: "ok", tokens: 0, cost: 0.0008 },
    { id: "s4", name: "embed.query", kind: "embedding", start: 440, duration: 90, depth: 2, status: "ok", tokens: 64, cost: 0.0001 },
    { id: "s5", name: "tool.web_search", kind: "tool", start: 660, duration: 520, depth: 1, status: seed % 5 === 0 ? "error" : "ok" },
    { id: "s6", name: "synthesize.answer", kind: "llm", start: 1200, duration: 600, depth: 1, status: "ok", tokens: 1480, cost: 0.031, model: "claude-opus-4.6" },
  ]
}

export const traces: Trace[] = Array.from({ length: 10 }, (_, i) => {
  const p = providers[i % 3]
  const spans = buildSpans(i)
  const err = spans.some((s) => s.status === "error")
  return {
    id: `trace_${(72910 - i).toString(16)}`,
    name: ["Contract analysis agent", "Support copilot", "RAG answer pipeline", "Code review agent"][i % 4],
    user: ["alex.rivera", "j.chen", "maria.k", "devin.ops"][i % 4],
    total: 1840,
    status: err ? "error" : "ok",
    spans,
    tokens: 2264,
    cost: 0.0439,
    time: `${Math.round(1 + rand(i) * 40)}m ago`,
    model: p.name,
  }
})

export const spanKindColor: Record<Span["kind"], string> = {
  agent: "var(--chart-4)",
  llm: "var(--chart-1)",
  tool: "var(--chart-5)",
  retrieval: "var(--chart-2)",
  embedding: "var(--chart-3)",
}

// ---- Monitor incidents ----
export type Incident = {
  id: string
  title: string
  metric: string
  value: string
  threshold: string
  status: "firing" | "resolved" | "pending"
  time: string
}

export const incidents: Incident[] = [
  { id: "inc-1", title: "High latency — claude-opus-4.6", metric: "P95 Latency", value: "2,340ms", threshold: "1,500ms", status: "firing", time: "9m" },
  { id: "inc-2", title: "Cost burn rate exceeded", metric: "Hourly Spend", value: "$612", threshold: "$480", status: "firing", time: "2m" },
  { id: "inc-3", title: "5xx errors on Gemini", metric: "Error Rate", value: "2.1%", threshold: "1.0%", status: "pending", time: "21m" },
  { id: "inc-4", title: "Token spike on RAG", metric: "Tokens/min", value: "+210%", threshold: "+100%", status: "resolved", time: "1h" },
]
