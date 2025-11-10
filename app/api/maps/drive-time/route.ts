import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originLat, originLng, destLat, destLng } = body

    if (!originLat || !originLng || !destLat || !destLng) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${apiKey}&mode=driving`
    )

    const data = await response.json()

    if (data.status !== "OK" || !data.rows?.[0]?.elements?.[0]) {
      return NextResponse.json({ error: "Could not calculate route" }, { status: 400 })
    }

    const element = data.rows[0].elements[0]

    if (element.status !== "OK") {
      return NextResponse.json({ error: "No route found" }, { status: 400 })
    }

    return NextResponse.json({
      durationMinutes: Math.round(element.duration.value / 60),
      distanceMiles: Math.round((element.distance.value / 1609.34) * 10) / 10,
      durationText: element.duration.text,
      distanceText: element.distance.text,
    })
  } catch (error) {
    console.error("Drive time API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
