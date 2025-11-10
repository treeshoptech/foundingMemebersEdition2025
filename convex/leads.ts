import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all leads for organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
    return leads
  },
})

// Create a new lead
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    customerName: v.string(),
    propertyAddress: v.string(),
    phoneNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    serviceType: v.string(),
    status: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      organizationId: args.organizationId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      phoneNumber: args.phoneNumber,
      email: args.email,
      serviceType: args.serviceType,
      status: args.status || "new",
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
    leadId: v.id("leads"),
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
    const { leadId, ...updates } = args
    await ctx.db.patch(leadId, updates)
  },
})

// Delete lead
export const remove = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.leadId)
  },
})
