/**
 * TreeShop Employee Form Component
 *
 * Comprehensive form for creating and editing employees with the full
 * TreeShop career progression system.
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeCodeBadge } from "@/components/employee-code-badge"
import { TierBadge } from "@/components/tier-badge"
import {
  getAllCareerTracks,
  getTierProgressionPath,
  LEADERSHIP_ADDONS,
  EQUIPMENT_ADDONS,
  DRIVER_ADDONS,
  CERTIFICATION_ADDONS,
  calculateHourlyRate,
  calculateTrueCost,
  generateEmployeeCode,
  formatCurrency,
  calculateAnnualSalary,
  type CareerTrackCode,
  type TierLevel,
  type LeadershipCode,
  type EquipmentCode,
  type DriverCode,
  type CertificationCode,
  type CrossTraining,
  type TreeShopEmployee,
} from "@/lib/treeshop-employee-types"

export interface TreeShopEmployeeFormData {
  name: string
  careerTrack: CareerTrackCode
  tier: TierLevel
  baseHourlyRate: number
  burdenMultiplier: number
  leadershipLevel?: LeadershipCode
  equipmentCertifications: EquipmentCode[]
  driverLicenses: DriverCode[]
  professionalCerts: CertificationCode[]
  crossTraining: CrossTraining[]
  position?: string
}

interface TreeShopEmployeeFormProps {
  initialData?: Partial<TreeShopEmployeeFormData>
  onSubmit: (data: TreeShopEmployeeFormData) => void
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

export function TreeShopEmployeeForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create Employee",
  isLoading = false,
}: TreeShopEmployeeFormProps) {
  // Form state
  const [name, setName] = useState(initialData?.name || "")
  const [careerTrack, setCareerTrack] = useState<CareerTrackCode>(initialData?.careerTrack || "ATC")
  const [tier, setTier] = useState<TierLevel>(initialData?.tier || 1)
  const [baseHourlyRate, setBaseHourlyRate] = useState(initialData?.baseHourlyRate || 16)
  const [burdenMultiplier, setBurdenMultiplier] = useState(initialData?.burdenMultiplier || 1.7)
  const [leadershipLevel, setLeadershipLevel] = useState<LeadershipCode | undefined>(
    initialData?.leadershipLevel,
  )
  const [equipmentCertifications, setEquipmentCertifications] = useState<EquipmentCode[]>(
    initialData?.equipmentCertifications || [],
  )
  const [driverLicenses, setDriverLicenses] = useState<DriverCode[]>(
    initialData?.driverLicenses || [],
  )
  const [professionalCerts, setProfessionalCerts] = useState<CertificationCode[]>(
    initialData?.professionalCerts || [],
  )
  const [crossTraining, setCrossTraining] = useState<CrossTraining[]>(
    initialData?.crossTraining || [],
  )
  const [position, setPosition] = useState(initialData?.position || "")

  // Calculated values
  const [employeeCode, setEmployeeCode] = useState("")
  const [effectiveHourlyRate, setEffectiveHourlyRate] = useState(0)
  const [trueCostPerHour, setTrueCostPerHour] = useState(0)
  const [annualSalary, setAnnualSalary] = useState(0)

  // Recalculate derived values whenever inputs change
  useEffect(() => {
    const employee: TreeShopEmployee = {
      name,
      careerTrack,
      tier,
      baseHourlyRate,
      burdenMultiplier,
      leadershipLevel,
      equipmentCertifications,
      driverLicenses,
      professionalCerts,
      crossTraining,
      organizationId: "",
      createdAt: Date.now(),
    }

    const code = generateEmployeeCode(employee)
    const hourlyRate = calculateHourlyRate(employee)
    const trueCost = calculateTrueCost(hourlyRate, burdenMultiplier)
    const annual = calculateAnnualSalary(hourlyRate)

    setEmployeeCode(code)
    setEffectiveHourlyRate(hourlyRate)
    setTrueCostPerHour(trueCost)
    setAnnualSalary(annual)
  }, [
    name,
    careerTrack,
    tier,
    baseHourlyRate,
    burdenMultiplier,
    leadershipLevel,
    equipmentCertifications,
    driverLicenses,
    professionalCerts,
    crossTraining,
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData: TreeShopEmployeeFormData = {
      name,
      careerTrack,
      tier,
      baseHourlyRate,
      burdenMultiplier,
      leadershipLevel,
      equipmentCertifications,
      driverLicenses,
      professionalCerts,
      crossTraining,
      position,
    }

    onSubmit(formData)
  }

  const careerTracks = getAllCareerTracks()
  const tierLevels = getTierProgressionPath()

  // Group career tracks by category
  const groupedTracks = careerTracks.reduce(
    (acc, track) => {
      if (!acc[track.category]) {
        acc[track.category] = []
      }
      acc[track.category].push(track)
      return acc
    },
    {} as Record<string, typeof careerTracks>,
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Employee Code Preview */}
      <Card className="bg-slate-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Employee Code Preview</CardTitle>
          <CardDescription>Auto-generated from selections below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <EmployeeCodeBadge code={employeeCode} size="lg" />
            <TierBadge tier={tier} size="md" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Effective Hourly Rate</div>
              <div className="text-lg font-semibold text-primary">
                {formatCurrency(effectiveHourlyRate)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Est. Annual Salary</div>
              <div className="text-lg font-semibold">{formatCurrency(annualSalary)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">True Cost Per Hour</div>
              <div className="text-lg font-semibold text-accent">
                {formatCurrency(trueCostPerHour)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Burden Multiplier</div>
              <div className="text-lg font-semibold">{burdenMultiplier.toFixed(2)}x</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Employee Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="careerTrack">Career Track *</Label>
            <Select value={careerTrack} onValueChange={(value) => setCareerTrack(value as CareerTrackCode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedTracks).map(([category, tracks]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {category}
                    </div>
                    {tracks.map((track) => (
                      <SelectItem key={track.code} value={track.code}>
                        {track.code} - {track.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Tier Level *</Label>
            <Select value={tier.toString()} onValueChange={(value) => setTier(parseInt(value) as TierLevel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tierLevels.map((tierLevel) => (
                  <SelectItem key={tierLevel.level} value={tierLevel.level.toString()}>
                    Tier {tierLevel.level} - {tierLevel.name} ({tierLevel.multiplier}x)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="baseHourlyRate">Base Hourly Rate (Tier 1) *</Label>
            <Input
              id="baseHourlyRate"
              type="number"
              step="0.01"
              min="0"
              value={baseHourlyRate}
              onChange={(e) => setBaseHourlyRate(parseFloat(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              The Tier 1 rate for this career track (will be multiplied by tier)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="burdenMultiplier">Burden Multiplier *</Label>
            <Input
              id="burdenMultiplier"
              type="number"
              step="0.01"
              min="1"
              value={burdenMultiplier}
              onChange={(e) => setBurdenMultiplier(parseFloat(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Typical range: 1.5 - 1.9 (includes taxes, insurance, overhead)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Additional Notes (Optional)</Label>
          <Input
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Additional notes or legacy position info"
          />
        </div>
      </div>

      <Separator />

      {/* Leadership Level */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Leadership Level</h3>
        <div className="space-y-2">
          <Label>Select Leadership Role (Optional)</Label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(LEADERSHIP_ADDONS).map(([code, addon]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLeadershipLevel(leadershipLevel === code ? undefined : (code as LeadershipCode))}
                className={`p-3 border rounded-md text-left transition-colors ${
                  leadershipLevel === code
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-sm">{addon.name}</div>
                <div className="text-xs text-muted-foreground">+${addon.premium}/hour</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Equipment Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Equipment Certifications</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(EQUIPMENT_ADDONS).map(([code, addon]) => (
            <label
              key={code}
              className="flex items-start space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Checkbox
                checked={equipmentCertifications.includes(code as EquipmentCode)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setEquipmentCertifications([...equipmentCertifications, code as EquipmentCode])
                  } else {
                    setEquipmentCertifications(
                      equipmentCertifications.filter((c) => c !== code),
                    )
                  }
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm">{addon.name}</div>
                <div className="text-xs text-muted-foreground">{addon.description}</div>
                <div className="text-xs font-medium text-accent">+${addon.premium}/hour</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Driver Licenses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Driver Licenses</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(DRIVER_ADDONS).map(([code, addon]) => (
            <label
              key={code}
              className="flex items-start space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Checkbox
                checked={driverLicenses.includes(code as DriverCode)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setDriverLicenses([...driverLicenses, code as DriverCode])
                  } else {
                    setDriverLicenses(driverLicenses.filter((c) => c !== code))
                  }
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm">{addon.name}</div>
                <div className="text-xs text-muted-foreground">{addon.description}</div>
                <div className="text-xs font-medium text-accent">+${addon.premium}/hour</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Professional Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Certifications</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(CERTIFICATION_ADDONS).map(([code, addon]) => (
            <label
              key={code}
              className="flex items-start space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Checkbox
                checked={professionalCerts.includes(code as CertificationCode)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProfessionalCerts([...professionalCerts, code as CertificationCode])
                  } else {
                    setProfessionalCerts(professionalCerts.filter((c) => c !== code))
                  }
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm">{addon.name}</div>
                <div className="text-xs font-medium text-accent">+${addon.premium}/hour</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Cross-Training */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cross-Training</h3>
        <p className="text-sm text-muted-foreground">
          Secondary competencies in other roles (to be implemented in future version)
        </p>
        {crossTraining.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {crossTraining.map((ct, idx) => (
              <Badge key={idx} variant="outline">
                {ct.role} Tier {ct.tier}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
