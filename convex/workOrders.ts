import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all work orders for organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const workOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
    return workOrders
  },
})

// Create a new work order
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    proposalId: v.optional(v.id("proposals")),
    customerName: v.string(),
    propertyAddress: v.string(),
    serviceType: v.string(),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled"))),
    scheduledDate: v.optional(v.number()),
    assignedEmployeeIds: v.array(v.id("employees")),
    assignedEquipmentIds: v.array(v.id("equipment")),
    estimatedHours: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workOrderId = await ctx.db.insert("workOrders", {
      organizationId: args.organizationId,
      proposalId: args.proposalId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      serviceType: args.serviceType,
      status: args.status || "scheduled",
      scheduledDate: args.scheduledDate,
      assignedEmployeeIds: args.assignedEmployeeIds,
      assignedEquipmentIds: args.assignedEquipmentIds,
      estimatedHours: args.estimatedHours,
      notes: args.notes,
      createdAt: Date.now(),
    })

    return workOrderId
  },
})

// Update work order
export const update = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    organizationId: v.id("organizations"),
    customerName: v.optional(v.string()),
    propertyAddress: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled")),
    ),
    scheduledDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    assignedEmployeeIds: v.optional(v.array(v.id("employees"))),
    assignedEquipmentIds: v.optional(v.array(v.id("equipment"))),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { workOrderId, ...updates } = args
    await ctx.db.patch(workOrderId, updates)
  },
})

// Delete work order
export const remove = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.workOrderId)
  },
})
