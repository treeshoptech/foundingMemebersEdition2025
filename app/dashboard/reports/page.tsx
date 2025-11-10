"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, TrendingUp, TrendingDown, AlertCircle, FileText, PieChart, BarChart3 } from "lucide-react"
import { useOrganization } from "@/providers/organization-provider"

export default function ReportsPage() {
  const { currentOrganization } = useOrganization()

  // Date range for reports (default to last 30 days)
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split("T")[0]
  })

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0]
  })

  const startTimestamp = new Date(startDate).getTime()
  const endTimestamp = new Date(endDate).getTime()

  // Fetch reports data
  const utilizationReport = useQuery(
    api.equipmentKPIs.getUtilizationReport,
    currentOrganization
      ? {
          organizationId: currentOrganization._id,
          startDate: startTimestamp,
          endDate: endTimestamp,
        }
      : "skip"
  )

  const costEfficiencyReport = useQuery(
    api.equipmentKPIs.getCostEfficiencyReport,
    currentOrganization
      ? {
          organizationId: currentOrganization._id,
          startDate: startTimestamp,
          endDate: endTimestamp,
        }
      : "skip"
  )

  const organizationKPIs = useQuery(
    api.equipmentKPIs.getOrganizationKPIs,
    currentOrganization
      ? {
          organizationId: currentOrganization._id,
          startDate: startTimestamp,
          endDate: endTimestamp,
        }
      : "skip"
  )

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please select an organization</p>
      </div>
    )
  }

  const isLoading = utilizationReport === undefined || costEfficiencyReport === undefined || organizationKPIs === undefined

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Equipment Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for your equipment fleet</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
          <CardDescription>Select the date range for your reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() - 30)
                setStartDate(date.toISOString().split("T")[0])
                setEndDate(new Date().toISOString().split("T")[0])
              }}
            >
              Last 30 Days
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() - 90)
                setStartDate(date.toISOString().split("T")[0])
                setEndDate(new Date().toISOString().split("T")[0])
              }}
            >
              Last 90 Days
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <PieChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="utilization">
              <BarChart3 className="h-4 w-4 mr-2" />
              Utilization
            </TabsTrigger>
            <TabsTrigger value="costs">
              <TrendingUp className="h-4 w-4 mr-2" />
              Cost Analysis
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <AlertCircle className="h-4 w-4 mr-2" />
              Maintenance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organizationKPIs?.equipmentCount || 0}</div>
                  <p className="text-xs text-muted-foreground">Active units in fleet</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {organizationKPIs?.totals.totalHours.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Hours operated in period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${organizationKPIs?.totals.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">Total equipment costs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {utilizationReport?.summary.avgUtilization.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Fleet utilization rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Detailed breakdown of equipment costs for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Fuel Costs</span>
                    <span className="text-sm font-bold">
                      ${organizationKPIs?.totals.totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Maintenance Costs</span>
                    <span className="text-sm font-bold">
                      ${organizationKPIs?.totals.totalMaintenanceCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Operating Costs</span>
                    <span className="text-sm font-bold">
                      ${organizationKPIs?.totals.totalOperatingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm font-medium">Ownership Costs</span>
                    <span className="text-sm font-bold">
                      ${organizationKPIs?.totals.totalOwnershipCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-base font-bold">Total Costs</span>
                    <span className="text-base font-bold">
                      ${organizationKPIs?.totals.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilization Tab */}
          <TabsContent value="utilization" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Well Utilized</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {utilizationReport?.summary.wellUtilized || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">50-100% utilization</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Underutilized</CardTitle>
                  <TrendingDown className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {utilizationReport?.summary.underutilized || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Below 50% utilization</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overutilized</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {utilizationReport?.summary.overutilized || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Over 100% utilization</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Utilization Details</CardTitle>
                <CardDescription>Sorted by utilization rate (lowest first)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {utilizationReport?.equipment.map((eq) => (
                    <div
                      key={eq.equipmentId}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{eq.equipmentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {eq.category} - {eq.type}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-bold ${
                              eq.utilizationRate < 50
                                ? "text-accent"
                                : eq.utilizationRate > 100
                                  ? "text-destructive"
                                  : "text-primary"
                            }`}
                          >
                            {eq.utilizationRate.toFixed(1)}%
                          </span>
                          {eq.utilizationRate < 50 ? (
                            <TrendingDown className="h-4 w-4 text-accent" />
                          ) : eq.utilizationRate > 100 ? (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {eq.totalHours.toFixed(1)}h / {eq.expectedHours.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Analysis Tab */}
          <TabsContent value="costs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {costEfficiencyReport?.summary.equipmentOverBudget || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Equipment exceeding estimated costs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Budget</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {costEfficiencyReport?.summary.equipmentUnderBudget || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Equipment under estimated costs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      (costEfficiencyReport?.summary.totalVariance || 0) > 0 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    ${Math.abs(costEfficiencyReport?.summary.totalVariance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(costEfficiencyReport?.summary.totalVariance || 0) > 0 ? "Over" : "Under"} estimated
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Cost Efficiency</CardTitle>
                <CardDescription>Sorted by cost variance (highest overspend first)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {costEfficiencyReport?.equipment.map((eq) => (
                    <div
                      key={eq.equipmentId}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{eq.equipmentName}</p>
                        <p className="text-sm text-muted-foreground">
                          {eq.category} - {eq.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {eq.totalHours.toFixed(1)} hours operated
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div
                          className={`text-lg font-bold ${
                            eq.costs.totalVariance > 0 ? "text-destructive" : "text-primary"
                          }`}
                        >
                          {eq.costs.totalVariance > 0 ? "+" : ""}$
                          {eq.costs.totalVariance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Actual: ${eq.costs.totalActual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Est: ${eq.costs.totalEstimated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Overview</CardTitle>
                <CardDescription>Equipment maintenance status and upcoming service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Maintenance tracking will be displayed here</p>
                  <p className="text-sm mt-2">Include upcoming service, overdue maintenance, and service history</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
