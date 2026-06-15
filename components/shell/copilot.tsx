"use client"

import * as React from "react"
import { Sparkles, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useShell } from "./shell-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Logo } from "./logo"

type Msg = { role: "user" | "assistant"; content: string }

const suggestions = [
  "Why did costs spike in the last hour?",
  "Summarize today's error trends",
  "Which model should I switch to?",
  "Show my highest-latency endpoints",
]

const canned: Record<string, string> = {
  default:
    "Based on the last 24h of telemetry: total spend is $4,820 (down 3.2%), P95 latency is 412ms, and success rate is 99.2%. The biggest opportunity right now is routing classification calls to gemini-3-flash for an estimated $4,820/mo in savings.",
}

export function Copilot() {
  const { copilotOpen, setCopilotOpen } = useShell()
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi Alex — I'm your Neuralyze Copilot. I monitor your LLM telemetry in real time. Ask me anything about cost, latency, errors, or optimizations.",
    },
  ])
  const [input, setInput] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const ask = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: "user", content: text }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: "assistant", content: canned.default }])
    }, 1100)
  }

  return (
    <>
      {/* Floating launcher */}
      {!copilotOpen && (
        <button
          onClick={() => setCopilotOpen(true)}
          aria-label="Open AI copilot"
          className="group fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground glow-ring-strong transition-transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="size-6" />
          <span className="absolute -right-0.5 -top-0.5 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex size-3 rounded-full bg-success" />
          </span>
        </button>
      )}

      <Sheet open={copilotOpen} onOpenChange={setCopilotOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 border-l border-border bg-background/95 p-0 backdrop-blur-xl sm:max-w-md"
        >
          <SheetHeader className="flex-row items-center gap-3 border-b border-border p-4">
            <Logo />
            <div className="flex flex-1 flex-col">
              <SheetTitle className="text-base">Neuralyze Copilot</SheetTitle>
              <SheetDescription className="text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-success animate-pulse-dot" />
                  Connected to live telemetry
                </span>
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setCopilotOpen(false)}>
              <X className="size-4" />
            </Button>
          </SheetHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2.5",
                    m.role === "user" && "flex-row-reverse",
                  )}
                >
                  {m.role === "assistant" && (
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Sparkles className="size-3.5" />
                    </span>
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-card-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2.5">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 rounded-full bg-muted-foreground animate-pulse-dot"
                        style={{ animationDelay: `${d * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="flex items-center gap-2 border-t border-border p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your AI telemetry..."
              className="h-10 flex-1 rounded-lg border border-border bg-muted/40 px-3 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" size="icon" aria-label="Send" disabled={!input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
