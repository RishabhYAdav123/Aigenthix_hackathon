# Neuralyze

Neuralyze is an AI observability and LLM cost optimization dashboard built with Next.js. It provides a simulated console for tracing, monitoring, evaluating, and optimizing production AI systems.

## Features

- Real-time AI observability dashboard with KPI cards and charts
- Distributed tracing views for model calls, tools, retrievals, and agent workflows
- Cost intelligence for token usage, latency, and spend analysis
- Evaluation and guardrail screens for quality tracking
- Live monitoring, alerting, logs, sessions, users, and settings pages
- Workflow graph interface for visualizing multi-step AI pipelines
- Dark/light theme support

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Recharts
- Framer Motion
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/                 Next.js app routes and layouts
components/          Shared UI, dashboard, shell, chart, and workflow components
lib/                 Shared utilities and mock data
public/              Static assets
```

## Main Routes

- `/` - landing page
- `/dashboard` - main observability dashboard
- `/tracing` - distributed traces
- `/monitor` - live monitoring
- `/evaluation` - evals and quality signals
- `/optimizer` - AI optimization recommendations
- `/alerts` - alert management
- `/logs` - request and system logs
- `/sessions` - user/session analysis
- `/workflow` - workflow graph view
- `/users` - user insights
- `/settings` - app configuration
