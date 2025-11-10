import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthProvider } from "@/lib/auth-context"
import { OrganizationProvider } from "@/providers/organization-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </OrganizationProvider>
    </AuthProvider>
  )
}
