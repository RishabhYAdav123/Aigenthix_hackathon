import { cn } from "@/lib/utils"

const variants: Record<string, string> = {
  success: "bg-success/15 text-success border-success/20",
  active: "bg-primary/15 text-primary border-primary/20",
  completed: "bg-muted text-muted-foreground border-border",
  error: "bg-destructive/15 text-destructive border-destructive/20",
  warning: "bg-warning/15 text-warning border-warning/25",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
  info: "bg-primary/15 text-primary border-primary/20",
  firing: "bg-destructive/15 text-destructive border-destructive/20",
  resolved: "bg-success/15 text-success border-success/20",
  pending: "bg-warning/15 text-warning border-warning/25",
}

export function StatusBadge({
  status,
  label,
  dot = true,
  className,
}: {
  status: string
  label?: string
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        variants[status] ?? variants.completed,
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {label ?? status}
    </span>
  )
}
