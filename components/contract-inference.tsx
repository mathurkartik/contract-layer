'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/format'

export interface ContractTerms {
  startDate: string
  endDate: string
  tcv: number
  billingFrequency: string
  recognitionMethod: string
}

interface ContractInferenceProps {
  onTermsChange?: (terms: ContractTerms) => void
}

export function ContractInference({ onTermsChange }: ContractInferenceProps) {
  const [terms, setTerms] = useState<ContractTerms>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    tcv: 180000,
    billingFrequency: 'quarterly',
    recognitionMethod: 'straight-line',
  })

  const handleChange = (field: keyof ContractTerms, value: string | number) => {
    const updated = { ...terms, [field]: value }
    setTerms(updated)
    onTermsChange?.(updated)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Contract Layer Inference
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-900">
            <span className="font-semibold">Detected contract:</span> ${formatCurrency(terms.tcv)} annual SaaS license, {new Date(terms.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – {new Date(terms.endDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}. Billing: {terms.billingFrequency}. Recognition method: {terms.recognitionMethod}.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Contract Start Date
          </label>
          <input
            type="date"
            value={terms.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Contract End Date
          </label>
          <input
            type="date"
            value={terms.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Total Contract Value (TCV)
          </label>
          <div className="flex items-center">
            <span className="text-gray-900 mr-2">$</span>
            <input
              type="number"
              value={terms.tcv}
              onChange={(e) => handleChange('tcv', parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Billing Frequency
          </label>
          <select
            value={terms.billingFrequency}
            onChange={(e) => handleChange('billingFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="quarterly" className="text-gray-900">Quarterly</option>
            <option value="monthly" className="text-gray-900">Monthly</option>
            <option value="annual" className="text-gray-900">Annual</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">
            Recognition Method
          </label>
          <select
            value={terms.recognitionMethod}
            onChange={(e) => handleChange('recognitionMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="straight-line" className="text-gray-900">Straight-Line</option>
            <option value="proportional" className="text-gray-900">Proportional</option>
            <option value="milestone" className="text-gray-900">Milestone-Based</option>
          </select>
        </div>
      </div>
    </div>
  )
}
