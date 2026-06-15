import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Neuralyze — AI Observability & LLM Cost Intelligence",
  description:
    "Trace every prompt, optimize every token, and ship reliable AI with the observability platform built for production LLM applications.",
}

export default function Page() {
  return <LandingPage />
}
