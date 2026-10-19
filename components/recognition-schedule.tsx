'use client'

import { ContractTerms } from './contract-inference'
import { formatCurrency } from '@/lib/format'

interface ScheduleRow {
  month: string
  invoiced: number
  recognised: number
  deferredAccrued: number
  mismatch: boolean
}

interface RecognitionScheduleProps {
  contractTerms: ContractTerms
}

export function RecognitionSchedule({ contractTerms }: RecognitionScheduleProps) {
  const generateSchedule = (): ScheduleRow[] => {
    const start = new Date(contractTerms.startDate)
    const end = new Date(contractTerms.endDate)
    const months: ScheduleRow[] = []

    let current = new Date(start)
    const monthlyRecognition = contractTerms.tcv / 12

    // Quarterly invoice schedule
    const invoicesByMonth: { [key: string]: number } = {
      '2024-01': 45000, // Q1 invoice covers Jan-Mar
      '2024-02': 0,
      '2024-03': 0,
      '2024-04': 45000, // Q2 invoice covers Apr-Jun
      '2024-05': 0,
      '2024-06': 0,
      '2024-07': 45000, // Q3 invoice covers Jul-Sep
      '2024-08': 0,
      '2024-09': 0,
      '2024-10': 0,     // Q4 not yet invoiced
      '2024-11': 0,
      '2024-12': 0,
    }

    while (current <= end) {
      const monthKey = current.toISOString().slice(0, 7)
      const invoiced = invoicesByMonth[monthKey] || 0
      const recognised = monthlyRecognition
      const deferredAccrued = invoiced - recognised
      const mismatch = invoiced !== recognised

      months.push({
        month: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        invoiced,
        recognised: Math.round(recognised),
        deferredAccrued,
        mismatch,
      })

      current.setMonth(current.getMonth() + 1)
    }

    return months
  }

  const schedule = generateSchedule()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Revenue Recognition Schedule</h3>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs text-amber-900 leading-relaxed">
          <span className="font-semibold">The ASC 606 Gap:</span> Stripe recorded $135,000 received across 3 quarterly invoices. ASC 606 requires $180,000 recognised evenly across 12 months. Contract Layer maps the gap — $45,000 still to invoice, $0 over-recognised.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-3 py-2 font-semibold text-gray-900">Month</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-900">Invoiced</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-900">Recognised</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-900">Deferred/Accrued</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-border ${
                  row.mismatch ? 'bg-amber-50' : 'hover:bg-muted/50'
                }`}
              >
                <td className="px-3 py-2 text-gray-900 font-medium">{row.month}</td>
                <td className="text-right px-3 py-2 text-gray-900">
                  ${formatCurrency(row.invoiced)}
                </td>
                <td className="text-right px-3 py-2 text-gray-900">
                  ${formatCurrency(row.recognised)}
                </td>
                <td
                  className={`text-right px-3 py-2 font-medium ${
                    row.mismatch ? 'text-amber-700' : 'text-gray-900'
                  }`}
                >
                  {row.deferredAccrued > 0 ? '+' : row.deferredAccrued < 0 ? '-' : ''}{row.deferredAccrued !== 0 ? `$${formatCurrency(Math.abs(row.deferredAccrued))}` : '$0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Every row is amber because quarterly invoicing never aligns with monthly recognition — this is the core problem Contract Layer solves.
      </p>
    </div>
  )
}
