import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create employee
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    position: v.string(),
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(),
  },
  handler: async (ctx, args) => {
    // Calculate true cost per hour
    const trueCostPerHour = args.baseHourlyRate * args.burdenMultiplier

    const employeeId = await ctx.db.insert("employees", {
      ...args,
      trueCostPerHour,
      createdAt: Date.now(),
    })

    return employeeId
  },
})

// List employees by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
  },
})

// Update employee
export const update = mutation({
  args: {
    id: v.id("employees"),
    name: v.string(),
    position: v.string(),
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Recalculate true cost per hour
    const trueCostPerHour = data.baseHourlyRate * data.burdenMultiplier

    await ctx.db.patch(id, {
      ...data,
      trueCostPerHour,
    })
  },
})

// Delete employee
export const remove = mutation({
  args: {
    id: v.id("employees"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
