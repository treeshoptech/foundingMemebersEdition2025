"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, User, DollarSign, Calculator } from "lucide-react"

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

const POSITION_PRESETS = {
  "Entry Ground Crew": { multiplier: 1.6, description: "Entry-level ground worker" },
  "Experienced Climber": { multiplier: 1.7, description: "Certified climber with experience" },
  "Crew Leader": { multiplier: 1.8, description: "Team leader and supervisor" },
  "Certified Arborist": { multiplier: 1.9, description: "ISA certified professional" },
  "Specialized Operator": { multiplier: 2.0, description: "Heavy equipment specialist" },
  "Custom": { multiplier: 1.7, description: "Custom position" }
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

  const handlePositionChange = (position: string) => {
    setFormData({
      ...formData,
      position,
      burdenMultiplier: POSITION_PRESETS[position as keyof typeof POSITION_PRESETS]?.multiplier || 1.7
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{initialData ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>Configure employee compensation and calculate true hourly cost with burden</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Role *</Label>
                  <Select value={formData.position} onValueChange={handlePositionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(POSITION_PRESETS).map(([position, { description }]) => (
                        <SelectItem key={position} value={position}>
                          <div className="flex flex-col">
                            <span>{position}</span>
                            <span className="text-xs text-muted-foreground">{description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Compensation & Burden
              </CardTitle>
              <CardDescription>
                Base wage plus burden multiplier (taxes, insurance, benefits, overhead)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="baseHourlyRate">Base Hourly Rate *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="baseHourlyRate"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="25.00"
                      className="pl-7"
                      value={formData.baseHourlyRate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseHourlyRate: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">What you pay the employee per hour</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="burdenMultiplier">Burden Multiplier *</Label>
                  <Input
                    id="burdenMultiplier"
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="3.0"
                    placeholder="1.7"
                    value={formData.burdenMultiplier || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        burdenMultiplier: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">Typical range: 1.6x - 2.0x</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">Standard Burden Multipliers:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Entry Ground Crew: <strong>1.6x</strong> (taxes + basic overhead)</li>
                    <li>• Experienced Climber: <strong>1.7x</strong> (standard tree service)</li>
                    <li>• Crew Leader: <strong>1.8x</strong> (leadership premium)</li>
                    <li>• Certified Arborist: <strong>1.9x</strong> (certification costs)</li>
                    <li>• Specialized Operator: <strong>2.0x</strong> (specialized training)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Calculation */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                True Cost Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Base Hourly Rate</p>
                  <p className="text-2xl font-bold">${formData.baseHourlyRate.toFixed(2)}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Burden Multiplier</p>
                  <p className="text-2xl font-bold">{formData.burdenMultiplier.toFixed(2)}x</p>
                </div>

                <div className="p-6 bg-primary/10 rounded-lg border-2 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">TRUE COST PER HOUR</p>
                      <p className="text-3xl font-bold text-primary">${trueCost.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-primary opacity-50" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p className="mb-2"><strong>Calculation:</strong> ${formData.baseHourlyRate.toFixed(2)} × {formData.burdenMultiplier.toFixed(2)} = ${trueCost.toFixed(2)}/hour</p>
                <p className="text-xs">This true cost includes base wage + payroll taxes + workers comp + insurance + benefits + non-billable time</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pt-4 border-t">
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
                "Update Employee"
              ) : (
                "Create Employee"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
