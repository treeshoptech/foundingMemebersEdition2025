import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all projects for organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
    return projects
  },
})

// Get a single project by ID
export const get = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId)
    return project
  },
})

// Get project by proposal ID
export const getByProposal = query({
  args: {
    proposalId: v.id("proposals"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_proposal", (q) => q.eq("proposalId", args.proposalId))
      .first()
    return project
  },
})

// Get full project details with all related entities
export const getFullDetails = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId)
    if (!project) return null

    // Get related entities
    const proposal = project.proposalId ? await ctx.db.get(project.proposalId) : null
    const lead = project.leadId ? await ctx.db.get(project.leadId) : null
    const workOrder = project.workOrderId ? await ctx.db.get(project.workOrderId) : null

    // Get all invoices
    const invoices = await Promise.all(
      project.invoiceIds.map(id => ctx.db.get(id))
    )

    return {
      project,
      proposal,
      lead,
      workOrder,
      invoices: invoices.filter(inv => inv !== null),
    }
  },
})

// Create a new project (typically from an accepted proposal)
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    proposalId: v.id("proposals"),
    leadId: v.optional(v.id("leads")),
    customerName: v.string(),
    propertyAddress: v.string(),
    serviceType: v.string(),
    status: v.optional(v.string()),
    totalInvestment: v.number(),
    startDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      organizationId: args.organizationId,
      leadId: args.leadId,
      proposalId: args.proposalId,
      workOrderId: undefined,
      invoiceIds: [],
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      serviceType: args.serviceType,
      status: args.status || "active",
      totalInvestment: args.totalInvestment,
      startDate: args.startDate || Date.now(),
      completionDate: undefined,
      notes: args.notes,
      createdAt: Date.now(),
    })

    // Update proposal with projectId
    await ctx.db.patch(args.proposalId, {
      projectId: projectId,
    })

    return projectId
  },
})

// Update project
export const update = mutation({
  args: {
    projectId: v.id("projects"),
    customerName: v.optional(v.string()),
    propertyAddress: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    status: v.optional(v.string()),
    totalInvestment: v.optional(v.number()),
    startDate: v.optional(v.number()),
    completionDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args
    await ctx.db.patch(projectId, updates)
  },
})

// Link work order to project
export const linkWorkOrder = mutation({
  args: {
    projectId: v.id("projects"),
    workOrderId: v.id("workOrders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      workOrderId: args.workOrderId,
    })
  },
})

// Add invoice to project
export const addInvoice = mutation({
  args: {
    projectId: v.id("projects"),
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId)
    if (!project) throw new Error("Project not found")

    const updatedInvoiceIds = [...project.invoiceIds, args.invoiceId]
    await ctx.db.patch(args.projectId, {
      invoiceIds: updatedInvoiceIds,
    })
  },
})

// Delete project
export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId)
  },
})
