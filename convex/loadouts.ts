import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create loadout with comprehensive cost calculations
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    serviceType: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    employeeIds: v.array(v.id("employees")),
    productionRate: v.number(),
    overheadCost: v.number(),
    transportRate: v.optional(v.number()),
    isActive: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get equipment and calculate total equipment cost
    const equipment = await Promise.all(args.equipmentIds.map((id) => ctx.db.get(id)))
    const totalEquipmentCost = equipment.reduce((sum, eq) => sum + (eq?.totalCostPerHour || 0), 0)

    // Get employees and calculate total labor cost
    const employees = await Promise.all(args.employeeIds.map((id) => ctx.db.get(id)))
    const totalLaborCost = employees.reduce((sum, emp) => sum + (emp?.trueCostPerHour || 0), 0)

    // Calculate total loadout cost
    const totalLoadoutCost = totalEquipmentCost + totalLaborCost + args.overheadCost

    // Calculate billing rates at all margins using CORRECT formula: Cost ÷ (1 - Margin%)
    const billingRate30 = totalLoadoutCost / 0.70  // 30% margin
    const billingRate40 = totalLoadoutCost / 0.60  // 40% margin
    const billingRate50 = totalLoadoutCost / 0.50  // 50% margin
    const billingRate60 = totalLoadoutCost / 0.40  // 60% margin
    const billingRate70 = totalLoadoutCost / 0.30  // 70% margin

    const loadoutId = await ctx.db.insert("loadouts", {
      organizationId: args.organizationId,
      name: args.name,
      description: args.description,
      serviceType: args.serviceType,
      equipmentIds: args.equipmentIds,
      employeeIds: args.employeeIds,
      productionRate: args.productionRate,
      totalEquipmentCost,
      totalLaborCost,
      overheadCost: args.overheadCost,
      totalLoadoutCost,
      billingRate30,
      billingRate40,
      billingRate50,
      billingRate60,
      billingRate70,
      transportRate: args.transportRate,
      isActive: args.isActive,
      notes: args.notes,
      createdAt: Date.now(),
    })

    return loadoutId
  },
})

// Update loadout
export const update = mutation({
  args: {
    id: v.id("loadouts"),
    name: v.string(),
    description: v.optional(v.string()),
    serviceType: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    employeeIds: v.array(v.id("employees")),
    productionRate: v.number(),
    overheadCost: v.number(),
    transportRate: v.optional(v.number()),
    isActive: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Recalculate all costs
    const equipment = await Promise.all(data.equipmentIds.map((id) => ctx.db.get(id)))
    const totalEquipmentCost = equipment.reduce((sum, eq) => sum + (eq?.totalCostPerHour || 0), 0)

    const employees = await Promise.all(data.employeeIds.map((id) => ctx.db.get(id)))
    const totalLaborCost = employees.reduce((sum, emp) => sum + (emp?.trueCostPerHour || 0), 0)

    const totalLoadoutCost = totalEquipmentCost + totalLaborCost + data.overheadCost

    // Recalculate billing rates at all margins
    const billingRate30 = totalLoadoutCost / 0.70
    const billingRate40 = totalLoadoutCost / 0.60
    const billingRate50 = totalLoadoutCost / 0.50
    const billingRate60 = totalLoadoutCost / 0.40
    const billingRate70 = totalLoadoutCost / 0.30

    await ctx.db.patch(id, {
      name: data.name,
      description: data.description,
      serviceType: data.serviceType,
      equipmentIds: data.equipmentIds,
      employeeIds: data.employeeIds,
      productionRate: data.productionRate,
      totalEquipmentCost,
      totalLaborCost,
      overheadCost: data.overheadCost,
      totalLoadoutCost,
      billingRate30,
      billingRate40,
      billingRate50,
      billingRate60,
      billingRate70,
      transportRate: data.transportRate,
      isActive: data.isActive,
      notes: data.notes,
    })
  },
})

// List loadouts by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const loadouts = await ctx.db
      .query("loadouts")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    // Enrich with equipment and employee details
    return await Promise.all(
      loadouts.map(async (loadout) => {
        const equipment = await Promise.all(loadout.equipmentIds.map((id) => ctx.db.get(id)))
        const employees = await Promise.all(loadout.employeeIds.map((id) => ctx.db.get(id)))

        return {
          ...loadout,
          equipment: equipment.filter((e) => e !== null),
          employees: employees.filter((e) => e !== null),
        }
      }),
    )
  },
})

// List active loadouts by service type
export const listByServiceType = query({
  args: {
    organizationId: v.id("organizations"),
    serviceType: v.string(),
  },
  handler: async (ctx, args) => {
    const loadouts = await ctx.db
      .query("loadouts")
      .withIndex("by_service_type", (q) =>
        q.eq("organizationId", args.organizationId).eq("serviceType", args.serviceType)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()

    // Enrich with equipment and employee details
    return await Promise.all(
      loadouts.map(async (loadout) => {
        const equipment = await Promise.all(loadout.equipmentIds.map((id) => ctx.db.get(id)))
        const employees = await Promise.all(loadout.employeeIds.map((id) => ctx.db.get(id)))

        return {
          ...loadout,
          equipment: equipment.filter((e) => e !== null),
          employees: employees.filter((e) => e !== null),
        }
      }),
    )
  },
})

// Get single loadout with details
export const getById = query({
  args: {
    id: v.id("loadouts"),
  },
  handler: async (ctx, args) => {
    const loadout = await ctx.db.get(args.id)
    if (!loadout) return null

    const equipment = await Promise.all(loadout.equipmentIds.map((id) => ctx.db.get(id)))
    const employees = await Promise.all(loadout.employeeIds.map((id) => ctx.db.get(id)))

    return {
      ...loadout,
      equipment: equipment.filter((e) => e !== null),
      employees: employees.filter((e) => e !== null),
    }
  },
})

// Delete loadout
export const remove = mutation({
  args: {
    id: v.id("loadouts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// Toggle loadout active status
export const toggleActive = mutation({
  args: {
    id: v.id("loadouts"),
  },
  handler: async (ctx, args) => {
    const loadout = await ctx.db.get(args.id)
    if (!loadout) throw new Error("Loadout not found")

    await ctx.db.patch(args.id, {
      isActive: !loadout.isActive,
    })
  },
})
