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
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plus,
  DollarSign,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const STATUS_COLORS = {
  new: "default",
  contacted: "secondary",
  qualified: "default",
  proposal_sent: "secondary",
  converted: "default",
  lost: "destructive",
} as const

const SOURCE_OPTIONS = ["Website", "Referral", "Google", "Facebook", "Other"]
const SERVICE_OPTIONS = [
  "Forestry Mulching",
  "Stump Grinding",
  "Land Clearing",
  "Tree Removal",
  "Tree Trimming",
]

export default function LeadsPage() {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    propertyAddress: "",
    status: "new",
    serviceType: "",
    estimatedValue: "",
    notes: "",
  })

  const leads = useQuery(api.leads.list)

  const createLead = useMutation(api.leads.create)
  const updateLead = useMutation(api.leads.update)
  const deleteLead = useMutation(api.leads.remove)

  const handleOpenDialog = (lead?: any) => {
    if (lead) {
      setEditingLead(lead)
      setFormData({
        customerName: lead.customerName,
        email: lead.email || "",
        phoneNumber: lead.phoneNumber || "",
        propertyAddress: lead.propertyAddress,
        status: lead.status,
        serviceType: lead.serviceType,
        estimatedValue: lead.estimatedValue?.toString() || "",
        notes: lead.notes || "",
      })
    } else {
      setEditingLead(null)
      setFormData({
        customerName: "",
        email: "",
        phoneNumber: "",
        propertyAddress: "",
        status: "new",
        serviceType: "",
        estimatedValue: "",
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.organizationId) return

    try {
      if (editingLead) {
        await updateLead({
          leadId: editingLead._id,
          customerName: formData.customerName,
          email: formData.email || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          propertyAddress: formData.propertyAddress,
          status: formData.status,
          serviceType: formData.serviceType,
          estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
          notes: formData.notes || undefined,
        })
      } else {
        await createLead({
          customerName: formData.customerName,
          propertyAddress: formData.propertyAddress,
          phoneNumber: formData.phoneNumber || undefined,
          email: formData.email || undefined,
          serviceType: formData.serviceType,
          status: formData.status,
          estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
          notes: formData.notes || undefined,
        })
      }
      setIsDialogOpen(false)
      setEditingLead(null)
    } catch (error) {
      console.error("Failed to save lead:", error)
    }
  }

  const handleDelete = async (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteLead({ leadId: leadId as any })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-2">Track and manage incoming leads</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
              <DialogDescription>
                {editingLead ? "Update lead information" : "Add a new lead to your pipeline"}
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Interest *</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  step="0.01"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                />
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
                <Button type="submit">{editingLead ? "Save Changes" : "Add Lead"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Active Leads
          </CardTitle>
          <CardDescription>Manage your lead pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          {!leads || leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No leads yet</p>
              <p className="text-sm mt-2">Add your first lead to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.customerName}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {lead.propertyAddress}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {lead.phoneNumber && (
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phoneNumber}
                          </div>
                        )}
                        {lead.email && (
                          <div className="text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lead.serviceType}</TableCell>
                    <TableCell>
                      {lead.estimatedValue && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {lead.estimatedValue.toLocaleString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] || "default"}>
                        {lead.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(lead)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lead._id)}>
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
