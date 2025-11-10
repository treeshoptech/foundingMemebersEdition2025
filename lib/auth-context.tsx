"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: string
  organizationId: string
  organizationName: string
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

const DEMO_USER: User = {
  userId: "k57015tkwh8r3mj078n4fra2s97v4ckd",
  organizationId: "kd74nxbz8vv2q7cv57p9chbhts7v4znm",
  organizationName: "Demo Tree Service Co.",
  name: "Demo User",
  email: "demo@treeshop.app",
  role: "owner",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("treeshop_user")

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Validate that the organizationId is a proper Convex ID
        if (parsedUser.organizationId && parsedUser.organizationId.length > 20) {
          setUser(parsedUser)
        } else {
          // Old demo user with invalid ID - replace with new one
          console.log("[v0] Replacing old demo user with valid organization ID")
          localStorage.setItem("treeshop_user", JSON.stringify(DEMO_USER))
          setUser(DEMO_USER)
        }
      } catch (error) {
        localStorage.removeItem("treeshop_user")
        setUser(DEMO_USER)
        localStorage.setItem("treeshop_user", JSON.stringify(DEMO_USER))
      }
    } else {
      console.log("[v0] No auth configured, using demo user")
      setUser(DEMO_USER)
      localStorage.setItem("treeshop_user", JSON.stringify(DEMO_USER))
    }

    setIsLoading(false)
  }, [])

  const signIn = (userData: User) => {
    setUser(userData)
    localStorage.setItem("treeshop_user", JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("treeshop_user")
    localStorage.removeItem("treeshop_workos_session")
    // Redirect to WorkOS logout which will clean up and redirect to home
    window.location.href = "/api/auth/workos/logout"
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
