"use client"

import * as React from "react"
import {
  KeyRound,
  Cpu,
  BellRing,
  SlidersHorizontal,
  Copy,
  RotateCw,
  Eye,
  EyeOff,
  Check,
  Plus,
} from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { providerHealth, alertRules, type AlertRule } from "@/lib/analytics-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const tabs = [
  { value: "providers", label: "API & Providers", icon: KeyRound },
  { value: "models", label: "Models", icon: Cpu },
  { value: "alerts", label: "Alert Rules", icon: BellRing },
  { value: "workspace", label: "Workspace", icon: SlidersHorizontal },
]

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <PageHeader title="Settings" description="API keys, model defaults, alert rules and workspace preferences." showActions={false} />

      <Tabs defaultValue="providers" className="gap-6">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-card p-1">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
              <t.icon className="size-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="providers" className="flex flex-col gap-4">
          <ApiKeysPanel />
          <ProvidersPanel />
        </TabsContent>

        <TabsContent value="models">
          <ModelsPanel />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertRulesPanel />
        </TabsContent>

        <TabsContent value="workspace">
          <WorkspacePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiKeysPanel() {
  const [revealed, setRevealed] = React.useState(false)
  const key = "nlz_live_8f4c2a91d7e6b305f1c9a8d4e2b7"
  const masked = "nlz_live_" + "•".repeat(20)
  return (
    <Panel title="Workspace API key" description="Use this key to send telemetry to Neuralyze." contentClassName="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="api-key">Secret key</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="api-key"
            readOnly
            value={revealed ? key : masked}
            className="font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label={revealed ? "Hide key" : "Reveal key"} onClick={() => setRevealed((v) => !v)}>
              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Copy key"
              onClick={() => {
                navigator.clipboard?.writeText(key)
                toast.success("API key copied to clipboard")
              }}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("API key rotated", { description: "Previous key is valid for 24h." })}
            >
              <RotateCw className="size-4" data-icon="inline-start" />
              Rotate
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Keep this secret. Rotate immediately if it leaks.</p>
      </div>
    </Panel>
  )
}

function ProvidersPanel() {
  const [keys, setKeys] = React.useState<Record<string, boolean>>({
    OpenAI: true,
    Gemini: true,
    Claude: true,
  })
  return (
    <Panel title="Model providers" description="Connect inference providers and bring your own keys." contentClassName="flex flex-col gap-3">
      {providerHealth.map((prov) => {
        const connected = keys[prov.name]
        return (
          <div key={prov.name} className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 font-semibold text-primary">
                {prov.name[0]}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{prov.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{prov.model}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={cn(connected ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                {connected ? "Connected" : "Disconnected"}
              </Badge>
              <Switch
                checked={connected}
                onCheckedChange={(v) => {
                  setKeys((prev) => ({ ...prev, [prov.name]: v }))
                  toast[v ? "success" : "message"](`${prov.name} ${v ? "connected" : "disconnected"}`)
                }}
                aria-label={`Toggle ${prov.name}`}
              />
            </div>
          </div>
        )
      })}
      <Button variant="outline" size="sm" className="self-start" onClick={() => toast("Add provider", { description: "Choose from 14 supported gateways." })}>
        <Plus className="size-4" data-icon="inline-start" />
        Add provider
      </Button>
    </Panel>
  )
}

function ModelsPanel() {
  const [temperature, setTemperature] = React.useState([0.7])
  const [maxTokens, setMaxTokens] = React.useState([2048])
  return (
    <Panel title="Model defaults" description="Applied to new traces unless overridden per request." contentClassName="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Default model</Label>
          <Select defaultValue="gpt-5-mini">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-5-mini">OpenAI · gpt-5-mini</SelectItem>
              <SelectItem value="claude-opus-4.6">Anthropic · claude-opus-4.6</SelectItem>
              <SelectItem value="gemini-3-flash">Google · gemini-3-flash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Fallback model</Label>
          <Select defaultValue="gemini-3-flash">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-3-flash">Google · gemini-3-flash</SelectItem>
              <SelectItem value="gpt-5-mini">OpenAI · gpt-5-mini</SelectItem>
              <SelectItem value="claude-opus-4.6">Anthropic · claude-opus-4.6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Temperature</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">{temperature[0].toFixed(2)}</span>
        </div>
        <Slider value={temperature} onValueChange={setTemperature} min={0} max={2} step={0.05} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Max output tokens</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">{maxTokens[0].toLocaleString()}</span>
        </div>
        <Slider value={maxTokens} onValueChange={setMaxTokens} min={256} max={8192} step={256} />
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <ToggleRow label="Semantic caching" description="Reuse responses for near-duplicate prompts." defaultChecked />
        <ToggleRow label="Auto model routing" description="Let the optimizer pick the cheapest model that meets quality." defaultChecked />
        <ToggleRow label="Streaming responses" description="Stream tokens to clients as they are generated." defaultChecked />
      </div>

      <Button className="self-start" onClick={() => toast.success("Model defaults saved")}>
        <Check className="size-4" data-icon="inline-start" />
        Save changes
      </Button>
    </Panel>
  )
}

function AlertRulesPanel() {
  const [rules, setRules] = React.useState<AlertRule[]>(alertRules)
  return (
    <Panel title="Alert rules" description="Trigger notifications when thresholds are crossed." contentClassName="flex flex-col gap-3">
      {rules.map((rule) => (
        <div key={rule.id} className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{rule.name}</span>
              <Badge variant="outline" className="font-normal">{rule.channel}</Badge>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{rule.condition}</span>
          </div>
          <Switch
            checked={rule.enabled}
            onCheckedChange={(v) => {
              setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: v } : r)))
              toast[v ? "success" : "message"](`${rule.name} ${v ? "enabled" : "disabled"}`)
            }}
            aria-label={`Toggle ${rule.name}`}
          />
        </div>
      ))}
      <Button variant="outline" size="sm" className="self-start" onClick={() => toast("New alert rule", { description: "Define a condition and channel." })}>
        <Plus className="size-4" data-icon="inline-start" />
        New rule
      </Button>
    </Panel>
  )
}

function WorkspacePanel() {
  return (
    <Panel title="Workspace preferences" description="General settings for the Neuralyze workspace." contentClassName="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ws-name">Workspace name</Label>
          <Input id="ws-name" defaultValue="Neuralyze Production" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Data retention</Label>
          <Select defaultValue="90">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Timezone</Label>
          <Select defaultValue="utc">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="pst">Pacific (PST)</SelectItem>
              <SelectItem value="est">Eastern (EST)</SelectItem>
              <SelectItem value="cet">Central Europe (CET)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Currency</Label>
          <Select defaultValue="usd">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD ($)</SelectItem>
              <SelectItem value="eur">EUR (€)</SelectItem>
              <SelectItem value="gbp">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <ToggleRow label="PII redaction" description="Automatically scrub emails, keys and tokens from logs." defaultChecked />
        <ToggleRow label="Weekly digest email" description="Receive a summary of cost, quality and incidents." defaultChecked />
        <ToggleRow label="Anonymous usage analytics" description="Help improve Neuralyze with anonymized metrics." />
      </div>

      <Button className="self-start" onClick={() => toast.success("Workspace settings saved")}>
        <Check className="size-4" data-icon="inline-start" />
        Save changes
      </Button>
    </Panel>
  )
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [on, setOn] = React.useState(!!defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Switch checked={on} onCheckedChange={setOn} aria-label={label} />
    </div>
  )
}
