"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench, Layers, FileText, DollarSign, TrendingUp, Clock, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/pricing-calculator"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function DashboardPage() {
  const { user, error } = useAuth()

  // Connect to live Convex data
  const equipment = useQuery(api.equipment.list, user?.organizationId ? { organizationId: user.organizationId as any } : "skip") || []
  const employees = useQuery(api.employees.list, user?.organizationId ? { organizationId: user.organizationId as any } : "skip") || []
  const loadouts = useQuery(api.loadouts.list, user?.organizationId ? { organizationId: user.organizationId as any } : "skip") || []
  const proposals = useQuery(api.proposals.list, user?.organizationId ? { organizationId: user.organizationId as any } : "skip") || []

  const totalProposalValue = proposals?.reduce((sum: number, p: any) => sum + p.totalInvestment, 0) || 0
  const activeProposals = proposals?.filter((p: any) => p.status === "sent" || p.status === "draft").length || 0
  const acceptedProposals = proposals?.filter((p: any) => p.status === "accepted").length || 0
  const averageBillingRate =
    loadouts && loadouts.length > 0
      ? loadouts.reduce((sum: number, l: any) => sum + l.billingRate, 0) / loadouts.length
      : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposal Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProposalValue)}</div>
            <p className="text-xs text-muted-foreground">{proposals?.length || 0} total proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProposals}</div>
            <p className="text-xs text-muted-foreground">{acceptedProposals} accepted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Billing Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageBillingRate)}/hr</div>
            <p className="text-xs text-muted-foreground">{loadouts?.length || 0} loadouts configured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(equipment?.length || 0) + (employees?.length || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {equipment?.length || 0} equipment, {employees?.length || 0} employees
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/proposals/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                <Plus className="h-6 w-6" />
                <span>New Proposal</span>
              </Button>
            </Link>
            <Link href="/dashboard/calculator">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                <Clock className="h-6 w-6" />
                <span>Quick Quote</span>
              </Button>
            </Link>
            <Link href="/dashboard/loadouts">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                <Layers className="h-6 w-6" />
                <span>Manage Loadouts</span>
              </Button>
            </Link>
            <Link href="/dashboard/equipment">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                <Wrench className="h-6 w-6" />
                <span>Add Equipment</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Complete these steps to start creating proposals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                equipment && equipment.length > 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className="flex-1">
              <div className="font-medium">Add Equipment</div>
              <div className="text-sm text-muted-foreground">Add your trucks, chippers, and tools</div>
            </div>
            <Link href="/dashboard/equipment">
              <Button size="sm" variant="outline">
                Add Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                employees && employees.length > 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className="flex-1">
              <div className="font-medium">Add Employees</div>
              <div className="text-sm text-muted-foreground">Configure your crew with true costs</div>
            </div>
            <Link href="/dashboard/employees">
              <Button size="sm" variant="outline">
                Add Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                loadouts && loadouts.length > 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
            <div className="flex-1">
              <div className="font-medium">Create Loadouts</div>
              <div className="text-sm text-muted-foreground">Combine equipment and employees for pricing</div>
            </div>
            <Link href="/dashboard/loadouts">
              <Button size="sm" variant="outline">
                Create Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                proposals && proposals.length > 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              4
            </div>
            <div className="flex-1">
              <div className="font-medium">Create Your First Proposal</div>
              <div className="text-sm text-muted-foreground">Start pricing jobs and winning contracts</div>
            </div>
            <Link href="/dashboard/proposals/new">
              <Button size="sm" variant="outline">
                Start Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
