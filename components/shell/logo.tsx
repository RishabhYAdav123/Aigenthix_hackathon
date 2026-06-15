import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground glow-ring",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="M12 2.5 4 7v10l8 4.5 8-4.5V7l-8-4.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        <path
          d="M12 4.6v5M12 14.4v5M5.3 8.2 9.6 10.7M14.4 13.3l4.3 2.5M18.7 8.2 14.4 10.7M9.6 13.3l-4.3 2.5"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
