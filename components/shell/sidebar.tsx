"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeft, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { navSections } from "@/lib/nav"
import { Logo } from "./logo"
import { useShell } from "./shell-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { collapsed, toggleCollapsed } = useShell()

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <Logo />
        {!collapsed && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold tracking-tight">
              Neuralyze
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              AI Observability
            </span>
          </div>
        )}
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-6">
          {navSections.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              {!collapsed && (
                <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => {
                const active = pathname === item.href
                const link = (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground glow-ring"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <item.icon
                      className={cn(
                        "size-4 shrink-0",
                        active && "text-primary",
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "AI" ? "default" : "secondary"}
                            className="ml-auto h-4 px-1.5 text-[10px]"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                )
                return collapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger render={link} />
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              Upgrade to Scale
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlock unlimited traces and AI auto-optimization.
            </p>
            <Button size="sm" className="mt-3 w-full">
              Upgrade
              <ChevronRight className="size-3.5" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={toggleCollapsed}
          className={cn("w-full text-muted-foreground", collapsed && "w-auto")}
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" data-icon="inline-start" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { collapsed } = useShell()
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-[width] duration-300 lg:block",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <SidebarContent />
    </aside>
  )
}
