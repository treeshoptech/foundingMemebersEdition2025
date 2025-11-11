"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Fuel,
  Wrench,
  Shield,
  BarChart3,
  PieChart,
  AlertTriangle,
} from "lucide-react"

type Equipment = {
  _id: string
  name: string
  category: string
  type: string
  status: string
  purchasePrice: number
  usefulLifeYears: number
  annualHours: number
  daysPerYear: number
  hoursPerDay: number
  ownershipCostPerHour: number
  operatingCostPerHour: number
  totalCostPerHour: number
  totalHoursOperated?: number
  fuelBurnRate: number
  fuelPricePerGallon: number
  maintenanceTier: string
  insuranceAnnual: number
}

interface EquipmentReportingProps {
  equipment: Equipment[]
}

export function EquipmentReporting({ equipment }: EquipmentReportingProps) {
  if (!equipment || equipment.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Add equipment to see reporting and analytics
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate fleet-wide metrics
  const totalEquipment = equipment.length
  const activeEquipment = equipment.filter((e) => e.status === "Active").length
  const totalInvestment = equipment.reduce((sum, e) => sum + e.purchasePrice, 0)
  const totalAnnualHours = equipment.reduce((sum, e) => sum + e.annualHours, 0)
  const averageCostPerHour = equipment.reduce((sum, e) => sum + e.totalCostPerHour, 0) / totalEquipment

  // Category breakdown
  const categoryStats = equipment.reduce((acc, e) => {
    if (!acc[e.category]) {
      acc[e.category] = {
        count: 0,
        totalCost: 0,
        totalHours: 0,
        avgCostPerHour: 0,
      }
    }
    acc[e.category].count++
    acc[e.category].totalCost += e.purchasePrice
    acc[e.category].totalHours += e.annualHours
    acc[e.category].avgCostPerHour += e.totalCostPerHour
    return acc
  }, {} as Record<string, { count: number; totalCost: number; totalHours: number; avgCostPerHour: number }>)

  // Calculate averages for categories
  Object.keys(categoryStats).forEach((category) => {
    categoryStats[category].avgCostPerHour /= categoryStats[category].count
  })

  // Most expensive equipment
  const mostExpensive = [...equipment].sort((a, b) => b.purchasePrice - a.purchasePrice).slice(0, 5)

  // Highest operating cost
  const highestOperating = [...equipment].sort((a, b) => b.operatingCostPerHour - a.operatingCostPerHour).slice(0, 5)

  // Annual cost breakdown
  const totalAnnualOwnership = equipment.reduce((sum, e) => sum + (e.ownershipCostPerHour * e.annualHours), 0)
  const totalAnnualOperating = equipment.reduce((sum, e) => sum + (e.operatingCostPerHour * e.annualHours), 0)
  const totalAnnualCost = totalAnnualOwnership + totalAnnualOperating

  // Fuel consumption
  const totalAnnualFuelGallons = equipment.reduce((sum, e) => sum + (e.fuelBurnRate * e.annualHours), 0)
  const totalAnnualFuelCost = equipment.reduce((sum, e) => sum + (e.fuelBurnRate * e.fuelPricePerGallon * e.annualHours), 0)

  // Insurance
  const totalAnnualInsurance = equipment.reduce((sum, e) => sum + e.insuranceAnnual, 0)

  // Maintenance tier distribution
  const maintenanceTiers = equipment.reduce((acc, e) => {
    acc[e.maintenanceTier] = (acc[e.maintenanceTier] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Utilization analysis
  const underutilized = equipment.filter((e) => e.daysPerYear < 150)
  const wellUtilized = equipment.filter((e) => e.daysPerYear >= 200)

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvestment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalEquipment} pieces of equipment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Fleet Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-muted-foreground">Ownership + Operating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost Per Hour</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageCostPerHour.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Fleet-wide average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnnualHours.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{activeEquipment} active units</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Cost Breakdown</CardTitle>
          <CardDescription>Total fleet operating costs by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ownership Costs (Depreciation, Finance, Insurance)</span>
              <span className="font-bold">${totalAnnualOwnership.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <Progress value={(totalAnnualOwnership / totalAnnualCost) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {((totalAnnualOwnership / totalAnnualCost) * 100).toFixed(1)}% of total annual cost
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Operating Costs (Fuel, Maintenance)</span>
              <span className="font-bold">${totalAnnualOperating.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <Progress value={(totalAnnualOperating / totalAnnualCost) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {((totalAnnualOperating / totalAnnualCost) * 100).toFixed(1)}% of total annual cost
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Fuel Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Fuel Consumption
            </CardTitle>
            <CardDescription>Annual fleet fuel usage and costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Fuel Consumption</p>
              <p className="text-3xl font-bold">{totalAnnualFuelGallons.toLocaleString()} gal/year</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fuel Cost</p>
              <p className="text-2xl font-bold text-destructive">${totalAnnualFuelCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}/year</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Average: {(totalAnnualFuelGallons / totalAnnualHours).toFixed(2)} gal/hr fleet-wide
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Insurance Coverage
            </CardTitle>
            <CardDescription>Annual insurance costs across fleet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Annual Premiums</p>
              <p className="text-3xl font-bold">${totalAnnualInsurance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Per Unit</p>
              <p className="text-2xl font-bold">${(totalAnnualInsurance / totalEquipment).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                {((totalAnnualInsurance / totalAnnualCost) * 100).toFixed(1)}% of total annual fleet cost
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Equipment by Category
          </CardTitle>
          <CardDescription>Fleet composition and category statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{category}</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.count} units • ${stats.avgCostPerHour.toFixed(2)}/hr avg • {stats.totalHours.toLocaleString()} hrs/year
                    </p>
                  </div>
                  <Badge variant="outline">${stats.totalCost.toLocaleString()}</Badge>
                </div>
                <Progress value={(stats.count / totalEquipment) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Tier Distribution
          </CardTitle>
          <CardDescription>Equipment maintenance complexity breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Minimal Maintenance</p>
              <p className="text-3xl font-bold">{maintenanceTiers.minimal || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">$1,300/year base</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Standard Maintenance</p>
              <p className="text-3xl font-bold">{maintenanceTiers.standard || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">$2,600/year base</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Intensive Maintenance</p>
              <p className="text-3xl font-bold">{maintenanceTiers.intensive || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">$4,550/year base</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utilization Analysis */}
      {(underutilized.length > 0 || wellUtilized.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Utilization Analysis
            </CardTitle>
            <CardDescription>Equipment usage efficiency insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {underutilized.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <div className="flex items-start gap-2">
                  <TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">Underutilized Equipment</p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                      {underutilized.length} units operating less than 150 days/year
                    </p>
                    <ul className="mt-2 space-y-1">
                      {underutilized.slice(0, 3).map((e) => (
                        <li key={e._id} className="text-sm text-yellow-800 dark:text-yellow-200">
                          • {e.name}: {e.daysPerYear} days/year ({e.annualHours} hrs)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {wellUtilized.length > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Well-Utilized Equipment</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {wellUtilized.length} units operating 200+ days/year
                    </p>
                    <ul className="mt-2 space-y-1">
                      {wellUtilized.slice(0, 3).map((e) => (
                        <li key={e._id} className="text-sm text-muted-foreground">
                          • {e.name}: {e.daysPerYear} days/year ({e.annualHours} hrs)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Highest Purchase Price</CardTitle>
            <CardDescription>Top 5 most expensive equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostExpensive.map((e, i) => (
                <div key={e._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-sm text-muted-foreground">{e.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${e.purchasePrice.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">${e.totalCostPerHour.toFixed(2)}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Operating Cost</CardTitle>
            <CardDescription>Top 5 highest hourly operating costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highestOperating.map((e, i) => (
                <div key={e._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-sm text-muted-foreground">{e.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">${e.operatingCostPerHour.toFixed(2)}/hr</p>
                    <p className="text-xs text-muted-foreground">Total: ${e.totalCostPerHour.toFixed(2)}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
