"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_TYPES,
  EQUIPMENT_STATUS,
  EQUIPMENT_CONDITION,
  FUEL_TYPES,
  getTypes,
  getStatuses,
  getConditions,
  getFuelTypes,
} from "@/lib/equipment-constants"

interface EquipmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EquipmentFormData) => Promise<void>
  initialData?: EquipmentFormData
}

export interface EquipmentFormData {
  // Basic Information
  name: string
  category: string
  type: string

  // Detailed Equipment Information
  year?: number
  make?: string
  model?: string
  serialNumber?: string
  vin?: string
  licensePlate?: string

  // Financial Information
  purchasePrice: number
  purchaseDate?: number
  usefulLifeYears: number
  annualHours: number
  financeAPR?: number
  financeTermYears?: number
  maintenanceCostPerHour: number
  fuelCostPerHour: number
  insuranceAnnual: number

  // Status & Condition
  status: string
  condition?: string

  // Operational Information
  fuelType?: string
  fuelCapacity?: number

  // KPI Tracking Fields
  totalHoursOperated?: number
  lastServiceDate?: number
  nextServiceDue?: number
  currentOdometerReading?: number

  // Additional Information
  notes?: string
  imageUrl?: string
}

export function EquipmentForm({ open, onOpenChange, onSubmit, initialData }: EquipmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EquipmentFormData>(
    initialData || {
      name: "",
      category: "",
      type: "",
      purchasePrice: 0,
      usefulLifeYears: 5,
      annualHours: 2000,
      maintenanceCostPerHour: 0,
      fuelCostPerHour: 0,
      insuranceAnnual: 0,
      status: EQUIPMENT_STATUS.ACTIVE,
    },
  )

  // Get available types based on selected category
  const availableTypes = formData.category
    ? getTypes(formData.category.toUpperCase().replace(/\s+/g, "_").replace(/&/g, "").replace(/-/g, "_") as keyof typeof EQUIPMENT_TYPES)
    : []

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
          <DialogTitle>{initialData ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          <DialogDescription>Enter comprehensive equipment details for accurate tracking and cost analysis</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Bandit 18XP Chipper"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatuses().map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value, type: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EQUIPMENT_CATEGORIES).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.category ? "Select type" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition || ""}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {getConditions().map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={formData.make || ""}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g., Bandit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model || ""}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g., 18XP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber || ""}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN</Label>
                  <Input
                    id="vin"
                    value={formData.vin || ""}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate || ""}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={formData.fuelType || ""}
                    onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFuelTypes().map((fuelType) => (
                        <SelectItem key={fuelType} value={fuelType}>
                          {fuelType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelCapacity">Fuel Capacity (gallons)</Label>
                  <Input
                    id="fuelCapacity"
                    type="number"
                    step="0.1"
                    value={formData.fuelCapacity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fuelCapacity: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this equipment..."
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price ($) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchasePrice: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={
                      formData.purchaseDate
                        ? new Date(formData.purchaseDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchaseDate: e.target.value ? new Date(e.target.value).getTime() : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usefulLifeYears">Useful Life (years) *</Label>
                  <Input
                    id="usefulLifeYears"
                    type="number"
                    value={formData.usefulLifeYears}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usefulLifeYears: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualHours">Annual Hours *</Label>
                  <Input
                    id="annualHours"
                    type="number"
                    value={formData.annualHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        annualHours: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceAnnual">Annual Insurance ($) *</Label>
                <Input
                  id="insuranceAnnual"
                  type="number"
                  step="0.01"
                  value={formData.insuranceAnnual}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      insuranceAnnual: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="financeAPR">Finance APR (%)</Label>
                  <Input
                    id="financeAPR"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.5"
                    value={formData.financeAPR || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financeAPR: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financeTermYears">Finance Term (years)</Label>
                  <Input
                    id="financeTermYears"
                    type="number"
                    step="1"
                    placeholder="e.g., 5"
                    value={formData.financeTermYears || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financeTermYears: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceCostPerHour">Maintenance ($/hr) *</Label>
                  <Input
                    id="maintenanceCostPerHour"
                    type="number"
                    step="0.01"
                    value={formData.maintenanceCostPerHour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenanceCostPerHour: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelCostPerHour">Fuel ($/hr) *</Label>
                  <Input
                    id="fuelCostPerHour"
                    type="number"
                    step="0.01"
                    value={formData.fuelCostPerHour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fuelCostPerHour: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalHoursOperated">Total Hours Operated</Label>
                  <Input
                    id="totalHoursOperated"
                    type="number"
                    step="0.1"
                    value={formData.totalHoursOperated || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalHoursOperated: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentOdometerReading">Current Odometer (miles)</Label>
                  <Input
                    id="currentOdometerReading"
                    type="number"
                    value={formData.currentOdometerReading || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentOdometerReading: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastServiceDate">Last Service Date</Label>
                  <Input
                    id="lastServiceDate"
                    type="date"
                    value={
                      formData.lastServiceDate
                        ? new Date(formData.lastServiceDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastServiceDate: e.target.value ? new Date(e.target.value).getTime() : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextServiceDue">Next Service Due</Label>
                  <Input
                    id="nextServiceDue"
                    type="date"
                    value={
                      formData.nextServiceDue
                        ? new Date(formData.nextServiceDue).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nextServiceDue: e.target.value ? new Date(e.target.value).getTime() : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : initialData ? (
                "Update Equipment"
              ) : (
                "Create Equipment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
