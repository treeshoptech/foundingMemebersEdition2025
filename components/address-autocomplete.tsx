"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string, coordinates?: { lat: number; lng: number }) => void
  onDriveTimeCalculated?: (minutes: number, miles: number) => void
  organizationCoordinates?: { lat: number; lng: number }
  label?: string
  placeholder?: string
  disabled?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  onDriveTimeCalculated,
  organizationCoordinates,
  label = "Property Address",
  placeholder = "Enter job site address...",
  disabled = false,
}: AddressAutocompleteProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle address input and trigger geocoding + drive time calculation
  const handleAddressBlur = async () => {
    if (!value || value.length < 5) return

    setIsGeocoding(true)

    try {
      // Geocode the address to get coordinates
      const response = await fetch(`/api/maps/geocode?address=${encodeURIComponent(value)}`)

      if (!response.ok) {
        console.error("Geocoding failed")
        return
      }

      const data = await response.json()
      const coordinates = { lat: data.lat, lng: data.lng }

      // Update with formatted address
      onChange(data.formatted_address, coordinates)

      // Calculate drive time if organization coordinates are available
      if (organizationCoordinates && onDriveTimeCalculated) {
        setIsCalculating(true)

        try {
          const driveTimeResponse = await fetch("/api/maps/drive-time", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              originLat: organizationCoordinates.lat,
              originLng: organizationCoordinates.lng,
              destLat: coordinates.lat,
              destLng: coordinates.lng,
            }),
          })

          if (driveTimeResponse.ok) {
            const driveTimeData = await driveTimeResponse.json()
            onDriveTimeCalculated(driveTimeData.durationMinutes, driveTimeData.distanceMiles)
          }
        } catch (error) {
          console.error("Drive time calculation failed:", error)
        } finally {
          setIsCalculating(false)
        }
      }
    } catch (error) {
      console.error("Address geocoding failed:", error)
    } finally {
      setIsGeocoding(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="address">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {label}
          {isCalculating && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Calculating drive time...
            </span>
          )}
        </div>
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleAddressBlur}
          placeholder={placeholder}
          disabled={disabled || isGeocoding}
          className={cn(isGeocoding && "opacity-50")}
        />
        {isGeocoding && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        <Navigation className="h-3 w-3 inline mr-1" />
        Enter address and press Tab/Enter to auto-calculate drive time
      </p>
    </div>
  )
}
