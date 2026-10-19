'use client'

import { useState } from 'react'
import { FlaskConical, X } from 'lucide-react'
import { experiments, getAllAssignments, getVisitorId } from '@/lib/ab-testing'

export function ABTestDebugPanel() {
  const [open, setOpen] = useState(false)

  if (process.env.NODE_ENV !== 'development') return null

  const assignments = getAllAssignments()
  const visitorId = getVisitorId()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-14 z-50 p-2 bg-indigo-700 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
        title="A/B Test Assignments"
      >
        <FlaskConical className="w-4 h-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">A/B Test Assignments</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground font-mono truncate">
              Visitor: {visitorId}
            </p>

            <div className="space-y-3">
              {Object.entries(experiments).map(([name, exp]) => (
                <div key={name} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">{name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        exp.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {exp.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(exp.variants).map(([variant, config]) => (
                      <span
                        key={variant}
                        className={`text-xs px-2 py-1 rounded border ${
                          assignments[name] === variant
                            ? 'bg-accent text-accent-foreground border-accent font-semibold'
                            : 'bg-white text-muted-foreground border-border'
                        }`}
                      >
                        {variant} ({config.weight}%)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
