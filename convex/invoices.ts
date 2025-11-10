import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all invoices for organization
export const list = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Get organizationId from auth context
    const invoices = await ctx.db.query("invoices").collect()
    return invoices
  },
})

// Create a new invoice
export const create = mutation({
  args: {
    proposalId: v.optional(v.id("proposals")),
    workOrderId: v.optional(v.id("workOrders")),
    invoiceNumber: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    propertyAddress: v.string(),
    subtotal: v.number(),
    taxRate: v.number(),
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
    // TODO: Get organizationId from auth context
    const organizationId = "temp_org_id" as any

    const taxAmount = args.subtotal * (args.taxRate / 100)
    const total = args.subtotal + taxAmount

    const invoiceId = await ctx.db.insert("invoices", {
      organizationId,
      proposalId: args.proposalId,
      workOrderId: args.workOrderId,
      invoiceNumber: args.invoiceNumber,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      propertyAddress: args.propertyAddress,
      status: "draft",
      subtotal: args.subtotal,
      taxRate: args.taxRate,
      taxAmount,
      total,
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
    id: v.id("invoices"),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("overdue"), v.literal("cancelled")),
    ),
    paidDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
  },
})

// Delete invoice
export const remove = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
