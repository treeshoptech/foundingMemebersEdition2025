"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material"
import { Add, Edit, Delete, Phone, Email, LocationOn } from "@mui/icons-material"

// Mock data for demo mode
const mockLeads = [
  {
    _id: "1",
    customerName: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Portland, OR",
    status: "new",
    source: "website",
    serviceInterest: "Tree Removal",
    estimatedValue: 2500,
    notes: "Large oak tree in backyard",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    customerName: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 234-5678",
    address: "456 Pine Avenue, Eugene, OR",
    status: "contacted",
    source: "referral",
    serviceInterest: "Land Clearing",
    estimatedValue: 8500,
    notes: "2 acres need clearing",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    customerName: "Mike Davis",
    email: "mike@example.com",
    phone: "(555) 345-6789",
    address: "789 Maple Drive, Salem, OR",
    status: "qualified",
    source: "google",
    serviceInterest: "Stump Grinding",
    estimatedValue: 450,
    notes: "5 stumps to grind",
    createdAt: new Date().toISOString(),
  },
]

const statusColors: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  new: "primary",
  contacted: "warning",
  qualified: "success",
  proposal_sent: "info",
  converted: "success",
  lost: "error",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    status: "new",
    source: "website",
    serviceInterest: "",
    estimatedValue: 0,
    notes: "",
  })

  const handleOpenDialog = (lead?: any) => {
    if (lead) {
      setEditingLead(lead)
      setFormData(lead)
    } else {
      setEditingLead(null)
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        address: "",
        status: "new",
        source: "website",
        serviceInterest: "",
        estimatedValue: 0,
        notes: "",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingLead(null)
  }

  const handleSubmit = () => {
    if (editingLead) {
      setLeads(leads.map((l) => (l._id === editingLead._id ? { ...l, ...formData } : l)))
    } else {
      setLeads([...leads, { _id: Date.now().toString(), ...formData, createdAt: new Date().toISOString() }])
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setLeads(leads.filter((l) => l._id !== id))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Leads
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Lead
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Service Interest</TableCell>
              <TableCell>Est. Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {lead.customerName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}
                  >
                    <LocationOn sx={{ fontSize: 14 }} />
                    {lead.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Phone sx={{ fontSize: 14 }} />
                      {lead.phone}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Email sx={{ fontSize: 14 }} />
                      {lead.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{lead.serviceInterest}</TableCell>
                <TableCell>${lead.estimatedValue.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={lead.status.replace("_", " ")} size="small" color={statusColors[lead.status]} />
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(lead)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(lead._id)} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingLead ? "Edit Lead" : "Add Lead"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Customer Name"
              fullWidth
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Box>
            <TextField
              label="Address"
              fullWidth
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="proposal_sent">Proposal Sent</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
              </TextField>
              <TextField
                select
                label="Source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="google">Google</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                select
                label="Service Interest"
                value={formData.serviceInterest}
                onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
              >
                <MenuItem value="Mulching">Mulching</MenuItem>
                <MenuItem value="Stump Grinding">Stump Grinding</MenuItem>
                <MenuItem value="Land Clearing">Land Clearing</MenuItem>
                <MenuItem value="Tree Removal">Tree Removal</MenuItem>
                <MenuItem value="Tree Trimming">Tree Trimming</MenuItem>
              </TextField>
              <TextField
                label="Estimated Value"
                type="number"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: Number.parseFloat(e.target.value) })}
              />
            </Box>
            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingLead ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
