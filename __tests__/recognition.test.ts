import { describe, it, expect } from 'vitest'
import {
  generateSchedule,
  validateSchedule,
  computeMonthCount,
  billingMonths,
  type ScheduleEntry,
} from '../lib/evaluation'

interface TestCase {
  name: string
  contract: {
    tcv: number
    months: number
    billingFrequency: string
    startDate: string
  }
  expected: {
    monthlyRecognition: number
    totalInvoices: number
    invoiceAmount: number
    deferredRevenueAtMonth?: [number, number]
  }
}

const testCases: TestCase[] = [
  {
    name: 'Annual contract, quarterly billing',
    contract: { tcv: 180000, months: 12, billingFrequency: 'quarterly', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 15000,
      totalInvoices: 4,
      invoiceAmount: 45000,
      deferredRevenueAtMonth: [0, 30000],
    },
  },
  {
    name: 'Monthly contract, monthly billing (no gap)',
    contract: { tcv: 120000, months: 12, billingFrequency: 'monthly', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 10000,
      totalInvoices: 12,
      invoiceAmount: 10000,
    },
  },
  {
    name: 'Annual contract, annual billing (max deferred)',
    contract: { tcv: 120000, months: 12, billingFrequency: 'annual', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 10000,
      totalInvoices: 1,
      invoiceAmount: 120000,
      deferredRevenueAtMonth: [0, 110000],
    },
  },
  {
    name: '6-month contract, monthly billing',
    contract: { tcv: 60000, months: 6, billingFrequency: 'monthly', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 10000,
      totalInvoices: 6,
      invoiceAmount: 10000,
    },
  },
  {
    name: '6-month contract, quarterly billing',
    contract: { tcv: 90000, months: 6, billingFrequency: 'quarterly', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 15000,
      totalInvoices: 2,
      invoiceAmount: 45000,
      deferredRevenueAtMonth: [0, 30000],
    },
  },
  {
    name: 'Annual contract, semi-annual billing',
    contract: { tcv: 240000, months: 12, billingFrequency: 'semi-annual', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 20000,
      totalInvoices: 2,
      invoiceAmount: 120000,
      deferredRevenueAtMonth: [0, 100000],
    },
  },
  {
    name: 'Small contract, quarterly billing',
    contract: { tcv: 12000, months: 12, billingFrequency: 'quarterly', startDate: '2024-07-01' },
    expected: {
      monthlyRecognition: 1000,
      totalInvoices: 4,
      invoiceAmount: 3000,
      deferredRevenueAtMonth: [0, 2000],
    },
  },
  {
    name: 'Large enterprise contract, annual billing',
    contract: { tcv: 1200000, months: 12, billingFrequency: 'annual', startDate: '2024-01-01' },
    expected: {
      monthlyRecognition: 100000,
      totalInvoices: 1,
      invoiceAmount: 1200000,
      deferredRevenueAtMonth: [5, 600000],
    },
  },
]

function endDate(startDate: string, months: number): string {
  const d = new Date(startDate + 'T00:00:00')
  d.setMonth(d.getMonth() + months - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const lastDay = new Date(y, d.getMonth() + 1, 0).getDate()
  return `${y}-${m}-${String(lastDay).padStart(2, '0')}`
}

describe('computeMonthCount', () => {
  it('returns 12 for a full year', () => {
    expect(computeMonthCount('2024-01-01', '2024-12-31')).toBe(12)
  })

  it('returns 6 for half year', () => {
    expect(computeMonthCount('2024-01-01', '2024-06-30')).toBe(6)
  })

  it('returns 1 for single month', () => {
    expect(computeMonthCount('2024-03-01', '2024-03-31')).toBe(1)
  })
})

describe('billingMonths', () => {
  it('returns correct intervals', () => {
    expect(billingMonths('monthly')).toBe(1)
    expect(billingMonths('quarterly')).toBe(3)
    expect(billingMonths('semi-annual')).toBe(6)
    expect(billingMonths('annual')).toBe(12)
  })
})

describe('generateSchedule', () => {
  testCases.forEach((tc) => {
    describe(tc.name, () => {
      const end = endDate(tc.contract.startDate, tc.contract.months)
      const terms = {
        startDate: tc.contract.startDate,
        endDate: end,
        tcv: tc.contract.tcv,
        billingFrequency: tc.contract.billingFrequency,
        recognitionMethod: 'straight-line',
      }
      const schedule = generateSchedule(terms)

      it(`produces ${tc.contract.months} rows`, () => {
        expect(schedule.length).toBe(tc.contract.months)
      })

      it(`has monthly recognition of $${tc.expected.monthlyRecognition}`, () => {
        expect(schedule[0].recognised).toBeCloseTo(tc.expected.monthlyRecognition, 2)
      })

      it(`has ${tc.expected.totalInvoices} invoice events`, () => {
        const invoiceRows = schedule.filter((r) => r.invoiced > 0)
        expect(invoiceRows.length).toBe(tc.expected.totalInvoices)
      })

      it(`has invoice amount of $${tc.expected.invoiceAmount}`, () => {
        const invoiceRows = schedule.filter((r) => r.invoiced > 0)
        if (invoiceRows.length > 0) {
          expect(invoiceRows[0].invoiced).toBeCloseTo(tc.expected.invoiceAmount, 2)
        }
      })

      if (tc.expected.deferredRevenueAtMonth) {
        const [monthIdx, expectedDeferred] = tc.expected.deferredRevenueAtMonth
        it(`has deferred revenue of $${expectedDeferred} at month ${monthIdx + 1}`, () => {
          expect(schedule[monthIdx].deferredRevenue).toBeCloseTo(expectedDeferred, 2)
        })
      }
    })
  })
})

describe('validateSchedule', () => {
  testCases.forEach((tc) => {
    it(`validates: ${tc.name}`, () => {
      const end = endDate(tc.contract.startDate, tc.contract.months)
      const terms = {
        startDate: tc.contract.startDate,
        endDate: end,
        tcv: tc.contract.tcv,
        billingFrequency: tc.contract.billingFrequency,
        recognitionMethod: 'straight-line',
      }
      const schedule = generateSchedule(terms)
      const result = validateSchedule(terms, schedule)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  it('detects recognition total mismatch', () => {
    const terms = {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      tcv: 120000,
      billingFrequency: 'monthly',
      recognitionMethod: 'straight-line',
    }
    const schedule = generateSchedule(terms)
    schedule[0].recognised = 5000
    const result = validateSchedule(terms, schedule)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('recognised'))).toBe(true)
  })

  it('detects non-zero final deferred revenue', () => {
    const terms = {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      tcv: 120000,
      billingFrequency: 'quarterly',
      recognitionMethod: 'straight-line',
    }
    const schedule = generateSchedule(terms)
    schedule[schedule.length - 1].deferredRevenue = 5000
    const result = validateSchedule(terms, schedule)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('Final month'))).toBe(true)
  })
})
