import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import {
  generateEmployeeCode,
  calculateEffectiveHourlyRate,
  calculateTrueCost,
} from "./treeshopCalculations"

// ============================================================================
// EMPLOYEE QUERIES
// ============================================================================

// List all employees for an organization
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

// Get a single employee by ID
export const get = query({
  args: {
    id: v.id("employees"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// List employees by career track
export const listByCareerTrack = query({
  args: {
    organizationId: v.id("organizations"),
    careerTrack: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_career_track", (q) =>
        q.eq("organizationId", args.organizationId).eq("careerTrack", args.careerTrack),
      )
      .collect()
  },
})

// List employees by tier
export const listByTier = query({
  args: {
    organizationId: v.id("organizations"),
    tier: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_tier", (q) => q.eq("organizationId", args.organizationId).eq("tier", args.tier))
      .collect()
  },
})

// ============================================================================
// EMPLOYEE MUTATIONS
// ============================================================================

// Create a new employee with TreeShop career system
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    careerTrack: v.string(),
    tier: v.number(),
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(),
    leadershipLevel: v.optional(v.string()),
    equipmentCertifications: v.array(v.string()),
    driverLicenses: v.array(v.string()),
    professionalCerts: v.array(v.string()),
    crossTraining: v.array(
      v.object({
        role: v.string(),
        tier: v.number(),
      }),
    ),
    position: v.optional(v.string()), // Legacy field for notes
  },
  handler: async (ctx, args) => {
    // Generate employee code
    const employeeCode = generateEmployeeCode({
      careerTrack: args.careerTrack,
      tier: args.tier,
      leadershipLevel: args.leadershipLevel,
      equipmentCertifications: args.equipmentCertifications,
      driverLicenses: args.driverLicenses,
      professionalCerts: args.professionalCerts,
      crossTraining: args.crossTraining,
    })

    // Calculate effective hourly rate based on tier and add-ons
    const effectiveHourlyRate = calculateEffectiveHourlyRate(
      args.baseHourlyRate,
      args.tier,
      args.leadershipLevel,
      args.equipmentCertifications,
      args.driverLicenses,
      args.professionalCerts,
    )

    // Calculate true business cost per hour
    const trueCostPerHour = calculateTrueCost(effectiveHourlyRate, args.burdenMultiplier)

    // Insert employee record
    const employeeId = await ctx.db.insert("employees", {
      organizationId: args.organizationId,
      name: args.name,
      careerTrack: args.careerTrack,
      tier: args.tier,
      baseHourlyRate: args.baseHourlyRate,
      burdenMultiplier: args.burdenMultiplier,
      leadershipLevel: args.leadershipLevel,
      equipmentCertifications: args.equipmentCertifications,
      driverLicenses: args.driverLicenses,
      professionalCerts: args.professionalCerts,
      crossTraining: args.crossTraining,
      employeeCode,
      effectiveHourlyRate,
      trueCostPerHour,
      position: args.position,
      createdAt: Date.now(),
    })

    return employeeId
  },
})

// Update an existing employee
export const update = mutation({
  args: {
    id: v.id("employees"),
    name: v.string(),
    careerTrack: v.string(),
    tier: v.number(),
    baseHourlyRate: v.number(),
    burdenMultiplier: v.number(),
    leadershipLevel: v.optional(v.string()),
    equipmentCertifications: v.array(v.string()),
    driverLicenses: v.array(v.string()),
    professionalCerts: v.array(v.string()),
    crossTraining: v.array(
      v.object({
        role: v.string(),
        tier: v.number(),
      }),
    ),
    position: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Regenerate employee code
    const employeeCode = generateEmployeeCode({
      careerTrack: data.careerTrack,
      tier: data.tier,
      leadershipLevel: data.leadershipLevel,
      equipmentCertifications: data.equipmentCertifications,
      driverLicenses: data.driverLicenses,
      professionalCerts: data.professionalCerts,
      crossTraining: data.crossTraining,
    })

    // Recalculate effective hourly rate
    const effectiveHourlyRate = calculateEffectiveHourlyRate(
      data.baseHourlyRate,
      data.tier,
      data.leadershipLevel,
      data.equipmentCertifications,
      data.driverLicenses,
      data.professionalCerts,
    )

    // Recalculate true business cost per hour
    const trueCostPerHour = calculateTrueCost(effectiveHourlyRate, data.burdenMultiplier)

    // Update employee record
    await ctx.db.patch(id, {
      ...data,
      employeeCode,
      effectiveHourlyRate,
      trueCostPerHour,
    })
  },
})

// Delete an employee
export const remove = mutation({
  args: {
    id: v.id("employees"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// ============================================================================
// CAREER ADVANCEMENT MUTATIONS
// ============================================================================

// Promote employee to next tier
export const promoteTier = mutation({
  args: {
    id: v.id("employees"),
  },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.id)
    if (!employee) {
      throw new Error("Employee not found")
    }

    if (employee.tier >= 5) {
      throw new Error("Employee is already at maximum tier (Master)")
    }

    const newTier = (employee.tier + 1) as 1 | 2 | 3 | 4 | 5

    // Regenerate employee code with new tier
    const employeeCode = generateEmployeeCode({
      careerTrack: employee.careerTrack,
      tier: newTier,
      leadershipLevel: employee.leadershipLevel,
      equipmentCertifications: employee.equipmentCertifications,
      driverLicenses: employee.driverLicenses,
      professionalCerts: employee.professionalCerts,
      crossTraining: employee.crossTraining,
    })

    // Recalculate rates with new tier
    const effectiveHourlyRate = calculateEffectiveHourlyRate(
      employee.baseHourlyRate,
      newTier,
      employee.leadershipLevel,
      employee.equipmentCertifications,
      employee.driverLicenses,
      employee.professionalCerts,
    )

    const trueCostPerHour = calculateTrueCost(effectiveHourlyRate, employee.burdenMultiplier)

    await ctx.db.patch(args.id, {
      tier: newTier,
      employeeCode,
      effectiveHourlyRate,
      trueCostPerHour,
    })
  },
})

// Add a certification to an employee
export const addCertification = mutation({
  args: {
    id: v.id("employees"),
    certificationType: v.union(
      v.literal("equipment"),
      v.literal("driver"),
      v.literal("professional"),
    ),
    certificationCode: v.string(),
  },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.id)
    if (!employee) {
      throw new Error("Employee not found")
    }

    let updatedEmployee = { ...employee }

    // Add certification to appropriate array
    switch (args.certificationType) {
      case "equipment":
        if (!employee.equipmentCertifications.includes(args.certificationCode)) {
          updatedEmployee.equipmentCertifications = [
            ...employee.equipmentCertifications,
            args.certificationCode,
          ]
        }
        break
      case "driver":
        if (!employee.driverLicenses.includes(args.certificationCode)) {
          updatedEmployee.driverLicenses = [...employee.driverLicenses, args.certificationCode]
        }
        break
      case "professional":
        if (!employee.professionalCerts.includes(args.certificationCode)) {
          updatedEmployee.professionalCerts = [
            ...employee.professionalCerts,
            args.certificationCode,
          ]
        }
        break
    }

    // Regenerate employee code
    const employeeCode = generateEmployeeCode({
      careerTrack: updatedEmployee.careerTrack,
      tier: updatedEmployee.tier,
      leadershipLevel: updatedEmployee.leadershipLevel,
      equipmentCertifications: updatedEmployee.equipmentCertifications,
      driverLicenses: updatedEmployee.driverLicenses,
      professionalCerts: updatedEmployee.professionalCerts,
      crossTraining: updatedEmployee.crossTraining,
    })

    // Recalculate rates
    const effectiveHourlyRate = calculateEffectiveHourlyRate(
      updatedEmployee.baseHourlyRate,
      updatedEmployee.tier,
      updatedEmployee.leadershipLevel,
      updatedEmployee.equipmentCertifications,
      updatedEmployee.driverLicenses,
      updatedEmployee.professionalCerts,
    )

    const trueCostPerHour = calculateTrueCost(effectiveHourlyRate, updatedEmployee.burdenMultiplier)

    await ctx.db.patch(args.id, {
      equipmentCertifications: updatedEmployee.equipmentCertifications,
      driverLicenses: updatedEmployee.driverLicenses,
      professionalCerts: updatedEmployee.professionalCerts,
      employeeCode,
      effectiveHourlyRate,
      trueCostPerHour,
    })
  },
})

// Add cross-training to an employee
export const addCrossTraining = mutation({
  args: {
    id: v.id("employees"),
    role: v.string(),
    tier: v.number(),
  },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.id)
    if (!employee) {
      throw new Error("Employee not found")
    }

    // Check if cross-training already exists
    const existingCrossTraining = employee.crossTraining.find((ct) => ct.role === args.role)
    if (existingCrossTraining) {
      throw new Error(`Employee already has cross-training in ${args.role}`)
    }

    const updatedCrossTraining = [...employee.crossTraining, { role: args.role, tier: args.tier }]

    // Regenerate employee code
    const employeeCode = generateEmployeeCode({
      careerTrack: employee.careerTrack,
      tier: employee.tier,
      leadershipLevel: employee.leadershipLevel,
      equipmentCertifications: employee.equipmentCertifications,
      driverLicenses: employee.driverLicenses,
      professionalCerts: employee.professionalCerts,
      crossTraining: updatedCrossTraining,
    })

    await ctx.db.patch(args.id, {
      crossTraining: updatedCrossTraining,
      employeeCode,
    })
  },
})

// Update cross-training tier
export const updateCrossTrainingTier = mutation({
  args: {
    id: v.id("employees"),
    role: v.string(),
    tier: v.number(),
  },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.id)
    if (!employee) {
      throw new Error("Employee not found")
    }

    // Update the tier for the specified cross-training role
    const updatedCrossTraining = employee.crossTraining.map((ct) =>
      ct.role === args.role ? { ...ct, tier: args.tier } : ct,
    )

    // Regenerate employee code
    const employeeCode = generateEmployeeCode({
      careerTrack: employee.careerTrack,
      tier: employee.tier,
      leadershipLevel: employee.leadershipLevel,
      equipmentCertifications: employee.equipmentCertifications,
      driverLicenses: employee.driverLicenses,
      professionalCerts: employee.professionalCerts,
      crossTraining: updatedCrossTraining,
    })

    await ctx.db.patch(args.id, {
      crossTraining: updatedCrossTraining,
      employeeCode,
    })
  },
})
