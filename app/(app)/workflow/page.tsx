"use client"

import * as React from "react"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Play, RotateCcw } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Panel } from "@/components/dashboard/panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlowNode, type FlowNodeData } from "@/components/workflow/flow-node"
import { cn } from "@/lib/utils"

const nodeTypes = { flow: FlowNode }

type Pipeline = {
  id: string
  name: string
  description: string
  nodes: Node<FlowNodeData>[]
  edges: Edge[]
  order: string[]
}

function edge(id: string, source: string, target: string): Edge {
  return {
    id,
    source,
    target,
    animated: true,
    style: { stroke: "var(--primary)", strokeWidth: 2, opacity: 0.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--primary)" },
  }
}

const baseNode = (id: string, x: number, y: number, data: FlowNodeData): Node<FlowNodeData> => ({
  id,
  type: "flow",
  position: { x, y },
  data: { ...data, status: "idle" },
})

const pipelines: Pipeline[] = [
  {
    id: "agent",
    name: "Agent Flow",
    description: "Autonomous reasoning agent with tool use",
    order: ["a1", "a2", "a3", "a4", "a5"],
    nodes: [
      baseNode("a1", 0, 120, { label: "User Query", kind: "input", detail: "inbound request", metric: "1 req" }),
      baseNode("a2", 260, 120, { label: "Planner", kind: "agent", detail: "gpt-5-mini", metric: "720 tok" }),
      baseNode("a3", 520, 20, { label: "Web Search", kind: "tool", detail: "tool call", metric: "520ms" }),
      baseNode("a4", 520, 220, { label: "Synthesize", kind: "llm", detail: "claude-opus-4.6", metric: "1.48K tok" }),
      baseNode("a5", 800, 120, { label: "Response", kind: "output", detail: "final answer", metric: "1.84s" }),
    ],
    edges: [edge("e1", "a1", "a2"), edge("e2", "a2", "a3"), edge("e3", "a2", "a4"), edge("e4", "a3", "a4"), edge("e5", "a4", "a5")],
  },
  {
    id: "tool",
    name: "Tool Pipeline",
    description: "Structured multi-tool execution chain",
    order: ["t1", "t2", "t3", "t4", "t5"],
    nodes: [
      baseNode("t1", 0, 120, { label: "Request", kind: "input", detail: "function call", metric: "1 req" }),
      baseNode("t2", 260, 120, { label: "Router", kind: "agent", detail: "intent classify", metric: "120ms" }),
      baseNode("t3", 520, 30, { label: "DB Query", kind: "tool", detail: "postgres", metric: "84ms" }),
      baseNode("t4", 520, 210, { label: "API Call", kind: "tool", detail: "REST", metric: "210ms" }),
      baseNode("t5", 800, 120, { label: "Aggregate", kind: "output", detail: "merged result", metric: "412ms" }),
    ],
    edges: [edge("te1", "t1", "t2"), edge("te2", "t2", "t3"), edge("te3", "t2", "t4"), edge("te4", "t3", "t5"), edge("te5", "t4", "t5")],
  },
  {
    id: "rag",
    name: "RAG Pipeline",
    description: "Retrieval-augmented generation flow",
    order: ["r1", "r2", "r3", "r4", "r5", "r6"],
    nodes: [
      baseNode("r1", 0, 120, { label: "Query", kind: "input", detail: "user prompt", metric: "1 req" }),
      baseNode("r2", 230, 120, { label: "Embed", kind: "retrieval", detail: "text-embed-3", metric: "64 tok" }),
      baseNode("r3", 460, 30, { label: "Vector Search", kind: "retrieval", detail: "top-k 8", metric: "38ms" }),
      baseNode("r4", 460, 210, { label: "Rerank", kind: "tool", detail: "cross-encoder", metric: "52ms" }),
      baseNode("r5", 700, 120, { label: "Generate", kind: "llm", detail: "gpt-5-mini", metric: "1.2K tok" }),
      baseNode("r6", 940, 120, { label: "Answer", kind: "output", detail: "grounded", metric: "1.1s" }),
    ],
    edges: [edge("re1", "r1", "r2"), edge("re2", "r2", "r3"), edge("re3", "r3", "r4"), edge("re4", "r4", "r5"), edge("re5", "r5", "r6")],
  },
  {
    id: "optimizer",
    name: "Optimization Agent",
    description: "Continuous cost & quality optimization loop",
    order: ["o1", "o2", "o3", "o4", "o5"],
    nodes: [
      baseNode("o1", 0, 120, { label: "Telemetry", kind: "input", detail: "traces + cost", metric: "38M tok" }),
      baseNode("o2", 260, 120, { label: "Analyzer", kind: "optimizer", detail: "pattern mining", metric: "142 found" }),
      baseNode("o3", 540, 30, { label: "Semantic Cache", kind: "cache", detail: "0.92 threshold", metric: "34% hit" }),
      baseNode("o4", 540, 210, { label: "Model Router", kind: "agent", detail: "cost-aware", metric: "-59%" }),
      baseNode("o5", 820, 120, { label: "Savings", kind: "output", detail: "applied", metric: "$31.2k/mo" }),
    ],
    edges: [edge("oe1", "o1", "o2"), edge("oe2", "o2", "o3"), edge("oe3", "o2", "o4"), edge("oe4", "o3", "o5"), edge("oe5", "o4", "o5")],
  },
]

export default function WorkflowPage() {
  const [activeId, setActiveId] = React.useState(pipelines[0].id)
  const active = pipelines.find((p) => p.id === activeId)!
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(active.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(active.edges)
  const [running, setRunning] = React.useState(false)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  const loadPipeline = React.useCallback(
    (p: Pipeline) => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      setRunning(false)
      setNodes(p.nodes.map((n) => ({ ...n, data: { ...n.data, status: "idle" } })))
      setEdges(p.edges.map((e) => ({ ...e, style: { ...e.style, opacity: 0.5 } })))
    },
    [setNodes, setEdges],
  )

  const setNodeStatus = React.useCallback(
    (id: string, status: FlowNodeData["status"]) => {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, status } } : n)))
    },
    [setNodes],
  )

  const simulate = React.useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setRunning(true)
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: "idle" } })))
    active.order.forEach((id, i) => {
      timers.current.push(
        setTimeout(() => {
          setNodeStatus(id, "running")
        }, i * 700),
      )
      timers.current.push(
        setTimeout(() => {
          setNodeStatus(id, "done")
          if (i === active.order.length - 1) setRunning(false)
        }, i * 700 + 650),
      )
    })
  }, [active, setNodeStatus, setNodes])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader title="AI Workflow" description="Agent flows, tool pipelines and RAG visualization." showActions={false}>
        <Button variant="outline" size="sm" onClick={() => loadPipeline(active)}>
          <RotateCcw className="size-4" data-icon="inline-start" />
          Reset
        </Button>
        <Button size="sm" onClick={simulate} disabled={running}>
          <Play className="size-4" data-icon="inline-start" />
          {running ? "Executing…" : "Run pipeline"}
        </Button>
      </PageHeader>

      {/* Pipeline selector */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {pipelines.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActiveId(p.id)
              loadPipeline(p)
            }}
            className={cn(
              "flex flex-col gap-1 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40",
              activeId === p.id ? "border-primary/60 glow-ring" : "border-border",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{p.name}</span>
              {activeId === p.id && <Badge className="bg-primary/15 text-primary">Active</Badge>}
            </div>
            <span className="text-xs text-muted-foreground">{p.description}</span>
          </button>
        ))}
      </div>

      <Panel title={active.name} description={active.description} contentClassName="p-0">
        <div className="h-[520px] w-full overflow-hidden rounded-b-xl">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.4}
            maxZoom={1.5}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
            <Controls className="!border-border !bg-card [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground [&_button:hover]:!bg-muted" />
            <MiniMap
              pannable
              zoomable
              className="!rounded-lg !border !border-border !bg-card"
              maskColor="color-mix(in oklch, var(--background) 70%, transparent)"
              nodeColor="var(--primary)"
            />
          </ReactFlow>
        </div>
      </Panel>
    </div>
  )
}
