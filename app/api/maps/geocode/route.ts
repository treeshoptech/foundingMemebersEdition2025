import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address parameter required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status !== "OK" || !data.results?.[0]) {
      return NextResponse.json({ error: "Could not geocode address" }, { status: 400 })
    }

    const result = data.results[0]

    return NextResponse.json({
      formatted_address: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      place_id: result.place_id,
    })
  } catch (error) {
    console.error("Geocoding API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
