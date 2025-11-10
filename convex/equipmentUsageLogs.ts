import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create usage log entry
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    equipmentId: v.id("equipment"),
    workOrderId: v.optional(v.id("workOrders")),
    date: v.number(),
    hoursUsed: v.number(),
    odometerStart: v.optional(v.number()),
    odometerEnd: v.optional(v.number()),
    fuelUsed: v.optional(v.number()),
    fuelCost: v.optional(v.number()),
    maintenanceCost: v.optional(v.number()),
    operatorId: v.optional(v.id("employees")),
    jobLocation: v.optional(v.string()),
    notes: v.optional(v.string()),
    issuesReported: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("equipmentUsageLogs", {
      ...args,
      createdAt: Date.now(),
    })

    // Update equipment's total hours operated
    const equipment = await ctx.db.get(args.equipmentId)
    if (equipment) {
      const currentHours = equipment.totalHoursOperated || 0
      const newTotalHours = currentHours + args.hoursUsed

      // Update odometer if provided
      const updates: {
        totalHoursOperated: number
        currentOdometerReading?: number
      } = {
        totalHoursOperated: newTotalHours,
      }

      if (args.odometerEnd) {
        updates.currentOdometerReading = args.odometerEnd
      }

      await ctx.db.patch(args.equipmentId, updates)
    }

    return logId
  },
})

// List usage logs by equipment
export const listByEquipment = query({
  args: {
    equipmentId: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentUsageLogs")
      .withIndex("by_equipment", (q) => q.eq("equipmentId", args.equipmentId))
      .order("desc")
      .collect()
  },
})

// List usage logs by work order
export const listByWorkOrder = query({
  args: {
    workOrderId: v.id("workOrders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentUsageLogs")
      .withIndex("by_work_order", (q) => q.eq("workOrderId", args.workOrderId))
      .collect()
  },
})

// List all usage logs by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentUsageLogs")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect()
  },
})

// Get usage logs by date range
export const listByDateRange = query({
  args: {
    organizationId: v.id("organizations"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const allLogs = await ctx.db
      .query("equipmentUsageLogs")
      .withIndex("by_date", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    return allLogs.filter((log) => log.date >= args.startDate && log.date <= args.endDate)
  },
})

// Get usage log by ID
export const getById = query({
  args: {
    id: v.id("equipmentUsageLogs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Update usage log
export const update = mutation({
  args: {
    id: v.id("equipmentUsageLogs"),
    date: v.number(),
    hoursUsed: v.number(),
    odometerStart: v.optional(v.number()),
    odometerEnd: v.optional(v.number()),
    fuelUsed: v.optional(v.number()),
    fuelCost: v.optional(v.number()),
    maintenanceCost: v.optional(v.number()),
    operatorId: v.optional(v.id("employees")),
    jobLocation: v.optional(v.string()),
    notes: v.optional(v.string()),
    issuesReported: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Get the old log to adjust equipment hours if needed
    const oldLog = await ctx.db.get(id)
    if (oldLog) {
      const hoursDifference = data.hoursUsed - oldLog.hoursUsed

      // Update equipment's total hours if hours changed
      if (hoursDifference !== 0) {
        const equipment = await ctx.db.get(oldLog.equipmentId)
        if (equipment) {
          const currentHours = equipment.totalHoursOperated || 0
          await ctx.db.patch(oldLog.equipmentId, {
            totalHoursOperated: currentHours + hoursDifference,
          })
        }
      }

      // Update odometer if provided
      if (data.odometerEnd) {
        const equipment = await ctx.db.get(oldLog.equipmentId)
        if (equipment) {
          await ctx.db.patch(oldLog.equipmentId, {
            currentOdometerReading: data.odometerEnd,
          })
        }
      }
    }

    await ctx.db.patch(id, data)
  },
})

// Delete usage log
export const remove = mutation({
  args: {
    id: v.id("equipmentUsageLogs"),
  },
  handler: async (ctx, args) => {
    const log = await ctx.db.get(args.id)
    if (log) {
      // Adjust equipment hours when deleting
      const equipment = await ctx.db.get(log.equipmentId)
      if (equipment) {
        const currentHours = equipment.totalHoursOperated || 0
        const newHours = Math.max(0, currentHours - log.hoursUsed)
        await ctx.db.patch(log.equipmentId, {
          totalHoursOperated: newHours,
        })
      }

      await ctx.db.delete(args.id)
    }
  },
})
