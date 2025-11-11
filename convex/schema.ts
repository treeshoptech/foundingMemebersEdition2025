import { defineSchema, defineTable } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { v } from "convex/values"

export default defineSchema({
  // Convex Auth tables (handles authentication)
  ...authTables,

  // Organizations (Multi-tenant root)
  organizations: defineTable({
    name: v.string(),
    businessAddress: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    logoUrl: v.optional(v.string()), // Company logo URL
    createdAt: v.number(),
  }),

  // Users (linked to organizations and Convex Auth)
  users: defineTable({
    authUserId: v.id("authAccounts"), // Link to Convex Auth user
    email: v.string(),
    name: v.string(),
    organizationId: v.id("organizations"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("manager"), v.literal("estimator")),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_auth_user", ["authUserId"])
    .index("by_organization", ["organizationId"]),

  // Invitations for employee onboarding
  invitations: defineTable({
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("manager"), v.literal("estimator")),
    token: v.string(), // Unique invite token
    invitedBy: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"])
    .index("by_organization", ["organizationId"]),

  // Equipment - Enhanced with detailed categorization and tracking
  equipment: defineTable({
    organizationId: v.id("organizations"),

    // Basic Information
    name: v.string(),
    category: v.string(), // From EQUIPMENT_CATEGORIES
    type: v.string(), // From EQUIPMENT_TYPES

    // Detailed Equipment Information
    year: v.optional(v.number()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),

    // Financial Information
    purchasePrice: v.number(),
    purchaseDate: v.optional(v.number()),
    usefulLifeYears: v.number(),

    // Usage Pattern
    daysPerYear: v.number(), // Days per year in operation (100-300)
    hoursPerDay: v.number(), // Hours per day when running (2-12)
    annualHours: v.number(), // Calculated: daysPerYear × hoursPerDay

    // Financing
    financingType: v.optional(v.string()), // "cash" or "financed"
    financeAPR: v.optional(v.number()), // Annual Percentage Rate (e.g., 6.5 for 6.5%)
    financeTermMonths: v.optional(v.number()), // Finance term in months
    financeDownPayment: v.optional(v.number()), // Down payment amount

    // Operating Costs
    fuelBurnRate: v.number(), // Gallons per hour (actual consumption)
    fuelPricePerGallon: v.number(), // Current fuel price
    maintenanceTier: v.string(), // "minimal", "standard", "intensive"
    oilChangeInterval: v.number(), // Hours between oil changes

    insuranceAnnual: v.number(),

    // Auto-calculated Costs
    ownershipCostPerHour: v.number(),
    operatingCostPerHour: v.number(),
    totalCostPerHour: v.number(),

    // Status & Condition
    status: v.string(), // Active, In Maintenance, Out of Service, etc.
    condition: v.optional(v.string()), // Excellent, Good, Fair, Poor

    // Operational Information
    fuelType: v.optional(v.string()),

    // KPI Tracking Fields
    totalHoursOperated: v.optional(v.number()), // Cumulative hours
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    currentOdometerReading: v.optional(v.number()), // Miles for vehicles

    // Additional Information
    notes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_category", ["organizationId", "category"])
    .index("by_status", ["organizationId", "status"]),

  // Equipment Attachments
  equipmentAttachments: defineTable({
    organizationId: v.id("organizations"),
    equipmentId: v.id("equipment"),

    // Attachment Information
    name: v.string(),
    category: v.string(), // Related to parent equipment category
    type: v.string(),

    // Details
    serialNumber: v.optional(v.string()),
    purchasePrice: v.optional(v.number()),
    purchaseDate: v.optional(v.number()),
    condition: v.optional(v.string()),

    // Status
    status: v.string(), // Active, In Maintenance, etc.
    notes: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_equipment", ["equipmentId"]),

  // Equipment Usage Logs - For detailed KPI tracking
  equipmentUsageLogs: defineTable({
    organizationId: v.id("organizations"),
    equipmentId: v.id("equipment"),
    workOrderId: v.optional(v.id("workOrders")),

    // Usage Information
    date: v.number(),
    hoursUsed: v.number(),
    odometerStart: v.optional(v.number()),
    odometerEnd: v.optional(v.number()),

    // Costs (actual costs for this usage period)
    fuelUsed: v.optional(v.number()), // Gallons
    fuelCost: v.optional(v.number()), // Actual $ spent
    maintenanceCost: v.optional(v.number()), // Any maintenance done

    // Operator & Location
    operatorId: v.optional(v.id("employees")),
    jobLocation: v.optional(v.string()),

    // Notes
    notes: v.optional(v.string()),
    issuesReported: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_equipment", ["equipmentId"])
    .index("by_work_order", ["workOrderId"])
    .index("by_date", ["organizationId", "date"]),

  // Equipment Maintenance Logs
  equipmentMaintenanceLogs: defineTable({
    organizationId: v.id("organizations"),
    equipmentId: v.id("equipment"),

    // Maintenance Information
    date: v.number(),
    type: v.string(), // Routine, Repair, Inspection, etc.
    description: v.string(),

    // Cost Information
    laborCost: v.optional(v.number()),
    partsCost: v.optional(v.number()),
    totalCost: v.number(),

    // Service Details
    hoursAtService: v.optional(v.number()),
    odometerAtService: v.optional(v.number()),
    performedBy: v.optional(v.string()), // Shop name or employee

    // Next Service
    nextServiceDue: v.optional(v.number()),
    nextServiceHours: v.optional(v.number()),

    // Documentation
    invoiceNumber: v.optional(v.string()),
    notes: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_equipment", ["equipmentId"])
    .index("by_date", ["organizationId", "date"]),

  // Employees (TreeShop System)
  employees: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),

    // TreeShop Career System
    careerTrack: v.string(), // ATC, TRS, FOR, LCL, MUL, STG, ESR, LSC, EQO, MNT, SAL, PMC, ADM, FIN, SAF, TEC
    tier: v.number(), // 1-5

    // Base Compensation (Tier 1 rate for the career track)
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(), // Default 1.7x for true business cost

    // Add-Ons (all optional and stackable)
    leadershipLevel: v.optional(v.string()), // L, S, M, D, C
    equipmentCertifications: v.array(v.string()), // E1, E2, E3, E4
    driverLicenses: v.array(v.string()), // D1, D2, D3, DH
    professionalCerts: v.array(v.string()), // ISA, CRA, TRA, OSH, PES, CPR

    // Cross-Training (Secondary Specialties)
    crossTraining: v.array(
      v.object({
        role: v.string(),
        tier: v.number(),
      }),
    ),

    // Calculated Fields
    employeeCode: v.string(), // Generated: [ROLE][TIER]+[ADD-ONS] / X-[CROSS-TRAINING]
    effectiveHourlyRate: v.number(), // Based on tier + add-ons
    trueCostPerHour: v.number(), // effectiveHourlyRate * burdenMultiplier

    // Legacy field (kept for backward compatibility, can be used for additional notes)
    position: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_career_track", ["organizationId", "careerTrack"])
    .index("by_tier", ["organizationId", "tier"])
    .index("by_code", ["organizationId", "employeeCode"]),

  // Loadouts (Equipment + Employee combinations)
  loadouts: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    serviceType: v.string(), // Forestry Mulching, Stump Grinding, Land Clearing, etc.

    // Equipment & Crew
    equipmentIds: v.array(v.id("equipment")),
    employeeIds: v.array(v.id("employees")),

    // Production & Performance
    productionRate: v.number(), // PpH (Points per Hour) or StumpScore/hour

    // Cost Components (calculated)
    totalEquipmentCost: v.number(), // Sum of all equipment costs per hour
    totalLaborCost: v.number(), // Sum of all employee true costs per hour
    overheadCost: v.number(), // Admin, office, general overhead
    totalLoadoutCost: v.number(), // Equipment + Labor + Overhead

    // Multi-Margin Billing Rates (all pre-calculated)
    billingRate30: v.number(), // Cost ÷ 0.70 (30% margin)
    billingRate40: v.number(), // Cost ÷ 0.60 (40% margin)
    billingRate50: v.number(), // Cost ÷ 0.50 (50% margin)
    billingRate60: v.number(), // Cost ÷ 0.40 (60% margin)
    billingRate70: v.number(), // Cost ÷ 0.30 (70% margin)

    // Transport Rate (for calculator usage)
    transportRate: v.optional(v.number()), // 0.30 or 0.50 depending on equipment

    // Status
    isActive: v.boolean(), // Can this loadout be used for new quotes?

    // Notes
    notes: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_service_type", ["organizationId", "serviceType"])
    .index("by_active", ["organizationId", "isActive"]),

  // Customers
  customers: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // Leads
  leads: defineTable({
    organizationId: v.id("organizations"),
    customerName: v.string(),
    propertyAddress: v.string(),
    phoneNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    serviceType: v.string(),
    status: v.string(),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // Proposals
  proposals: defineTable({
    organizationId: v.id("organizations"),
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    propertyAddress: v.string(),
    driveTimeMinutes: v.number(),
    totalInvestment: v.number(),
    status: v.string(),
    lineItems: v.array(
      v.object({
        lineNumber: v.number(),
        serviceType: v.string(),
        description: v.string(),
        productionHours: v.number(),
        transportHours: v.number(),
        bufferHours: v.number(),
        totalHours: v.number(),
        hourlyRate: v.number(),
        totalCost: v.number(),
        lineTotal: v.number(),
        loadoutId: v.id("loadouts"),
        loadoutName: v.string(),
      }),
    ),

    // Financing Options (optional)
    financingOffered: v.optional(v.boolean()),
    financingAPR: v.optional(v.number()), // Annual Percentage Rate
    financingTermMonths: v.optional(v.number()), // Term in months
    financingMonthlyPayment: v.optional(v.number()), // Calculated monthly payment

    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // Projects
  projects: defineTable({
    organizationId: v.id("organizations"),
    proposalId: v.optional(v.id("proposals")),
    customerName: v.string(),
    propertyAddress: v.string(),
    serviceType: v.string(),
    status: v.string(),
    totalInvestment: v.number(),
    startDate: v.optional(v.number()),
    completionDate: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  workOrders: defineTable({
    organizationId: v.id("organizations"),
    proposalId: v.optional(v.id("proposals")),
    customerName: v.string(),
    propertyAddress: v.string(),
    serviceType: v.string(),
    status: v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled")),
    scheduledDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    assignedEmployeeIds: v.array(v.id("employees")),
    assignedEquipmentIds: v.array(v.id("equipment")),
    estimatedHours: v.number(),
    actualHours: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_proposal", ["proposalId"])
    .index("by_status", ["organizationId", "status"]),

  invoices: defineTable({
    organizationId: v.id("organizations"),
    proposalId: v.optional(v.id("proposals")),
    workOrderId: v.optional(v.id("workOrders")),
    invoiceNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    propertyAddress: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled"),
    ),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    total: v.number(),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      }),
    ),
    dueDate: v.number(),
    paidDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_invoice_number", ["organizationId", "invoiceNumber"])
    .index("by_status", ["organizationId", "status"]),
})
