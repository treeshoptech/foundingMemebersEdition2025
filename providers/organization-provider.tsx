"use client"

import React, { createContext, useContext } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import type { Id } from "@/convex/_generated/dataModel"

interface Organization {
  _id: Id<"organizations">
  name: string
  businessAddress: string
  latitude?: number
  longitude?: number
  workosOrgId?: string
  logoUrl?: string
  createdAt: number
}

interface OrganizationContextType {
  currentOrganization: Organization | null
  isLoading: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()

  // Fetch organization details using the organizationId from the user
  const organization = useQuery(
    api.organizations.get,
    user?.organizationId ? { organizationId: user.organizationId as Id<"organizations"> } : "skip"
  )

  const isLoading = authLoading || (!!user && organization === undefined)

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization: organization || null,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}
