import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get organization by WorkOS org ID, create if doesn't exist
export const getOrCreateFromWorkOS = mutation({
  args: {
    workosOrgId: v.string(),
    workosOrgName: v.string(),
    workosUserId: v.string(),
    userEmail: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('[Convex] getOrCreateFromWorkOS called with:', {
      workosOrgId: args.workosOrgId,
      workosOrgName: args.workosOrgName,
      userEmail: args.userEmail,
    });

    // Check if organization already exists
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_workos_org", (q) => q.eq("workosOrgId", args.workosOrgId))
      .first()

    console.log('[Convex] Existing org:', existingOrg ? existingOrg._id : 'none');

    if (existingOrg) {
      // Check if user exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.userEmail))
        .first()

      console.log('[Convex] Existing user:', existingUser ? existingUser._id : 'none');

      if (existingUser) {
        // Validate that the user's organizationId matches the org
        if (existingUser.organizationId !== existingOrg._id) {
          console.error('[Convex] CORRUPTED DATA: User organizationId mismatch!', {
            userOrgId: existingUser.organizationId,
            actualOrgId: existingOrg._id,
          });
          // Fix the corrupted data
          await ctx.db.patch(existingUser._id, {
            organizationId: existingOrg._id,
          });
          console.log('[Convex] Fixed user organizationId');
        }

        // ALWAYS return the organization ID from the org record, not from the user
        // This ensures we return the correct ID even if the user record was corrupted
        const result = {
          organizationId: existingOrg._id,
          organizationName: existingOrg.name,
          organizationLogo: existingOrg.logoUrl,
          userId: existingUser._id,
        };
        console.log('[Convex] Returning result:', result);
        return result;
      }

      // Create user if doesn't exist
      console.log('[Convex] Creating new user for existing org');
      const userId = await ctx.db.insert("users", {
        email: args.userEmail,
        name: args.userName,
        workosUserId: args.workosUserId || `temp-${Date.now()}`,
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
      workosUserId: args.workosUserId || `temp-${Date.now()}`,
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
    depositPercentage: v.optional(v.number()),
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

// DEBUG: List all organizations
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").collect()
    return orgs.map(org => ({
      _id: org._id,
      name: org.name,
      workosOrgId: org.workosOrgId,
    }))
  },
})

// WIPE: Delete all data from all tables
export const wipeAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting data wipe...")

    // Get all records from all tables
    const organizations = await ctx.db.query("organizations").collect()
    const users = await ctx.db.query("users").collect()
    const equipment = await ctx.db.query("equipment").collect()
    const employees = await ctx.db.query("employees").collect()
    const loadouts = await ctx.db.query("loadouts").collect()
    const customers = await ctx.db.query("customers").collect()
    const leads = await ctx.db.query("leads").collect()
    const proposals = await ctx.db.query("proposals").collect()
    const workOrders = await ctx.db.query("workOrders").collect()
    const invoices = await ctx.db.query("invoices").collect()

    // Delete all records
    for (const org of organizations) await ctx.db.delete(org._id)
    for (const user of users) await ctx.db.delete(user._id)
    for (const eq of equipment) await ctx.db.delete(eq._id)
    for (const emp of employees) await ctx.db.delete(emp._id)
    for (const loadout of loadouts) await ctx.db.delete(loadout._id)
    for (const customer of customers) await ctx.db.delete(customer._id)
    for (const lead of leads) await ctx.db.delete(lead._id)
    for (const proposal of proposals) await ctx.db.delete(proposal._id)
    for (const wo of workOrders) await ctx.db.delete(wo._id)
    for (const invoice of invoices) await ctx.db.delete(invoice._id)

    console.log("Data wipe complete!")

    return {
      message: "All data wiped successfully",
      deleted: {
        organizations: organizations.length,
        users: users.length,
        equipment: equipment.length,
        employees: employees.length,
        loadouts: loadouts.length,
        customers: customers.length,
        leads: leads.length,
        proposals: proposals.length,
        workOrders: workOrders.length,
        invoices: invoices.length,
      }
    }
  },
})
