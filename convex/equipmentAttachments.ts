import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create equipment attachment
export const create = mutation({
  args: {
    organizationId: v.id("organizations"),
    equipmentId: v.id("equipment"),
    name: v.string(),
    category: v.string(),
    type: v.string(),
    serialNumber: v.optional(v.string()),
    purchasePrice: v.optional(v.number()),
    purchaseDate: v.optional(v.number()),
    condition: v.optional(v.string()),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const attachmentId = await ctx.db.insert("equipmentAttachments", {
      ...args,
      createdAt: Date.now(),
    })

    return attachmentId
  },
})

// List attachments by equipment
export const listByEquipment = query({
  args: {
    equipmentId: v.id("equipment"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentAttachments")
      .withIndex("by_equipment", (q) => q.eq("equipmentId", args.equipmentId))
      .collect()
  },
})

// List all attachments by organization
export const list = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("equipmentAttachments")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect()
  },
})

// Get attachment by ID
export const getById = query({
  args: {
    id: v.id("equipmentAttachments"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Update attachment
export const update = mutation({
  args: {
    id: v.id("equipmentAttachments"),
    name: v.string(),
    category: v.string(),
    type: v.string(),
    serialNumber: v.optional(v.string()),
    purchasePrice: v.optional(v.number()),
    purchaseDate: v.optional(v.number()),
    condition: v.optional(v.string()),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
  },
})

// Delete attachment
export const remove = mutation({
  args: {
    id: v.id("equipmentAttachments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
