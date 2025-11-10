import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create equipment
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    category: v.string(),
    purchasePrice: v.number(),
    usefulLifeYears: v.number(),
    annualHours: v.number(),
    maintenanceCostPerHour: v.number(),
    fuelCostPerHour: v.number(),
    insuranceAnnual: v.number(),
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

// Update equipment
export const update = mutation({
  args: {
    id: v.id("equipment"),
    name: v.string(),
    category: v.string(),
    purchasePrice: v.number(),
    usefulLifeYears: v.number(),
    annualHours: v.number(),
    maintenanceCostPerHour: v.number(),
    fuelCostPerHour: v.number(),
    insuranceAnnual: v.number(),
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

// Delete equipment
export const remove = mutation({
  args: {
    id: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
