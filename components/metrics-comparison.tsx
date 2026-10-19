'use client'

import { formatCurrency } from '@/lib/format'
import { ContractTerms } from './contract-inference'

interface MetricsComparisonProps {
  contractTerms: ContractTerms
}

export function MetricsComparison({ contractTerms }: MetricsComparisonProps) {
  const monthlyRecognition = Math.round(contractTerms.tcv / 12)

  // Simulate quarterly billing pattern
  const billingTimeline = [
    { month: 'Jan', invoice: 45000, recognition: monthlyRecognition },
    { month: 'Feb', invoice: 0, recognition: monthlyRecognition },
    { month: 'Mar', invoice: 0, recognition: monthlyRecognition },
    { month: 'Apr', invoice: 45000, recognition: monthlyRecognition },
    { month: 'May', invoice: 0, recognition: monthlyRecognition },
    { month: 'Jun', invoice: 0, recognition: monthlyRecognition },
    { month: 'Jul', invoice: 45000, recognition: monthlyRecognition },
    { month: 'Aug', invoice: 0, recognition: monthlyRecognition },
    { month: 'Sep', invoice: 0, recognition: monthlyRecognition },
    { month: 'Oct', invoice: 0, recognition: monthlyRecognition },
    { month: 'Nov', invoice: 0, recognition: monthlyRecognition },
    { month: 'Dec', invoice: 0, recognition: monthlyRecognition },
  ]

  const maxValue = 50000

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Comparison: Invoiced vs Recognised</h3>
        <div className="space-y-4">
          {billingTimeline.map((item, idx) => {
            const invoiceWidth = Math.max((item.invoice / maxValue) * 100, 0)
            const recognitionWidth = (item.recognition / maxValue) * 100
            const mismatch = item.invoice !== item.recognition

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-900 w-10">{item.month}</span>
                  <span className="text-xs text-gray-500">
                    Inv: ${formatCurrency(item.invoice)} | Rec: ${formatCurrency(item.recognition)}
                    {mismatch && <span className="text-orange-500 ml-1">● Gap</span>}
                  </span>
                </div>
                {/* Stacked bars — invoice on top, recognition below */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-8">Inv</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 bg-blue-400 rounded-full transition-all"
                        style={{ width: `${invoiceWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-8">Rec</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${recognitionWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span className="text-gray-600">Invoiced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-600">Recognised</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-orange-500">●</span>
          <span className="text-gray-600">Gap (mismatch)</span>
        </div>
      </div>
    </div>
  )
}
