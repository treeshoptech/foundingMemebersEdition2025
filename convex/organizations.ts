import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get organization by WorkOS org ID, create if doesn't exist
export const getOrCreateFromWorkOS = mutation({
  args: {
    workosOrgId: v.string(),
    workosOrgName: v.string(),
    userEmail: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if organization already exists
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_workos_org", (q) => q.eq("workosOrgId", args.workosOrgId))
      .first()

    if (existingOrg) {
      // Check if user exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.userEmail))
        .first()

      if (existingUser) {
        return {
          organizationId: existingOrg._id,
          organizationName: existingOrg.name,
          organizationLogo: existingOrg.logoUrl,
          userId: existingUser._id,
        }
      }

      // Create user if doesn't exist
      const userId = await ctx.db.insert("users", {
        email: args.userEmail,
        name: args.userName,
        passwordHash: "", // WorkOS handles authentication
        organizationId: existingOrg._id,
        role: "owner",
        createdAt: Date.now(),
      })

      return {
        organizationId: existingOrg._id,
        organizationName: existingOrg.name,
        organizationLogo: existingOrg.logoUrl,
        userId,
      }
    }

    // Create new organization
    const orgId = await ctx.db.insert("organizations", {
      name: args.workosOrgName,
      businessAddress: "", // Can be filled in later
      workosOrgId: args.workosOrgId,
      createdAt: Date.now(),
    })

    // Create owner user
    const userId = await ctx.db.insert("users", {
      email: args.userEmail,
      name: args.userName,
      passwordHash: "", // WorkOS handles authentication
      organizationId: orgId,
      role: "owner",
      createdAt: Date.now(),
    })

    return {
      organizationId: orgId,
      organizationName: args.workosOrgName,
      organizationLogo: undefined,
      userId,
    }
  },
})

// Get organization by ID
export const get = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId)
  },
})

// Update organization details
export const update = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    businessAddress: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, ...updates } = args

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    )

    await ctx.db.patch(organizationId, cleanUpdates)
    return await ctx.db.get(organizationId)
  },
})

// Generate upload URL for logo upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})
