"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardList,
  Calendar,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Users,
  Receipt,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

const STATUS_COLORS = {
  scheduled: "default",
  "in-progress": "secondary",
  completed: "default",
  cancelled: "destructive",
} as const

const SERVICE_OPTIONS = [
  "Forestry Mulching",
  "Stump Grinding",
  "Land Clearing",
  "Tree Removal",
  "Tree Trimming",
]

export default function WorkOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkOrder, setEditingWorkOrder] = useState<any>(null)
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customerName: "",
    propertyAddress: "",
    serviceType: "",
    scheduledDate: "",
    status: "scheduled",
    assignedEmployeeIds: [] as string[],
    assignedEquipmentIds: [] as string[],
    estimatedHours: "",
    notes: "",
  })

  const workOrders = useQuery(
    api.workOrders.list,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
  )

  const employees = useQuery(
    api.employees.list,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
  )

  const equipment = useQuery(
    api.equipment.list,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
  )

  const createWorkOrder = useMutation(api.workOrders.create)
  const updateWorkOrder = useMutation(api.workOrders.update)
  const deleteWorkOrder = useMutation(api.workOrders.remove)
  const generateDepositInvoice = useMutation(api.invoices.generateDepositInvoice)
  const generateFinalInvoice = useMutation(api.invoices.generateFinalInvoice)

  const handleOpenDialog = (workOrder?: any) => {
    if (workOrder) {
      setEditingWorkOrder(workOrder)
      setFormData({
        customerName: workOrder.customerName,
        propertyAddress: workOrder.propertyAddress,
        serviceType: workOrder.serviceType,
        scheduledDate: workOrder.scheduledDate ? new Date(workOrder.scheduledDate).toISOString().split('T')[0] : "",
        status: workOrder.status,
        assignedEmployeeIds: workOrder.assignedEmployeeIds || [],
        assignedEquipmentIds: workOrder.assignedEquipmentIds || [],
        estimatedHours: workOrder.estimatedHours?.toString() || "",
        notes: workOrder.notes || "",
      })
    } else {
      setEditingWorkOrder(null)
      setFormData({
        customerName: "",
        propertyAddress: "",
        serviceType: "",
        scheduledDate: "",
        status: "scheduled",
        assignedEmployeeIds: [],
        assignedEquipmentIds: [],
        estimatedHours: "",
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.organizationId) return

    try {
      const workOrderData = {
        organizationId: user.organizationId as any,
        customerName: formData.customerName,
        propertyAddress: formData.propertyAddress,
        serviceType: formData.serviceType,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).getTime() : undefined,
        status: formData.status as any,
        assignedEmployeeIds: formData.assignedEmployeeIds as any,
        assignedEquipmentIds: formData.assignedEquipmentIds as any,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : 0,
        notes: formData.notes || undefined,
      }

      if (editingWorkOrder) {
        await updateWorkOrder({
          workOrderId: editingWorkOrder._id,
          ...workOrderData,
        })
      } else {
        await createWorkOrder(workOrderData)
      }

      setIsDialogOpen(false)
      setEditingWorkOrder(null)
    } catch (error) {
      console.error("Failed to save work order:", error)
    }
  }

  const handleDelete = async (workOrderId: string) => {
    if (confirm("Are you sure you want to delete this work order?")) {
      await deleteWorkOrder({ workOrderId: workOrderId as any })
    }
  }

  const handleGenerateDepositInvoice = async (workOrderId: string) => {
    if (confirm("Generate a deposit invoice for this work order?")) {
      setGeneratingInvoice(workOrderId)
      try {
        const invoiceId = await generateDepositInvoice({
          workOrderId: workOrderId as any,
          taxRate: 0, // Default tax rate, can be customized
        })
        if (invoiceId) {
          router.push("/dashboard/invoices")
        }
      } catch (error: any) {
        console.error("Failed to generate deposit invoice:", error)
        alert(error?.message || "Failed to generate deposit invoice. Please try again.")
      } finally {
        setGeneratingInvoice(null)
      }
    }
  }

  const handleGenerateFinalInvoice = async (workOrderId: string) => {
    if (confirm("Generate the final invoice for this completed work order?")) {
      setGeneratingInvoice(workOrderId)
      try {
        const invoiceId = await generateFinalInvoice({
          workOrderId: workOrderId as any,
          taxRate: 0, // Default tax rate, can be customized
        })
        if (invoiceId) {
          router.push("/dashboard/invoices")
        }
      } catch (error: any) {
        console.error("Failed to generate final invoice:", error)
        alert(error?.message || "Failed to generate final invoice. Please try again.")
      } finally {
        setGeneratingInvoice(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground mt-2">Schedule and track active jobs</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Work Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWorkOrder ? "Edit Work Order" : "Create Work Order"}</DialogTitle>
              <DialogDescription>
                {editingWorkOrder ? "Update work order details" : "Schedule a new job"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    step="0.1"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingWorkOrder ? "Save Changes" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Active Work Orders
          </CardTitle>
          <CardDescription>Manage scheduled and ongoing jobs</CardDescription>
        </CardHeader>
        <CardContent>
          {!workOrders || workOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No work orders yet</p>
              <p className="text-sm mt-2">Create your first work order to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow key={wo._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{wo.customerName}</div>
                        <div className="text-sm text-muted-foreground">{wo.propertyAddress}</div>
                      </div>
                    </TableCell>
                    <TableCell>{wo.serviceType}</TableCell>
                    <TableCell>
                      {wo.scheduledDate && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(wo.scheduledDate).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{wo.estimatedHours} hrs</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[wo.status as keyof typeof STATUS_COLORS] || "default"}>
                        {wo.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {wo.projectId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateDepositInvoice(wo._id)}
                            disabled={generatingInvoice === wo._id}
                          >
                            <Receipt className="h-3 w-3 mr-1" />
                            Deposit
                          </Button>
                        )}
                        {wo.status === "completed" && wo.projectId && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleGenerateFinalInvoice(wo._id)}
                            disabled={generatingInvoice === wo._id}
                          >
                            <Receipt className="h-3 w-3 mr-1" />
                            Final
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(wo)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(wo._id)}>
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
    </div>
  )
}
