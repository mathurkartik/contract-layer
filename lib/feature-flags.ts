'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'

export interface FeatureFlagConfig {
  editable_contracts: boolean
  comparison_view: boolean
  export_csv: boolean
  compliance_checklist: boolean
  multi_contract: boolean
}

const defaults: FeatureFlagConfig = {
  editable_contracts: true,
  comparison_view: false,
  export_csv: true,
  compliance_checklist: true,
  multi_contract: false,
}

type FlagName = keyof FeatureFlagConfig

const STORAGE_KEY = 'cl_feature_flags'

let flags: FeatureFlagConfig = { ...defaults }
let listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags))
  } catch {}
}

function loadFromStorage(): Partial<FeatureFlagConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Partial<FeatureFlagConfig>
  } catch {}
  return {}
}

function loadFromURL(): Partial<FeatureFlagConfig> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const overrides: Partial<FeatureFlagConfig> = {}
  for (const key of Object.keys(defaults) as FlagName[]) {
    const val = params.get(`ff_${key}`)
    if (val !== null) {
      overrides[key] = val === 'true' || val === '1'
    }
  }
  return overrides
}

function initFlags() {
  const stored = loadFromStorage()
  const url = loadFromURL()
  flags = { ...defaults, ...stored, ...url }
}

if (typeof window !== 'undefined') {
  initFlags()
}

export function getFlag(name: FlagName): boolean {
  return flags[name]
}

export function setFlag(name: FlagName, value: boolean) {
  flags = { ...flags, [name]: value }
  persist()
  notify()
}

export function resetFlags() {
  flags = { ...defaults }
  persist()
  notify()
}

export function getAllFlags(): FeatureFlagConfig {
  return { ...flags }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): FeatureFlagConfig {
  return flags
}

function getServerSnapshot(): FeatureFlagConfig {
  return defaults
}

export function useFeatureFlag(name: FlagName): boolean {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return current[name]
}

export function useAllFlags(): FeatureFlagConfig {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
