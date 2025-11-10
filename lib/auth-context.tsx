"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
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
  error: string | null
  signIn: (user: User) => void
  signOut: () => void
  retryAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: workosUser, loading: workosLoading } = useWorkOSAuth()
  const getOrCreateUser = useMutation(api.users.getOrCreateUser)
  const [error, setError] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  // Get or create Convex user based on WorkOS user
  const convexUser = useQuery(
    api.users.getCurrentUser,
    workosUser?.id ? { workosUserId: workosUser.id } : "skip"
  )

  // Auto-create user in Convex on first login with error handling
  useEffect(() => {
    if (workosUser && !convexUser && !workosLoading && !isCreatingUser) {
      setIsCreatingUser(true)
      setError(null)

      getOrCreateUser({
        workosUserId: workosUser.id,
        email: workosUser.email,
        name: `${workosUser.firstName || ""} ${workosUser.lastName || ""}`.trim() || workosUser.email,
      })
        .then(() => {
          setIsCreatingUser(false)
        })
        .catch((err) => {
          console.error("Failed to create user in Convex:", err)
          setError("Failed to initialize your account. Please try again.")
          setIsCreatingUser(false)
        })
    }
  }, [workosUser, convexUser, workosLoading, isCreatingUser, getOrCreateUser])

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

  const retryAuth = () => {
    setError(null)
    setIsCreatingUser(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: workosLoading || isCreatingUser || (workosUser && !convexUser && !error),
        error,
        signIn: () => {},
        signOut,
        retryAuth,
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
