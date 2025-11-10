import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create proposal
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    propertyAddress: v.string(),
    driveTimeMinutes: v.number(),
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
  },
  handler: async (ctx, args) => {
    // Calculate total investment
    const totalInvestment = args.lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

    const proposalId = await ctx.db.insert("proposals", {
      organizationId: args.organizationId,
      customerId: args.customerId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      driveTimeMinutes: args.driveTimeMinutes,
      totalInvestment,
      status: "draft",
      lineItems: args.lineItems,
      createdAt: Date.now(),
    })

    return proposalId
  },
})

// List proposals by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("proposals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect()
  },
})

// Get single proposal
export const get = query({
  args: {
    id: v.id("proposals"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Update proposal
export const update = mutation({
  args: {
    id: v.id("proposals"),
    customerName: v.string(),
    propertyAddress: v.string(),
    driveTimeMinutes: v.number(),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Recalculate total investment
    const totalInvestment = data.lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

    await ctx.db.patch(id, {
      ...data,
      totalInvestment,
    })
  },
})

// Update proposal status
export const updateStatus = mutation({
  args: {
    id: v.id("proposals"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    })
  },
})

// Delete proposal
export const remove = mutation({
  args: {
    id: v.id("proposals"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
