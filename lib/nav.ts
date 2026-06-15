import {
  LayoutDashboard,
  GitBranch,
  MessagesSquare,
  Users,
  Activity,
  BellRing,
  Workflow,
  ScrollText,
  Gauge,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  description: string
  badge?: string
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Realtime KPIs, traffic, cost and optimization summary",
      },
      {
        title: "Tracing",
        href: "/tracing",
        icon: GitBranch,
        description: "Execution trees, spans and latency waterfalls",
      },
      {
        title: "Sessions",
        href: "/sessions",
        icon: MessagesSquare,
        description: "Conversation history and session replay",
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        title: "User Analytics",
        href: "/users",
        icon: Users,
        description: "Requests, retention and cost per user",
      },
      {
        title: "AI Workflow",
        href: "/workflow",
        icon: Workflow,
        description: "Agent flows, tool and RAG pipelines",
      },
      {
        title: "Evaluation",
        href: "/evaluation",
        icon: Gauge,
        description: "Quality scores, feedback and hallucination risk",
      },
      {
        title: "AI Optimizer",
        href: "/optimizer",
        icon: Sparkles,
        description: "Cost reduction and model recommendations",
        badge: "AI",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Monitor",
        href: "/monitor",
        icon: Activity,
        description: "System health, latency and cost monitoring",
      },
      {
        title: "Alerts",
        href: "/alerts",
        icon: BellRing,
        description: "Failures, spikes and alert rules",
        badge: "3",
      },
      {
        title: "Logs",
        href: "/logs",
        icon: ScrollText,
        description: "Raw prompts, responses and AI suggestions",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "API keys, models and workspace preferences",
      },
    ],
  },
]

export const flatNav: NavItem[] = navSections.flatMap((s) => s.items)
