/**
 * TreeShop Employees Page
 *
 * Comprehensive employee management with the TreeShop career progression system.
 */

"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  TreeShopEmployeeForm,
  type TreeShopEmployeeFormData,
} from "@/components/treeshop-employee-form"
import { EmployeeCodeBadge } from "@/components/employee-code-badge"
import { TierBadge } from "@/components/tier-badge"
import { Plus, Pencil, Trash2, TrendingUp, Users } from "lucide-react"
import { formatCurrency, getCareerTrackName } from "@/lib/treeshop-employee-types"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"employees"> | null>(null)

  // Convex hooks
  const employees = useQuery(
    api.employees.list,
    user?.organizationId ? { organizationId: user.organizationId as Id<"organizations"> } : "skip",
  )
  const createEmployee = useMutation(api.employees.create)
  const updateEmployee = useMutation(api.employees.update)
  const deleteEmployee = useMutation(api.employees.remove)

  const handleSubmit = async (data: TreeShopEmployeeFormData) => {
    if (!user?.organizationId) return

    try {
      if (editingId) {
        // Update existing employee
        await updateEmployee({
          id: editingId,
          name: data.name,
          careerTrack: data.careerTrack,
          tier: data.tier,
          baseHourlyRate: data.baseHourlyRate,
          burdenMultiplier: data.burdenMultiplier,
          leadershipLevel: data.leadershipLevel,
          equipmentCertifications: data.equipmentCertifications,
          driverLicenses: data.driverLicenses,
          professionalCerts: data.professionalCerts,
          crossTraining: data.crossTraining,
          position: data.position,
        })
      } else {
        // Create new employee
        await createEmployee({
          organizationId: user.organizationId as Id<"organizations">,
          name: data.name,
          careerTrack: data.careerTrack,
          tier: data.tier,
          baseHourlyRate: data.baseHourlyRate,
          burdenMultiplier: data.burdenMultiplier,
          leadershipLevel: data.leadershipLevel,
          equipmentCertifications: data.equipmentCertifications,
          driverLicenses: data.driverLicenses,
          professionalCerts: data.professionalCerts,
          crossTraining: data.crossTraining,
          position: data.position,
        })
      }

      setEditingId(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to save employee:", error)
      alert("Failed to save employee. Please try again.")
    }
  }

  const handleEdit = (id: Id<"employees">) => {
    setEditingId(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: Id<"employees">) => {
    if (confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      try {
        await deleteEmployee({ id })
      } catch (error) {
        console.error("Failed to delete employee:", error)
        alert("Failed to delete employee. Please try again.")
      }
    }
  }

  const editingEmployee = employees?.find((e) => e._id === editingId)

  // Calculate statistics
  const totalEmployees = employees?.length || 0
  const totalTrueCostPerHour = employees?.reduce((sum, e) => sum + e.trueCostPerHour, 0) || 0
  const avgTrueCostPerHour = totalEmployees > 0 ? totalTrueCostPerHour / totalEmployees : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">TreeShop Employees</h1>
          <p className="text-muted-foreground">
            Manage employee careers, certifications, and compensation
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. True Cost/Hour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgTrueCostPerHour)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labor Cost/Hour</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalTrueCostPerHour)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Roster</CardTitle>
          <CardDescription>
            All employees with career tracks, certifications, and compensation details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!employees ? (
            <div className="text-center py-8 text-muted-foreground">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No employees added yet. Click "Add Employee" to get started with the TreeShop career
              system.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee Code</TableHead>
                    <TableHead>Career Track</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Hourly Rate</TableHead>
                    <TableHead className="text-right">True Cost/Hr</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <EmployeeCodeBadge code={employee.employeeCode} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{employee.careerTrack}</div>
                          <div className="text-xs text-muted-foreground">
                            {getCareerTrackName(employee.careerTrack as any)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TierBadge tier={employee.tier as any} size="sm" />
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(employee.effectiveHourlyRate)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-orange-600">
                        {formatCurrency(employee.trueCostPerHour)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(employee._id)}
                            title="Edit Employee"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(employee._id)}
                            title="Delete Employee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update employee information, career progression, and certifications."
                : "Create a new employee with the TreeShop career progression system."}
            </DialogDescription>
          </DialogHeader>
          <TreeShopEmployeeForm
            initialData={
              editingEmployee
                ? {
                    name: editingEmployee.name,
                    careerTrack: editingEmployee.careerTrack as any,
                    tier: editingEmployee.tier as any,
                    baseHourlyRate: editingEmployee.baseHourlyRate,
                    burdenMultiplier: editingEmployee.burdenMultiplier,
                    leadershipLevel: editingEmployee.leadershipLevel as any,
                    equipmentCertifications: editingEmployee.equipmentCertifications as any,
                    driverLicenses: editingEmployee.driverLicenses as any,
                    professionalCerts: editingEmployee.professionalCerts as any,
                    crossTraining: editingEmployee.crossTraining as any,
                    position: editingEmployee.position,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingId(null)
            }}
            submitLabel={editingId ? "Update Employee" : "Create Employee"}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
