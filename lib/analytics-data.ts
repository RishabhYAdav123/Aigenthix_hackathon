// Extended deterministic mock data for the intelligence / operations modules.
import { seededSeries } from "./mock-data"

function rand(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ---- Requests per user (bar) ----
export function requestsPerUser() {
  const users = ["alex.rivera", "j.chen", "maria.k", "devin.ops", "sara.lin", "omar.h", "priya.n", "lucas.b"]
  return users.map((user, i) => ({
    user,
    requests: Math.round(8000 + rand(i + 2) * 42000),
    cost: Math.round(120 + rand(i + 5) * 1100),
  }))
}

// ---- Cost per user (horizontal) ----
export function costPerUser() {
  return requestsPerUser()
    .map((u) => ({ user: u.user, cost: u.cost }))
    .sort((a, b) => b.cost - a.cost)
}

// ---- Retention cohort line ----
export function retentionData(points = 8) {
  const labels = Array.from({ length: points }, (_, i) => `D${i * 7}`)
  const newCohort = [100, 82, 71, 64, 58, 54, 51, 49]
  const power = [100, 94, 91, 89, 88, 87, 86, 86]
  return labels.map((day, i) => ({ day, all: newCohort[i], power: power[i] }))
}

// ---- Usage segmentation pie ----
export function segmentationData() {
  return [
    { name: "Chat", value: 42, fill: "var(--chart-1)" },
    { name: "RAG", value: 24, fill: "var(--chart-2)" },
    { name: "Classify", value: 18, fill: "var(--chart-3)" },
    { name: "Summarize", value: 11, fill: "var(--chart-4)" },
    { name: "Embed", value: 5, fill: "var(--chart-5)" },
  ]
}

// ---- Activity heatmap (7 days x 24 hours) ----
export function heatmapData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day, d) => ({
    day,
    hours: Array.from({ length: 24 }, (_, h) => {
      const business = h >= 8 && h <= 19 ? 1 : 0.35
      const weekend = d >= 5 ? 0.45 : 1
      const noise = rand(d * 24 + h)
      return {
        hour: h,
        value: Math.round(business * weekend * (40 + noise * 60)),
      }
    }),
  }))
}

// ---- Live requests-per-second for monitor ----
export function rpsSeries(points = 30) {
  const labels = Array.from({ length: points }, (_, i) => `${i}`)
  const rps = seededSeries(points, 1240, 320, 61)
  return labels.map((t, i) => ({ t, rps: rps[i] }))
}

// ---- Service status ----
export type Service = {
  name: string
  status: "operational" | "degraded" | "down"
  uptime: number
  latency: number
}
export const services: Service[] = [
  { name: "OpenAI Gateway", status: "operational", uptime: 99.98, latency: 312 },
  { name: "Gemini Gateway", status: "degraded", uptime: 99.41, latency: 684 },
  { name: "Claude Gateway", status: "operational", uptime: 99.95, latency: 421 },
  { name: "Vector Store", status: "operational", uptime: 99.99, latency: 38 },
  { name: "Semantic Cache", status: "operational", uptime: 100, latency: 6 },
  { name: "Trace Collector", status: "operational", uptime: 99.97, latency: 22 },
]

// ---- Monitor thresholds ----
export type Monitor = {
  id: string
  title: string
  metric: string
  value: number
  threshold: number
  unit: string
  kind: "latency" | "error" | "cost" | "token"
  series: { i: number; v: number }[]
}
export const monitors: Monitor[] = [
  {
    id: "m1",
    title: "High Latency",
    metric: "P95 latency",
    value: 1340,
    threshold: 1500,
    unit: "ms",
    kind: "latency",
    series: seededSeries(20, 60, 30, 5).map((v, i) => ({ i, v })),
  },
  {
    id: "m2",
    title: "Error Rate",
    metric: "5xx errors",
    value: 0.8,
    threshold: 1,
    unit: "%",
    kind: "error",
    series: seededSeries(20, 40, 24, 9).map((v, i) => ({ i, v })),
  },
  {
    id: "m3",
    title: "Cost Burn",
    metric: "Hourly spend",
    value: 612,
    threshold: 480,
    unit: "$",
    kind: "cost",
    series: seededSeries(20, 55, 28, 13).map((v, i) => ({ i, v })),
  },
  {
    id: "m4",
    title: "Token Spike",
    metric: "Tokens / min",
    value: 184,
    threshold: 100,
    unit: "%",
    kind: "token",
    series: seededSeries(20, 50, 40, 17).map((v, i) => ({ i, v })),
  },
]

// ---- Evaluation ----
export function feedbackData(points = 12) {
  const labels = Array.from({ length: points }, (_, i) => `W${i + 1}`)
  const up = seededSeries(points, 320, 90, 71)
  const down = seededSeries(points, 48, 30, 73)
  return labels.map((week, i) => ({ week, up: up[i], down: down[i] }))
}

export function ratingDistribution() {
  return [
    { rating: "1★", count: 142 },
    { rating: "2★", count: 318 },
    { rating: "3★", count: 980 },
    { rating: "4★", count: 3120 },
    { rating: "5★", count: 5840 },
  ]
}

export function benchmarkData() {
  return [
    { metric: "Accuracy", value: 92 },
    { metric: "Helpfulness", value: 88 },
    { metric: "Coherence", value: 94 },
    { metric: "Safety", value: 97 },
    { metric: "Latency", value: 81 },
    { metric: "Cost", value: 86 },
  ]
}

export type Scorecard = {
  label: string
  score: number
  delta: number
  color: string
}
export const scorecards: Scorecard[] = [
  { label: "Quality Score", score: 92, delta: 2.4, color: "var(--chart-1)" },
  { label: "Helpfulness", score: 88, delta: 1.1, color: "var(--chart-3)" },
  { label: "User Rating", score: 4.6, delta: 0.2, color: "var(--chart-4)" },
  { label: "Hallucination Risk", score: 6, delta: -1.8, color: "var(--chart-5)" },
]

// ---- Optimizer projection ----
export function projectionData(points = 12) {
  const labels = Array.from({ length: points }, (_, i) => `M${i + 1}`)
  let current = 9800
  return labels.map((month, i) => {
    const optimized = Math.round(current * (1 - Math.min(0.42, i * 0.045)))
    const out = { month, current: Math.round(current), optimized }
    current = Math.round(current * 1.06)
    return out
  })
}

export type PromptOpt = {
  id: string
  label: string
  before: number
  after: number
  saving: string
}
export const promptOpts: PromptOpt[] = [
  { id: "p1", label: "System prompt dedup", before: 1240, after: 600, saving: "52%" },
  { id: "p2", label: "Few-shot example trim", before: 820, after: 410, saving: "50%" },
  { id: "p3", label: "RAG context rerank", before: 8200, after: 5100, saving: "38%" },
  { id: "p4", label: "Output schema constraint", before: 1480, after: 940, saving: "36%" },
]

// ---- API providers (settings + monitor health) ----
export type ProviderHealth = {
  name: string
  model: string
  status: "connected" | "disconnected"
  latency: number
  errorRate: number
}
export const providerHealth: ProviderHealth[] = [
  { name: "OpenAI", model: "gpt-5-mini", status: "connected", latency: 312, errorRate: 0.4 },
  { name: "Gemini", model: "gemini-3-flash", status: "connected", latency: 684, errorRate: 2.1 },
  { name: "Claude", model: "claude-opus-4.6", status: "connected", latency: 421, errorRate: 0.6 },
]

// ---- Alert rules ----
export type AlertRule = {
  id: string
  name: string
  condition: string
  channel: "Slack" | "Email" | "Webhook" | "PagerDuty"
  enabled: boolean
}
export const alertRules: AlertRule[] = [
  { id: "r1", name: "Cost spike", condition: "Hourly spend > $480", channel: "Slack", enabled: true },
  { id: "r2", name: "Latency SLO breach", condition: "P95 latency > 1500ms", channel: "PagerDuty", enabled: true },
  { id: "r3", name: "Error surge", condition: "5xx rate > 1% for 5m", channel: "Email", enabled: true },
  { id: "r4", name: "Token anomaly", condition: "Tokens/min > +100% baseline", channel: "Webhook", enabled: false },
  { id: "r5", name: "Optimization found", condition: "Est. savings > $500/mo", channel: "Slack", enabled: true },
]
