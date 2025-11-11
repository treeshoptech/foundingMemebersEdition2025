import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create proposal
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    propertyAddress: v.string(),
    driveTimeMinutes: v.number(),
    lineItems: v.array(
      v.object({
        lineNumber: v.number(),
        serviceType: v.string(),
        description: v.string(),
        productionHours: v.number(),
        transportHours: v.number(),
        bufferHours: v.number(),
        totalHours: v.number(),
        hourlyRate: v.number(),
        totalCost: v.number(),
        lineTotal: v.number(),
        loadoutId: v.id("loadouts"),
        loadoutName: v.string(),
      }),
    ),
    // Optional financing fields
    financingOffered: v.optional(v.boolean()),
    financingAPR: v.optional(v.number()),
    financingTermMonths: v.optional(v.number()),
    financingMonthlyPayment: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Calculate total investment
    const totalInvestment = args.lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

    const proposalId = await ctx.db.insert("proposals", {
      organizationId: args.organizationId,
      customerId: args.customerId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      driveTimeMinutes: args.driveTimeMinutes,
      totalInvestment,
      status: "draft",
      lineItems: args.lineItems,
      financingOffered: args.financingOffered,
      financingAPR: args.financingAPR,
      financingTermMonths: args.financingTermMonths,
      financingMonthlyPayment: args.financingMonthlyPayment,
      createdAt: Date.now(),
    })

    return proposalId
  },
})

// List proposals by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("proposals")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .order("desc")
      .collect()
  },
})

// Get single proposal
export const get = query({
  args: {
    id: v.id("proposals"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Update proposal
export const update = mutation({
  args: {
    id: v.id("proposals"),
    customerName: v.string(),
    propertyAddress: v.string(),
    driveTimeMinutes: v.number(),
    lineItems: v.array(
      v.object({
        lineNumber: v.number(),
        serviceType: v.string(),
        description: v.string(),
        productionHours: v.number(),
        transportHours: v.number(),
        bufferHours: v.number(),
        totalHours: v.number(),
        hourlyRate: v.number(),
        totalCost: v.number(),
        lineTotal: v.number(),
        loadoutId: v.id("loadouts"),
        loadoutName: v.string(),
      }),
    ),
    // Optional financing fields
    financingOffered: v.optional(v.boolean()),
    financingAPR: v.optional(v.number()),
    financingTermMonths: v.optional(v.number()),
    financingMonthlyPayment: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args

    // Recalculate total investment
    const totalInvestment = data.lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

    await ctx.db.patch(id, {
      ...data,
      totalInvestment,
    })
  },
})

// Update financing options
export const updateFinancing = mutation({
  args: {
    id: v.id("proposals"),
    financingOffered: v.boolean(),
    financingAPR: v.optional(v.number()),
    financingTermMonths: v.optional(v.number()),
    financingMonthlyPayment: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
  },
})

// Update proposal status
export const updateStatus = mutation({
  args: {
    id: v.id("proposals"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    })
  },
})

// Delete proposal
export const remove = mutation({
  args: {
    id: v.id("proposals"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

// Convert accepted proposal to project + work order
export const convertToProject = mutation({
  args: {
    proposalId: v.id("proposals"),
  },
  handler: async (ctx, args) => {
    // Get the proposal
    const proposal = await ctx.db.get(args.proposalId)
    if (!proposal) throw new Error("Proposal not found")
    if (proposal.status !== "accepted") {
      throw new Error("Only accepted proposals can be converted to projects")
    }

    // Calculate total estimated hours from line items
    const estimatedHours = proposal.lineItems.reduce(
      (sum, item) => sum + item.totalHours,
      0
    )

    // Create the project
    const projectId = await ctx.db.insert("projects", {
      organizationId: proposal.organizationId,
      leadId: proposal.leadId,
      proposalId: args.proposalId,
      workOrderId: undefined,
      invoiceIds: [],
      customerName: proposal.customerName,
      propertyAddress: proposal.propertyAddress,
      serviceType: proposal.lineItems[0]?.serviceType || "General Service",
      status: "active",
      totalInvestment: proposal.totalInvestment,
      startDate: Date.now(),
      completionDate: undefined,
      notes: undefined,
      createdAt: Date.now(),
    })

    // Create the work order
    const workOrderId = await ctx.db.insert("workOrders", {
      organizationId: proposal.organizationId,
      projectId: projectId,
      proposalId: args.proposalId,
      customerName: proposal.customerName,
      propertyAddress: proposal.propertyAddress,
      serviceType: proposal.lineItems[0]?.serviceType || "General Service",
      status: "scheduled",
      scheduledDate: undefined,
      completedDate: undefined,
      assignedEmployeeIds: [],
      assignedEquipmentIds: [],
      estimatedHours: estimatedHours,
      actualHours: undefined,
      notes: undefined,
      createdAt: Date.now(),
    })

    // Update project with work order ID
    await ctx.db.patch(projectId, {
      workOrderId: workOrderId,
    })

    // Update proposal with project ID
    await ctx.db.patch(args.proposalId, {
      projectId: projectId,
    })

    return {
      projectId,
      workOrderId,
    }
  },
})
