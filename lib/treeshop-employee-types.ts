/**
 * TreeShop Employee System - Complete Type Definitions
 *
 * This file contains all types, enums, and constants for the comprehensive
 * TreeShop employee career progression and compensation system.
 */

// ============================================================================
// CAREER TRACKS
// ============================================================================

/**
 * Field Operations Career Tracks (8 tracks)
 */
export const FIELD_OPERATIONS_TRACKS = {
  ATC: 'Arboriculture & Tree Care',
  TRS: 'Tree Removal & Rigging',
  FOR: 'Forestry & Land Management',
  LCL: 'Land Clearing & Excavation',
  MUL: 'Mulching & Material Processing',
  STG: 'Stump Grinding & Site Restoration',
  ESR: 'Emergency & Storm Response',
  LSC: 'Landscaping & Grounds',
} as const;

/**
 * Equipment & Maintenance Career Tracks (2 tracks)
 */
export const EQUIPMENT_TRACKS = {
  EQO: 'Equipment Operations',
  MNT: 'Maintenance & Repair',
} as const;

/**
 * Business Operations Career Tracks (6 tracks)
 */
export const BUSINESS_TRACKS = {
  SAL: 'Sales & Business Development',
  PMC: 'Project Management & Coordination',
  ADM: 'Administrative & Office Operations',
  FIN: 'Financial & Accounting',
  SAF: 'Safety & Compliance',
  TEC: 'Technology & Systems',
} as const;

/**
 * All Career Tracks Combined (16 total)
 */
export const CAREER_TRACKS = {
  ...FIELD_OPERATIONS_TRACKS,
  ...EQUIPMENT_TRACKS,
  ...BUSINESS_TRACKS,
} as const;

export type CareerTrackCode = keyof typeof CAREER_TRACKS;

// ============================================================================
// TIER PROGRESSION SYSTEM
// ============================================================================

/**
 * Five-Tier Progression System
 * Each tier has a multiplier applied to base hourly rate
 */
export const TIER_SYSTEM = {
  1: {
    name: 'Entry Level',
    description: '0-6 months experience',
    multiplier: 1.0,
  },
  2: {
    name: 'Developing',
    description: '6-18 months experience',
    multiplier: 1.6,
  },
  3: {
    name: 'Competent',
    description: '18 months - 3 years experience',
    multiplier: 1.8,
  },
  4: {
    name: 'Advanced',
    description: '3-5 years experience',
    multiplier: 2.0,
  },
  5: {
    name: 'Master',
    description: '5+ years experience',
    multiplier: 2.2,
  },
} as const;

export type TierLevel = keyof typeof TIER_SYSTEM;

// ============================================================================
// ADD-ON CODES (STACKABLE)
// ============================================================================

/**
 * Leadership Add-Ons with hourly premiums
 */
export const LEADERSHIP_ADDONS = {
  L: { name: 'Team Leader', premium: 2.0 },
  S: { name: 'Supervisor', premium: 3.0 },
  M: { name: 'Manager', premium: 5.0 },
  D: { name: 'Director', premium: 6.0 },
  C: { name: 'Chief/Executive', premium: 7.0 },
} as const;

export type LeadershipCode = keyof typeof LEADERSHIP_ADDONS;

/**
 * Equipment Operation Add-Ons with hourly premiums
 */
export const EQUIPMENT_ADDONS = {
  E1: { name: 'Basic Equipment', description: 'Hand tools, chainsaws', premium: 0.5 },
  E2: { name: 'Intermediate Machinery', description: 'Chippers, stump grinders', premium: 2.0 },
  E3: { name: 'Advanced Equipment', description: 'Cranes, bucket trucks', premium: 4.0 },
  E4: { name: 'Specialized Equipment', description: 'Forestry mulchers, tracked fellers', premium: 7.0 },
} as const;

export type EquipmentCode = keyof typeof EQUIPMENT_ADDONS;

/**
 * Driver License Add-Ons with hourly premiums
 */
export const DRIVER_ADDONS = {
  D1: { name: 'Standard License', description: 'Clean driving record', premium: 0.5 },
  D2: { name: 'CDL Class B', description: 'Trailer operation', premium: 2.0 },
  D3: { name: 'CDL Class A', description: 'Heavy haul', premium: 3.0 },
  DH: { name: 'Hazmat Endorsement', description: 'Hazardous materials', premium: 1.0 },
} as const;

export type DriverCode = keyof typeof DRIVER_ADDONS;

/**
 * Professional Certifications & Add-Ons with hourly premiums
 */
export const CERTIFICATION_ADDONS = {
  ISA: { name: 'ISA Arborist', premium: 4.0 },
  CRA: { name: 'Crane Certified', premium: 3.0 },
  TRA: { name: 'Trainer Certified', premium: 3.0 },
  OSH: { name: 'OSHA Certified', premium: 2.0 },
  PES: { name: 'Pesticide/Environmental', premium: 2.0 },
  CPR: { name: 'CPR Certified', premium: 1.0 },
} as const;

export type CertificationCode = keyof typeof CERTIFICATION_ADDONS;

// ============================================================================
// CROSS-TRAINING
// ============================================================================

/**
 * Cross-Training Record
 * Represents secondary competency in another role at a specific tier
 */
export interface CrossTraining {
  role: CareerTrackCode;
  tier: TierLevel;
}

// ============================================================================
// EMPLOYEE DATA STRUCTURE
// ============================================================================

/**
 * Complete TreeShop Employee Data
 */
export interface TreeShopEmployee {
  // Primary Role
  careerTrack: CareerTrackCode;
  tier: TierLevel;

  // Base Compensation (Tier 1 rate for the career track)
  baseHourlyRate: number;
  burdenMultiplier: number; // Business burden multiplier (typically 1.7)

  // Add-Ons (all optional and stackable)
  leadershipLevel?: LeadershipCode;
  equipmentCertifications: EquipmentCode[];
  driverLicenses: DriverCode[];
  professionalCerts: CertificationCode[];

  // Cross-Training (Secondary Specialties)
  crossTraining: CrossTraining[];

  // Calculated Fields
  employeeCode?: string;        // Generated from all above fields
  effectiveHourlyRate?: number; // Calculated based on tier + add-ons
  trueCostPerHour?: number;     // With burden multiplier

  // Standard Employee Fields
  organizationId: string;
  name: string;
  createdAt: number;
}

// ============================================================================
// COMPENSATION CALCULATION
// ============================================================================

/**
 * Calculate the hourly rate for an employee based on their complete profile
 *
 * Formula:
 * effectiveRate = (baseRate × tierMultiplier) + leadershipPremium + sum(allAddonPremiums)
 *
 * @param employee - TreeShop employee data
 * @returns Calculated hourly rate
 */
export function calculateHourlyRate(employee: TreeShopEmployee): number {
  // Start with base rate adjusted by tier multiplier
  const tierMultiplier = TIER_SYSTEM[employee.tier].multiplier;
  let hourlyRate = employee.baseHourlyRate * tierMultiplier;

  // Add leadership premium
  if (employee.leadershipLevel) {
    hourlyRate += LEADERSHIP_ADDONS[employee.leadershipLevel].premium;
  }

  // Add equipment certification premiums
  employee.equipmentCertifications.forEach(cert => {
    hourlyRate += EQUIPMENT_ADDONS[cert].premium;
  });

  // Add driver license premiums
  employee.driverLicenses.forEach(license => {
    hourlyRate += DRIVER_ADDONS[license].premium;
  });

  // Add professional certification premiums
  employee.professionalCerts.forEach(cert => {
    hourlyRate += CERTIFICATION_ADDONS[cert].premium;
  });

  return Number(hourlyRate.toFixed(2));
}

/**
 * Calculate true business cost per hour with burden multiplier
 *
 * @param hourlyRate - Employee's effective hourly rate
 * @param burdenMultiplier - Business burden multiplier (default 1.7)
 * @returns True cost per hour
 */
export function calculateTrueCost(hourlyRate: number, burdenMultiplier: number = 1.7): number {
  return Number((hourlyRate * burdenMultiplier).toFixed(2));
}

// ============================================================================
// EMPLOYEE CODE GENERATION
// ============================================================================

/**
 * Generate employee code from profile
 *
 * Format: [ROLE][TIER]+[ADD-ONS] / X-[CROSS-TRAINING]
 *
 * Examples:
 * - ATC1 (Entry arborist)
 * - TRS4+S+E3+D3+CRA+ISA (Advanced climber with supervisor role)
 * - MUL3+L+E2+D2 / X-STG3+X-LCL2 (Multi-skilled operator)
 *
 * @param employee - TreeShop employee data
 * @returns Employee code string
 */
export function generateEmployeeCode(employee: TreeShopEmployee): string {
  let code = `${employee.careerTrack}${employee.tier}`;

  // Add leadership level
  if (employee.leadershipLevel) {
    code += `+${employee.leadershipLevel}`;
  }

  // Add equipment certifications (sorted for consistency)
  const sortedEquipment = [...employee.equipmentCertifications].sort();
  sortedEquipment.forEach(cert => {
    code += `+${cert}`;
  });

  // Add driver licenses (sorted for consistency)
  const sortedDrivers = [...employee.driverLicenses].sort();
  sortedDrivers.forEach(license => {
    code += `+${license}`;
  });

  // Add professional certifications (sorted for consistency)
  const sortedCerts = [...employee.professionalCerts].sort();
  sortedCerts.forEach(cert => {
    code += `+${cert}`;
  });

  // Add cross-training
  if (employee.crossTraining.length > 0) {
    const crossTrainingCodes = employee.crossTraining
      .map(ct => `X-${ct.role}${ct.tier}`)
      .join('+');
    code += ` / ${crossTrainingCodes}`;
  }

  return code;
}

/**
 * Parse employee code back into components
 * (Useful for validation and code analysis)
 *
 * @param code - Employee code string
 * @returns Parsed components or null if invalid
 */
export function parseEmployeeCode(code: string): {
  careerTrack: CareerTrackCode;
  tier: TierLevel;
  leadershipLevel?: LeadershipCode;
  equipmentCertifications: EquipmentCode[];
  driverLicenses: DriverCode[];
  professionalCerts: CertificationCode[];
  crossTraining: CrossTraining[];
} | null {
  try {
    // Split main code from cross-training
    const [mainPart, crossTrainingPart] = code.split(' / ');

    // Parse main part
    const parts = mainPart.split('+');
    const primaryRole = parts[0];

    // Extract career track (first 3 chars) and tier (last char)
    const careerTrack = primaryRole.slice(0, 3) as CareerTrackCode;
    const tier = parseInt(primaryRole.slice(3)) as TierLevel;

    // Validate career track and tier
    if (!CAREER_TRACKS[careerTrack] || !TIER_SYSTEM[tier]) {
      return null;
    }

    // Parse add-ons
    let leadershipLevel: LeadershipCode | undefined;
    const equipmentCertifications: EquipmentCode[] = [];
    const driverLicenses: DriverCode[] = [];
    const professionalCerts: CertificationCode[] = [];

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      if (part in LEADERSHIP_ADDONS) {
        leadershipLevel = part as LeadershipCode;
      } else if (part in EQUIPMENT_ADDONS) {
        equipmentCertifications.push(part as EquipmentCode);
      } else if (part in DRIVER_ADDONS) {
        driverLicenses.push(part as DriverCode);
      } else if (part in CERTIFICATION_ADDONS) {
        professionalCerts.push(part as CertificationCode);
      }
    }

    // Parse cross-training
    const crossTraining: CrossTraining[] = [];
    if (crossTrainingPart) {
      const crossTrainingCodes = crossTrainingPart.split('+');
      crossTrainingCodes.forEach(ctCode => {
        if (ctCode.startsWith('X-')) {
          const roleCode = ctCode.slice(2);
          const ctCareerTrack = roleCode.slice(0, 3) as CareerTrackCode;
          const ctTier = parseInt(roleCode.slice(3)) as TierLevel;

          if (CAREER_TRACKS[ctCareerTrack] && TIER_SYSTEM[ctTier]) {
            crossTraining.push({ role: ctCareerTrack, tier: ctTier });
          }
        }
      });
    }

    return {
      careerTrack,
      tier,
      leadershipLevel,
      equipmentCertifications,
      driverLicenses,
      professionalCerts,
      crossTraining,
    };
  } catch (error) {
    return null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get human-readable name for a career track
 */
export function getCareerTrackName(code: CareerTrackCode): string {
  return CAREER_TRACKS[code];
}

/**
 * Get all career track options for dropdowns
 */
export function getAllCareerTracks(): Array<{ code: CareerTrackCode; name: string; category: string }> {
  const tracks: Array<{ code: CareerTrackCode; name: string; category: string }> = [];

  Object.entries(FIELD_OPERATIONS_TRACKS).forEach(([code, name]) => {
    tracks.push({ code: code as CareerTrackCode, name, category: 'Field Operations' });
  });

  Object.entries(EQUIPMENT_TRACKS).forEach(([code, name]) => {
    tracks.push({ code: code as CareerTrackCode, name, category: 'Equipment & Maintenance' });
  });

  Object.entries(BUSINESS_TRACKS).forEach(([code, name]) => {
    tracks.push({ code: code as CareerTrackCode, name, category: 'Business Operations' });
  });

  return tracks;
}

/**
 * Get tier progression path for visualization
 */
export function getTierProgressionPath(): Array<{
  level: TierLevel;
  name: string;
  description: string;
  multiplier: number;
}> {
  return Object.entries(TIER_SYSTEM).map(([level, data]) => ({
    level: parseInt(level) as TierLevel,
    ...data,
  }));
}

/**
 * Calculate annual salary estimate (for salaried positions)
 * Assumes 2,080 hours per year (40 hours/week × 52 weeks)
 */
export function calculateAnnualSalary(hourlyRate: number): number {
  return Number((hourlyRate * 2080).toFixed(0));
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
