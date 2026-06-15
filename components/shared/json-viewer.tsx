"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

/** Lightweight, dependency-free syntax highlighter for JSON. */
function highlight(json: string) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-chart-4" // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-primary font-medium" : "text-chart-3"
      } else if (/true|false/.test(match)) {
        cls = "text-chart-2"
      } else if (/null/.test(match)) {
        cls = "text-muted-foreground"
      }
      return `<span class="${cls}">${match}</span>`
    },
  )
}

export function JsonViewer({
  data,
  className,
  copyable = true,
  maxHeight,
}: {
  data: unknown
  className?: string
  copyable?: boolean
  maxHeight?: number
}) {
  const [copied, setCopied] = React.useState(false)
  const json = React.useMemo(
    () => (typeof data === "string" ? data : JSON.stringify(data, null, 2)),
    [data],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Copy failed")
    }
  }

  return (
    <div className={cn("group relative rounded-lg border border-border bg-muted/40", className)}>
      {copyable && (
        <button
          onClick={copy}
          aria-label="Copy JSON"
          className="absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground opacity-0 backdrop-blur transition hover:text-foreground group-hover:opacity-100"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      )}
      <pre
        className="overflow-auto p-3 font-mono text-xs leading-relaxed"
        style={{ maxHeight }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(json) }} />
      </pre>
    </div>
  )
}
