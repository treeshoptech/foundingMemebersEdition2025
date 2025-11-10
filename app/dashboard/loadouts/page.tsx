"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadoutForm, type LoadoutFormData } from "@/components/loadout-form"
import { Plus, Pencil, Trash2, Users, Wrench } from "lucide-react"

export default function LoadoutsPage() {
  const { user } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadouts: any[] = []
  const equipment: any[] = []
  const employees: any[] = []

  const handleSubmit = async (data: LoadoutFormData) => {
    if (!user) return
    console.log("[v0] Loadout data to save:", data)
    // Would save to Convex when connected
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this loadout?")) {
      console.log("[v0] Delete loadout:", id)
      // Would delete from Convex when connected
    }
  }

  const editingLoadout = loadouts?.find((l) => l._id === editingId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Loadouts</h1>
          <p className="text-muted-foreground">Combine equipment and employees for pricing</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Loadout
        </Button>
      </div>

      {loadouts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No loadouts created yet. Create your first loadout to start pricing jobs.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Loadout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loadouts.map((loadout) => (
            <Card key={loadout._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{loadout.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {loadout.serviceType}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(loadout._id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(loadout._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                    <span>{loadout.equipment?.length || 0} Equipment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{loadout.employees?.length || 0} Employees</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost/Hour:</span>
                    <span className="font-medium">${loadout.totalLoadoutCostPerHour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Margin:</span>
                    <span className="font-medium">{loadout.selectedMargin}%</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-1">
                    <span>Billing Rate:</span>
                    <span className="text-primary">${loadout.billingRate.toFixed(2)}/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LoadoutForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) setEditingId(null)
        }}
        onSubmit={handleSubmit}
        equipment={equipment || []}
        employees={employees || []}
        initialData={editingLoadout}
      />
    </div>
  )
}
