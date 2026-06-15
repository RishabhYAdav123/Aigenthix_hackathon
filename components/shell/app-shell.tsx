"use client"

import * as React from "react"
import { ShellProvider, useShell } from "./shell-context"
import { Sidebar, SidebarContent } from "./sidebar"
import { Topbar } from "./topbar"
import { CommandPalette } from "./command-palette"
import { Copilot } from "./copilot"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"

function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useShell()
  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full">
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-60" />
      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <Sidebar />
      <MobileSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
      <CommandPalette />
      <Copilot />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <Shell>{children}</Shell>
    </ShellProvider>
  )
}
