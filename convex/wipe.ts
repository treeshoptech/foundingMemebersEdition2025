import { mutation } from "./_generated/server"

// WARNING: This deletes ALL data from ALL tables
export const wipeAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting data wipe...");

    // Get all records from all tables
    const organizations = await ctx.db.query("organizations").collect();
    const users = await ctx.db.query("users").collect();
    const equipment = await ctx.db.query("equipment").collect();
    const employees = await ctx.db.query("employees").collect();
    const loadouts = await ctx.db.query("loadouts").collect();
    const customers = await ctx.db.query("customers").collect();
    const leads = await ctx.db.query("leads").collect();
    const proposals = await ctx.db.query("proposals").collect();
    const workOrders = await ctx.db.query("workOrders").collect();
    const invoices = await ctx.db.query("invoices").collect();

    // Delete all records
    for (const org of organizations) await ctx.db.delete(org._id);
    for (const user of users) await ctx.db.delete(user._id);
    for (const eq of equipment) await ctx.db.delete(eq._id);
    for (const emp of employees) await ctx.db.delete(emp._id);
    for (const loadout of loadouts) await ctx.db.delete(loadout._id);
    for (const customer of customers) await ctx.db.delete(customer._id);
    for (const lead of leads) await ctx.db.delete(lead._id);
    for (const proposal of proposals) await ctx.db.delete(proposal._id);
    for (const wo of workOrders) await ctx.db.delete(wo._id);
    for (const invoice of invoices) await ctx.db.delete(invoice._id);

    console.log("Data wipe complete!");

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
    };
  },
});
