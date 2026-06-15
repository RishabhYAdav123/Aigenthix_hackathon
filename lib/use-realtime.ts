"use client"

import * as React from "react"

/** Simulates a websocket pushing a new value on an interval. */
export function useLiveValue(
  initial: number,
  { volatility = 0.02, interval = 2500, min, max }: {
    volatility?: number
    interval?: number
    min?: number
    max?: number
  } = {},
) {
  const [value, setValue] = React.useState(initial)

  React.useEffect(() => {
    const id = setInterval(() => {
      setValue((prev) => {
        const change = prev * volatility * (Math.random() - 0.5) * 2
        let next = prev + change
        if (min !== undefined) next = Math.max(min, next)
        if (max !== undefined) next = Math.min(max, next)
        return next
      })
    }, interval)
    return () => clearInterval(id)
  }, [volatility, interval, min, max])

  return value
}

/** Pushes new points onto a rolling time-series, simulating live telemetry. */
export function useLiveSeries<T extends Record<string, unknown>>(
  initial: T[],
  makePoint: (prev: T) => T,
  interval = 3000,
) {
  const [series, setSeries] = React.useState<T[]>(initial)

  React.useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1]
        const next = makePoint(last)
        return [...prev.slice(1), next]
      })
    }, interval)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval])

  return series
}

/** Animated number that eases from 0 to the target on mount. */
export function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = React.useState(0)
  const ref = React.useRef<number | null>(null)

  React.useEffect(() => {
    let start: number | null = null
    const step = (ts: number) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    // Fallback in case rAF is throttled (e.g. background tab): guarantee final value.
    const fallback = setTimeout(() => setValue(target), duration + 200)
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current)
      clearTimeout(fallback)
    }
  }, [target, duration])

  return value
}

/** A blinking "X seconds ago" live clock for telemetry freshness. */
export function useTelemetryClock(interval = 1000) {
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 4), interval)
    return () => clearInterval(id)
  }, [interval])
  return tick
}
