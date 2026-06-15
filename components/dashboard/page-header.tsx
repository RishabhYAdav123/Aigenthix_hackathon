"use client"

import * as React from "react"
import { Download, RefreshCw, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function PageHeader({
  title,
  description,
  children,
  showActions = true,
}: {
  title: string
  description?: string
  children?: React.ReactNode
  showActions?: boolean
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {showActions && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Refreshing telemetry…", { description: "Pulling the latest spans and metrics." })}
            >
              <Calendar className="size-4" data-icon="inline-start" />
              Last 24h
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Refresh"
              onClick={() => toast.success("Telemetry refreshed")}
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success("Export started", { description: "Your CSV/PDF will be ready shortly." })}
            >
              <Download className="size-4" data-icon="inline-start" />
              Export
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
