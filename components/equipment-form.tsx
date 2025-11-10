"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface EquipmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EquipmentFormData) => Promise<void>
  initialData?: EquipmentFormData
}

export interface EquipmentFormData {
  name: string
  category: string
  purchasePrice: number
  usefulLifeYears: number
  annualHours: number
  maintenanceCostPerHour: number
  fuelCostPerHour: number
  insuranceAnnual: number
}

export function EquipmentForm({ open, onOpenChange, onSubmit, initialData }: EquipmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EquipmentFormData>(
    initialData || {
      name: "",
      category: "",
      purchasePrice: 0,
      usefulLifeYears: 5,
      annualHours: 2000,
      maintenanceCostPerHour: 0,
      fuelCostPerHour: 0,
      insuranceAnnual: 0,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          <DialogDescription>Enter equipment details to calculate hourly costs</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Chipper, Truck, Saw"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
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
              <Label htmlFor="usefulLifeYears">Useful Life (years)</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualHours">Annual Hours</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceCostPerHour">Maintenance ($/hr)</Label>
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
              <Label htmlFor="fuelCostPerHour">Fuel ($/hr)</Label>
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

          <div className="space-y-2">
            <Label htmlFor="insuranceAnnual">Annual Insurance ($)</Label>
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
