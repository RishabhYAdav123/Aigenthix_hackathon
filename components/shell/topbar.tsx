"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Search,
  Bell,
  ChevronDown,
  Check,
  Menu,
  Sparkles,
  Command as CommandIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { flatNav } from "@/lib/nav"
import { alerts } from "@/lib/mock-data"
import { useShell } from "./shell-context"
import { useTelemetryClock } from "@/lib/use-realtime"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const workspaces = [
  { name: "Acme Production", plan: "Enterprise" },
  { name: "Acme Staging", plan: "Pro" },
  { name: "Research Lab", plan: "Team" },
]

const severityColor: Record<string, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  info: "bg-primary",
}

export function Topbar() {
  const pathname = usePathname()
  const { setCommandOpen, setCopilotOpen, setMobileOpen } = useShell()
  const tick = useTelemetryClock()
  const [workspace, setWorkspace] = React.useState(workspaces[0])

  const current = flatNav.find((n) => n.href === pathname)
  const unread = alerts.filter((a) => !a.acknowledged).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Workspace selector */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse-dot" />
              <span className="hidden max-w-32 truncate sm:inline">
                {workspace.name}
              </span>
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuGroup>
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.name}
                onClick={() => setWorkspace(ws)}
                className="flex items-center justify-between"
              >
                <span className="flex flex-col">
                  <span className="text-sm">{ws.name}</span>
                  <span className="text-xs text-muted-foreground">{ws.plan}</span>
                </span>
                {ws.name === workspace.name && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="hidden h-6 md:block" />

      <div className="hidden flex-col md:flex">
        <span className="text-sm font-medium leading-none">
          {current?.title ?? "Overview"}
        </span>
      </div>

      {/* Global search trigger */}
      <button
        onClick={() => setCommandOpen(true)}
        className="group ml-auto flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:w-64"
      >
        <Search className="size-4" />
        <span className="hidden md:inline">Search or jump to...</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium md:inline-flex">
          <CommandIcon className="size-3" />K
        </kbd>
      </button>

      {/* Live telemetry status */}
      <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 lg:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Live
          <span className="ml-1 tabular-nums text-foreground">{tick}s</span>
        </span>
      </div>

      {/* Copilot */}
      <Button
        variant="outline"
        size="icon"
        aria-label="Open AI copilot"
        onClick={() => setCopilotOpen(true)}
        className="text-primary"
      >
        <Sparkles className="size-4" />
      </Button>

      <ThemeToggle />

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            <Badge variant="secondary" className="text-[10px]">{unread} new</Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-80 overflow-y-auto">
            {alerts.slice(0, 5).map((a) => (
              <DropdownMenuItem key={a.id} className="flex items-start gap-2.5 py-2.5">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    severityColor[a.severity],
                  )}
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{a.title}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {a.message}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{a.time}</span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button aria-label="Account" className="rounded-full outline-none">
              <Avatar className="size-9 border border-border">
                <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                  AR
                </AvatarFallback>
              </Avatar>
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm">Alex Rivera</span>
            <span className="text-xs font-normal text-muted-foreground">
              alex@acme.com
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
