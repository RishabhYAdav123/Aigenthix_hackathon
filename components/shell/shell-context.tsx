"use client"

import * as React from "react"

type ShellContextType = {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggleCollapsed: () => void
  commandOpen: boolean
  setCommandOpen: (v: boolean) => void
  copilotOpen: boolean
  setCopilotOpen: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const ShellContext = React.createContext<ShellContextType | null>(null)

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [copilotOpen, setCopilotOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <ShellContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapsed: () => setCollapsed((c) => !c),
        commandOpen,
        setCommandOpen,
        copilotOpen,
        setCopilotOpen,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </ShellContext.Provider>
  )
}

export function useShell() {
  const ctx = React.useContext(ShellContext)
  if (!ctx) throw new Error("useShell must be used within ShellProvider")
  return ctx
}
