"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EmployeeFormData) => Promise<void>
  initialData?: EmployeeFormData
}

export interface EmployeeFormData {
  name: string
  position: string
  baseHourlyRate: number
  burdenMultiplier: number
}

export function EmployeeForm({ open, onOpenChange, onSubmit, initialData }: EmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<EmployeeFormData>(
    initialData || {
      name: "",
      position: "",
      baseHourlyRate: 0,
      burdenMultiplier: 1.5,
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

  const trueCost = formData.baseHourlyRate * formData.burdenMultiplier

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>Enter employee details to calculate true hourly cost</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="e.g., Climber, Ground Crew, Operator"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseHourlyRate">Base Hourly Rate ($)</Label>
            <Input
              id="baseHourlyRate"
              type="number"
              step="0.01"
              value={formData.baseHourlyRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseHourlyRate: Number.parseFloat(e.target.value) || 0,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="burdenMultiplier">Burden Multiplier (includes taxes, insurance, benefits)</Label>
            <Input
              id="burdenMultiplier"
              type="number"
              step="0.01"
              value={formData.burdenMultiplier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  burdenMultiplier: Number.parseFloat(e.target.value) || 0,
                })
              }
              required
            />
            <p className="text-sm text-muted-foreground">Typical range: 1.3 - 1.8</p>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm font-medium">True Cost Per Hour</div>
            <div className="text-2xl font-bold text-primary">${trueCost.toFixed(2)}</div>
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
