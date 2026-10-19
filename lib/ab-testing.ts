'use client'

import { createContext, useContext, useSyncExternalStore } from 'react'

export interface ExperimentVariant {
  weight: number
}

export interface Experiment {
  enabled: boolean
  variants: Record<string, ExperimentVariant>
}

export const experiments: Record<string, Experiment> = {
  schedule_layout: {
    enabled: true,
    variants: {
      table: { weight: 50 },
      timeline: { weight: 50 },
    },
  },
  highlight_style: {
    enabled: true,
    variants: {
      amber: { weight: 50 },
      red_green: { weight: 50 },
    },
  },
}

const VISITOR_KEY = 'cl_visitor_id'
const ASSIGNMENTS_KEY = 'cl_ab_assignments'

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr'
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'fallback-' + Math.random().toString(36).slice(2)
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return Math.abs(hash)
}

function assignVariant(experimentName: string, experiment: Experiment, visitorId: string): string {
  const variantNames = Object.keys(experiment.variants)
  if (variantNames.length === 0) return ''

  const hash = hashString(`${visitorId}:${experimentName}`)
  const totalWeight = variantNames.reduce((sum, v) => sum + experiment.variants[v].weight, 0)
  const bucket = hash % totalWeight

  let cumulative = 0
  for (const name of variantNames) {
    cumulative += experiment.variants[name].weight
    if (bucket < cumulative) return name
  }
  return variantNames[variantNames.length - 1]
}

type Assignments = Record<string, string>

let assignments: Assignments = {}
let listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

function persistAssignments() {
  try {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments))
  } catch {}
}

function loadAssignments(): Assignments {
  try {
    const raw = localStorage.getItem(ASSIGNMENTS_KEY)
    if (raw) return JSON.parse(raw) as Assignments
  } catch {}
  return {}
}

export function initABTests() {
  const visitorId = getOrCreateVisitorId()
  const stored = loadAssignments()
  const next: Assignments = {}

  for (const [name, exp] of Object.entries(experiments)) {
    if (!exp.enabled) continue
    if (stored[name] && Object.keys(exp.variants).includes(stored[name])) {
      next[name] = stored[name]
    } else {
      next[name] = assignVariant(name, exp, visitorId)
    }
  }

  assignments = next
  persistAssignments()
  notify()
}

if (typeof window !== 'undefined') {
  initABTests()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): Assignments {
  return assignments
}

function getServerSnapshot(): Assignments {
  return {}
}

export function useExperiment(name: string): string | undefined {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return current[name]
}

export function getAllAssignments(): Assignments {
  return { ...assignments }
}

export function getVisitorId(): string {
  return getOrCreateVisitorId()
}
