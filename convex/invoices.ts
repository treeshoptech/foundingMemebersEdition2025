import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all invoices for organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
    return invoices
  },
})

// Create a new invoice
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    proposalId: v.optional(v.id("proposals")),
    workOrderId: v.optional(v.id("workOrders")),
    invoiceNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    propertyAddress: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled"))),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    total: v.number(),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      }),
    ),
    dueDate: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const invoiceId = await ctx.db.insert("invoices", {
      organizationId: args.organizationId,
      proposalId: args.proposalId,
      workOrderId: args.workOrderId,
      invoiceNumber: args.invoiceNumber,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      propertyAddress: args.propertyAddress,
      status: args.status || "draft",
      subtotal: args.subtotal,
      taxRate: args.taxRate,
      taxAmount: args.taxAmount,
      total: args.total,
      lineItems: args.lineItems,
      dueDate: args.dueDate,
      notes: args.notes,
      createdAt: Date.now(),
    })

    return invoiceId
  },
})

// Update invoice
export const update = mutation({
  args: {
    invoiceId: v.id("invoices"),
    organizationId: v.id("organizations"),
    invoiceNumber: v.optional(v.string()),
    customerName: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    propertyAddress: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled")),
    ),
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    total: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    paidDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { invoiceId, ...updates } = args
    await ctx.db.patch(invoiceId, updates)
  },
})

// Delete invoice
export const remove = mutation({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.invoiceId)
  },
})

// Generate deposit invoice from work order
export const generateDepositInvoice = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    taxRate: v.optional(v.number()), // Default 0 if not provided
  },
  handler: async (ctx, args) => {
    // Get work order
    const workOrder = await ctx.db.get(args.workOrderId)
    if (!workOrder) throw new Error("Work order not found")
    if (!workOrder.projectId) throw new Error("Work order must be linked to a project")

    // Get project
    const project = await ctx.db.get(workOrder.projectId)
    if (!project) throw new Error("Project not found")

    // Get proposal for line items
    const proposal = await ctx.db.get(project.proposalId)
    if (!proposal) throw new Error("Proposal not found")

    // Get organization for deposit percentage
    const organization = await ctx.db.get(project.organizationId)
    if (!organization) throw new Error("Organization not found")

    const depositPercentage = organization.depositPercentage || 25 // Default 25%

    // Calculate deposit amount
    const depositAmount = (project.totalInvestment * depositPercentage) / 100
    const taxRate = args.taxRate || 0
    const taxAmount = depositAmount * (taxRate / 100)
    const total = depositAmount + taxAmount

    // Generate invoice number
    const invoiceCount = await ctx.db
      .query("invoices")
      .withIndex("by_organization", (q) => q.eq("organizationId", project.organizationId))
      .collect()
    const invoiceNumber = `INV-${String(invoiceCount.length + 1).padStart(5, "0")}`

    // Create line items
    const lineItems = [
      {
        description: `Deposit (${depositPercentage}%) - ${project.serviceType}`,
        quantity: 1,
        unitPrice: depositAmount,
        total: depositAmount,
      },
    ]

    // Create invoice
    const invoiceId = await ctx.db.insert("invoices", {
      organizationId: project.organizationId,
      projectId: project._id,
      proposalId: project.proposalId,
      workOrderId: args.workOrderId,
      invoiceNumber,
      invoiceType: "deposit",
      customerName: project.customerName,
      customerEmail: undefined,
      propertyAddress: project.propertyAddress,
      status: "draft",
      subtotal: depositAmount,
      taxRate,
      taxAmount,
      total,
      lineItems,
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      paidDate: undefined,
      notes: `Deposit invoice for ${project.customerName} - ${project.propertyAddress}`,
      createdAt: Date.now(),
    })

    // Add invoice to project
    const updatedInvoiceIds = [...project.invoiceIds, invoiceId]
    await ctx.db.patch(project._id, {
      invoiceIds: updatedInvoiceIds,
    })

    return invoiceId
  },
})

// Generate final/balance invoice from completed work order
export const generateFinalInvoice = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    taxRate: v.optional(v.number()), // Default 0 if not provided
  },
  handler: async (ctx, args) => {
    // Get work order
    const workOrder = await ctx.db.get(args.workOrderId)
    if (!workOrder) throw new Error("Work order not found")
    if (workOrder.status !== "completed") {
      throw new Error("Work order must be completed before generating final invoice")
    }
    if (!workOrder.projectId) throw new Error("Work order must be linked to a project")

    // Get project
    const project = await ctx.db.get(workOrder.projectId)
    if (!project) throw new Error("Project not found")

    // Get proposal for line items
    const proposal = await ctx.db.get(project.proposalId)
    if (!proposal) throw new Error("Proposal not found")

    // Check if deposit was paid
    const projectInvoices = await Promise.all(
      project.invoiceIds.map(id => ctx.db.get(id))
    )
    const depositInvoice = projectInvoices.find(inv => inv?.invoiceType === "deposit")
    const depositPaid = depositInvoice?.status === "paid"

    // Calculate balance amount
    let balanceAmount = project.totalInvestment
    if (depositPaid && depositInvoice) {
      balanceAmount = project.totalInvestment - depositInvoice.subtotal
    }

    const taxRate = args.taxRate || 0
    const taxAmount = balanceAmount * (taxRate / 100)
    const total = balanceAmount + taxAmount

    // Generate invoice number
    const invoiceCount = await ctx.db
      .query("invoices")
      .withIndex("by_organization", (q) => q.eq("organizationId", project.organizationId))
      .collect()
    const invoiceNumber = `INV-${String(invoiceCount.length + 1).padStart(5, "0")}`

    // Create line items from proposal
    const lineItems = proposal.lineItems.map(item => ({
      description: item.description,
      quantity: 1,
      unitPrice: item.lineTotal,
      total: item.lineTotal,
    }))

    // If deposit was paid, add a line item for it
    if (depositPaid && depositInvoice) {
      lineItems.push({
        description: `Deposit Payment (${depositInvoice.invoiceNumber})`,
        quantity: 1,
        unitPrice: -depositInvoice.subtotal,
        total: -depositInvoice.subtotal,
      })
    }

    const invoiceType = depositPaid ? "balance" : "final"

    // Create invoice
    const invoiceId = await ctx.db.insert("invoices", {
      organizationId: project.organizationId,
      projectId: project._id,
      proposalId: project.proposalId,
      workOrderId: args.workOrderId,
      invoiceNumber,
      invoiceType,
      customerName: project.customerName,
      customerEmail: undefined,
      propertyAddress: project.propertyAddress,
      status: "draft",
      subtotal: balanceAmount,
      taxRate,
      taxAmount,
      total,
      lineItems,
      dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      paidDate: undefined,
      notes: `${invoiceType === "balance" ? "Balance" : "Final"} invoice for ${project.customerName} - ${project.propertyAddress}`,
      createdAt: Date.now(),
    })

    // Add invoice to project
    const updatedInvoiceIds = [...project.invoiceIds, invoiceId]
    await ctx.db.patch(project._id, {
      invoiceIds: updatedInvoiceIds,
    })

    return invoiceId
  },
})
