"use client"

import React, { createContext, useContext } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import type { Id } from "@/convex/_generated/dataModel"

interface Organization {
  _id: Id<"organizations">
  name: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  _creationTime: number
}

interface OrganizationContextType {
  currentOrganization: Organization | null
  isLoading: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const organization = useQuery(
    api.organizations.get,
    user?.organizationId ? { id: user.organizationId as Id<"organizations"> } : "skip"
  )

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization: organization || null,
        isLoading: user !== null && organization === undefined,
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
