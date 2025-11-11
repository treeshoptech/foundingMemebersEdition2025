import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create equipment with comprehensive onboarding
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),

    // Section 1: Equipment Identity
    name: v.string(),
    category: v.string(),
    type: v.string(),
    year: v.optional(v.number()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    status: v.string(),
    condition: v.optional(v.string()),

    // Section 2: Usage Pattern
    daysPerYear: v.number(),
    hoursPerDay: v.number(),
    annualHours: v.number(),

    // Section 3: Purchase & Financing
    purchasePrice: v.number(),
    purchaseDate: v.optional(v.number()),
    usefulLifeYears: v.number(),
    financingType: v.optional(v.string()),
    financeAPR: v.optional(v.number()),
    financeTermMonths: v.optional(v.number()),
    financeDownPayment: v.optional(v.number()),

    // Section 4: Annual Fixed Costs
    insuranceAnnual: v.number(),

    // Section 5: Annual Operating Costs
    fuelBurnRate: v.number(),
    fuelPricePerGallon: v.number(),
    maintenanceTier: v.string(),
    oilChangeInterval: v.number(),

    // Optional fields
    fuelType: v.optional(v.string()),
    notes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    totalHoursOperated: v.optional(v.number()),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    currentOdometerReading: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      purchasePrice, usefulLifeYears, annualHours,
      financeAPR, financeTermMonths, financeDownPayment, financingType,
      fuelBurnRate, fuelPricePerGallon,
      maintenanceTier, oilChangeInterval,
      insuranceAnnual
    } = args

    // DEPRECIATION: (Purchase Price - Residual Value) / Years / Annual Hours
    const residualValue = purchasePrice * 0.20 // 20% residual
    const depreciationCostPerHour = (purchasePrice - residualValue) / usefulLifeYears / annualHours

    // FINANCING: Calculate monthly payment and annual interest
    let financingCostPerHour = 0
    if (financingType === "financed" && financeAPR && financeTermMonths) {
      const principal = purchasePrice - (financeDownPayment || 0)
      const monthlyRate = (financeAPR / 100) / 12
      const monthlyPayment = principal *
        (monthlyRate * Math.pow(1 + monthlyRate, financeTermMonths)) /
        (Math.pow(1 + monthlyRate, financeTermMonths) - 1)
      const annualInterest = (12 * monthlyPayment) - (principal / (financeTermMonths / 12))
      financingCostPerHour = annualInterest / annualHours
    }

    // FUEL: Burn Rate × Price Per Gallon
    const fuelCostPerHour = fuelBurnRate * fuelPricePerGallon

    // MAINTENANCE: Tier Cost + Oil Changes
    const maintenanceTierCosts = {
      minimal: 1300,
      standard: 2600,
      intensive: 4550
    }
    const tierCost = maintenanceTierCosts[maintenanceTier as keyof typeof maintenanceTierCosts] || 2600
    const oilChangesPerYear = annualHours / oilChangeInterval
    const oilCostPerChange = 150
    const maintenanceCostPerHour = (tierCost + (oilChangesPerYear * oilCostPerChange)) / annualHours

    // INSURANCE: Annual Insurance / Annual Hours
    const insuranceCostPerHour = insuranceAnnual / annualHours

    // TOTAL COSTS
    const ownershipCostPerHour = depreciationCostPerHour + financingCostPerHour + insuranceCostPerHour
    const operatingCostPerHour = fuelCostPerHour + maintenanceCostPerHour
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

// Update equipment
export const update = mutation({
  args: {
    id: v.id("equipment"),

    // Section 1: Equipment Identity
    name: v.string(),
    category: v.string(),
    type: v.string(),
    year: v.optional(v.number()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    status: v.string(),
    condition: v.optional(v.string()),

    // Section 2: Usage Pattern
    daysPerYear: v.number(),
    hoursPerDay: v.number(),
    annualHours: v.number(),

    // Section 3: Purchase & Financing
    purchasePrice: v.number(),
    purchaseDate: v.optional(v.number()),
    usefulLifeYears: v.number(),
    financingType: v.optional(v.string()),
    financeAPR: v.optional(v.number()),
    financeTermMonths: v.optional(v.number()),
    financeDownPayment: v.optional(v.number()),

    // Section 4: Annual Fixed Costs
    insuranceAnnual: v.number(),

    // Section 5: Annual Operating Costs
    fuelBurnRate: v.number(),
    fuelPricePerGallon: v.number(),
    maintenanceTier: v.string(),
    oilChangeInterval: v.number(),

    // Optional fields
    fuelType: v.optional(v.string()),
    notes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    totalHoursOperated: v.optional(v.number()),
    lastServiceDate: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    currentOdometerReading: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    const {
      purchasePrice, usefulLifeYears, annualHours,
      financeAPR, financeTermMonths, financeDownPayment, financingType,
      fuelBurnRate, fuelPricePerGallon,
      maintenanceTier, oilChangeInterval,
      insuranceAnnual
    } = data

    // DEPRECIATION
    const residualValue = purchasePrice * 0.20
    const depreciationCostPerHour = (purchasePrice - residualValue) / usefulLifeYears / annualHours

    // FINANCING
    let financingCostPerHour = 0
    if (financingType === "financed" && financeAPR && financeTermMonths) {
      const principal = purchasePrice - (financeDownPayment || 0)
      const monthlyRate = (financeAPR / 100) / 12
      const monthlyPayment = principal *
        (monthlyRate * Math.pow(1 + monthlyRate, financeTermMonths)) /
        (Math.pow(1 + monthlyRate, financeTermMonths) - 1)
      const annualInterest = (12 * monthlyPayment) - (principal / (financeTermMonths / 12))
      financingCostPerHour = annualInterest / annualHours
    }

    // FUEL
    const fuelCostPerHour = fuelBurnRate * fuelPricePerGallon

    // MAINTENANCE
    const maintenanceTierCosts = {
      minimal: 1300,
      standard: 2600,
      intensive: 4550
    }
    const tierCost = maintenanceTierCosts[maintenanceTier as keyof typeof maintenanceTierCosts] || 2600
    const oilChangesPerYear = annualHours / oilChangeInterval
    const oilCostPerChange = 150
    const maintenanceCostPerHour = (tierCost + (oilChangesPerYear * oilCostPerChange)) / annualHours

    // INSURANCE
    const insuranceCostPerHour = insuranceAnnual / annualHours

    // TOTAL COSTS
    const ownershipCostPerHour = depreciationCostPerHour + financingCostPerHour + insuranceCostPerHour
    const operatingCostPerHour = fuelCostPerHour + maintenanceCostPerHour
    const totalCostPerHour = ownershipCostPerHour + operatingCostPerHour

    await ctx.db.patch(id, {
      ...data,
      ownershipCostPerHour,
      operatingCostPerHour,
      totalCostPerHour,
    })
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
