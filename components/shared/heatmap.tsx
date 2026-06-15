"use client"

import * as React from "react"
import { heatmapData } from "@/lib/analytics-data"
import { cn } from "@/lib/utils"

export function ActivityHeatmap() {
  const data = React.useMemo(() => heatmapData(), [])
  const max = React.useMemo(
    () => Math.max(...data.flatMap((d) => d.hours.map((h) => h.value))),
    [data],
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        {data.map((row) => (
          <div key={row.day} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-[10px] font-medium text-muted-foreground">{row.day}</span>
            <div className="flex flex-1 gap-1">
              {row.hours.map((cell) => {
                const intensity = cell.value / max
                return (
                  <div
                    key={cell.hour}
                    title={`${row.day} ${cell.hour}:00 — ${cell.value} req`}
                    className={cn(
                      "h-4 flex-1 rounded-[3px] border border-border/50 transition-transform hover:scale-125",
                    )}
                    style={{
                      backgroundColor: `color-mix(in oklch, var(--primary) ${Math.round(
                        intensity * 100,
                      )}%, transparent)`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pl-10 text-[10px] text-muted-foreground">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        Less
        {[0.15, 0.4, 0.65, 0.9].map((o) => (
          <span
            key={o}
            className="size-3 rounded-[3px]"
            style={{ backgroundColor: `color-mix(in oklch, var(--primary) ${o * 100}%, transparent)` }}
          />
        ))}
        More
      </div>
    </div>
  )
}
