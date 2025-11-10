import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create maintenance log entry
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    equipmentId: v.id("equipment"),
    date: v.number(),
    type: v.string(), // Routine, Repair, Inspection, etc.
    description: v.string(),
    laborCost: v.optional(v.number()),
    partsCost: v.optional(v.number()),
    totalCost: v.number(),
    hoursAtService: v.optional(v.number()),
    odometerAtService: v.optional(v.number()),
    performedBy: v.optional(v.string()),
    nextServiceDue: v.optional(v.number()),
    nextServiceHours: v.optional(v.number()),
    invoiceNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("equipmentMaintenanceLogs", {
      ...args,
      createdAt: Date.now(),
    })

    // Update equipment's service information
    const equipment = await ctx.db.get(args.equipmentId)
    if (equipment) {
      const updates: {
        lastServiceDate: number
        nextServiceDue?: number
      } = {
        lastServiceDate: args.date,
      }

      if (args.nextServiceDue) {
        updates.nextServiceDue = args.nextServiceDue
      }

      await ctx.db.patch(args.equipmentId, updates)
    }

    return logId
  },
})

// List maintenance logs by equipment
export const listByEquipment = query({
  args: {
    equipmentId: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentMaintenanceLogs")
      .withIndex("by_equipment", (q) => q.eq("equipmentId", args.equipmentId))
      .order("desc")
      .collect()
  },
})

// List all maintenance logs by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentMaintenanceLogs")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect()
  },
})

// Get maintenance logs by date range
export const listByDateRange = query({
  args: {
    organizationId: v.id("organizations"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const allLogs = await ctx.db
      .query("equipmentMaintenanceLogs")
      .withIndex("by_date", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    return allLogs.filter((log) => log.date >= args.startDate && log.date <= args.endDate)
  },
})

// Get maintenance log by ID
export const getById = query({
  args: {
    id: v.id("equipmentMaintenanceLogs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Update maintenance log
export const update = mutation({
  args: {
    id: v.id("equipmentMaintenanceLogs"),
    date: v.number(),
    type: v.string(),
    description: v.string(),
    laborCost: v.optional(v.number()),
    partsCost: v.optional(v.number()),
    totalCost: v.number(),
    hoursAtService: v.optional(v.number()),
    odometerAtService: v.optional(v.number()),
    performedBy: v.optional(v.string()),
    nextServiceDue: v.optional(v.number()),
    nextServiceHours: v.optional(v.number()),
    invoiceNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    const log = await ctx.db.get(id)
    if (log) {
      // Update equipment's service information if date changed
      const equipment = await ctx.db.get(log.equipmentId)
      if (equipment && data.date !== log.date) {
        const updates: {
          lastServiceDate: number
          nextServiceDue?: number
        } = {
          lastServiceDate: data.date,
        }

        if (data.nextServiceDue) {
          updates.nextServiceDue = data.nextServiceDue
        }

        await ctx.db.patch(log.equipmentId, updates)
      }
    }

    await ctx.db.patch(id, data)
  },
})

// Delete maintenance log
export const remove = mutation({
  args: {
    id: v.id("equipmentMaintenanceLogs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// Get upcoming maintenance (equipment with service due soon)
export const getUpcomingMaintenance = query({
  args: {
    organizationId: v.id("organizations"),
    daysAhead: v.optional(v.number()), // Default to 30 days
  },
  handler: async (ctx, args) => {
    const daysAhead = args.daysAhead || 30
    const futureDate = Date.now() + daysAhead * 24 * 60 * 60 * 1000

    const allEquipment = await ctx.db
      .query("equipment")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    return allEquipment.filter((equipment) => {
      return equipment.nextServiceDue && equipment.nextServiceDue <= futureDate && equipment.nextServiceDue >= Date.now()
    })
  },
})

// Get overdue maintenance
export const getOverdueMaintenance = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const allEquipment = await ctx.db
      .query("equipment")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    return allEquipment.filter((equipment) => {
      return equipment.nextServiceDue && equipment.nextServiceDue < now
    })
  },
})
