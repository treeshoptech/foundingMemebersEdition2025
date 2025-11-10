/**
 * TreeShop Employee System - Convex-compatible Calculation Utilities
 *
 * These functions calculate employee codes, compensation, and related metrics
 * for the TreeShop employee career progression system.
 */

// ============================================================================
// TIER MULTIPLIERS
// ============================================================================

const TIER_MULTIPLIERS: Record<number, number> = {
  1: 1.0, // Entry Level
  2: 1.6, // Developing
  3: 1.8, // Competent
  4: 2.0, // Advanced
  5: 2.2, // Master
}

// ============================================================================
// ADD-ON PREMIUMS
// ============================================================================

const LEADERSHIP_PREMIUMS: Record<string, number> = {
  L: 2.0, // Team Leader
  S: 3.0, // Supervisor
  M: 5.0, // Manager
  D: 6.0, // Director
  C: 7.0, // Chief/Executive
}

const EQUIPMENT_PREMIUMS: Record<string, number> = {
  E1: 0.5, // Basic Equipment
  E2: 2.0, // Intermediate Machinery
  E3: 4.0, // Advanced Equipment
  E4: 7.0, // Specialized Equipment
}

const DRIVER_PREMIUMS: Record<string, number> = {
  D1: 0.5, // Standard License
  D2: 2.0, // CDL Class B
  D3: 3.0, // CDL Class A
  DH: 1.0, // Hazmat Endorsement
}

const CERTIFICATION_PREMIUMS: Record<string, number> = {
  ISA: 4.0, // ISA Arborist
  CRA: 3.0, // Crane Certified
  TRA: 3.0, // Trainer Certified
  OSH: 2.0, // OSHA Certified
  PES: 2.0, // Pesticide/Environmental
  CPR: 1.0, // CPR Certified
}

// ============================================================================
// EMPLOYEE CODE GENERATION
// ============================================================================

interface CrossTraining {
  role: string
  tier: number
}

interface EmployeeData {
  careerTrack: string
  tier: number
  leadershipLevel?: string
  equipmentCertifications: string[]
  driverLicenses: string[]
  professionalCerts: string[]
  crossTraining: CrossTraining[]
}

/**
 * Generate employee code from profile data
 *
 * Format: [ROLE][TIER]+[ADD-ONS] / X-[CROSS-TRAINING]
 *
 * Examples:
 * - ATC1 (Entry arborist)
 * - TRS4+S+E3+D3+CRA+ISA (Advanced climber with supervisor role)
 * - MUL3+L+E2+D2 / X-STG3+X-LCL2 (Multi-skilled operator)
 */
export function generateEmployeeCode(employee: EmployeeData): string {
  let code = `${employee.careerTrack}${employee.tier}`

  // Add leadership level
  if (employee.leadershipLevel) {
    code += `+${employee.leadershipLevel}`
  }

  // Add equipment certifications (sorted for consistency)
  const sortedEquipment = [...employee.equipmentCertifications].sort()
  sortedEquipment.forEach((cert) => {
    code += `+${cert}`
  })

  // Add driver licenses (sorted for consistency)
  const sortedDrivers = [...employee.driverLicenses].sort()
  sortedDrivers.forEach((license) => {
    code += `+${license}`
  })

  // Add professional certifications (sorted for consistency)
  const sortedCerts = [...employee.professionalCerts].sort()
  sortedCerts.forEach((cert) => {
    code += `+${cert}`
  })

  // Add cross-training
  if (employee.crossTraining.length > 0) {
    const crossTrainingCodes = employee.crossTraining.map((ct) => `X-${ct.role}${ct.tier}`).join("+")
    code += ` / ${crossTrainingCodes}`
  }

  return code
}

// ============================================================================
// COMPENSATION CALCULATION
// ============================================================================

/**
 * Calculate the effective hourly rate based on tier and add-ons
 *
 * Formula:
 * effectiveRate = (baseRate × tierMultiplier) + leadershipPremium + sum(allAddonPremiums)
 */
export function calculateEffectiveHourlyRate(
  baseHourlyRate: number,
  tier: number,
  leadershipLevel: string | undefined,
  equipmentCertifications: string[],
  driverLicenses: string[],
  professionalCerts: string[],
): number {
  // Start with base rate adjusted by tier multiplier
  const tierMultiplier = TIER_MULTIPLIERS[tier] || 1.0
  let hourlyRate = baseHourlyRate * tierMultiplier

  // Add leadership premium
  if (leadershipLevel && LEADERSHIP_PREMIUMS[leadershipLevel]) {
    hourlyRate += LEADERSHIP_PREMIUMS[leadershipLevel]
  }

  // Add equipment certification premiums
  equipmentCertifications.forEach((cert) => {
    if (EQUIPMENT_PREMIUMS[cert]) {
      hourlyRate += EQUIPMENT_PREMIUMS[cert]
    }
  })

  // Add driver license premiums
  driverLicenses.forEach((license) => {
    if (DRIVER_PREMIUMS[license]) {
      hourlyRate += DRIVER_PREMIUMS[license]
    }
  })

  // Add professional certification premiums
  professionalCerts.forEach((cert) => {
    if (CERTIFICATION_PREMIUMS[cert]) {
      hourlyRate += CERTIFICATION_PREMIUMS[cert]
    }
  })

  return Number(hourlyRate.toFixed(2))
}

/**
 * Calculate true business cost per hour with burden multiplier
 *
 * @param effectiveHourlyRate - Employee's effective hourly rate
 * @param burdenMultiplier - Business burden multiplier (typically 1.7)
 * @returns True cost per hour
 */
export function calculateTrueCost(effectiveHourlyRate: number, burdenMultiplier: number): number {
  return Number((effectiveHourlyRate * burdenMultiplier).toFixed(2))
}
