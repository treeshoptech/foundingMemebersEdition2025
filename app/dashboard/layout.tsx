import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthProvider } from "@/lib/auth-context"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}
