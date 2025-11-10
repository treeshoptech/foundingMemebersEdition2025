import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all leads for organization
export const list = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Get organizationId from auth context
    const leads = await ctx.db.query("leads").collect()
    return leads
  },
})

// Create a new lead
export const create = mutation({
  args: {
    customerName: v.string(),
    propertyAddress: v.string(),
    phoneNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    serviceType: v.string(),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Get organizationId from auth context
    const organizationId = "temp_org_id" as any

    const leadId = await ctx.db.insert("leads", {
      organizationId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      phoneNumber: args.phoneNumber,
      email: args.email,
      serviceType: args.serviceType,
      status: "new",
      estimatedValue: args.estimatedValue,
      notes: args.notes,
      createdAt: Date.now(),
    })

    return leadId
  },
})

// Update lead
export const update = mutation({
  args: {
    id: v.id("leads"),
    customerName: v.optional(v.string()),
    propertyAddress: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    status: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

// Delete lead
export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
