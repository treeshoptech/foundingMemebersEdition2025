import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Initialize demo organization for development
export const initializeDemoOrganization = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if demo org already exists
    const existingOrgs = await ctx.db.query("organizations").collect()
    const demoOrg = existingOrgs.find(org => org.name === "Demo Tree Service Co.")

    if (demoOrg) {
      return {
        message: "Demo organization already exists",
        organizationId: demoOrg._id
      }
    }

    // Create demo organization
    const orgId = await ctx.db.insert("organizations", {
      name: "Demo Tree Service Co.",
      businessAddress: "New Smyrna Beach, FL",
      latitude: 29.0258,
      longitude: -80.9270,
      createdAt: Date.now(),
    })

    // Create demo user
    const userId = await ctx.db.insert("users", {
      email: "demo@treeshop.app",
      name: "Demo User",
      passwordHash: "demo-hash", // Not used in demo mode
      organizationId: orgId,
      role: "owner",
      createdAt: Date.now(),
    })

    return {
      message: "Demo organization created successfully",
      organizationId: orgId,
      userId: userId
    }
  },
})

// Get or create demo organization
export const getDemoOrganization = query({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").collect()
    const demoOrg = orgs.find(org => org.name === "Demo Tree Service Co.")

    return demoOrg || null
  },
})

// Fix: Link existing organization to WorkOS org ID
export const linkWorkOSOrg = mutation({
  args: {
    organizationName: v.string(),
    workosOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find organization by name
    const orgs = await ctx.db.query("organizations").collect()
    const org = orgs.find(o => o.name.includes(args.organizationName))

    if (!org) {
      throw new Error(`Organization with name containing "${args.organizationName}" not found`)
    }

    // Update with WorkOS org ID
    await ctx.db.patch(org._id, {
      workosOrgId: args.workosOrgId,
    })

    return {
      message: "Successfully linked organization to WorkOS",
      organizationId: org._id,
      organizationName: org.name,
      workosOrgId: args.workosOrgId,
    }
  },
})
