"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Sparkles, Plus, Download } from "lucide-react"
import { flatNav } from "@/lib/nav"
import { useShell } from "./shell-context"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import { toast } from "sonner"

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setCopilotOpen } = useShell()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const run = (fn: () => void) => {
    setCommandOpen(false)
    fn()
  }

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search pages, actions and telemetry..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {flatNav.map((item) => (
            <CommandItem
              key={item.href}
              value={item.title}
              onSelect={() => run(() => router.push(item.href))}
            >
              <item.icon />
              {item.title}
              <CommandShortcut>{item.description.split(",")[0]}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => setCopilotOpen(true))}>
            <Sparkles />
            Ask Neuralyze Copilot
          </CommandItem>
          <CommandItem onSelect={() => run(() => toast.success("New alert rule created"))}>
            <Plus />
            Create alert rule
          </CommandItem>
          <CommandItem onSelect={() => run(() => toast.success("Export started — CSV will download shortly"))}>
            <Download />
            Export dashboard data
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => run(() => setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun /> : <Moon />}
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
