'use client'

import { useState } from 'react'
import { Settings, X } from 'lucide-react'
import { useAllFlags, setFlag, resetFlags, type FeatureFlagConfig } from '@/lib/feature-flags'

const FLAG_LABELS: Record<keyof FeatureFlagConfig, string> = {
  editable_contracts: 'Editable Contracts',
  comparison_view: 'Comparison View',
  export_csv: 'CSV Export',
  compliance_checklist: 'Compliance Checklist',
  multi_contract: 'Multi-Contract Support',
}

export function FeatureFlagDebugPanel() {
  const [open, setOpen] = useState(false)
  const flags = useAllFlags()

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Feature Flags"
      >
        <Settings className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Feature Flags</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(Object.keys(flags) as (keyof FeatureFlagConfig)[]).map((key) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-medium text-foreground">{FLAG_LABELS[key]}</span>
                  <button
                    onClick={() => setFlag(key, !flags[key])}
                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                      flags[key] ? 'bg-accent' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                        flags[key] ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>

            <button
              onClick={resetFlags}
              className="w-full text-xs text-center py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </>
  )
}
