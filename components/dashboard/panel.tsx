import * as React from "react"
import { cn } from "@/lib/utils"

export function Panel({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5">
          <div className="flex flex-col gap-0.5">
            {title && (
              <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="flex shrink-0 items-center gap-1.5">{action}</div>}
        </header>
      )}
      <div className={cn("flex-1 p-4", contentClassName)}>{children}</div>
    </section>
  )
}
