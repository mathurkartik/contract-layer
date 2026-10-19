'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ContractTerms } from './contract-inference'
import { formatCurrency } from '@/lib/format'

interface ComplianceSummaryProps {
  contractTerms: ContractTerms
}

export function ComplianceSummary({ contractTerms }: ComplianceSummaryProps) {
  const [closePeriod, setClosePeriod] = useState('Q1 2024')
  const [isExpanded, setIsExpanded] = useState(false)

  // Mock Q1 2024 amounts
  const q1Revenue = 45000 // 3 months x 15,000
  const q1Deferred = 10000

  const journalEntries = [
    {
      account: 'Revenue',
      debit: q1Revenue,
      credit: 0,
    },
    {
      account: 'Deferred Revenue',
      debit: 0,
      credit: q1Deferred,
    },
    {
      account: 'Accounts Receivable',
      debit: 0,
      credit: q1Revenue,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">ASC 606 Compliance Summary</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-900">Close Period:</label>
          <select
            value={closePeriod}
            onChange={(e) => setClosePeriod(e.target.value)}
            className="px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
          >
            <option>Q1 2024</option>
            <option>Q2 2024</option>
            <option>Q3 2024</option>
            <option>Q4 2024</option>
          </select>
        </div>
      </div>

      {/* Performance Obligations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-xs text-blue-900 space-y-1">
          <p>
            <span className="font-semibold">Performance Obligation 1:</span> SaaS Software License
          </p>
          <p className="text-blue-800">
            Transfer of control: Point in time (monthly service delivery)
          </p>
          <p className="text-blue-800">
            {closePeriod} Recognised Revenue:{' '}
            <span className="font-semibold text-blue-900">${formatCurrency(q1Revenue)}</span>
          </p>
        </div>
      </div>

      {/* Journal Entry Summary */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-900">
            {closePeriod} Journal Entry
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-900 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isExpanded && (
          <div className="mt-2 border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold text-gray-900">Account</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-900">Debit</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-900">Credit</th>
                </tr>
              </thead>
              <tbody>
                {journalEntries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-gray-900 font-medium">{entry.account}</td>
                    <td className="text-right px-3 py-2 text-gray-900">
                      {entry.debit > 0 ? `$${formatCurrency(entry.debit)}` : '—'}
                    </td>
                    <td className="text-right px-3 py-2 text-gray-900">
                      {entry.credit > 0 ? `$${formatCurrency(entry.credit)}` : '—'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 border-t-2 border-blue-200 font-semibold">
                  <td className="px-3 py-2 text-blue-900">Total</td>
                  <td className="text-right px-3 py-2 text-blue-900">
                    ${formatCurrency(journalEntries.reduce((sum, e) => sum + e.debit, 0))}
                  </td>
                  <td className="text-right px-3 py-2 text-blue-900">
                    ${formatCurrency(journalEntries.reduce((sum, e) => sum + e.credit, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-900">
          <span className="font-semibold">Status:</span> Revenue recognition for {closePeriod}{' '}
          is locked. Journal entry ready for posting.
        </p>
      </div>
    </div>
  )
}
