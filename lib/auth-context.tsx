"use client"

import React, { createContext, useContext, useEffect } from "react"
import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-nextjs/components"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface User {
  userId: string
  organizationId: string
  organizationName: string
  organizationLogo?: string
  name: string
  email: string
  role: "owner" | "admin" | "manager" | "estimator"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (user: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: workosUser, loading: workosLoading } = useWorkOSAuth()
  const getOrCreateUser = useMutation(api.users.getOrCreateUser)

  // Get or create Convex user based on WorkOS user
  const convexUser = useQuery(
    api.users.getCurrentUser,
    workosUser?.id ? { workosUserId: workosUser.id } : "skip"
  )

  // Auto-create user in Convex on first login
  useEffect(() => {
    if (workosUser && !convexUser && !workosLoading) {
      getOrCreateUser({
        workosUserId: workosUser.id,
        email: workosUser.email,
        name: `${workosUser.firstName || ""} ${workosUser.lastName || ""}`.trim() || workosUser.email,
      })
    }
  }, [workosUser, convexUser, workosLoading, getOrCreateUser])

  const user: User | null = convexUser
    ? {
        userId: convexUser._id,
        organizationId: convexUser.organizationId,
        organizationName: "", // Will load from org
        name: convexUser.name,
        email: convexUser.email,
        role: convexUser.role,
      }
    : null

  const signOut = () => {
    window.location.href = "/auth/logout"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: workosLoading || (workosUser && !convexUser),
        signIn: () => {},
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
