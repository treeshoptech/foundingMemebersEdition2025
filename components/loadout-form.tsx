"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calculator, Users, Wrench, TrendingUp, DollarSign, Info } from "lucide-react"

type Equipment = { _id: string; name: string; category: string; type: string; totalCostPerHour: number; status: string }
type Employee = { _id: string; name: string; position?: string; careerTrack: string; tier: number; trueCostPerHour: number; employeeCode: string }

export interface LoadoutFormData {
  name: string
  description?: string
  serviceType: string
  equipmentIds: string[]
  employeeIds: string[]
  productionRate: number
  overheadCost: number
  transportRate?: number
  isActive: boolean
  notes?: string
}

interface LoadoutFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LoadoutFormData) => void
  initialData?: any
  equipment: Equipment[]
  employees: Employee[]
}

const SERVICE_TYPES = ["Forestry Mulching", "Stump Grinding", "Land Clearing", "Tree Removal", "Tree Trimming", "Emergency Tree Service"]

export function LoadoutForm({ open, onOpenChange, onSubmit, initialData, equipment, employees }: LoadoutFormProps) {
  const [formData, setFormData] = useState<LoadoutFormData>({
    name: "", description: "", serviceType: "", equipmentIds: [], employeeIds: [],
    productionRate: 1.0, overheadCost: 0, transportRate: 0.50, isActive: true, notes: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "", description: initialData.description || "", serviceType: initialData.serviceType || "",
        equipmentIds: initialData.equipmentIds || [], employeeIds: initialData.employeeIds || [],
        productionRate: initialData.productionRate || 1.0, overheadCost: initialData.overheadCost || 0,
        transportRate: initialData.transportRate, isActive: initialData.isActive ?? true, notes: initialData.notes || ""
      })
    } else {
      setFormData({ name: "", description: "", serviceType: "", equipmentIds: [], employeeIds: [],
        productionRate: 1.0, overheadCost: 0, transportRate: 0.50, isActive: true, notes: "" })
    }
  }, [initialData, open])

  const selectedEquipment = equipment.filter((e) => formData.equipmentIds.includes(e._id))
  const selectedEmployees = employees.filter((e) => formData.employeeIds.includes(e._id))
  const totalEquipmentCost = selectedEquipment.reduce((sum, e) => sum + e.totalCostPerHour, 0)
  const totalLaborCost = selectedEmployees.reduce((sum, e) => sum + e.trueCostPerHour, 0)
  const totalLoadoutCost = totalEquipmentCost + totalLaborCost + formData.overheadCost

  const billingRates = {
    margin30: totalLoadoutCost / 0.70, margin40: totalLoadoutCost / 0.60, margin50: totalLoadoutCost / 0.50,
    margin60: totalLoadoutCost / 0.40, margin70: totalLoadoutCost / 0.30
  }

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData) }
  const toggleEquipment = (id: string) => setFormData(prev => ({ ...prev, equipmentIds: prev.equipmentIds.includes(id) ? prev.equipmentIds.filter(i => i !== id) : [...prev.equipmentIds, id] }))
  const toggleEmployee = (id: string) => setFormData(prev => ({ ...prev, employeeIds: prev.employeeIds.includes(id) ? prev.employeeIds.filter(i => i !== id) : [...prev.employeeIds, id] }))

  const activeEquipment = equipment.filter((e) => e.status === "Active")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-2xl">{initialData ? "Edit Loadout" : "Create New Loadout"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Loadout Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Loadout Name *</Label>
                  <Input id="name" placeholder="e.g., 'CAT 265 Mulching Crew'" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                    <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                    <SelectContent>{SERVICE_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="productionRate">Production Rate (PpH) *</Label>
                  <Input id="productionRate" type="number" step="0.1" min="0.1" placeholder="e.g., 1.5" value={formData.productionRate} onChange={(e) => setFormData({ ...formData, productionRate: parseFloat(e.target.value) || 0 })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overheadCost">Overhead Cost/Hour</Label>
                  <Input id="overheadCost" type="number" step="0.01" min="0" placeholder="e.g., 15.00" value={formData.overheadCost} onChange={(e) => setFormData({ ...formData, overheadCost: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportRate">Transport Rate</Label>
                  <Select value={formData.transportRate?.toString() || "0.50"} onValueChange={(value) => setFormData({ ...formData, transportRate: parseFloat(value) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="0.30">30% (Small)</SelectItem><SelectItem value="0.50">50% (Standard)</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Wrench className="h-5 w-5" />Select Equipment</CardTitle></CardHeader>
            <CardContent>
              {activeEquipment.length === 0 ? (<p className="text-center text-muted-foreground py-4">No active equipment available.</p>) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {activeEquipment.map((eq) => (
                    <div key={eq._id} className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${formData.equipmentIds.includes(eq._id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => toggleEquipment(eq._id)}>
                      <Checkbox checked={formData.equipmentIds.includes(eq._id)} onCheckedChange={() => toggleEquipment(eq._id)} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between"><p className="font-medium">{eq.name}</p><Badge variant="outline">${eq.totalCostPerHour.toFixed(2)}/hr</Badge></div>
                        <p className="text-sm text-muted-foreground">{eq.category} " {eq.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" />Select Crew Members</CardTitle></CardHeader>
            <CardContent>
              {employees.length === 0 ? (<p className="text-center text-muted-foreground py-4">No employees available.</p>) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {employees.map((emp) => (
                    <div key={emp._id} className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${formData.employeeIds.includes(emp._id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => toggleEmployee(emp._id)}>
                      <Checkbox checked={formData.employeeIds.includes(emp._id)} onCheckedChange={() => toggleEmployee(emp._id)} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between"><p className="font-medium">{emp.name}</p><Badge variant="outline">${emp.trueCostPerHour.toFixed(2)}/hr</Badge></div>
                        <p className="text-sm text-muted-foreground">{emp.employeeCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/50">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Calculator className="h-5 w-5" />Real-Time Cost & Billing Rates</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm text-muted-foreground mb-1">Equipment Cost</p><p className="text-2xl font-bold">${totalEquipmentCost.toFixed(2)}/hr</p><p className="text-xs text-muted-foreground mt-1">{selectedEquipment.length} pieces</p></div>
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm text-muted-foreground mb-1">Labor Cost</p><p className="text-2xl font-bold">${totalLaborCost.toFixed(2)}/hr</p><p className="text-xs text-muted-foreground mt-1">{selectedEmployees.length} crew</p></div>
                <div className="p-4 bg-muted rounded-lg"><p className="text-sm text-muted-foreground mb-1">Overhead</p><p className="text-2xl font-bold">${formData.overheadCost.toFixed(2)}/hr</p></div>
              </div>
              <Separator />
              <div className="p-6 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">TOTAL LOADOUT COST</p><p className="text-4xl font-bold text-primary">${totalLoadoutCost.toFixed(2)}/hr</p></div><TrendingUp className="h-12 w-12 text-primary opacity-50" /></div>
              </div>
              <Separator />
              <div><div className="flex items-center gap-2 mb-4"><DollarSign className="h-5 w-5" /><h4 className="font-semibold">Billing Rates at Different Margins</h4></div>
                <div className="grid gap-3 md:grid-cols-5">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900"><p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">30% Margin</p><p className="text-lg font-bold">${billingRates.margin30.toFixed(2)}/hr</p></div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-900"><p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">40% Margin</p><p className="text-lg font-bold">${billingRates.margin40.toFixed(2)}/hr</p></div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-2 border-yellow-400 dark:border-yellow-700"><p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium mb-1">50% Margin P</p><p className="text-lg font-bold">${billingRates.margin50.toFixed(2)}/hr</p></div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-900"><p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">60% Margin</p><p className="text-lg font-bold">${billingRates.margin60.toFixed(2)}/hr</p></div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-900"><p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">70% Margin</p><p className="text-lg font-bold">${billingRates.margin70.toFixed(2)}/hr</p></div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-start gap-2"><Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" /><div className="text-sm text-blue-800 dark:text-blue-200"><p className="font-medium mb-1">All Billing Rates Saved Automatically</p><p className="text-xs">When you save this loadout, all 5 margin options are stored. Calculators can offer pricing flexibility.</p></div></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Additional Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2"><Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })} /><Label htmlFor="isActive" className="cursor-pointer">Active (available for quotes)</Label></div>
              <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" placeholder="Any special notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} /></div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!formData.name || !formData.serviceType || formData.equipmentIds.length === 0}>{initialData ? "Update Loadout" : "Create Loadout"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
