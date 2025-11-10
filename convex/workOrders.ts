import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all work orders for organization
export const list = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Get organizationId from auth context
    const workOrders = await ctx.db.query("workOrders").collect()
    return workOrders
  },
})

// Create a new work order
export const create = mutation({
  args: {
    proposalId: v.optional(v.id("proposals")),
    customerName: v.string(),
    propertyAddress: v.string(),
    serviceType: v.string(),
    scheduledDate: v.optional(v.number()),
    assignedEmployeeIds: v.array(v.id("employees")),
    assignedEquipmentIds: v.array(v.id("equipment")),
    estimatedHours: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Get organizationId from auth context
    const organizationId = "temp_org_id" as any

    const workOrderId = await ctx.db.insert("workOrders", {
      organizationId,
      proposalId: args.proposalId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      serviceType: args.serviceType,
      status: "scheduled",
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
    id: v.id("workOrders"),
    status: v.optional(
      v.union(v.literal("scheduled"), v.literal("in-progress"), v.literal("completed"), v.literal("cancelled")),
    ),
    scheduledDate: v.optional(v.number()),
    completedDate: v.optional(v.number()),
    assignedEmployeeIds: v.optional(v.array(v.id("employees"))),
    assignedEquipmentIds: v.optional(v.array(v.id("equipment"))),
    actualHours: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

// Delete work order
export const remove = mutation({
  args: { id: v.id("workOrders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
