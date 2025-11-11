"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Wrench,
  Users,
  Layers,
  Calculator,
  FileText,
  LogOut,
  Menu,
  UserPlus,
  ClipboardList,
  Receipt,
  Settings,
  BarChart3,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: UserPlus },
  { name: "Proposals", href: "/dashboard/proposals", icon: FileText },
  { name: "Work Orders", href: "/dashboard/work-orders", icon: ClipboardList },
  { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { name: "Equipment", href: "/dashboard/equipment", icon: Wrench },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Loadouts", href: "/dashboard/loadouts", icon: Layers },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Calculator", href: "/dashboard/calculator", icon: Calculator },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:fixed md:inset-y-0 md:right-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-l bg-card">
          <div className="flex items-center justify-center h-16 px-6 border-b">
            <Image src="/logo.png" alt="TreeShop" width={120} height={40} className="object-contain" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="border-t p-4 space-y-2">
            <div className="flex items-center gap-3 mb-3">
              {user?.organizationLogo ? (
                <Image
                  src={user.organizationLogo}
                  alt={user.organizationName}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {user?.organizationName?.charAt(0) || "T"}
                  </span>
                </div>
              )}
              <div className="text-sm flex-1">
                <div className="font-medium">{user?.name}</div>
                <div className="text-muted-foreground text-xs truncate">{user?.organizationName}</div>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <Image src="/logo.png" alt="TreeShop" width={100} height={32} className="object-contain" />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet (60% width) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[60vw] sm:w-[60vw] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b px-4 py-4">
              <SheetTitle className="flex items-center justify-between">
                <Image src="/logo.png" alt="TreeShop" width={100} height={32} className="object-contain" />
              </SheetTitle>
            </SheetHeader>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* User Info */}
            <div className="border-t p-4 space-y-2">
              <div className="flex items-center gap-3 mb-3">
                {user?.organizationLogo ? (
                  <Image
                    src={user.organizationLogo}
                    alt={user.organizationName}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {user?.organizationName?.charAt(0) || "T"}
                    </span>
                  </div>
                )}
                <div className="text-xs flex-1 min-w-0">
                  <div className="font-medium truncate">{user?.name}</div>
                  <div className="text-muted-foreground truncate">{user?.organizationName}</div>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent text-sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="md:pr-64 pt-16 md:pt-0">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
