"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"

interface LoadoutFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LoadoutFormData) => Promise<void>
  equipment: Array<{ _id: Id<"equipment">; name: string; totalCostPerHour: number }>
  employees: Array<{ _id: Id<"employees">; name: string; trueCostPerHour: number }>
  initialData?: LoadoutFormData
}

export interface LoadoutFormData {
  name: string
  serviceType: string
  equipmentIds: Id<"equipment">[]
  employeeIds: Id<"employees">[]
  productionRate: number
  selectedMargin: number
}

const SERVICE_TYPES = [
  "Tree Removal",
  "Tree Trimming",
  "Stump Grinding",
  "Land Clearing",
  "Mulching",
  "Emergency Service",
]

export function LoadoutForm({ open, onOpenChange, onSubmit, equipment, employees, initialData }: LoadoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<LoadoutFormData>(
    initialData || {
      name: "",
      serviceType: "",
      equipmentIds: [],
      employeeIds: [],
      productionRate: 1,
      selectedMargin: 50,
    },
  )

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

  const toggleEquipment = (id: Id<"equipment">) => {
    setFormData({
      ...formData,
      equipmentIds: formData.equipmentIds.includes(id)
        ? formData.equipmentIds.filter((eId) => eId !== id)
        : [...formData.equipmentIds, id],
    })
  }

  const toggleEmployee = (id: Id<"employees">) => {
    setFormData({
      ...formData,
      employeeIds: formData.employeeIds.includes(id)
        ? formData.employeeIds.filter((eId) => eId !== id)
        : [...formData.employeeIds, id],
    })
  }

  // Calculate totals
  const selectedEquipment = equipment.filter((e) => formData.equipmentIds.includes(e._id))
  const selectedEmployees = employees.filter((e) => formData.employeeIds.includes(e._id))
  const totalCost =
    selectedEquipment.reduce((sum, e) => sum + e.totalCostPerHour, 0) +
    selectedEmployees.reduce((sum, e) => sum + e.trueCostPerHour, 0)
  const billingRate = totalCost * (1 + formData.selectedMargin / 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Loadout" : "Create Loadout"}</DialogTitle>
          <DialogDescription>Combine equipment and employees to create a pricing loadout</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Loadout Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 3-Man Removal Crew"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Equipment</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
              {equipment.length === 0 ? (
                <p className="text-sm text-muted-foreground">No equipment available. Add equipment first.</p>
              ) : (
                equipment.map((item) => (
                  <div key={item._id} className="flex items-center gap-2">
                    <Checkbox
                      id={`eq-${item._id}`}
                      checked={formData.equipmentIds.includes(item._id)}
                      onCheckedChange={() => toggleEquipment(item._id)}
                    />
                    <Label htmlFor={`eq-${item._id}`} className="flex-1 cursor-pointer">
                      {item.name}
                      <span className="text-muted-foreground ml-2">(${item.totalCostPerHour.toFixed(2)}/hr)</span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Employees</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
              {employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">No employees available. Add employees first.</p>
              ) : (
                employees.map((item) => (
                  <div key={item._id} className="flex items-center gap-2">
                    <Checkbox
                      id={`emp-${item._id}`}
                      checked={formData.employeeIds.includes(item._id)}
                      onCheckedChange={() => toggleEmployee(item._id)}
                    />
                    <Label htmlFor={`emp-${item._id}`} className="flex-1 cursor-pointer">
                      {item.name}
                      <span className="text-muted-foreground ml-2">(${item.trueCostPerHour.toFixed(2)}/hr)</span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productionRate">Production Rate (units/hour)</Label>
              <Input
                id="productionRate"
                type="number"
                step="0.1"
                value={formData.productionRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productionRate: Number.parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selectedMargin">Margin (%)</Label>
              <Input
                id="selectedMargin"
                type="number"
                step="1"
                value={formData.selectedMargin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    selectedMargin: Number.parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Cost Per Hour:</span>
              <span className="font-semibold">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Billing Rate:</span>
              <span className="text-primary">${billingRate.toFixed(2)}/hr</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
