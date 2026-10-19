'use client'

import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { ContractTerms } from './contract-inference'

interface RevenueDashboardProps {
  contractTerms: ContractTerms
}

export function RevenueDashboard({ contractTerms }: RevenueDashboardProps) {
  // Calculate metrics based on contract terms
  const monthlyRecognition = Math.round(contractTerms.tcv / 12)
  const quarterlyBilling = 45000 // Based on quarterly invoicing pattern
  const monthsElapsed = 9 // Q1, Q2, Q3 invoiced
  const totalInvoiced = monthsElapsed / 3 * quarterlyBilling
  const totalRecognised = monthlyRecognition * monthsElapsed
  const recognitionGap = totalRecognised - totalInvoiced
  const deferredRevenue = Math.max(0, totalInvoiced - totalRecognised)
  const accrualRevenue = Math.max(0, totalRecognised - totalInvoiced)

  const metrics = [
    {
      label: 'Annual TCV',
      value: contractTerms.tcv,
      trend: 'baseline',
      icon: '📊',
    },
    {
      label: 'Monthly Recognition',
      value: monthlyRecognition,
      trend: 'baseline',
      icon: '📈',
    },
    {
      label: 'Total Invoiced (YTD)',
      value: totalInvoiced,
      trend: 'neutral',
      icon: '💰',
    },
    {
      label: 'Total Recognised (YTD)',
      value: totalRecognised,
      trend: 'positive',
      icon: '✓',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatCurrency(metric.value)}
                </p>
              </div>
              <span className="text-xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reconciliation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deferred Revenue */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Deferred Revenue</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground">From Quarterly Invoicing:</span>
              <span className="text-lg font-bold text-primary">
                ${formatCurrency(deferredRevenue)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cash received but not yet earned under ASC 606. This liability decreases as services are rendered.
            </p>
          </div>
        </div>

        {/* Accrued Revenue */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Accrued Revenue</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground">From Straight-Line Recognition:</span>
              <span className="text-lg font-bold text-primary">
                ${formatCurrency(accrualRevenue)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Revenue earned but not yet invoiced. This asset increases until the remaining invoices are sent.
            </p>
          </div>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">ASC 606 Reconciliation</h3>
            <div className="space-y-2 text-xs text-indigo-800">
              <div className="flex justify-between">
                <span>Total Invoiced:</span>
                <span className="font-semibold">${formatCurrency(totalInvoiced)}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-200 pb-2">
                <span>Total Recognised:</span>
                <span className="font-semibold">${formatCurrency(totalRecognised)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-semibold">Recognition Gap:</span>
                <span className={`font-bold ${accrualRevenue > 0 ? 'text-indigo-600' : 'text-green-600'}`}>
                  ${formatCurrency(recognitionGap)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium mb-2">Billing Pattern</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">Quarterly</p>
          <p className="text-xs text-muted-foreground">
            3 invoices of ${formatCurrency(quarterlyBilling)} sent in Jan, Apr, Jul
          </p>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium mb-2">Recognition Method</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">Straight-Line</p>
          <p className="text-xs text-muted-foreground">
            ${formatCurrency(monthlyRecognition)}/month over {Math.ceil(contractTerms.tcv / monthlyRecognition)} months
          </p>
        </div>

        <div className="bg-white rounded-lg border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium mb-2">Contract Status</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">In Progress</p>
          <p className="text-xs text-muted-foreground">
            {monthsElapsed} of 12 months completed
          </p>
        </div>
      </div>
    </div>
  )
}
