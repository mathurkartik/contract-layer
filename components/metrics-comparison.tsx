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
  const scale = 100 / maxValue

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Comparison</h3>
        <div className="space-y-3">
          {billingTimeline.map((item, idx) => {
            const invoiceWidth = (item.invoice / maxValue) * 100
            const recognitionWidth = (item.recognition / maxValue) * 100
            const mismatch = item.invoice !== item.recognition

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground w-12">{item.month}</span>
                  <span className="text-xs text-muted-foreground">
                    Inv: ${formatCurrency(item.invoice)} | Rec: ${formatCurrency(item.recognition)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {/* Invoice bar */}
                  <div
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${invoiceWidth}%` }}
                    title={`Invoice: $${formatCurrency(item.invoice)}`}
                  />
                  {/* Recognition bar */}
                  <div
                    className="h-2 bg-accent rounded-full transition-all"
                    style={{ width: `${recognitionWidth}%` }}
                    title={`Recognition: $${formatCurrency(item.recognition)}`}
                  />
                  {/* Mismatch indicator */}
                  {mismatch && (
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-0 self-center" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Invoiced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted-foreground">Recognised</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-muted-foreground">Mismatch</span>
        </div>
      </div>
    </div>
  )
}
