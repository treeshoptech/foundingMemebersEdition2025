"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, Wrench, TrendingUp, DollarSign, BarChart3, Info, CheckCircle2, XCircle } from "lucide-react"

type Loadout = {
  _id: string
  name: string
  description?: string
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
  transportRate?: number
  isActive: boolean
  notes?: string
  equipment: Array<{ _id: string; name: string; category: string; totalCostPerHour: number }>
  employees: Array<{ _id: string; name: string; employeeCode: string; trueCostPerHour: number }>
}

interface LoadoutDetailModalProps {
  loadout: Loadout | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoadoutDetailModal({ loadout, open, onOpenChange }: LoadoutDetailModalProps) {
  if (!loadout) return null

  const margins = [
    { label: "30%", rate: loadout.billingRate30, color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400" },
    { label: "40%", rate: loadout.billingRate40, color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 text-green-600 dark:text-green-400" },
    { label: "50%", rate: loadout.billingRate50, color: "bg-yellow-50 dark:bg-yellow-950 border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400", highlighted: true },
    { label: "60%", rate: loadout.billingRate60, color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400" },
    { label: "70%", rate: loadout.billingRate70, color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{loadout.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{loadout.serviceType}</p>
              {loadout.description && <p className="text-sm text-muted-foreground mt-1">{loadout.description}</p>}
            </div>
            <Badge variant="outline" className={loadout.isActive ? "bg-primary/10 text-primary" : "bg-muted"}>
              {loadout.isActive ? (<><CheckCircle2 className="h-3 w-3 inline mr-1" />Active</>) : (<><XCircle className="h-3 w-3 inline mr-1" />Inactive</>)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Production Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Production & Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Production Rate</p>
                <p className="text-2xl font-bold">{loadout.productionRate} PpH</p>
                <p className="text-xs text-muted-foreground mt-1">Points per Hour</p>
              </div>
              {loadout.transportRate && (
                <div>
                  <p className="text-sm text-muted-foreground">Transport Rate</p>
                  <p className="text-2xl font-bold">{(loadout.transportRate * 100).toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Of hourly rate for mobilization</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipment List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Equipment ({loadout.equipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadout.equipment.map((eq) => (
                  <div key={eq._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">{eq.category}</p>
                    </div>
                    <Badge variant="outline">${eq.totalCostPerHour.toFixed(2)}/hr</Badge>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total Equipment Cost:</span>
                  <span>${loadout.totalEquipmentCost.toFixed(2)}/hr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crew List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Crew Members ({loadout.employees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadout.employees.map((emp) => (
                  <div key={emp._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">{emp.employeeCode}</p>
                    </div>
                    <Badge variant="outline">${emp.trueCostPerHour.toFixed(2)}/hr</Badge>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span>Total Labor Cost:</span>
                  <span>${loadout.totalLaborCost.toFixed(2)}/hr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Cost Summary & Billing Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Equipment Cost</p>
                  <p className="text-2xl font-bold">${loadout.totalEquipmentCost.toFixed(2)}/hr</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Labor Cost</p>
                  <p className="text-2xl font-bold">${loadout.totalLaborCost.toFixed(2)}/hr</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Overhead Cost</p>
                  <p className="text-2xl font-bold">${loadout.overheadCost.toFixed(2)}/hr</p>
                </div>
              </div>

              <Separator />

              <div className="p-6 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">TOTAL LOADOUT COST</p>
                    <p className="text-4xl font-bold text-primary">${loadout.totalLoadoutCost.toFixed(2)}/hr</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-primary opacity-50" />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5" />
                  <h4 className="font-semibold">Pre-Calculated Billing Rates</h4>
                </div>
                <div className="grid gap-3 md:grid-cols-5">
                  {margins.map((margin) => (
                    <div key={margin.label} className={`p-3 rounded-lg border ${margin.highlighted ? 'border-2' : ''} ${margin.color}`}>
                      <p className="text-xs font-medium mb-1">{margin.label} Margin {margin.highlighted && 'P'}</p>
                      <p className="text-lg font-bold">${margin.rate.toFixed(2)}/hr</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Pricing Flexibility Built-In</p>
                    <p className="text-xs">All 5 billing rates are pre-calculated and stored. Pricing calculators can select the appropriate margin based on project complexity, competition, and customer value.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {loadout.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{loadout.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
