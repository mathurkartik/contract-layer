'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { InvoiceStream, Invoice } from '@/components/invoice-stream'
import { ContractInference, ContractTerms } from '@/components/contract-inference'
import { RecognitionSchedule } from '@/components/recognition-schedule'
import { ComplianceSummary } from '@/components/compliance-summary'
import { RevenueDashboard } from '@/components/revenue-dashboard'
import { MetricsComparison } from '@/components/metrics-comparison'
import { FeatureFlagDebugPanel } from '@/components/feature-flag-debug-panel'
import { ABTestDebugPanel } from '@/components/ab-test-debug-panel'
import { FeedbackWidget } from '@/components/feedback-widget'
import { ValidationBadge } from '@/components/validation-badge'
import { formatCurrency } from '@/lib/format'

type Step = 'inference' | 'compliance' | 'dashboard'

export default function Page() {
  const [currentStep, setCurrentStep] = useState<Step>('inference')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const [contractTerms, setContractTerms] = useState<ContractTerms>({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    tcv: 180000,
    billingFrequency: 'quarterly',
    recognitionMethod: 'straight-line',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contract Layer</h1>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Revenue Recognition Platform
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-primary-foreground/80 font-medium">
                Mid-Market SaaS Edition
              </div>
              <div className="text-xs text-primary-foreground/80 font-medium">
                $2M–$6M ARR
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-6 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setCurrentStep('inference')}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${
              currentStep === 'inference'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold">
              1
            </div>
            <span className="text-sm font-semibold">Contract Inference</span>
          </button>

          <button
            onClick={() => setCurrentStep('compliance')}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${
              currentStep === 'compliance'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
              2
            </div>
            <span className="text-sm font-semibold">ASC 606 Compliance</span>
          </button>

          <button
            onClick={() => setCurrentStep('dashboard')}
            className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${
              currentStep === 'dashboard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
              3
            </div>
            <span className="text-sm font-semibold">Revenue Dashboard</span>
          </button>
        </div>

        {/* Step 1: Contract Inference */}
        {currentStep === 'inference' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel: Invoice Stream */}
              <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
                <InvoiceStream
                  selectedId={selectedInvoice?.id}
                  onInvoiceSelect={setSelectedInvoice}
                />
              </div>

              {/* Middle Panel: Contract Inference */}
              <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
                <ContractInference onTermsChange={setContractTerms} />
              </div>

              {/* Right Panel: Placeholder for visual balance */}
              <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Contract Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">Annual TCV:</span>
                      <span className="text-lg font-bold text-indigo-600">
                        ${formatCurrency(contractTerms.tcv)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">Monthly Recognition:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${formatCurrency(Math.round(contractTerms.tcv / 12))}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">Period:</span>
                      <span className="text-xs text-gray-900 font-medium">
                        {contractTerms.startDate} to {contractTerms.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recognition Schedule Table */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-sm space-y-4">
              <RecognitionSchedule contractTerms={contractTerms} />
              <ValidationBadge contractTerms={contractTerms} />
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep('compliance')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue to Compliance
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: ASC 606 Compliance */}
        {currentStep === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
              <ComplianceSummary contractTerms={contractTerms} />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('inference')}
                className="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back to Inference
              </button>

              <button
                onClick={() => setCurrentStep('dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Revenue Dashboard
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Revenue Dashboard */}
        {currentStep === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
              <RevenueDashboard contractTerms={contractTerms} />
            </div>

            {/* Metrics Comparison */}
            <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
              <MetricsComparison contractTerms={contractTerms} />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('compliance')}
                className="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back to Compliance
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const monthlyRec = Math.round(contractTerms.tcv / 12)
                    const rows = [
                      ['Month', 'Invoiced', 'Recognised', 'Deferred/Accrued'],
                      ['Jan 2024', '45000', String(monthlyRec), String(45000 - monthlyRec)],
                      ['Feb 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Mar 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Apr 2024', '45000', String(monthlyRec), String(45000 - monthlyRec)],
                      ['May 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Jun 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Jul 2024', '45000', String(monthlyRec), String(45000 - monthlyRec)],
                      ['Aug 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Sep 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Oct 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Nov 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                      ['Dec 2024', '0', String(monthlyRec), String(0 - monthlyRec)],
                    ]
                    const csv = rows.map(r => r.join(',')).join('\n')
                    const blob = new Blob([csv], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'asc606-recognition-report.csv'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Export Report
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Finalize
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs text-primary-foreground/70">
            Built to map Stripe invoice data to ASC 606 recognition schedules
          </p>
        </div>
      </footer>

      {/* Floating widgets */}
      <FeedbackWidget />
      <FeatureFlagDebugPanel />
      <ABTestDebugPanel />
    </div>
  )
}
