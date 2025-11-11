"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Truck,
  Calendar,
  DollarSign,
  Fuel,
  Wrench,
  Clock,
  TrendingUp,
  Info,
  Building2,
  Hash,
  CreditCard,
  BarChart3,
} from "lucide-react"

type Equipment = {
  _id: string
  name: string
  category: string
  type: string
  year?: number
  make?: string
  model?: string
  serialNumber?: string
  vin?: string
  licensePlate?: string
  status: string
  condition?: string

  // Usage Pattern
  daysPerYear: number
  hoursPerDay: number
  annualHours: number

  // Purchase & Financing
  purchasePrice: number
  purchaseDate?: number
  usefulLifeYears: number
  financingType?: string
  financeAPR?: number
  financeTermMonths?: number
  financeDownPayment?: number

  // Annual Fixed Costs
  insuranceAnnual: number

  // Annual Operating Costs
  fuelBurnRate: number
  fuelPricePerGallon: number
  maintenanceTier: string
  oilChangeInterval: number

  // Calculated Costs
  ownershipCostPerHour: number
  operatingCostPerHour: number
  totalCostPerHour: number

  // Optional tracking
  fuelType?: string
  notes?: string
  imageUrl?: string
  totalHoursOperated?: number
  lastServiceDate?: number
  nextServiceDue?: number
  currentOdometerReading?: number
}

interface EquipmentDetailModalProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipmentDetailModal({ equipment, open, onOpenChange }: EquipmentDetailModalProps) {
  if (!equipment) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary/10 text-primary"
      case "In Maintenance":
        return "bg-secondary/10 text-secondary"
      case "Out of Service":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getMaintenanceTierLabel = (tier: string) => {
    switch (tier) {
      case "minimal":
        return "Minimal ($1,300/year)"
      case "standard":
        return "Standard ($2,600/year)"
      case "intensive":
        return "Intensive ($4,550/year)"
      default:
        return tier
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{equipment.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {equipment.category} • {equipment.type}
              </p>
            </div>
            <Badge variant="outline" className={getStatusColor(equipment.status)}>
              {equipment.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Equipment Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Equipment Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {equipment.year && (
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{equipment.year}</p>
                </div>
              )}
              {equipment.make && (
                <div>
                  <p className="text-sm text-muted-foreground">Make</p>
                  <p className="font-medium">{equipment.make}</p>
                </div>
              )}
              {equipment.model && (
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-medium">{equipment.model}</p>
                </div>
              )}
              {equipment.serialNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <p className="font-medium font-mono text-sm">{equipment.serialNumber}</p>
                </div>
              )}
              {equipment.vin && (
                <div>
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-medium font-mono text-sm">{equipment.vin}</p>
                </div>
              )}
              {equipment.licensePlate && (
                <div>
                  <p className="text-sm text-muted-foreground">License Plate</p>
                  <p className="font-medium">{equipment.licensePlate}</p>
                </div>
              )}
              {equipment.condition && (
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">{equipment.condition}</p>
                </div>
              )}
              {equipment.fuelType && (
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-medium">{equipment.fuelType}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Pattern */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Usage Pattern
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Days Per Year</p>
                <p className="text-2xl font-bold">{equipment.daysPerYear}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Per Day</p>
                <p className="text-2xl font-bold">{equipment.hoursPerDay}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Hours</p>
                <p className="text-2xl font-bold text-primary">{equipment.annualHours}</p>
              </div>
            </CardContent>
          </Card>

          {/* Purchase & Financing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Purchase & Financing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Purchase Price</p>
                <p className="text-xl font-bold">${equipment.purchasePrice.toLocaleString()}</p>
              </div>
              {equipment.purchaseDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Useful Life</p>
                <p className="font-medium">{equipment.usefulLifeYears} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Financing Type</p>
                <p className="font-medium capitalize">{equipment.financingType || "Cash"}</p>
              </div>
              {equipment.financingType === "financed" && equipment.financeAPR && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">APR</p>
                    <p className="font-medium">{equipment.financeAPR}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Finance Term</p>
                    <p className="font-medium">{equipment.financeTermMonths} months</p>
                  </div>
                  {equipment.financeDownPayment && (
                    <div>
                      <p className="text-sm text-muted-foreground">Down Payment</p>
                      <p className="font-medium">${equipment.financeDownPayment.toLocaleString()}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Operating Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Operating Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Fuel Burn Rate</p>
                <p className="font-medium">{equipment.fuelBurnRate} gal/hr</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Price</p>
                <p className="font-medium">${equipment.fuelPricePerGallon}/gallon</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Tier</p>
                <p className="font-medium">{getMaintenanceTierLabel(equipment.maintenanceTier)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Oil Change Interval</p>
                <p className="font-medium">{equipment.oilChangeInterval} hours</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Insurance</p>
                <p className="font-medium">${equipment.insuranceAnnual.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Hourly Cost Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Ownership Cost</p>
                  <p className="text-2xl font-bold">${equipment.ownershipCostPerHour.toFixed(2)}/hr</p>
                  <p className="text-xs text-muted-foreground mt-1">Depreciation + Financing + Insurance</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Operating Cost</p>
                  <p className="text-2xl font-bold">${equipment.operatingCostPerHour.toFixed(2)}/hr</p>
                  <p className="text-xs text-muted-foreground mt-1">Fuel + Maintenance</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-primary">${equipment.totalCostPerHour.toFixed(2)}/hr</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete hourly cost</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Equipment Cost Only</p>
                    <p className="text-xs">
                      This is the raw equipment cost per hour. To calculate billing rates with profit margins,
                      add this equipment to a Loadout along with crew members and overhead costs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance & Tracking */}
          {(equipment.totalHoursOperated || equipment.lastServiceDate || equipment.nextServiceDue || equipment.currentOdometerReading) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Maintenance & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {equipment.totalHoursOperated && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours Operated</p>
                    <p className="text-xl font-bold">{equipment.totalHoursOperated.toFixed(1)} hours</p>
                  </div>
                )}
                {equipment.lastServiceDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Last Service Date</p>
                    <p className="font-medium">{new Date(equipment.lastServiceDate).toLocaleDateString()}</p>
                  </div>
                )}
                {equipment.nextServiceDue && (
                  <div>
                    <p className="text-sm text-muted-foreground">Next Service Due</p>
                    <p className="font-medium">{new Date(equipment.nextServiceDue).toLocaleDateString()}</p>
                  </div>
                )}
                {equipment.currentOdometerReading && (
                  <div>
                    <p className="text-sm text-muted-foreground">Current Odometer</p>
                    <p className="font-medium">{equipment.currentOdometerReading.toLocaleString()} miles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {equipment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{equipment.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
