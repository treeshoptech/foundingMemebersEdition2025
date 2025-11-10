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
import { Add, Edit, Delete, CalendarToday, Assignment } from "@mui/icons-material"

const mockWorkOrders = [
  {
    _id: "1",
    workOrderNumber: "WO-2024-001",
    proposalId: "1",
    customerName: "John Smith",
    serviceType: "Tree Removal",
    scheduledDate: "2024-01-15",
    status: "scheduled",
    assignedCrew: "Crew A",
    totalAmount: 2500,
    notes: "Large oak tree removal",
  },
  {
    _id: "2",
    workOrderNumber: "WO-2024-002",
    proposalId: "2",
    customerName: "Sarah Johnson",
    serviceType: "Land Clearing",
    scheduledDate: "2024-01-16",
    status: "in_progress",
    assignedCrew: "Crew B",
    totalAmount: 8500,
    notes: "2 acres clearing project",
  },
  {
    _id: "3",
    workOrderNumber: "WO-2024-003",
    proposalId: "3",
    customerName: "Mike Davis",
    serviceType: "Stump Grinding",
    scheduledDate: "2024-01-14",
    status: "completed",
    assignedCrew: "Crew A",
    totalAmount: 450,
    notes: "5 stumps ground",
  },
]

const statusColors: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  scheduled: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "error",
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState(mockWorkOrders)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingWorkOrder, setEditingWorkOrder] = useState<any>(null)
  const [formData, setFormData] = useState({
    workOrderNumber: "",
    customerName: "",
    serviceType: "",
    scheduledDate: "",
    status: "scheduled",
    assignedCrew: "",
    totalAmount: 0,
    notes: "",
  })

  const handleOpenDialog = (workOrder?: any) => {
    if (workOrder) {
      setEditingWorkOrder(workOrder)
      setFormData(workOrder)
    } else {
      setEditingWorkOrder(null)
      setFormData({
        workOrderNumber: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, "0")}`,
        customerName: "",
        serviceType: "",
        scheduledDate: "",
        status: "scheduled",
        assignedCrew: "",
        totalAmount: 0,
        notes: "",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingWorkOrder(null)
  }

  const handleSubmit = () => {
    if (editingWorkOrder) {
      setWorkOrders(workOrders.map((wo) => (wo._id === editingWorkOrder._id ? { ...wo, ...formData } : wo)))
    } else {
      setWorkOrders([...workOrders, { _id: Date.now().toString(), ...formData }])
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setWorkOrders(workOrders.filter((wo) => wo._id !== id))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Work Orders
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Create Work Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Work Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Assigned Crew</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workOrders.map((workOrder) => (
              <TableRow key={workOrder._id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Assignment sx={{ fontSize: 16 }} />
                    {workOrder.workOrderNumber}
                  </Typography>
                </TableCell>
                <TableCell>{workOrder.customerName}</TableCell>
                <TableCell>{workOrder.serviceType}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 14 }} />
                    {new Date(workOrder.scheduledDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>{workOrder.assignedCrew}</TableCell>
                <TableCell>${workOrder.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={workOrder.status.replace("_", " ")}
                    size="small"
                    color={statusColors[workOrder.status]}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(workOrder)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(workOrder._id)} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingWorkOrder ? "Edit Work Order" : "Create Work Order"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Work Order Number" fullWidth value={formData.workOrderNumber} disabled />
            <TextField
              label="Customer Name"
              fullWidth
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                select
                label="Service Type"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <MenuItem value="Mulching">Mulching</MenuItem>
                <MenuItem value="Stump Grinding">Stump Grinding</MenuItem>
                <MenuItem value="Land Clearing">Land Clearing</MenuItem>
                <MenuItem value="Tree Removal">Tree Removal</MenuItem>
                <MenuItem value="Tree Trimming">Tree Trimming</MenuItem>
              </TextField>
              <TextField
                label="Scheduled Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
              <TextField
                label="Assigned Crew"
                value={formData.assignedCrew}
                onChange={(e) => setFormData({ ...formData, assignedCrew: e.target.value })}
              />
            </Box>
            <TextField
              label="Total Amount"
              type="number"
              fullWidth
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number.parseFloat(e.target.value) })}
            />
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
            {editingWorkOrder ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
