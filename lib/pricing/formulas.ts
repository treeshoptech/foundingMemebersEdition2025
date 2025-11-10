// Port of PricingFormulas.swift to TypeScript

export interface MulchingParams {
  acres: number
  dbhPackage: number
  productionRate: number
  difficultyMultiplier?: number
}

export interface MulchingResult {
  baseTreeShopScore: number
  adjustedTreeShopScore: number
  productionHours: number
}

export function calculateMulchingWork(params: MulchingParams): MulchingResult {
  const baseTreeShopScore = params.dbhPackage * params.acres
  const adjustedTreeShopScore = baseTreeShopScore * (params.difficultyMultiplier || 1.0)
  const productionHours = params.productionRate > 0 ? adjustedTreeShopScore / params.productionRate : 0

  return {
    baseTreeShopScore,
    adjustedTreeShopScore,
    productionHours,
  }
}

export interface ProjectPricingParams {
  productionHours: number
  loadoutCostPerHour: number
  billingRatePerHour: number
  driveTimeOneWay: number
  transportRate?: number
  bufferPercent?: number
}

export interface ProjectPricingResult {
  productionHours: number
  transportHours: number
  bufferHours: number
  totalHours: number
  totalCost: number
  totalPrice: number
  totalProfit: number
  profitMargin: number
}

export function calculateProjectPricing(params: ProjectPricingParams): ProjectPricingResult {
  const transportRate = params.transportRate ?? 0.5
  const bufferPercent = params.bufferPercent ?? 0.1

  const transportHours = params.driveTimeOneWay * 2.0 * transportRate
  const bufferHours = (params.productionHours + transportHours) * bufferPercent
  const totalHours = params.productionHours + transportHours + bufferHours

  const totalCost = totalHours * params.loadoutCostPerHour
  const totalPrice = totalHours * params.billingRatePerHour
  const totalProfit = totalPrice - totalCost
  const profitMargin = totalPrice > 0 ? totalProfit / totalPrice : 0

  return {
    productionHours: params.productionHours,
    transportHours,
    bufferHours,
    totalHours,
    totalCost,
    totalPrice,
    totalProfit,
    profitMargin,
  }
}

export function calculateBillingRate(loadoutCost: number, targetMargin: number): number {
  return targetMargin < 1.0 ? loadoutCost / (1 - targetMargin) : loadoutCost
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`
}
