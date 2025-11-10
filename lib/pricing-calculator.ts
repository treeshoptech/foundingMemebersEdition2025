// Pricing calculation utilities

export interface PricingInputs {
  loadoutId: string
  loadoutName: string
  serviceType: string
  billingRate: number
  productionRate: number
  driveTimeMinutes: number
  workUnits: number
  bufferPercentage: number
}

export interface PricingResult {
  productionHours: number
  transportHours: number
  bufferHours: number
  totalHours: number
  hourlyRate: number
  totalCost: number
  lineTotal: number
}

export function calculatePricing(inputs: PricingInputs): PricingResult {
  // Calculate production hours based on work units and production rate
  const productionHours = inputs.workUnits / inputs.productionRate

  // Calculate transport hours (drive time * 2 for round trip, converted to hours)
  const transportHours = (inputs.driveTimeMinutes * 2) / 60

  // Calculate buffer hours
  const bufferHours = productionHours * (inputs.bufferPercentage / 100)

  // Total hours
  const totalHours = productionHours + transportHours + bufferHours

  // Calculate costs
  const totalCost = totalHours * inputs.billingRate
  const lineTotal = totalCost

  return {
    productionHours,
    transportHours,
    bufferHours,
    totalHours,
    hourlyRate: inputs.billingRate,
    totalCost,
    lineTotal,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(2)} hrs`
}
