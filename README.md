# Contract Layer

**Revenue Recognition Platform for Stripe-Powered SaaS**

Built to map Stripe invoice data to ASC 606 recognition schedules.

---

## The Problem

Stripe records revenue when invoices are issued. ASC 606 requires revenue to be recognised when the performance obligation is satisfied — typically spread evenly over the service period. For any billing cadence other than monthly (quarterly, annual, usage-based), these two numbers diverge **every single month**.

**Example:** A $180,000 annual SaaS contract billed quarterly produces three $45,000 invoices. But ASC 606 demands $15,000 recognised per month. The gap between "invoiced" and "recognised" is the deferred revenue / accrued revenue that mid-market SaaS companies ($2M–$6M ARR) struggle to track manually.

Contract Layer makes this gap visible and auditable.

---

## What It Does

Contract Layer is a 3-step workflow:

### Step 1 — Contract Inference

- **Stripe Invoice Stream**: Ingests quarterly invoices from Stripe and displays them with status (paid ✓ / unpaid ⏱) and service period labels.
- **Contract Inference Engine**: Detects the underlying contract terms — TCV, billing frequency, start/end dates, and recognition method.
- **Recognition Schedule**: Generates a month-by-month table showing Invoiced vs. Recognised vs. Deferred/Accrued, with every mismatched row highlighted in amber.

### Step 2 — ASC 606 Compliance

- Maps each invoice to the 5-step ASC 606 model (identify contract, identify obligations, determine price, allocate price, recognise revenue).
- Expandable compliance checklist with pass/fail indicators.

### Step 3 — Revenue Dashboard

- Visual summary of recognised vs. deferred revenue.
- Key metrics: total recognised, total deferred, compliance score.
- Comparison between Stripe's cash-basis view and GAAP-compliant recognition.

---

## Demo Scenario

The app ships with a pre-loaded demo for **Acme Corp**:

| Invoice | Date | Amount | Status | Service Period |
|---------|------|--------|--------|----------------|
| `in_1abc23` | Jan 1, 2024 | $45,000 | Paid ✓ | Jan – Mar |
| `in_2def45` | Apr 1, 2024 | $45,000 | Paid ✓ | Apr – Jun |
| `in_3ghi67` | Jul 1, 2024 | $45,000 | Unpaid ⏱ | Jul – Sep |

**Inferred contract:** $180,000 annual SaaS license, Jan 1 2024 – Dec 31 2024. Billing: quarterly. Recognition: straight-line ($15,000/month).

**The ASC 606 Gap:** Stripe recorded $135,000 across 3 invoices. ASC 606 requires $180,000 recognised evenly across 12 months. Contract Layer maps the gap — $45,000 still to invoice, $0 over-recognised. Every row in the recognition schedule is amber because quarterly invoicing never aligns with monthly recognition.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Lucide icons
- **Font**: Inter (Google Fonts)
- **Analytics**: Vercel Analytics
- **Package Manager**: pnpm

---

## Project Structure

```
contract-layer/
├── app/
│   ├── globals.css          # Design tokens & global styles
│   ├── layout.tsx           # Root layout with metadata & fonts
│   └── page.tsx             # Main 3-step workflow page
├── components/
│   ├── invoice-stream.tsx       # Stripe invoice cards
│   ├── contract-inference.tsx   # Contract term detection & editor
│   ├── recognition-schedule.tsx # Monthly recognition table with ASC 606 callout
│   ├── compliance-summary.tsx   # ASC 606 5-step compliance checklist
│   ├── revenue-dashboard.tsx    # Revenue metrics overview
│   ├── metrics-comparison.tsx   # Stripe vs. GAAP comparison
│   └── ui/
│       └── button.tsx           # Base button component
├── lib/
│   └── format.ts            # Currency formatting utility
├── public/                  # Static assets & favicons
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/mathurkartik/contract-layer.git
cd contract-layer

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Target Market

Mid-market SaaS companies at **$2M–$6M ARR** that:
- Bill on Stripe with non-monthly cadences (quarterly, annual)
- Need ASC 606 compliance without enterprise-grade ERP
- Want audit-ready recognition schedules derived directly from their billing data

---

## License

Private — all rights reserved.
