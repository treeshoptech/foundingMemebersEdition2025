import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Organizations (Multi-tenant root)
  organizations: defineTable({
    name: v.string(),
    businessAddress: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    workosOrgId: v.optional(v.string()), // WorkOS organization ID for mapping
    logoUrl: v.optional(v.string()), // Company logo URL
    createdAt: v.number(),
  }).index("by_workos_org", ["workosOrgId"]),

  // Users (linked to organizations)
  users: defineTable({
    email: v.string(),
    name: v.string(),
    workosUserId: v.optional(v.string()), // WorkOS user ID from JWT
    passwordHash: v.optional(v.string()), // DEPRECATED - keeping for migration
    organizationId: v.id("organizations"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("manager"), v.literal("estimator")),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_workos_user", ["workosUserId"])
    .index("by_organization", ["organizationId"]),

  // Equipment
  equipment: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    category: v.string(),
    purchasePrice: v.number(),
    usefulLifeYears: v.number(),
    annualHours: v.number(),
    maintenanceCostPerHour: v.number(),
    fuelCostPerHour: v.number(),
    insuranceAnnual: v.number(),
    ownershipCostPerHour: v.number(),
    operatingCostPerHour: v.number(),
    totalCostPerHour: v.number(),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // Employees
  employees: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    position: v.string(),
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(),
    trueCostPerHour: v.number(),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

  // Loadouts (Equipment + Employee combinations)
  loadouts: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    serviceType: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    employeeIds: v.array(v.id("employees")),
    productionRate: v.number(),
    totalLoadoutCostPerHour: v.number(),
    selectedMargin: v.number(),
    billingRate: v.number(),
    createdAt: v.number(),
  }).index("by_organization", ["organizationId"]),

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
