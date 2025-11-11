"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, BarChart3, Users, Wrench, CheckCircle2, XCircle, Zap } from "lucide-react"

type Loadout = {
  _id: string
  name: string
  serviceType: string
  productionRate: number
  totalEquipmentCost: number
  totalLaborCost: number
  overheadCost: number
  totalLoadoutCost: number
  billingRate30: number
  billingRate40: number
  billingRate50: number
  billingRate60: number
  billingRate70: number
  isActive: boolean
  equipment: Array<{ _id: string; name: string }>
  employees: Array<{ _id: string; name: string }>
}

interface LoadoutReportingProps {
  loadouts: Loadout[]
}

export function LoadoutReporting({ loadouts }: LoadoutReportingProps) {
  if (!loadouts || loadouts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Add loadouts to see reporting and analytics</p>
        </CardContent>
      </Card>
    )
  }

  const totalLoadouts = loadouts.length
  const activeLoadouts = loadouts.filter((l) => l.isActive).length
  const avgCostPerHour = loadouts.reduce((sum, l) => sum + l.totalLoadoutCost, 0) / totalLoadouts
  const avgBillingRate50 = loadouts.reduce((sum, l) => sum + l.billingRate50, 0) / totalLoadouts

  // Service type breakdown
  const serviceTypes = loadouts.reduce((acc, l) => {
    acc[l.serviceType] = (acc[l.serviceType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Cost composition averages
  const avgEquipmentCost = loadouts.reduce((sum, l) => sum + l.totalEquipmentCost, 0) / totalLoadouts
  const avgLaborCost = loadouts.reduce((sum, l) => sum + l.totalLaborCost, 0) / totalLoadouts
  const avgOverhead = loadouts.reduce((sum, l) => sum + l.overheadCost, 0) / totalLoadouts

  // Most/Least expensive
  const sortedByCost = [...loadouts].sort((a, b) => b.totalLoadoutCost - a.totalLoadoutCost)
  const mostExpensive = sortedByCost.slice(0, 5)
  const leastExpensive = sortedByCost.slice(-5).reverse()

  // Highest production rates
  const byProduction = [...loadouts].sort((a, b) => b.productionRate - a.productionRate).slice(0, 5)

  // Equipment/Labor balance
  const equipmentHeavy = loadouts.filter((l) => l.totalEquipmentCost > l.totalLaborCost)
  const laborHeavy = loadouts.filter((l) => l.totalLaborCost > l.totalEquipmentCost)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loadouts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoadouts}</div>
            <p className="text-xs text-muted-foreground">{activeLoadouts} active configurations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Hour</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgCostPerHour.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Fleet-wide average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Billing (50%)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgBillingRate50.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">At 50% margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(serviceTypes).length}</div>
            <p className="text-xs text-muted-foreground">Different services covered</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Average Cost Composition</CardTitle>
          <CardDescription>Breakdown of loadout costs across fleet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Equipment Cost</span>
              <span className="font-bold">${avgEquipmentCost.toFixed(2)}/hr</span>
            </div>
            <Progress value={(avgEquipmentCost / avgCostPerHour) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">{((avgEquipmentCost / avgCostPerHour) * 100).toFixed(1)}% of total cost</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Labor Cost</span>
              <span className="font-bold">${avgLaborCost.toFixed(2)}/hr</span>
            </div>
            <Progress value={(avgLaborCost / avgCostPerHour) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">{((avgLaborCost / avgCostPerHour) * 100).toFixed(1)}% of total cost</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overhead Cost</span>
              <span className="font-bold">${avgOverhead.toFixed(2)}/hr</span>
            </div>
            <Progress value={(avgOverhead / avgCostPerHour) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">{((avgOverhead / avgCostPerHour) * 100).toFixed(1)}% of total cost</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Service Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Loadouts by Service Type</CardTitle>
            <CardDescription>Coverage across different services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(serviceTypes).map(([service, count]) => (
                <div key={service} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{service}</p>
                    <Badge variant="outline">{count} loadout{count !== 1 ? 's' : ''}</Badge>
                  </div>
                  <Progress value={(count / totalLoadouts) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment vs Labor Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Structure Analysis</CardTitle>
            <CardDescription>Equipment-heavy vs labor-heavy loadouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  <p className="font-medium">Equipment-Heavy</p>
                </div>
                <p className="text-3xl font-bold">{equipmentHeavy.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Equipment cost exceeds labor</p>
              </div>

              <div className="p-4 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-secondary" />
                  <p className="font-medium">Labor-Heavy</p>
                </div>
                <p className="text-3xl font-bold">{laborHeavy.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Labor cost exceeds equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Highest Cost Loadouts</CardTitle>
            <CardDescription>Most expensive configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostExpensive.map((l) => (
                <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-sm text-muted-foreground">{l.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">${l.totalLoadoutCost.toFixed(2)}/hr</p>
                    <p className="text-xs text-muted-foreground">{l.equipment.length} eq + {l.employees.length} crew</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Production Rates</CardTitle>
            <CardDescription>Fastest point-generating loadouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {byProduction.map((l) => (
                <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-sm text-muted-foreground">{l.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-primary" />
                      <p className="font-bold text-primary">{l.productionRate} PpH</p>
                    </div>
                    <p className="text-xs text-muted-foreground">${l.billingRate50.toFixed(2)}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Loadout Status</CardTitle>
          <CardDescription>Active vs inactive configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="font-medium">Active Loadouts</p>
              </div>
              <p className="text-3xl font-bold">{activeLoadouts}</p>
              <p className="text-xs text-muted-foreground mt-1">Available for use in quotes and projects</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Inactive Loadouts</p>
              </div>
              <p className="text-3xl font-bold">{totalLoadouts - activeLoadouts}</p>
              <p className="text-xs text-muted-foreground mt-1">Archived or not currently in use</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
