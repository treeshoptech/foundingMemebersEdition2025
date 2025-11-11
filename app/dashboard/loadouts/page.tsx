"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadoutForm, type LoadoutFormData } from "@/components/loadout-form"
import { LoadoutDetailModal } from "@/components/loadout-detail-modal"
import { LoadoutReporting } from "@/components/loadout-reporting"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye, Users, Wrench, Loader2, CheckCircle2, XCircle, TrendingUp } from "lucide-react"
import { useOrganization } from "@/providers/organization-provider"

export default function LoadoutsPage() {
  const { currentOrganization } = useOrganization()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"loadouts"> | null>(null)
  const [detailViewId, setDetailViewId] = useState<Id<"loadouts"> | null>(null)

  const loadouts = useQuery(
    api.loadouts.list,
    currentOrganization ? { organizationId: currentOrganization._id } : "skip"
  )

  const equipment = useQuery(
    api.equipment.list,
    currentOrganization ? { organizationId: currentOrganization._id } : "skip"
  )

  const employees = useQuery(
    api.employees.list,
    currentOrganization ? { organizationId: currentOrganization._id } : "skip"
  )

  const createLoadout = useMutation(api.loadouts.create)
  const updateLoadout = useMutation(api.loadouts.update)
  const deleteLoadout = useMutation(api.loadouts.remove)
  const toggleActive = useMutation(api.loadouts.toggleActive)

  const handleSubmit = async (data: LoadoutFormData) => {
    if (!currentOrganization) return

    try {
      if (editingId) {
        await updateLoadout({ id: editingId, ...data })
      } else {
        await createLoadout({ organizationId: currentOrganization._id, ...data })
      }
      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error saving loadout:", error)
      alert("Failed to save loadout. Please try again.")
    }
  }

  const handleEdit = (id: Id<"loadouts">) => {
    setEditingId(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: Id<"loadouts">) => {
    if (confirm("Are you sure you want to delete this loadout?")) {
      try {
        await deleteLoadout({ id })
      } catch (error) {
        console.error("Error deleting loadout:", error)
        alert("Failed to delete loadout. Please try again.")
      }
    }
  }

  const handleToggleActive = async (id: Id<"loadouts">) => {
    try {
      await toggleActive({ id })
    } catch (error) {
      console.error("Error toggling loadout status:", error)
      alert("Failed to update loadout status.")
    }
  }

  const editingLoadout = loadouts?.find((l) => l._id === editingId)
  const detailViewLoadout = loadouts?.find((l) => l._id === detailViewId)

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please select an organization</p>
      </div>
    )
  }

  const isLoading = loadouts === undefined

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Loadouts</h1>
          <p className="text-muted-foreground">Equipment + crew configurations for pricing</p>
        </div>
        <Button onClick={() => { setEditingId(null); setIsFormOpen(true) }} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Create Loadout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loadouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadouts?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loadouts?.filter((l) => l.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Hour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${loadouts && loadouts.length > 0 ? (loadouts.reduce((sum, l) => sum + l.totalLoadoutCost, 0) / loadouts.length).toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadouts ? new Set(loadouts.map((l) => l.serviceType)).size : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Loadout Inventory</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loadout Configurations</CardTitle>
              <CardDescription>All equipment + crew combinations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : loadouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No loadouts created yet. Click 'Create Loadout' to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loadout Name</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead className="text-right">Equip/Crew</TableHead>
                      <TableHead className="text-right">Cost/Hour</TableHead>
                      <TableHead className="text-right">Rate @ 50%</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[180px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadouts.map((loadout) => (
                      <TableRow key={loadout._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{loadout.name}</div>
                            {loadout.description && (
                              <div className="text-xs text-muted-foreground">{loadout.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{loadout.serviceType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-end gap-1">
                              <Wrench className="h-3 w-3 text-muted-foreground" />
                              <span>{loadout.equipment.length}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{loadout.employees.length}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${loadout.totalLoadoutCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${loadout.billingRate50.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleToggleActive(loadout._id)}
                            className="hover:opacity-70 transition-opacity"
                          >
                            <Badge variant="outline" className={loadout.isActive ? "bg-primary/10 text-primary" : "bg-muted"}>
                              {loadout.isActive ? (<><CheckCircle2 className="h-3 w-3 inline mr-1" />Active</>) : (<><XCircle className="h-3 w-3 inline mr-1" />Inactive</>)}
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setDetailViewId(loadout._id)} title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(loadout._id)} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(loadout._id)} title="Delete">
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
        </TabsContent>

        <TabsContent value="reports">
          <LoadoutReporting loadouts={loadouts || []} />
        </TabsContent>
      </Tabs>

      <LoadoutForm
        open={isFormOpen}
        onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingId(null) }}
        onSubmit={handleSubmit}
        initialData={editingLoadout}
        equipment={equipment || []}
        employees={employees || []}
      />

      <LoadoutDetailModal
        loadout={detailViewLoadout || null}
        open={!!detailViewId}
        onOpenChange={(open) => { if (!open) setDetailViewId(null) }}
      />
    </div>
  )
}
