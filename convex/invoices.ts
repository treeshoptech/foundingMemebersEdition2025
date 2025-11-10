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
