/**
 * Financing Calculator Utilities
 * Calculate monthly payments and total costs for financing options
 */

export interface FinancingOptions {
  principal: number // Total amount to finance
  aprPercent: number // Annual Percentage Rate (as percentage, e.g., 5.9 for 5.9%)
  termMonths: number // Term in months
}

export interface FinancingResult {
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  aprPercent: number
  termMonths: number
}

/**
 * Calculate monthly payment using standard amortization formula
 * M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 * Where:
 *   M = Monthly payment
 *   P = Principal (loan amount)
 *   r = Monthly interest rate (APR / 12 / 100)
 *   n = Number of months
 */
export function calculateMonthlyPayment(options: FinancingOptions): FinancingResult {
  const { principal, aprPercent, termMonths } = options

  // Handle zero interest case
  if (aprPercent === 0) {
    return {
      monthlyPayment: principal / termMonths,
      totalPaid: principal,
      totalInterest: 0,
      aprPercent,
      termMonths,
    }
  }

  // Convert APR percentage to monthly rate
  const monthlyRate = aprPercent / 12 / 100

  // Calculate monthly payment using amortization formula
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  const totalPaid = monthlyPayment * termMonths
  const totalInterest = totalPaid - principal

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100, // Round to 2 decimal places
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    aprPercent,
    termMonths,
  }
}

/**
 * Calculate total cost of financing
 */
export function calculateFinancingCost(principal: number, aprPercent: number, termMonths: number): number {
  const result = calculateMonthlyPayment({ principal, aprPercent, termMonths })
  return result.totalPaid
}

/**
 * Common financing term options (in months)
 */
export const COMMON_TERMS = {
  "12 months": 12,
  "24 months": 24,
  "36 months": 36,
  "48 months": 48,
  "60 months": 60,
  "72 months": 72,
  "84 months": 84,
} as const

/**
 * Format monthly payment for display
 */
export function formatMonthlyPayment(monthlyPayment: number): string {
  return `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo`
}

/**
 * Format financing terms for display
 */
export function formatFinancingTerms(aprPercent: number, termMonths: number): string {
  return `${aprPercent}% APR for ${termMonths} months`
}

/**
 * Calculate multiple financing options for comparison
 */
export function calculateFinancingOptions(
  principal: number,
  aprRates: number[],
  terms: number[]
): FinancingResult[] {
  const options: FinancingResult[] = []

  for (const apr of aprRates) {
    for (const term of terms) {
      options.push(calculateMonthlyPayment({ principal, aprPercent: apr, termMonths: term }))
    }
  }

  return options
}
