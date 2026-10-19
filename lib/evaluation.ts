import { ContractTerms } from '@/components/contract-inference'

export interface ScheduleEntry {
  month: string
  invoiced: number
  recognised: number
  cumulativeInvoiced: number
  cumulativeRecognised: number
  deferredRevenue: number
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function computeMonthCount(startDate: string, endDate: string): number {
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(endDate + 'T00:00:00')
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
}

export function billingMonths(frequency: string): number {
  switch (frequency) {
    case 'monthly': return 1
    case 'quarterly': return 3
    case 'semi-annual': return 6
    case 'annual': return 12
    default: return 1
  }
}

export function generateSchedule(terms: ContractTerms): ScheduleEntry[] {
  const months = computeMonthCount(terms.startDate, terms.endDate)
  const monthlyRecognition = terms.tcv / months
  const billingInterval = billingMonths(terms.billingFrequency)
  const invoiceAmount = terms.tcv / (months / billingInterval)
  const schedule: ScheduleEntry[] = []

  let cumulativeInvoiced = 0
  let cumulativeRecognised = 0

  for (let i = 0; i < months; i++) {
    const invoiced = i % billingInterval === 0 ? invoiceAmount : 0
    cumulativeInvoiced += invoiced
    cumulativeRecognised += monthlyRecognition

    const start = new Date(terms.startDate + 'T00:00:00')
    start.setMonth(start.getMonth() + i)
    const monthLabel = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    schedule.push({
      month: monthLabel,
      invoiced: Math.round(invoiced * 100) / 100,
      recognised: Math.round(monthlyRecognition * 100) / 100,
      cumulativeInvoiced: Math.round(cumulativeInvoiced * 100) / 100,
      cumulativeRecognised: Math.round(cumulativeRecognised * 100) / 100,
      deferredRevenue: Math.round((cumulativeInvoiced - cumulativeRecognised) * 100) / 100,
    })
  }

  return schedule
}

export function validateSchedule(terms: ContractTerms, schedule: ScheduleEntry[]): ValidationResult {
  const errors: string[] = []
  const months = computeMonthCount(terms.startDate, terms.endDate)

  if (schedule.length !== months) {
    errors.push(`Schedule has ${schedule.length} rows but contract spans ${months} months`)
  }

  const totalRecognised = schedule.reduce((sum, row) => sum + row.recognised, 0)
  const recognitionDiff = Math.abs(totalRecognised - terms.tcv)
  if (recognitionDiff > 0.01) {
    errors.push(
      `Total recognised ($${totalRecognised.toFixed(2)}) does not equal TCV ($${terms.tcv.toFixed(2)}), diff: $${recognitionDiff.toFixed(2)}`
    )
  }

  const totalInvoiced = schedule.reduce((sum, row) => sum + row.invoiced, 0)
  const invoiceDiff = Math.abs(totalInvoiced - terms.tcv)
  if (invoiceDiff > 0.01) {
    errors.push(
      `Total invoiced ($${totalInvoiced.toFixed(2)}) does not equal TCV ($${terms.tcv.toFixed(2)}), diff: $${invoiceDiff.toFixed(2)}`
    )
  }

  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i]
    const expectedDeferred = Math.round((row.cumulativeInvoiced - row.cumulativeRecognised) * 100) / 100
    if (Math.abs(row.deferredRevenue - expectedDeferred) > 0.01) {
      errors.push(
        `Month ${i + 1} (${row.month}): deferred revenue ($${row.deferredRevenue}) does not match cumulative invoiced - cumulative recognised ($${expectedDeferred})`
      )
    }
  }

  if (schedule.length > 0) {
    const last = schedule[schedule.length - 1]
    if (Math.abs(last.deferredRevenue) > 0.01) {
      errors.push(
        `Final month deferred revenue should be $0 but is $${last.deferredRevenue.toFixed(2)}`
      )
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateContractTerms(terms: ContractTerms): ValidationResult {
  const schedule = generateSchedule(terms)
  return validateSchedule(terms, schedule)
}
