'use client'

import { useMemo } from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { ContractTerms } from './contract-inference'
import { validateContractTerms } from '@/lib/evaluation'

interface ValidationBadgeProps {
  contractTerms: ContractTerms
}

export function ValidationBadge({ contractTerms }: ValidationBadgeProps) {
  const result = useMemo(() => validateContractTerms(contractTerms), [contractTerms])

  if (result.valid) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
        <span className="text-xs font-medium text-green-800">Calculations verified</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        <span className="text-xs font-medium text-red-800">Validation errors detected</span>
      </div>
      <ul className="text-xs text-red-700 space-y-1 pl-4 list-disc">
        {result.errors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </div>
  )
}
