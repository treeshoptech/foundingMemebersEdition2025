import { v } from "convex/values"
import { query } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"

// Get comprehensive KPIs for a single equipment
export const getEquipmentKPIs = query({
  args: {
    equipmentId: v.id("equipment"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db.get(args.equipmentId)
    if (!equipment) return null

    // Get usage logs for the period
    const allUsageLogs = await ctx.db
      .query("equipmentUsageLogs")
      .withIndex("by_equipment", (q) => q.eq("equipmentId", args.equipmentId))
      .collect()

    // Filter by date if provided
    const usageLogs = args.startDate && args.endDate
      ? allUsageLogs.filter((log) => log.date >= args.startDate! && log.date <= args.endDate!)
      : allUsageLogs

    // Get maintenance logs for the period
    const allMaintenanceLogs = await ctx.db
      .query("equipmentMaintenanceLogs")
      .withIndex("by_equipment", (q) => q.eq("equipmentId", args.equipmentId))
      .collect()

    const maintenanceLogs = args.startDate && args.endDate
      ? allMaintenanceLogs.filter((log) => log.date >= args.startDate! && log.date <= args.endDate!)
      : allMaintenanceLogs

    // Calculate KPIs
    const totalHoursInPeriod = usageLogs.reduce((sum, log) => sum + log.hoursUsed, 0)
    const totalFuelUsed = usageLogs.reduce((sum, log) => sum + (log.fuelUsed || 0), 0)
    const totalFuelCost = usageLogs.reduce((sum, log) => sum + (log.fuelCost || 0), 0)
    const totalMaintenanceCostFromUsage = usageLogs.reduce((sum, log) => sum + (log.maintenanceCost || 0), 0)
    const totalMaintenanceCostFromLogs = maintenanceLogs.reduce((sum, log) => sum + log.totalCost, 0)
    const totalMaintenanceCost = totalMaintenanceCostFromUsage + totalMaintenanceCostFromLogs

    // Calculate actual costs per hour for the period
    const actualFuelCostPerHour = totalHoursInPeriod > 0 ? totalFuelCost / totalHoursInPeriod : 0
    const actualMaintenanceCostPerHour = totalHoursInPeriod > 0 ? totalMaintenanceCost / totalHoursInPeriod : 0
    const actualOperatingCostPerHour = actualFuelCostPerHour + actualMaintenanceCostPerHour
    const actualTotalCostPerHour = equipment.ownershipCostPerHour + actualOperatingCostPerHour

    // Calculate utilization
    const daysInPeriod = args.startDate && args.endDate
      ? (args.endDate - args.startDate) / (1000 * 60 * 60 * 24)
      : 365 // Default to a year

    const expectedHoursPerDay = equipment.annualHours / 365
    const expectedHoursInPeriod = expectedHoursPerDay * daysInPeriod
    const utilizationRate = expectedHoursInPeriod > 0 ? (totalHoursInPeriod / expectedHoursInPeriod) * 100 : 0

    // Cost variance analysis
    const estimatedFuelCost = totalHoursInPeriod * equipment.fuelCostPerHour
    const estimatedMaintenanceCost = totalHoursInPeriod * equipment.maintenanceCostPerHour
    const fuelCostVariance = totalFuelCost - estimatedFuelCost
    const maintenanceCostVariance = totalMaintenanceCost - estimatedMaintenanceCost

    return {
      equipment,
      period: {
        startDate: args.startDate,
        endDate: args.endDate,
        daysInPeriod,
      },
      usage: {
        totalHours: totalHoursInPeriod,
        expectedHours: expectedHoursInPeriod,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        totalUsageLogs: usageLogs.length,
      },
      fuel: {
        totalGallonsUsed: totalFuelUsed,
        totalCost: totalFuelCost,
        estimatedCost: estimatedFuelCost,
        variance: fuelCostVariance,
        actualCostPerHour: Math.round(actualFuelCostPerHour * 100) / 100,
        estimatedCostPerHour: equipment.fuelCostPerHour,
      },
      maintenance: {
        totalCost: totalMaintenanceCost,
        estimatedCost: estimatedMaintenanceCost,
        variance: maintenanceCostVariance,
        actualCostPerHour: Math.round(actualMaintenanceCostPerHour * 100) / 100,
        estimatedCostPerHour: equipment.maintenanceCostPerHour,
        totalMaintenanceLogs: maintenanceLogs.length,
      },
      costs: {
        ownershipCostPerHour: equipment.ownershipCostPerHour,
        estimatedOperatingCostPerHour: equipment.operatingCostPerHour,
        estimatedTotalCostPerHour: equipment.totalCostPerHour,
        actualOperatingCostPerHour: Math.round(actualOperatingCostPerHour * 100) / 100,
        actualTotalCostPerHour: Math.round(actualTotalCostPerHour * 100) / 100,
      },
      totals: {
        totalRevenue: 0, // Can be calculated from work orders if linked
        totalOperatingCost: totalFuelCost + totalMaintenanceCost,
        totalOwnershipCost: equipment.ownershipCostPerHour * totalHoursInPeriod,
        totalCost: (equipment.ownershipCostPerHour * totalHoursInPeriod) + totalFuelCost + totalMaintenanceCost,
      },
    }
  },
})

// Get KPIs for all equipment in an organization
export const getOrganizationKPIs = query({
  args: {
    organizationId: v.id("organizations"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    const kpiPromises = equipment.map((eq) =>
      ctx.runQuery(internal.equipmentKPIs.getEquipmentKPIs, {
        equipmentId: eq._id,
        startDate: args.startDate,
        endDate: args.endDate,
      })
    )

    const allKPIs = await Promise.all(kpiPromises)

    // Aggregate totals
    const totals = allKPIs.reduce(
      (acc, kpi) => {
        if (!kpi) return acc
        return {
          totalHours: acc.totalHours + kpi.usage.totalHours,
          totalFuelCost: acc.totalFuelCost + kpi.fuel.totalCost,
          totalMaintenanceCost: acc.totalMaintenanceCost + kpi.maintenance.totalCost,
          totalOperatingCost: acc.totalOperatingCost + kpi.totals.totalOperatingCost,
          totalOwnershipCost: acc.totalOwnershipCost + kpi.totals.totalOwnershipCost,
          totalCost: acc.totalCost + kpi.totals.totalCost,
        }
      },
      {
        totalHours: 0,
        totalFuelCost: 0,
        totalMaintenanceCost: 0,
        totalOperatingCost: 0,
        totalOwnershipCost: 0,
        totalCost: 0,
      }
    )

    return {
      equipmentCount: equipment.length,
      period: {
        startDate: args.startDate,
        endDate: args.endDate,
      },
      totals,
      equipmentKPIs: allKPIs.filter((kpi) => kpi !== null),
    }
  },
})

// Get equipment utilization report
export const getUtilizationReport = query({
  args: {
    organizationId: v.id("organizations"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    const utilizationData = await Promise.all(
      equipment.map(async (eq) => {
        const usageLogs = await ctx.db
          .query("equipmentUsageLogs")
          .withIndex("by_equipment", (q) => q.eq("equipmentId", eq._id))
          .collect()

        const filteredLogs = usageLogs.filter(
          (log) => log.date >= args.startDate && log.date <= args.endDate
        )

        const totalHours = filteredLogs.reduce((sum, log) => sum + log.hoursUsed, 0)
        const daysInPeriod = (args.endDate - args.startDate) / (1000 * 60 * 60 * 24)
        const expectedHoursPerDay = eq.annualHours / 365
        const expectedHours = expectedHoursPerDay * daysInPeriod
        const utilizationRate = expectedHours > 0 ? (totalHours / expectedHours) * 100 : 0

        return {
          equipmentId: eq._id,
          equipmentName: eq.name,
          category: eq.category,
          type: eq.type,
          totalHours,
          expectedHours: Math.round(expectedHours * 100) / 100,
          utilizationRate: Math.round(utilizationRate * 100) / 100,
          status: eq.status,
        }
      })
    )

    // Sort by utilization rate (lowest first to identify underutilized equipment)
    utilizationData.sort((a, b) => a.utilizationRate - b.utilizationRate)

    return {
      period: {
        startDate: args.startDate,
        endDate: args.endDate,
      },
      equipment: utilizationData,
      summary: {
        avgUtilization: utilizationData.reduce((sum, eq) => sum + eq.utilizationRate, 0) / utilizationData.length || 0,
        underutilized: utilizationData.filter((eq) => eq.utilizationRate < 50).length,
        wellUtilized: utilizationData.filter((eq) => eq.utilizationRate >= 50 && eq.utilizationRate <= 100).length,
        overutilized: utilizationData.filter((eq) => eq.utilizationRate > 100).length,
      },
    }
  },
})

// Get equipment cost efficiency report
export const getCostEfficiencyReport = query({
  args: {
    organizationId: v.id("organizations"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()

    const costData = await Promise.all(
      equipment.map(async (eq) => {
        const usageLogs = await ctx.db
          .query("equipmentUsageLogs")
          .withIndex("by_equipment", (q) => q.eq("equipmentId", eq._id))
          .collect()

        const filteredUsageLogs = usageLogs.filter(
          (log) => log.date >= args.startDate && log.date <= args.endDate
        )

        const maintenanceLogs = await ctx.db
          .query("equipmentMaintenanceLogs")
          .withIndex("by_equipment", (q) => q.eq("equipmentId", eq._id))
          .collect()

        const filteredMaintenanceLogs = maintenanceLogs.filter(
          (log) => log.date >= args.startDate && log.date <= args.endDate
        )

        const totalHours = filteredUsageLogs.reduce((sum, log) => sum + log.hoursUsed, 0)
        const actualFuelCost = filteredUsageLogs.reduce((sum, log) => sum + (log.fuelCost || 0), 0)
        const actualMaintenanceCost = filteredMaintenanceLogs.reduce((sum, log) => sum + log.totalCost, 0)

        const estimatedFuelCost = totalHours * eq.fuelCostPerHour
        const estimatedMaintenanceCost = totalHours * eq.maintenanceCostPerHour

        return {
          equipmentId: eq._id,
          equipmentName: eq.name,
          category: eq.category,
          type: eq.type,
          totalHours,
          costs: {
            actualFuel: actualFuelCost,
            estimatedFuel: estimatedFuelCost,
            fuelVariance: actualFuelCost - estimatedFuelCost,
            actualMaintenance: actualMaintenanceCost,
            estimatedMaintenance: estimatedMaintenanceCost,
            maintenanceVariance: actualMaintenanceCost - estimatedMaintenanceCost,
            totalActual: actualFuelCost + actualMaintenanceCost,
            totalEstimated: estimatedFuelCost + estimatedMaintenanceCost,
            totalVariance: (actualFuelCost + actualMaintenanceCost) - (estimatedFuelCost + estimatedMaintenanceCost),
          },
        }
      })
    )

    // Sort by total variance (highest overspend first)
    costData.sort((a, b) => b.costs.totalVariance - a.costs.totalVariance)

    return {
      period: {
        startDate: args.startDate,
        endDate: args.endDate,
      },
      equipment: costData,
      summary: {
        totalActualCost: costData.reduce((sum, eq) => sum + eq.costs.totalActual, 0),
        totalEstimatedCost: costData.reduce((sum, eq) => sum + eq.costs.totalEstimated, 0),
        totalVariance: costData.reduce((sum, eq) => sum + eq.costs.totalVariance, 0),
        equipmentOverBudget: costData.filter((eq) => eq.costs.totalVariance > 0).length,
        equipmentUnderBudget: costData.filter((eq) => eq.costs.totalVariance < 0).length,
      },
    }
  },
})

// Import internal API
import { internal } from "./_generated/api"
