"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Upload, Loader2, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [businessName, setBusinessName] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const organization = useQuery(
    api.organizations.get,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
  )

  const updateOrganization = useMutation(api.organizations.update)
  const generateUploadUrl = useMutation(api.organizations.generateUploadUrl)

  // Initialize form with existing data
  useState(() => {
    if (organization) {
      setBusinessName(organization.name || "")
      setBusinessAddress(organization.businessAddress || "")
      setLogoUrl(organization.logoUrl || "")
      setLogoPreview(organization.logoUrl || "")
    }
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (PNG, JPG, or SVG)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setLogoFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
    setLogoUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!user?.organizationId) return

    setIsSaving(true)
    try {
      let finalLogoUrl = logoUrl

      // Upload logo if a new file was selected
      if (logoFile) {
        setIsUploading(true)
        try {
          // Get upload URL from Convex
          const uploadUrl = await generateUploadUrl()

          // Upload file to Convex
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": logoFile.type },
            body: logoFile,
          })

          const { storageId } = await result.json()

          // Get the public URL
          finalLogoUrl = `https://patient-raccoon-944.convex.cloud/api/storage/${storageId}`
        } catch (error) {
          console.error("Failed to upload logo:", error)
          alert("Failed to upload logo. Please try again.")
          setIsUploading(false)
          setIsSaving(false)
          return
        }
        setIsUploading(false)
      }

      await updateOrganization({
        organizationId: user.organizationId as any,
        name: businessName || undefined,
        businessAddress: businessAddress || undefined,
        logoUrl: finalLogoUrl || undefined,
      })

      // Update local user session with new logo
      const updatedUser = { ...user, organizationName: businessName, organizationLogo: finalLogoUrl }
      localStorage.setItem("treeshop_user", JSON.stringify(updatedUser))
      window.location.reload() // Reload to update sidebar
    } catch (error) {
      console.error("Failed to update organization:", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your company information and branding</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>Update your business details and company logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Tree Service Company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input
              id="businessAddress"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUpload">Company Logo</Label>
            <div className="space-y-4">
              {logoPreview ? (
                <div className="relative border-2 border-dashed rounded-lg p-6 bg-muted/30 flex flex-col items-center justify-center">
                  <Image
                    src={logoPreview}
                    alt="Company logo preview"
                    width={200}
                    height={80}
                    className="object-contain max-h-20 mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Logo
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Click to upload company logo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or SVG (max 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="logoUpload"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Your logo will appear on proposals, invoices, and throughout the application
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading Logo...
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <div className="mt-1 font-medium">{user?.name}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <div className="mt-1 font-medium">{user?.email}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <div className="mt-1 font-medium capitalize">{user?.role}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Organization</Label>
              <div className="mt-1 font-medium">{user?.organizationName}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
