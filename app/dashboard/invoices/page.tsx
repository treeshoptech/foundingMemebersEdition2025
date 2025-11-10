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
  Receipt,
  Calendar,
  Edit,
  Trash2,
  Plus,
  DollarSign,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const STATUS_COLORS = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "destructive",
} as const

export default function InvoicesPage() {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<any>(null)

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    propertyAddress: "",
    dueDate: "",
    subtotal: "",
    taxRate: "0.09",
    status: "draft",
    notes: "",
  })

  const invoices = useQuery(
    api.invoices.list,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
  )

  const createInvoice = useMutation(api.invoices.create)
  const updateInvoice = useMutation(api.invoices.update)
  const deleteInvoice = useMutation(api.invoices.remove)

  const calculateTax = (subtotal: number, taxRate: number) => {
    return subtotal * taxRate
  }

  const calculateTotal = (subtotal: number, taxRate: number) => {
    return subtotal + calculateTax(subtotal, taxRate)
  }

  const handleOpenDialog = (invoice?: any) => {
    if (invoice) {
      setEditingInvoice(invoice)
      setFormData({
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail || "",
        propertyAddress: invoice.propertyAddress,
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : "",
        subtotal: invoice.subtotal?.toString() || "",
        taxRate: invoice.taxRate?.toString() || "0.09",
        status: invoice.status,
        notes: invoice.notes || "",
      })
    } else {
      setEditingInvoice(null)
      // Set default due date to 15 days from now
      const defaultDueDate = new Date()
      defaultDueDate.setDate(defaultDueDate.getDate() + 15)

      setFormData({
        customerName: "",
        customerEmail: "",
        propertyAddress: "",
        dueDate: defaultDueDate.toISOString().split('T')[0],
        subtotal: "",
        taxRate: "0.09",
        status: "draft",
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.organizationId) return

    try {
      const subtotal = parseFloat(formData.subtotal) || 0
      const taxRate = parseFloat(formData.taxRate) || 0
      const tax = calculateTax(subtotal, taxRate)
      const total = calculateTotal(subtotal, taxRate)

      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String((invoices?.length || 0) + 1).padStart(3, '0')}`

      const invoiceData = {
        organizationId: user.organizationId as any,
        invoiceNumber,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail || undefined,
        propertyAddress: formData.propertyAddress,
        status: formData.status as any,
        subtotal,
        taxRate,
        taxAmount: tax,
        total,
        lineItems: [],
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime() : new Date().getTime() + (15 * 24 * 60 * 60 * 1000),
        notes: formData.notes || undefined,
      }

      if (editingInvoice) {
        await updateInvoice({
          invoiceId: editingInvoice._id,
          ...invoiceData,
        })
      } else {
        await createInvoice(invoiceData)
      }

      setIsDialogOpen(false)
      setEditingInvoice(null)
    } catch (error) {
      console.error("Failed to save invoice:", error)
    }
  }

  const handleDelete = async (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice({ invoiceId: invoiceId as any })
    }
  }

  const subtotal = parseFloat(formData.subtotal) || 0
  const taxRate = parseFloat(formData.taxRate) || 0
  const tax = calculateTax(subtotal, taxRate)
  const total = calculateTotal(subtotal, taxRate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-2">Create and track customer invoices</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
              <DialogDescription>
                {editingInvoice ? "Update invoice details" : "Generate a new customer invoice"}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
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
                  <Label htmlFor="subtotal">Subtotal *</Label>
                  <Input
                    id="subtotal"
                    type="number"
                    step="0.01"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {(parseFloat(formData.taxRate) * 100).toFixed(0)}% tax rate
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button type="submit">{editingInvoice ? "Save Changes" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            All Invoices
          </CardTitle>
          <CardDescription>Track billing and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {!invoices || invoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No invoices yet</p>
              <p className="text-sm mt-2">Create your first invoice to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium">
                        <Receipt className="h-3 w-3" />
                        {invoice.invoiceNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customerName}</div>
                        {invoice.customerEmail && (
                          <div className="text-sm text-muted-foreground">{invoice.customerEmail}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate && (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>${invoice.subtotal.toFixed(2)}</TableCell>
                    <TableCell>${invoice.taxAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-bold">
                        <DollarSign className="h-3 w-3" />
                        {invoice.total.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[invoice.status as keyof typeof STATUS_COLORS] || "default"}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(invoice)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice._id)}>
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
