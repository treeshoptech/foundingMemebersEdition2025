import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get or create user on first login
export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    workosUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists by WorkOS ID
    const existing = await ctx.db
      .query("users")
      .withIndex("by_workos_user", (q) => q.eq("workosUserId", args.workosUserId))
      .first()

    if (existing) {
      return existing
    }

    // Create default organization for new user
    const orgId = await ctx.db.insert("organizations", {
      name: `${args.name}'s Company`,
      businessAddress: "",
      createdAt: Date.now(),
    })

    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      workosUserId: args.workosUserId,
      organizationId: orgId,
      role: "owner",
      createdAt: Date.now(),
    })

    return await ctx.db.get(userId)
  },
})

// Get current user by WorkOS ID
export const getCurrentUser = query({
  args: {
    workosUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_workos_user", (q) => q.eq("workosUserId", args.workosUserId))
      .first()
  },
})
