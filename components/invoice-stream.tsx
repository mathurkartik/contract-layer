'use client'

import { CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'unpaid'
  servicePeriod: string
}

const mockInvoices: Invoice[] = [
  {
    id: 'in_1abc23',
    date: 'Jan 1, 2024',
    amount: 45000,
    status: 'paid',
    servicePeriod: 'Covers Jan – Mar service period',
  },
  {
    id: 'in_2def45',
    date: 'Apr 1, 2024',
    amount: 45000,
    status: 'paid',
    servicePeriod: 'Covers Apr – Jun service period',
  },
  {
    id: 'in_3ghi67',
    date: 'Jul 1, 2024',
    amount: 45000,
    status: 'unpaid',
    servicePeriod: 'Covers Jul – Sep service period',
  },
]

interface InvoiceStreamProps {
  onInvoiceSelect?: (invoice: Invoice) => void
  selectedId?: string
}

export function InvoiceStream({ onInvoiceSelect, selectedId }: InvoiceStreamProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Stripe Invoice Stream</h3>
      <div className="space-y-2">
        {mockInvoices.map((invoice) => (
          <button
            key={invoice.id}
            onClick={() => onInvoiceSelect?.(invoice)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedId === invoice.id
                ? 'bg-indigo-50 border-indigo-400'
                : 'bg-white border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="font-mono text-sm font-medium text-gray-900">
                {invoice.id}
              </div>
              {invoice.status === 'paid' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="text-xs text-gray-500 mb-1">{invoice.date}</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              ${formatCurrency(invoice.amount)}
            </div>
            <div className="text-xs text-gray-500 italic">{invoice.servicePeriod}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
