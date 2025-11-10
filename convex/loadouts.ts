import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create loadout
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    serviceType: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    employeeIds: v.array(v.id("employees")),
    productionRate: v.number(),
    selectedMargin: v.number(),
  },
  handler: async (ctx, args) => {
    // Get equipment costs
    const equipment = await Promise.all(args.equipmentIds.map((id) => ctx.db.get(id)))
    const totalEquipmentCost = equipment.reduce((sum, eq) => sum + (eq?.totalCostPerHour || 0), 0)

    // Get employee costs
    const employees = await Promise.all(args.employeeIds.map((id) => ctx.db.get(id)))
    const totalEmployeeCost = employees.reduce((sum, emp) => sum + (emp?.trueCostPerHour || 0), 0)

    const totalLoadoutCostPerHour = totalEquipmentCost + totalEmployeeCost
    const billingRate = totalLoadoutCostPerHour * (1 + args.selectedMargin / 100)

    const loadoutId = await ctx.db.insert("loadouts", {
      ...args,
      totalLoadoutCostPerHour,
      billingRate,
      createdAt: Date.now(),
    })

    return loadoutId
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

// Get single loadout with details
export const get = query({
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

// Update loadout
export const update = mutation({
  args: {
    id: v.id("loadouts"),
    name: v.string(),
    serviceType: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    employeeIds: v.array(v.id("employees")),
    productionRate: v.number(),
    selectedMargin: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Recalculate costs
    const equipment = await Promise.all(data.equipmentIds.map((id) => ctx.db.get(id)))
    const totalEquipmentCost = equipment.reduce((sum, eq) => sum + (eq?.totalCostPerHour || 0), 0)

    const employees = await Promise.all(data.employeeIds.map((id) => ctx.db.get(id)))
    const totalEmployeeCost = employees.reduce((sum, emp) => sum + (emp?.trueCostPerHour || 0), 0)

    const totalLoadoutCostPerHour = totalEquipmentCost + totalEmployeeCost
    const billingRate = totalLoadoutCostPerHour * (1 + data.selectedMargin / 100)

    await ctx.db.patch(id, {
      ...data,
      totalLoadoutCostPerHour,
      billingRate,
    })
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
