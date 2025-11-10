"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EquipmentForm, type EquipmentFormData } from "@/components/equipment-form"
import { Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useOrganization } from "@/providers/organization-provider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCategories } from "@/lib/equipment-constants"

export default function EquipmentPage() {
  const { currentOrganization } = useOrganization()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"equipment"> | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const equipment = useQuery(
    api.equipment.list,
    currentOrganization ? { organizationId: currentOrganization._id } : "skip"
  )

  const createEquipment = useMutation(api.equipment.create)
  const updateEquipment = useMutation(api.equipment.update)
  const deleteEquipment = useMutation(api.equipment.remove)

  const handleSubmit = async (data: EquipmentFormData) => {
    if (!currentOrganization) return

    try {
      if (editingId) {
        await updateEquipment({
          id: editingId,
          ...data,
        })
      } else {
        await createEquipment({
          organizationId: currentOrganization._id,
          ...data,
        })
      }
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error saving equipment:", error)
      alert("Failed to save equipment. Please try again.")
    }
  }

  const handleEdit = (id: Id<"equipment">) => {
    setEditingId(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: Id<"equipment">) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      try {
        await deleteEquipment({ id })
      } catch (error) {
        console.error("Error deleting equipment:", error)
        alert("Failed to delete equipment. Please try again.")
      }
    }
  }

  const editingEquipment = equipment?.find((e) => e._id === editingId)

  // Filter equipment by category
  const filteredEquipment = equipment
    ? selectedCategory === "all"
      ? equipment
      : equipment.filter((e) => e.category === selectedCategory)
    : []

  // Get unique categories from equipment
  const categories = equipment
    ? ["all", ...new Set(equipment.map((e) => e.category))]
    : ["all"]

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

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please select an organization</p>
      </div>
    )
  }

  const isLoading = equipment === undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Equipment</h1>
          <p className="text-muted-foreground">Comprehensive equipment inventory with detailed tracking</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setIsFormOpen(true)
          }}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {/* Equipment Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {equipment?.filter((e) => e.status === "Active").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <AlertCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {equipment?.filter((e) => e.status === "In Maintenance").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipment ? new Set(equipment.map((e) => e.category)).size : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          All ({equipment?.length || 0})
        </Button>
        {categories
          .filter((cat) => cat !== "all")
          .map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({equipment?.filter((e) => e.category === category).length || 0})
            </Button>
          ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>
            {selectedCategory === "all"
              ? "All equipment in your fleet"
              : `${selectedCategory} equipment`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {selectedCategory === "all"
                ? "No equipment added yet. Click 'Add Equipment' to get started."
                : `No ${selectedCategory} equipment found.`}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Make/Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Cost/Hour</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.type}</TableCell>
                    <TableCell>
                      {item.make || item.model ? (
                        <div className="text-sm">
                          {item.year && <span className="text-muted-foreground">{item.year} </span>}
                          {item.make} {item.model}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.totalHoursOperated ? (
                        <span className="text-sm">{item.totalHoursOperated.toFixed(1)}h</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">${item.totalCostPerHour.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item._id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EquipmentForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingId(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingEquipment}
      />
    </div>
  )
}
