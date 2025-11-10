// Google Maps API utilities for address autocomplete and drive time calculation

export interface AddressResult {
  formatted_address: string
  place_id: string
  lat: number
  lng: number
}

export interface DriveTimeResult {
  durationMinutes: number
  distanceMiles: number
  durationText: string
  distanceText: string
}

/**
 * Search for address suggestions using Google Places Autocomplete API
 */
export async function searchAddresses(query: string): Promise<AddressResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key not configured")
    return []
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${apiKey}&types=address&components=country:us`
    )

    const data = await response.json()

    if (data.status !== "OK") {
      console.error("Google Places API error:", data.status)
      return []
    }

    // Get detailed info for each prediction
    const results = await Promise.all(
      data.predictions.slice(0, 5).map(async (prediction: any) => {
        const details = await getPlaceDetails(prediction.place_id)
        return details
      })
    )

    return results.filter((r): r is AddressResult => r !== null)
  } catch (error) {
    console.error("Address search error:", error)
    return []
  }
}

/**
 * Get detailed place information including coordinates
 */
export async function getPlaceDetails(placeId: string): Promise<AddressResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status !== "OK" || !data.result) {
      return null
    }

    return {
      formatted_address: data.result.formatted_address,
      place_id: placeId,
      lat: data.result.geometry.location.lat,
      lng: data.result.geometry.location.lng,
    }
  } catch (error) {
    console.error("Place details error:", error)
    return null
  }
}

/**
 * Calculate drive time and distance between two locations
 * Uses Google Distance Matrix API
 */
export async function calculateDriveTime(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<DriveTimeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key not configured")
    return null
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}&mode=driving`
    )

    const data = await response.json()

    if (data.status !== "OK" || !data.rows?.[0]?.elements?.[0]) {
      console.error("Distance Matrix API error:", data.status)
      return null
    }

    const element = data.rows[0].elements[0]

    if (element.status !== "OK") {
      console.error("No route found")
      return null
    }

    return {
      durationMinutes: Math.round(element.duration.value / 60),
      distanceMiles: Math.round((element.distance.value / 1609.34) * 10) / 10, // Convert meters to miles
      durationText: element.duration.text,
      distanceText: element.distance.text,
    }
  } catch (error) {
    console.error("Drive time calculation error:", error)
    return null
  }
}

/**
 * Server-side API route helper for calculating drive time
 * (Since Google Maps API shouldn't expose key on client side for production)
 */
export async function calculateDriveTimeServer(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DriveTimeResult | null> {
  // This should be called from an API route, not client-side
  return calculateDriveTime({ lat: originLat, lng: originLng }, { lat: destLat, lng: destLng })
}
