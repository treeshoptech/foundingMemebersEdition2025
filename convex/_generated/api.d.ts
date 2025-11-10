/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as debug from "../debug.js";
import type * as employees from "../employees.js";
import type * as equipment from "../equipment.js";
import type * as init from "../init.js";
import type * as invoices from "../invoices.js";
import type * as leads from "../leads.js";
import type * as loadouts from "../loadouts.js";
import type * as organizations from "../organizations.js";
import type * as proposals from "../proposals.js";
import type * as users from "../users.js";
import type * as wipe from "../wipe.js";
import type * as workOrders from "../workOrders.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  debug: typeof debug;
  employees: typeof employees;
  equipment: typeof equipment;
  init: typeof init;
  invoices: typeof invoices;
  leads: typeof leads;
  loadouts: typeof loadouts;
  organizations: typeof organizations;
  proposals: typeof proposals;
  users: typeof users;
  wipe: typeof wipe;
  workOrders: typeof workOrders;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
