import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create equipment with enhanced fields
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),

    // Basic Information
    name: v.string(),
    category: v.string(),
    type: v.string(),

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
    annualHours: v.number(),
    maintenanceCostPerHour: v.number(),
    fuelCostPerHour: v.number(),
    insuranceAnnual: v.number(),

    // Status & Condition
    status: v.string(),
    condition: v.optional(v.string()),

    // Operational Information
    fuelType: v.optional(v.string()),
    fuelCapacity: v.optional(v.number()),

    // KPI Tracking Fields
    totalHoursOperated: v.optional(v.number()),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    currentOdometerReading: v.optional(v.number()),

    // Additional Information
    notes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate costs
    const ownershipCostPerHour =
      args.purchasePrice / (args.usefulLifeYears * args.annualHours) + args.insuranceAnnual / args.annualHours

    const operatingCostPerHour = args.maintenanceCostPerHour + args.fuelCostPerHour

    const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour

    const equipmentId = await ctx.db.insert("equipment", {
      ...args,
      ownershipCostPerHour,
      operatingCostPerHour,
      totalCostPerHour,
      createdAt: Date.now(),
    })

    return equipmentId
  },
})

// List equipment by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
  },
})

// Update equipment with enhanced fields
export const update = mutation({
  args: {
    id: v.id("equipment"),

    // Basic Information
    name: v.string(),
    category: v.string(),
    type: v.string(),

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
    annualHours: v.number(),
    maintenanceCostPerHour: v.number(),
    fuelCostPerHour: v.number(),
    insuranceAnnual: v.number(),

    // Status & Condition
    status: v.string(),
    condition: v.optional(v.string()),

    // Operational Information
    fuelType: v.optional(v.string()),
    fuelCapacity: v.optional(v.number()),

    // KPI Tracking Fields
    totalHoursOperated: v.optional(v.number()),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    currentOdometerReading: v.optional(v.number()),

    // Additional Information
    notes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Recalculate costs
    const ownershipCostPerHour =
      data.purchasePrice / (data.usefulLifeYears * data.annualHours) + data.insuranceAnnual / data.annualHours

    const operatingCostPerHour = data.maintenanceCostPerHour + data.fuelCostPerHour

    const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour

    await ctx.db.patch(id, {
      ...data,
      ownershipCostPerHour,
      operatingCostPerHour,
      totalCostPerHour,
    })
  },
})

// Get equipment by ID
export const getById = query({
  args: {
    id: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// List equipment by category
export const listByCategory = query({
  args: {
    organizationId: v.id("organizations"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_category", (q) => q.eq("organizationId", args.organizationId).eq("category", args.category))
      .collect()
  },
})

// List equipment by status
export const listByStatus = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipment")
      .withIndex("by_status", (q) => q.eq("organizationId", args.organizationId).eq("status", args.status))
      .collect()
  },
})

// Delete equipment
export const remove = mutation({
  args: {
    id: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
