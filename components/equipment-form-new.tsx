"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Calculator } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface EquipmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EquipmentFormData) => Promise<void>
  initialData?: Partial<EquipmentFormData>
}

export interface EquipmentFormData {
  // Section 1: Equipment Identity
  name: string
  year?: number
  make?: string
  model?: string
  serialNumber?: string
  category: string
  type: string
  status: string

  // Section 2: Usage Pattern
  daysPerYear: number
  hoursPerDay: number
  annualHours: number

  // Section 3: Purchase & Financing
  purchasePrice: number
  purchaseDate?: number
  usefulLifeYears: number
  financingType?: string
  financeAPR?: number
  financeTermMonths?: number
  financeDownPayment?: number

  // Section 4: Annual Fixed Costs
  insuranceAnnual: number

  // Section 5: Annual Operating Costs
  fuelBurnRate: number
  fuelPricePerGallon: number
  maintenanceTier: string
  oilChangeInterval: number

  // Optional fields
  condition?: string
  fuelType?: string
  notes?: string
}

const EQUIPMENT_CATEGORIES = [
  "Forestry Mulcher",
  "Skid Steer",
  "Truck",
  "Chipper",
  "Grapple",
  "Trailer",
  "Hand Tool",
  "Other"
]

const MAINTENANCE_TIERS = {
  minimal: { label: "MINIMAL: Basic oil changes only", cost: 1300 },
  standard: { label: "STANDARD: Regular service schedule", cost: 2600 },
  intensive: { label: "INTENSIVE: Heavy-duty ops (Tree Equipment Standard)", cost: 4550 }
}

export function EquipmentFormNew({ open, onOpenChange, onSubmit, initialData }: EquipmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: "",
    category: "",
    type: "",
    status: "Active",
    daysPerYear: 200,
    hoursPerDay: 6,
    annualHours: 1200,
    purchasePrice: 0,
    usefulLifeYears: 7,
    financingType: "cash",
    insuranceAnnual: 0,
    fuelBurnRate: 0,
    fuelPricePerGallon: 3.50,
    maintenanceTier: "intensive",
    oilChangeInterval: 500,
    ...initialData
  })

  // Calculate annual hours when days or hours change
  useEffect(() => {
    const calculated = formData.daysPerYear * formData.hoursPerDay
    setFormData(prev => ({ ...prev, annualHours: calculated }))
  }, [formData.daysPerYear, formData.hoursPerDay])

  // Calculate costs
  const calculateCosts = () => {
    const { purchasePrice, usefulLifeYears, annualHours, financeAPR, financeTermMonths, financeDownPayment,
            fuelBurnRate, fuelPricePerGallon, maintenanceTier, oilChangeInterval, insuranceAnnual, financingType } = formData

    // Depreciation
    const residualValue = purchasePrice * 0.20 // 20% residual
    const depreciationPerHour = (purchasePrice - residualValue) / usefulLifeYears / annualHours

    // Financing cost (monthly payment calculation)
    let financingPerHour = 0
    let monthlyPayment = 0
    if (financingType === "financed" && financeAPR && financeTermMonths) {
      const principal = purchasePrice - (financeDownPayment || 0)
      const monthlyRate = (financeAPR / 100) / 12
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, financeTermMonths)) /
                      (Math.pow(1 + monthlyRate, financeTermMonths) - 1)
      const annualInterest = (12 * monthlyPayment) - (principal / (financeTermMonths / 12))
      financingPerHour = annualInterest / annualHours
    }

    // Fuel
    const fuelPerHour = fuelBurnRate * fuelPricePerGallon

    // Maintenance
    const tierCost = MAINTENANCE_TIERS[maintenanceTier as keyof typeof MAINTENANCE_TIERS].cost
    const oilChangesPerYear = annualHours / oilChangeInterval
    const oilCostPerChange = 150 // Estimate
    const maintenancePerHour = (tierCost + (oilChangesPerYear * oilCostPerChange)) / annualHours

    // Insurance
    const insurancePerHour = insuranceAnnual / annualHours

    // Total
    const totalPerHour = depreciationPerHour + financingPerHour + fuelPerHour + maintenancePerHour + insurancePerHour
    const billingRate = totalPerHour * 3.0

    return {
      depreciationPerHour,
      financingPerHour,
      fuelPerHour,
      maintenancePerHour,
      insurancePerHour,
      totalPerHour,
      billingRate,
      monthlyPayment
    }
  }

  const costs = calculateCosts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
          <DialogDescription>Complete equipment onboarding for accurate cost tracking</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: EQUIPMENT IDENTITY */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Equipment Identity</CardTitle>
              <CardDescription>Basic information about this equipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name/Type *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., CAT 265 Forestry Mulcher"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make || ""}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g., Caterpillar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model || ""}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g., 265"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber || ""}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="Serial number"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: USAGE PATTERN */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Usage Pattern</CardTitle>
              <CardDescription>How much do we actually use this equipment?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daysPerYear">Days Per Year in Operation: {formData.daysPerYear}</Label>
                  <Input
                    id="daysPerYear"
                    type="range"
                    min="100"
                    max="300"
                    value={formData.daysPerYear}
                    onChange={(e) => setFormData({ ...formData, daysPerYear: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Range: 100-300 days</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoursPerDay">Hours Per Day When Running: {formData.hoursPerDay}</Label>
                  <Input
                    id="hoursPerDay"
                    type="range"
                    min="2"
                    max="12"
                    value={formData.hoursPerDay}
                    onChange={(e) => setFormData({ ...formData, hoursPerDay: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Range: 2-12 hours</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium">
                  <Calculator className="inline h-4 w-4 mr-2" />
                  Annual Operating Hours: {formData.daysPerYear} days × {formData.hoursPerDay} hrs = <span className="font-bold text-blue-600 dark:text-blue-400">{formData.annualHours} hours/year</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: PURCHASE & FINANCING */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Purchase & Financing</CardTitle>
              <CardDescription>What did it cost and how are we paying?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    placeholder="125000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usefulLifeYears">Years of Service (Expected Life) *</Label>
                  <Input
                    id="usefulLifeYears"
                    type="range"
                    min="1"
                    max="15"
                    value={formData.usefulLifeYears}
                    onChange={(e) => setFormData({ ...formData, usefulLifeYears: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">{formData.usefulLifeYears} years</p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Financing Options</Label>
                <RadioGroup value={formData.financingType} onValueChange={(value) => setFormData({ ...formData, financingType: value })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-normal cursor-pointer">Paid Cash (Skip financing details)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="financed" id="financed" />
                    <Label htmlFor="financed" className="font-normal cursor-pointer">Financed - Enter Details Below</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.financingType === "financed" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="financeAPR">APR %</Label>
                    <Input
                      id="financeAPR"
                      type="number"
                      step="0.1"
                      value={formData.financeAPR || 6.5}
                      onChange={(e) => setFormData({ ...formData, financeAPR: parseFloat(e.target.value) })}
                      placeholder="6.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financeTermMonths">Loan Term (months)</Label>
                    <Input
                      id="financeTermMonths"
                      type="number"
                      value={formData.financeTermMonths || 60}
                      onChange={(e) => setFormData({ ...formData, financeTermMonths: parseInt(e.target.value) })}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financeDownPayment">Down Payment (optional)</Label>
                    <Input
                      id="financeDownPayment"
                      type="number"
                      step="0.01"
                      value={formData.financeDownPayment || ""}
                      onChange={(e) => setFormData({ ...formData, financeDownPayment: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>
                  {costs.monthlyPayment > 0 && (
                    <div className="col-span-full p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm">Monthly Payment: <span className="font-bold">${costs.monthlyPayment.toFixed(2)}</span></p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 4: ANNUAL FIXED COSTS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. Annual Fixed Costs</CardTitle>
              <CardDescription>Insurance and other fixed annual expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceAnnual">Annual Insurance *</Label>
                <Input
                  id="insuranceAnnual"
                  type="number"
                  step="0.01"
                  value={formData.insuranceAnnual}
                  onChange={(e) => setFormData({ ...formData, insuranceAnnual: parseFloat(e.target.value) || 0 })}
                  placeholder="3000"
                  required
                />
                <p className="text-xs text-muted-foreground">Tip: Check policy or use 2-4% of purchase price as estimate</p>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: ANNUAL OPERATING COSTS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">5. Annual Operating Costs</CardTitle>
              <CardDescription>Fuel consumption and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Fuel Consumption</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelBurnRate">Fuel Burn Rate (gallons per hour) *</Label>
                    <Input
                      id="fuelBurnRate"
                      type="number"
                      step="0.1"
                      value={formData.fuelBurnRate}
                      onChange={(e) => setFormData({ ...formData, fuelBurnRate: parseFloat(e.target.value) || 0 })}
                      placeholder="8.5"
                      required
                    />
                    <p className="text-xs text-muted-foreground">NOT tank capacity - actual consumption. Track for 1 week and average.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelPricePerGallon">Current Fuel Price ($/gallon) *</Label>
                    <Input
                      id="fuelPricePerGallon"
                      type="number"
                      step="0.01"
                      value={formData.fuelPricePerGallon}
                      onChange={(e) => setFormData({ ...formData, fuelPricePerGallon: parseFloat(e.target.value) || 0 })}
                      placeholder="3.50"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Maintenance</h4>
                <div className="space-y-3">
                  <Label>Maintenance Tier *</Label>
                  <RadioGroup value={formData.maintenanceTier} onValueChange={(value) => setFormData({ ...formData, maintenanceTier: value })}>
                    {Object.entries(MAINTENANCE_TIERS).map(([key, { label, cost }]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="font-normal cursor-pointer">
                          {label} - ${cost.toLocaleString()}/year
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="oilChangeInterval">Oil Change Interval (hours) *</Label>
                  <Input
                    id="oilChangeInterval"
                    type="number"
                    value={formData.oilChangeInterval}
                    onChange={(e) => setFormData({ ...formData, oilChangeInterval: parseInt(e.target.value) || 500 })}
                    placeholder="500"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g., CAT 500hr, Grapple 250hr - consult manual. Annual changes: {(formData.annualHours / formData.oilChangeInterval).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CALCULATED HOURLY COST */}
          <Card className="border-2 border-blue-500 dark:border-blue-400">
            <CardHeader className="bg-blue-50 dark:bg-blue-950">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculated Hourly Cost (Auto-Generated)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>DEPRECIATION:</div>
                <div className="text-right font-medium">${costs.depreciationPerHour.toFixed(2)}/hr</div>

                <div>FINANCING:</div>
                <div className="text-right font-medium">${costs.financingPerHour.toFixed(2)}/hr</div>

                <div>FUEL:</div>
                <div className="text-right font-medium">${costs.fuelPerHour.toFixed(2)}/hr</div>

                <div>MAINTENANCE:</div>
                <div className="text-right font-medium">${costs.maintenancePerHour.toFixed(2)}/hr</div>

                <div>INSURANCE:</div>
                <div className="text-right font-medium">${costs.insurancePerHour.toFixed(2)}/hr</div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <div>TOTAL HOURLY EQUIPMENT COST:</div>
                <div className="text-blue-600 dark:text-blue-400">${costs.totalPerHour.toFixed(2)}/hr</div>
              </div>

              <div className="flex justify-between text-lg font-bold bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <div>RECOMMENDED BILLING RATE (3.0x):</div>
                <div className="text-green-600 dark:text-green-400">${costs.billingRate.toFixed(2)}/hr</div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Equipment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
